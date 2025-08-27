<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class SettingsController extends Controller
{
    /**
     * Show settings page
     */
    public function index(Request $request)
    {
        $user = $request->user();
        return view('settings.index', compact('user'));
    }
}