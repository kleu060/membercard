<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class ScanController extends Controller
{
    /**
     * Show scan page
     */
    public function index(Request $request)
    {
        return view('scan.index');
    }
}