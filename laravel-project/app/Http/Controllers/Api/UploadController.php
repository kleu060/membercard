<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;

class UploadController extends Controller
{
    /**
     * Handle file upload
     */
    public function upload(Request $request)
    {
        try {
            if (!$request->hasFile('file')) {
                return response()->json(['error' => 'No file received'], 400);
            }

            $file = $request->file('file');
            
            // Generate unique filename
            $timestamp = time();
            $randomId = Str::random(13);
            $fileExtension = $file->getClientOriginalExtension();
            $fileName = $timestamp . '-' . $randomId . '.' . $fileExtension;

            // Store file in public/uploads directory
            $path = $file->storeAs('uploads', $fileName, 'public');

            // Return the public URL
            $publicUrl = '/storage/' . $path;

            return response()->json([
                'url' => $publicUrl,
                'message' => 'File uploaded successfully'
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'error' => 'Upload failed',
                'message' => $e->getMessage()
            ], 500);
        }
    }
}