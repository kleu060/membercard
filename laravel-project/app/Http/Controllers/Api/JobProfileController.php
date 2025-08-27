<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobProfile;
use App\Models\CareerHistory;
use App\Models\Education;
use App\Models\Certification;
use App\Models\Skill;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class JobProfileController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index(Request $request)
    {
        $user = $request->user();
        
        // Users can only view their own job profile
        $jobProfile = JobProfile::with([
            'user',
            'careerHistory',
            'education',
            'certifications',
            'skills',
            'savedSearches',
            'savedJobs',
            'applications'
        ])->where('user_id', $user->id)->first();

        if (!$jobProfile) {
            return response()->json(['message' => 'Job profile not found'], 404);
        }

        return response()->json($jobProfile);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'summary' => 'nullable|string|max:2000',
            'resume_url' => 'nullable|url|max:255',
            'career_history' => 'nullable|array',
            'career_history.*.title' => 'required|string|max:255',
            'career_history.*.company' => 'required|string|max:255',
            'career_history.*.start_date' => 'required|date',
            'career_history.*.end_date' => 'nullable|date|after_or_equal:career_history.*.start_date',
            'career_history.*.is_current' => 'boolean',
            'career_history.*.description' => 'nullable|string|max:1000',
            'education' => 'nullable|array',
            'education.*.institution' => 'required|string|max:255',
            'education.*.degree' => 'required|string|max:255',
            'education.*.field' => 'nullable|string|max:255',
            'education.*.start_date' => 'required|date',
            'education.*.end_date' => 'nullable|date|after_or_equal:education.*.start_date',
            'education.*.is_current' => 'boolean',
            'education.*.gpa' => 'nullable|numeric|min:0|max:4',
            'education.*.description' => 'nullable|string|max:1000',
            'certifications' => 'nullable|array',
            'certifications.*.name' => 'required|string|max:255',
            'certifications.*.issuer' => 'required|string|max:255',
            'certifications.*.issue_date' => 'nullable|date',
            'certifications.*.expiry_date' => 'nullable|date|after_or_equal:certifications.*.issue_date',
            'certifications.*.credential_number' => 'nullable|string|max:255',
            'certifications.*.description' => 'nullable|string|max:1000',
            'skills' => 'nullable|array',
            'skills.*.name' => 'required|string|max:255',
            'skills.*.level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'skills.*.years_experience' => 'nullable|integer|min:0|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        
        // Check if profile already exists
        $existingProfile = JobProfile::where('user_id', $user->id)->first();
        if ($existingProfile) {
            return response()->json(['message' => 'Job profile already exists. Use update method instead.'], 409);
        }

        $jobProfile = JobProfile::create([
            'user_id' => $user->id,
            'summary' => $request->summary,
            'resume_url' => $request->resume_url,
        ]);

        // Handle career history
        if ($request->has('career_history')) {
            foreach ($request->career_history as $historyData) {
                $jobProfile->careerHistory()->create($historyData);
            }
        }

        // Handle education
        if ($request->has('education')) {
            foreach ($request->education as $educationData) {
                $jobProfile->education()->create($educationData);
            }
        }

        // Handle certifications
        if ($request->has('certifications')) {
            foreach ($request->certifications as $certificationData) {
                $jobProfile->certifications()->create($certificationData);
            }
        }

        // Handle skills
        if ($request->has('skills')) {
            foreach ($request->skills as $skillData) {
                $jobProfile->skills()->create($skillData);
            }
        }

        $jobProfile->load([
            'user',
            'careerHistory',
            'education',
            'certifications',
            'skills',
            'savedSearches',
            'savedJobs',
            'applications'
        ]);

        return response()->json($jobProfile, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request)
    {
        $user = $request->user();
        $jobProfile = JobProfile::where('user_id', $user->id)->first();

        if (!$jobProfile) {
            return response()->json(['message' => 'Job profile not found'], 404);
        }

        $validator = Validator::make($request->all(), [
            'summary' => 'nullable|string|max:2000',
            'resume_url' => 'nullable|url|max:255',
            'career_history' => 'nullable|array',
            'career_history.*.id' => 'nullable|exists:career_histories,id',
            'career_history.*.title' => 'required|string|max:255',
            'career_history.*.company' => 'required|string|max:255',
            'career_history.*.start_date' => 'required|date',
            'career_history.*.end_date' => 'nullable|date|after_or_equal:career_history.*.start_date',
            'career_history.*.is_current' => 'boolean',
            'career_history.*.description' => 'nullable|string|max:1000',
            'education' => 'nullable|array',
            'education.*.id' => 'nullable|exists:education,id',
            'education.*.institution' => 'required|string|max:255',
            'education.*.degree' => 'required|string|max:255',
            'education.*.field' => 'nullable|string|max:255',
            'education.*.start_date' => 'required|date',
            'education.*.end_date' => 'nullable|date|after_or_equal:education.*.start_date',
            'education.*.is_current' => 'boolean',
            'education.*.gpa' => 'nullable|numeric|min:0|max:4',
            'education.*.description' => 'nullable|string|max:1000',
            'certifications' => 'nullable|array',
            'certifications.*.id' => 'nullable|exists:certifications,id',
            'certifications.*.name' => 'required|string|max:255',
            'certifications.*.issuer' => 'required|string|max:255',
            'certifications.*.issue_date' => 'nullable|date',
            'certifications.*.expiry_date' => 'nullable|date|after_or_equal:certifications.*.issue_date',
            'certifications.*.credential_number' => 'nullable|string|max:255',
            'certifications.*.description' => 'nullable|string|max:1000',
            'skills' => 'nullable|array',
            'skills.*.id' => 'nullable|exists:skills,id',
            'skills.*.name' => 'required|string|max:255',
            'skills.*.level' => 'nullable|in:beginner,intermediate,advanced,expert',
            'skills.*.years_experience' => 'nullable|integer|min:0|max:50',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $jobProfile->update($request->only(['summary', 'resume_url']));

        // Handle career history
        if ($request->has('career_history')) {
            $existingIds = $jobProfile->careerHistory()->pluck('id')->toArray();
            $requestIds = collect($request->career_history)->pluck('id')->filter()->toArray();
            
            // Delete removed items
            $toDelete = array_diff($existingIds, $requestIds);
            CareerHistory::whereIn('id', $toDelete)->delete();
            
            // Update or create items
            foreach ($request->career_history as $historyData) {
                if (isset($historyData['id'])) {
                    $career = CareerHistory::find($historyData['id']);
                    if ($career && $career->profile_id === $jobProfile->id) {
                        $career->update($historyData);
                    }
                } else {
                    $jobProfile->careerHistory()->create($historyData);
                }
            }
        }

        // Handle education
        if ($request->has('education')) {
            $existingIds = $jobProfile->education()->pluck('id')->toArray();
            $requestIds = collect($request->education)->pluck('id')->filter()->toArray();
            
            // Delete removed items
            $toDelete = array_diff($existingIds, $requestIds);
            Education::whereIn('id', $toDelete)->delete();
            
            // Update or create items
            foreach ($request->education as $educationData) {
                if (isset($educationData['id'])) {
                    $education = Education::find($educationData['id']);
                    if ($education && $education->profile_id === $jobProfile->id) {
                        $education->update($educationData);
                    }
                } else {
                    $jobProfile->education()->create($educationData);
                }
            }
        }

        // Handle certifications
        if ($request->has('certifications')) {
            $existingIds = $jobProfile->certifications()->pluck('id')->toArray();
            $requestIds = collect($request->certifications)->pluck('id')->filter()->toArray();
            
            // Delete removed items
            $toDelete = array_diff($existingIds, $requestIds);
            Certification::whereIn('id', $toDelete)->delete();
            
            // Update or create items
            foreach ($request->certifications as $certificationData) {
                if (isset($certificationData['id'])) {
                    $certification = Certification::find($certificationData['id']);
                    if ($certification && $certification->profile_id === $jobProfile->id) {
                        $certification->update($certificationData);
                    }
                } else {
                    $jobProfile->certifications()->create($certificationData);
                }
            }
        }

        // Handle skills
        if ($request->has('skills')) {
            $existingIds = $jobProfile->skills()->pluck('id')->toArray();
            $requestIds = collect($request->skills)->pluck('id')->filter()->toArray();
            
            // Delete removed items
            $toDelete = array_diff($existingIds, $requestIds);
            Skill::whereIn('id', $toDelete)->delete();
            
            // Update or create items
            foreach ($request->skills as $skillData) {
                if (isset($skillData['id'])) {
                    $skill = Skill::find($skillData['id']);
                    if ($skill && $skill->profile_id === $jobProfile->id) {
                        $skill->update($skillData);
                    }
                } else {
                    $jobProfile->skills()->create($skillData);
                }
            }
        }

        $jobProfile->load([
            'user',
            'careerHistory',
            'education',
            'certifications',
            'skills',
            'savedSearches',
            'savedJobs',
            'applications'
        ]);

        return response()->json($jobProfile);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy()
    {
        $user = $request->user();
        $jobProfile = JobProfile::where('user_id', $user->id)->first();

        if (!$jobProfile) {
            return response()->json(['message' => 'Job profile not found'], 404);
        }

        $jobProfile->delete();

        return response()->json(['message' => 'Job profile deleted successfully']);
    }
}