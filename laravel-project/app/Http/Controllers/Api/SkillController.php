<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobProfile;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class SkillController extends Controller
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

        $skills = $jobProfile->skills()->orderBy('name')->get();
        return response()->json($skills);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'years_experience' => 'nullable|integer|min:0|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $jobProfile = JobProfile::where('user_id', $user->id)->first();

        if (!$jobProfile) {
            return response()->json(['message' => 'Job profile not found'], 404);
        }

        // Check if skill already exists
        $existingSkill = $jobProfile->skills()->where('name', $request->name)->first();
        if ($existingSkill) {
            return response()->json(['message' => 'Skill already exists'], 409);
        }

        $skill = $jobProfile->skills()->create($request->all());
        return response()->json($skill, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'years_experience' => 'nullable|integer|min:0|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $skill = Skill::whereHas('profile', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        // Check if name conflicts with existing skill
        if ($skill->name !== $request->name) {
            $existingSkill = $skill->profile->skills()->where('name', $request->name)->first();
            if ($existingSkill) {
                return response()->json(['message' => 'Skill name already exists'], 409);
            }
        }

        $skill->update($request->all());
        return response()->json($skill);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = $request->user();
        $skill = Skill::whereHas('profile', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        $skill->delete();
        return response()->json(['message' => 'Skill deleted successfully']);
    }
}