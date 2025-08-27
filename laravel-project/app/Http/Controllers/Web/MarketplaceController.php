<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class MarketplaceController extends Controller
{
    /**
     * Show marketplace page
     */
    public function index(Request $request)
    {
        return view('marketplace.index');
    }
}