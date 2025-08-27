<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Lead;
use App\Models\LeadInteraction;
use App\Models\LeadActivity;
use App\Models\BusinessCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\DB;
use Carbon\Carbon;

class LeadController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $query = Lead::query();

        // If user is not admin, only show their leads or assigned leads
        if (!$user->isAdmin()) {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('assigned_user_id', $user->id);
            });
        }

        // Filter by status
        if ($request->has('status')) {
            $query->where('status', $request->status);
        }

        // Filter by priority
        if ($request->has('priority')) {
            $query->where('priority', $request->priority);
        }

        // Filter by source
        if ($request->has('source')) {
            $query->where('source', $request->source);
        }

        // Filter by tags
        if ($request->has('tags')) {
            $tags = is_array($request->tags) ? $request->tags : explode(',', $request->tags);
            $query->where(function ($q) use ($tags) {
                foreach ($tags as $tag) {
                    $q->orWhere('tags', 'like', "%\"{$tag}\"%");
                }
            });
        }

        // Filter by date range
        if ($request->has('start_date') && $request->has('end_date')) {
            $query->whereBetween('created_at', [
                $request->start_date,
                $request->end_date
            ]);
        }

        // Search functionality
        if ($request->has('search')) {
            $search = $request->search;
            $query->where(function ($q) use ($search) {
                $q->where('name', 'like', "%{$search}%")
                  ->orWhere('email', 'like', "%{$search}%")
                  ->orWhere('company', 'like', "%{$search}%")
                  ->orWhere('phone', 'like', "%{$search}%");
            });
        }

        // Sort functionality
        $sortBy = $request->get('sort_by', 'created_at');
        $sortOrder = $request->get('sort_order', 'desc');
        $query->orderBy($sortBy, $sortOrder);

        // Pagination
        $perPage = $request->get('per_page', 15);
        $leads = $query->with(['user', 'assignedUser', 'businessCard'])
                      ->paginate($perPage);

        return response()->json($leads);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:2000',
            'interest' => 'nullable|string|max:100',
            'source' => 'nullable|string|max:100',
            'status' => 'nullable|string|in:new,contacted,qualified,proposal_sent,converted,lost',
            'priority' => 'nullable|string|in:low,medium,high,urgent',
            'score' => 'nullable|integer|min:0|max:100',
            'estimated_value' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'website' => 'nullable|url|max:255',
            'linkedin' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string|max:2000',
            'business_card_id' => 'nullable|exists:business_cards,id',
            'assigned_user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $leadData = $request->only([
            'name', 'email', 'phone', 'company', 'position', 'message',
            'interest', 'source', 'status', 'priority', 'score',
            'estimated_value', 'currency', 'website', 'linkedin', 'twitter',
            'address', 'city', 'country', 'notes', 'business_card_id', 'assigned_user_id'
        ]);

        $leadData['user_id'] = $request->user()->id;
        $leadData['status'] = $leadData['status'] ?? 'new';
        $leadData['priority'] = $leadData['priority'] ?? 'medium';
        $leadData['source'] = $leadData['source'] ?? 'manual';
        $leadData['interest'] = $leadData['interest'] ?? 'general';
        $leadData['currency'] = $leadData['currency'] ?? 'TWD';

        // Handle tags
        if ($request->has('tags')) {
            $leadData['tags'] = json_encode($request->tags);
        }

        $lead = Lead::create($leadData);

        // Log activity
        LeadActivity::create([
            'lead_id' => $lead->id,
            'type' => 'created',
            'title' => 'Lead created',
            'description' => 'New lead was created',
            'user_id' => $request->user()->id,
        ]);

        $lead->load(['user', 'assignedUser', 'businessCard']);

        return response()->json($lead, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show($id)
    {
        $lead = Lead::with([
            'user', 
            'assignedUser', 
            'businessCard', 
            'interactions.user',
            'activities.user'
        ])->findOrFail($id);

        // Authorization check
        $this->authorize('manage-leads', $lead);

        return response()->json($lead);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        // Authorization check
        $this->authorize('manage-leads', $lead);

        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'email' => 'nullable|email|max:255',
            'phone' => 'nullable|string|max:255',
            'company' => 'nullable|string|max:255',
            'position' => 'nullable|string|max:255',
            'message' => 'nullable|string|max:2000',
            'interest' => 'nullable|string|max:100',
            'source' => 'nullable|string|max:100',
            'status' => 'required|string|in:new,contacted,qualified,proposal_sent,converted,lost',
            'priority' => 'required|string|in:low,medium,high,urgent',
            'score' => 'nullable|integer|min:0|max:100',
            'estimated_value' => 'nullable|numeric|min:0',
            'currency' => 'nullable|string|max:3',
            'website' => 'nullable|url|max:255',
            'linkedin' => 'nullable|url|max:255',
            'twitter' => 'nullable|url|max:255',
            'address' => 'nullable|string|max:500',
            'city' => 'nullable|string|max:100',
            'country' => 'nullable|string|max:100',
            'tags' => 'nullable|array',
            'notes' => 'nullable|string|max:2000',
            'business_card_id' => 'nullable|exists:business_cards,id',
            'assigned_user_id' => 'nullable|exists:users,id',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $oldStatus = $lead->status;
        $oldPriority = $lead->priority;
        $oldAssignedUser = $lead->assigned_user_id;

        $leadData = $request->only([
            'name', 'email', 'phone', 'company', 'position', 'message',
            'interest', 'source', 'status', 'priority', 'score',
            'estimated_value', 'currency', 'website', 'linkedin', 'twitter',
            'address', 'city', 'country', 'notes', 'business_card_id', 'assigned_user_id'
        ]);

        // Handle tags
        if ($request->has('tags')) {
            $leadData['tags'] = json_encode($request->tags);
        }

        $lead->update($leadData);

        // Log activities for important changes
        $activities = [];

        if ($oldStatus !== $lead->status) {
            $activities[] = [
                'type' => 'status_changed',
                'title' => 'Status changed',
                'description' => "Status changed from {$oldStatus} to {$lead->status}",
            ];
        }

        if ($oldPriority !== $lead->priority) {
            $activities[] = [
                'type' => 'priority_changed',
                'title' => 'Priority changed',
                'description' => "Priority changed from {$oldPriority} to {$lead->priority}",
            ];
        }

        if ($oldAssignedUser !== $lead->assigned_user_id) {
            $activities[] = [
                'type' => 'assignment_changed',
                'title' => 'Assignment changed',
                'description' => "Lead assigned to user ID: {$lead->assigned_user_id}",
            ];
        }

        foreach ($activities as $activity) {
            LeadActivity::create([
                'lead_id' => $lead->id,
                'type' => $activity['type'],
                'title' => $activity['title'],
                'description' => $activity['description'],
                'user_id' => $request->user()->id,
            ]);
        }

        $lead->load(['user', 'assignedUser', 'businessCard']);

        return response()->json($lead);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $lead = Lead::findOrFail($id);

        // Authorization check
        $this->authorize('manage-leads', $lead);

        $lead->delete();

        return response()->json(['message' => 'Lead deleted successfully']);
    }

    /**
     * Get activities for a lead.
     */
    public function getActivities($id)
    {
        $lead = Lead::findOrFail($id);

        // Authorization check
        $this->authorize('manage-leads', $lead);

        $activities = $lead->activities()
                          ->with('user')
                          ->orderBy('created_at', 'desc')
                          ->paginate(20);

        return response()->json($activities);
    }

    /**
     * Get interactions for a lead.
     */
    public function getInteractions($id)
    {
        $lead = Lead::findOrFail($id);

        // Authorization check
        $this->authorize('manage-leads', $lead);

        $interactions = $lead->interactions()
                            ->with('user')
                            ->orderBy('created_at', 'desc')
                            ->paginate(20);

        return response()->json($interactions);
    }

    /**
     * Add an interaction to a lead.
     */
    public function addInteraction(Request $request, $id)
    {
        $lead = Lead::findOrFail($id);

        // Authorization check
        $this->authorize('manage-leads', $lead);

        $validator = Validator::make($request->all(), [
            'type' => 'required|string|in:call,email,meeting,video,coffee,other',
            'direction' => 'required|string|in:inbound,outbound',
            'title' => 'required|string|max:255',
            'description' => 'nullable|string|max:2000',
            'duration' => 'nullable|integer|min:1|max:1440',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $interaction = $lead->interactions()->create([
            'type' => $request->type,
            'direction' => $request->direction,
            'title' => $request->title,
            'description' => $request->description,
            'duration' => $request->duration,
            'user_id' => $request->user()->id,
        ]);

        // Update last contact time
        $lead->update(['last_contact_at' => now()]);

        // Log activity
        LeadActivity::create([
            'lead_id' => $lead->id,
            'type' => 'interaction_logged',
            'title' => 'Interaction logged',
            'description' => "{$request->direction} {$request->type}: {$request->title}",
            'user_id' => $request->user()->id,
        ]);

        $interaction->load('user');

        return response()->json($interaction, 201);
    }

    /**
     * Get lead statistics.
     */
    public function getStats(Request $request)
    {
        $user = $request->user();
        
        $query = Lead::query();
        
        // If user is not admin, only show their leads or assigned leads
        if (!$user->isAdmin()) {
            $query->where(function ($q) use ($user) {
                $q->where('user_id', $user->id)
                  ->orWhere('assigned_user_id', $user->id);
            });
        }

        $stats = [
            'total_leads' => $query->count(),
            'by_status' => $query->select('status', DB::raw('count(*) as count'))
                               ->groupBy('status')
                               ->get()
                               ->pluck('count', 'status'),
            'by_priority' => $query->select('priority', DB::raw('count(*) as count'))
                                ->groupBy('priority')
                                ->get()
                                ->pluck('count', 'priority'),
            'by_source' => $query->select('source', DB::raw('count(*) as count'))
                              ->groupBy('source')
                              ->get()
                              ->pluck('count', 'source'),
            'converted_this_month' => $query->where('status', 'converted')
                                          ->whereMonth('created_at', now()->month)
                                          ->count(),
            'avg_score' => $query->avg('score'),
        ];

        return response()->json($stats);
    }
}