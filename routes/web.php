<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\CardController;

Route::get('/', function () {
    return view('index');
});


Route::get('/card/{route}/{profile_id?}', [CardController::class, 'show']);