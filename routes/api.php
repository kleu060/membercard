<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

use App\Http\Controllers\Api\IndividualController;


Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

Route::get('/individual/{route}/{profile_id?}', [IndividualController::class, 'show']);
Route::get('/downloadvcf/{route}/{profile_id?}', [IndividualController::class, 'downloadVcf']);

