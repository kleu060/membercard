<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobProfile;
use App\Models\Education;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class EducationController extends Controller
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

        $education = $jobProfile->education()->orderBy('start_date', 'desc')->get();
        return response()->json($education);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'gpa' => 'nullable|numeric|min:0|max:4',
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

        $education = $jobProfile->education()->create($request->all());
        return response()->json($education, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'institution' => 'required|string|max:255',
            'degree' => 'required|string|max:255',
            'field' => 'nullable|string|max:255',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'is_current' => 'boolean',
            'gpa' => 'nullable|numeric|min:0|max:4',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $education = Education::whereHas('profile', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        $education->update($request->all());
        return response()->json($education);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = $request->user();
        $education = Education::whereHas('profile', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        $education->delete();
        return response()->json(['message' => 'Education deleted successfully']);
    }
}