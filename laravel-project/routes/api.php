<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\CardController;
use App\Http\Controllers\Api\JobProfileController;
use App\Http\Controllers\Api\AppointmentController;
use App\Http\Controllers\Api\MarketplaceController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\Admin\StatsController;
use App\Http\Controllers\Api\Admin\UserController;
use App\Http\Controllers\Api\Admin\PlanController;
use App\Http\Controllers\Api\Admin\FeatureController;
use App\Http\Controllers\Api\Admin\DatabaseController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});

// Authentication routes
Route::post('/auth/register', [AuthController::class, 'register']);
Route::post('/auth/login', [AuthController::class, 'login']);
Route::post('/auth/logout', [AuthController::class, 'logout'])->middleware('auth:sanctum');
Route::get('/auth/me', [AuthController::class, 'me'])->middleware('auth:sanctum');

// Upload routes
Route::post('/upload', [UploadController::class, 'upload']);

// Card routes
Route::get('/cards', [CardController::class, 'index']);
Route::post('/cards', [CardController::class, 'store'])->middleware('auth:sanctum');
Route::get('/cards/{id}', [CardController::class, 'show']);
Route::put('/cards/{id}', [CardController::class, 'update'])->middleware('auth:sanctum');
Route::delete('/cards/{id}', [CardController::class, 'destroy'])->middleware('auth:sanctum');

// Job profile routes
Route::get('/user/job-profile', [JobProfileController::class, 'show'])->middleware('auth:sanctum');
Route::post('/user/job-profile', [JobProfileController::class, 'store'])->middleware('auth:sanctum');
Route::put('/user/job-profile', [JobProfileController::class, 'update'])->middleware('auth:sanctum');

// Appointment routes
Route::get('/appointments', [AppointmentController::class, 'index'])->middleware('auth:sanctum');
Route::post('/appointments', [AppointmentController::class, 'store'])->middleware('auth:sanctum');

// Marketplace routes
Route::get('/marketplace', [MarketplaceController::class, 'index']);

// Admin routes
Route::middleware(['auth:sanctum', 'admin'])->prefix('admin')->group(function () {
    Route::get('/stats', [StatsController::class, 'index']);
    Route::get('/users', [UserController::class, 'index']);
    Route::get('/plans', [PlanController::class, 'index']);
    Route::get('/features', [FeatureController::class, 'index']);
    Route::get('/database/stats', [DatabaseController::class, 'stats']);
});