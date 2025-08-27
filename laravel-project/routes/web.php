<?php

use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Web\HomeController;
use App\Http\Controllers\Web\DashboardController;
use App\Http\Controllers\Web\CardController;
use App\Http\Controllers\Web\ProfileController;
use App\Http\Controllers\Web\SettingsController;
use App\Http\Controllers\Web\ScanController;
use App\Http\Controllers\Web\MarketplaceController;
use App\Http\Controllers\Web\JobMarketController;
use App\Http\Controllers\Web\JobProfileController;
use App\Http\Controllers\Web\AppointmentController;
use App\Http\Controllers\Web\AuthController;
use App\Http\Controllers\Web\AdminController;

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "web" middleware group. Make something great!
|
*/

// Home/Landing page
Route::get('/', [HomeController::class, 'index'])->name('home');

// Authentication routes
Route::middleware('guest')->group(function () {
    Route::get('/auth/signin', [AuthController::class, 'showSignIn'])->name('auth.signin');
    Route::post('/auth/signin', [AuthController::class, 'signIn']);
    Route::get('/auth/register', [AuthController::class, 'showRegister'])->name('auth.register');
    Route::post('/auth/register', [AuthController::class, 'register']);
});

Route::post('/auth/logout', [AuthController::class, 'logout'])->name('auth.logout')->middleware('auth');

// Authenticated routes
Route::middleware('auth')->group(function () {
    // Dashboard
    Route::get('/dashboard', [DashboardController::class, 'index'])->name('dashboard');
    
    // Cards
    Route::get('/cards', [CardController::class, 'index'])->name('cards.index');
    Route::get('/cards/create', [CardController::class, 'create'])->name('cards.create');
    Route::get('/cards/{id}/edit', [CardController::class, 'edit'])->name('cards.edit');
    Route::get('/card/{id}', [CardController::class, 'show'])->name('cards.show');
    
    // Profile
    Route::get('/profile', [ProfileController::class, 'index'])->name('profile');
    
    // Settings
    Route::get('/settings', [SettingsController::class, 'index'])->name('settings');
    
    // Scan
    Route::get('/scan', [ScanController::class, 'index'])->name('scan');
    
    // Marketplace
    Route::get('/marketplace', [MarketplaceController::class, 'index'])->name('marketplace');
    
    // Job Market
    Route::get('/job-market', [JobMarketController::class, 'index'])->name('job-market');
    
    // Job Profile
    Route::get('/job-profile', [JobProfileController::class, 'index'])->name('job-profile');
    
    // Appointments
    Route::get('/appointments', [AppointmentController::class, 'index'])->name('appointments');
    
    // Features
    Route::get('/features', function () {
        return view('features');
    })->name('features');
    
    // Templates
    Route::get('/templates', function () {
        return view('templates');
    })->name('templates');
    
    // Sync
    Route::get('/sync', function () {
        return view('sync');
    })->name('sync');
    
    // Pricing
    Route::get('/pricing', function () {
        return view('pricing');
    })->name('pricing');
});

// Public card view
Route::get('/card/{id}', [CardController::class, 'publicShow'])->name('card.public');

// Admin routes
Route::middleware(['auth', 'admin'])->prefix('admin')->group(function () {
    Route::get('/', [AdminController::class, 'index'])->name('admin.dashboard');
});