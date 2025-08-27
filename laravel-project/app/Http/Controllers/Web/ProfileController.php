<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    /**
     * Show user profile
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return view('profile.index', compact('user'));
    }
}