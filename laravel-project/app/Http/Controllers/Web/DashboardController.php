<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\BusinessCard;

class DashboardController extends Controller
{
    /**
     * Show the dashboard
     */
    public function index(Request $request)
    {
        $user = $request->user();
        $cards = BusinessCard::where('user_id', $user->id)
                           ->withCount(['socialLinks', 'products'])
                           ->latest()
                           ->get();
        
        return view('dashboard.index', compact('user', 'cards'));
    }
}