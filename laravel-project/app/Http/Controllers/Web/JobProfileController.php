<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class JobProfileController extends Controller
{
    /**
     * Show job profile page
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return view('job-profile.index', compact('user'));
    }
}