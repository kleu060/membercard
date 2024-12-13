<?php

/*
|--------------------------------------------------------------------------
| Backpack\PermissionManager Routes
|--------------------------------------------------------------------------
|
| This file is where you may define all of the routes that are
| handled by the Backpack\PermissionManager package.
|
*/

Route::group([
    // 'namespace'  => 'Backpack\PermissionManager\app\Http\Controllers',
    'prefix'     => config('backpack.base.route_prefix', 'admin'),
    'middleware' => ['web', backpack_middleware()],
], function () {
    Route::crud('user', \App\Http\Controllers\Admin\CustomUserCrudController::class);
    Route::crud('permission', \Backpack\PermissionManager\app\Http\Controllers\PermissionCrudController::class);
    Route::crud('role', \Backpack\PermissionManager\app\Http\Controllers\RoleCrudController::class);
});
