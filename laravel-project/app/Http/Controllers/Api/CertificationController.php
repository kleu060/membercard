<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\JobProfile;
use App\Models\Certification;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;

class CertificationController extends Controller
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

        $certifications = $jobProfile->certifications()->orderBy('issue_date', 'desc')->get();
        return response()->json($certifications);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'credential_number' => 'nullable|string|max:255',
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

        $certification = $jobProfile->certifications()->create($request->all());
        return response()->json($certification, 201);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'issuer' => 'required|string|max:255',
            'issue_date' => 'nullable|date',
            'expiry_date' => 'nullable|date|after_or_equal:issue_date',
            'credential_number' => 'nullable|string|max:255',
            'description' => 'nullable|string|max:1000',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        $user = $request->user();
        $certification = Certification::whereHas('profile', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        $certification->update($request->all());
        return response()->json($certification);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $user = $request->user();
        $certification = Certification::whereHas('profile', function ($query) use ($user) {
            $query->where('user_id', $user->id);
        })->findOrFail($id);

        $certification->delete();
        return response()->json(['message' => 'Certification deleted successfully']);
    }
}