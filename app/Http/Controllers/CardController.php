<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class CardController extends Controller
{
    //
    public function show($route, $profile_id = null) {
        return view('card', compact('route', 'profile_id'));
    }
}
