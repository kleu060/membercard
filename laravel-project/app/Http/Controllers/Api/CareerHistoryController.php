<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobProfile;
use App\Models\CareerHistory;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CareerHistoryController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $jobProfile = JobProfile::where('user_id', $user->id)->first();

        if (!$jobProfile) {
            return response()->json(['message' => 'Job profile not found'], 404);
        }

        $careerHistory = $jobProfile->careerHistory()->orderBy('start_date', 'desc')->get();
        return response()->json($careerHistory);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $jobProfile = JobProfile::where('user_id', $user->id)->first();

        if (!$jobProfile) {
            return response()->json(['message' => 'Job profile not found'], 404);
        }

        $careerHistory = $jobProfile->careerHistory()->create($request->all());
        return response()->json($careerHistory, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'title' => 'required|string|max:255',
            'company' => 'required|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $careerHistory = CareerHistory::whereHas('profile', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        $careerHistory->update($request->all());
        return response()->json($careerHistory);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = $request->user();
        $careerHistory = CareerHistory::whereHas('profile', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        $careerHistory->delete();
        return response()->json(['message' => 'Career history deleted successfully']);
    }
}