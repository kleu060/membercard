<?php

namespace App\Http\Controllers\Web;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AppointmentController extends Controller
{
    /**
     * Show appointments page
     */
    public function index(Request $request)
    {
        return view('appointments.index');
    }
}