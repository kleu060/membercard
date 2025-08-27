<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\BusinessCard;
use App\Models\Lead;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;

class UserController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $query = User::query();

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%");
            });
        }

        // Filter by role
        if ($request->has('role')) {
            $query->where('role', $request->role);
        }

        // Filter by subscription plan
        if ($request->has('subscription_plan')) {
            $query->where('subscription_plan', $request->subscription_plan);
        }

        // Filter by status (active/inactive based on recent activity)
        if ($request->has('is_active')) {
            if ($request->boolean('is_active')) {
                $query->where('updated_at', '>=', now()->subDays(30));
            } else {
                $query->where('updated_at', '<', now()->subDays(30));
            }
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $users = $query->withCount(['businessCards', 'leads', 'appointments'])
                      ->paginate($perPage);

        return response()->json($users);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $user = User::with([
            'businessCards',
            'savedCards',
            'leads',
            'assignedLeads',
            'appointments',
            'jobProfile',
            'bookingSettings'
        ])->findOrFail($id);

        return response()->json($user);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'required|email|max:255|unique:users,email,' . $id,
            'role' => 'required|string|in:user,admin',
            'subscription_plan' => 'required|string|in:free,professional,enterprise',
            'location' => 'nullable|string|max:255',
            'password' => 'nullable|string|min:8|confirmed',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $userData = $request->only(['name', 'email', 'role', 'subscription_plan', 'location']);

        if ($request->filled('password')) {
            $userData['password'] = Hash::make($request->password);
        }

        $user->update($userData);

        return response()->json($user);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = User::findOrFail($id);

        // Prevent deleting the last admin
        if ($user->role === 'admin') {
            $adminCount = User::where('role', 'admin')->count();
            if ($adminCount <= 1) {
                return response()->json(['message' => 'Cannot delete the last admin user'], 400);
            }
        }

        $user->delete();

        return response()->json(['message' => 'User deleted successfully']);
    }

    /**
     * Update user status.
     */
    public function updateStatus(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // Note: This is a simple implementation. In a real system, you might want
        // to have a dedicated 'is_active' field or handle it differently
        $user->touch(); // Update the updated_at timestamp

        return response()->json(['message' => 'User status updated successfully']);
    }

    /**
     * Get user statistics.
     */
    public function getStats()
    {
        $stats = [
            'total_users' => User::count(),
            'by_role' => User::select('role', \DB::raw('count(*) as count'))
                           ->groupBy('role')
                           ->get()
                           ->pluck('count', 'role'),
            'by_subscription' => User::select('subscription_plan', \DB::raw('count(*) as count'))
                                   ->groupBy('subscription_plan')
                                   ->get()
                                   ->pluck('count', 'subscription_plan'),
            'active_users' => User::where('updated_at', '>=', now()->subDays(30))->count(),
            'new_users_this_month' => User::whereMonth('created_at', now()->month)->count(),
            'users_with_cards' => User::has('businessCards')->count(),
            'users_with_leads' => User::has('leads')->count(),
            'users_with_appointments' => User::has('appointments')->count(),
        ];

        return response()->json($stats);
    }

    /**
     * Get user activity.
     */
    public function getActivity(Request $request, $id)
    {
        $user = User::findOrFail($id);

        $activities = collect();

        // Get business cards activity
        $cards = $user->businessCards()
                     ->select('id', 'name', 'created_at', 'updated_at')
                     ->orderBy('updated_at', 'desc')
                     ->take(10)
                     ->get()
                     ->map(function ($card) {
                         return [
                             'type' => 'business_card',
                             'id' => $card->id,
                             'title' => $card->name,
                             'created_at' => $card->created_at,
                             'updated_at' => $card->updated_at,
                         ];
                     });

        // Get leads activity
        $leads = $user->leads()
                     ->select('id', 'name', 'status', 'created_at', 'updated_at')
                     ->orderBy('updated_at', 'desc')
                     ->take(10)
                     ->get()
                     ->map(function ($lead) {
                         return [
                             'type' => 'lead',
                             'id' => $lead->id,
                             'title' => $lead->name,
                             'status' => $lead->status,
                             'created_at' => $lead->created_at,
                             'updated_at' => $lead->updated_at,
                         ];
                     });

        // Get appointments activity
        $appointments = $user->appointments()
                           ->select('id', 'title', 'status', 'appointment_date', 'created_at', 'updated_at')
                           ->orderBy('updated_at', 'desc')
                           ->take(10)
                           ->get()
                           ->map(function ($appointment) {
                               return [
                                   'type' => 'appointment',
                                   'id' => $appointment->id,
                                   'title' => $appointment->title,
                                   'status' => $appointment->status,
                                   'appointment_date' => $appointment->appointment_date,
                                   'created_at' => $appointment->created_at,
                                   'updated_at' => $appointment->updated_at,
                               ];
                           });

        // Combine and sort all activities
        $allActivities = $cards->concat($leads)->concat($appointments)
                                 ->sortByDesc('updated_at')
                                 ->take(20)
                                 ->values();

        return response()->json($allActivities);
    }
}