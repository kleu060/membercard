<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class JobMarketController extends Controller
{
    /**
     * Show job market page
     */
    public function index(Request $request)
    {
        return view('job-market.index');
    }
}