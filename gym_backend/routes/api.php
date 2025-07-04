<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\Admin\MemberShipController;

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');
/*Authentication section*/
Route::post('register',[AuthController::class,'register']);
Route::post('login',[AuthController::class,'login']);
Route::post('logout',[AuthController::class,'logout'])->middleware('auth:sanctum');
Route::get('profile', [AuthController::class, 'profile'])->middleware('auth:sanctum');
Route::put('profile', [AuthController::class, 'updateProfile'])->middleware('auth:sanctum');
Route::delete('profile', [AuthController::class, 'deleteAccount'])->middleware('auth:sanctum');

/** Admin Functionality */

Route::apiResource('/users',UserController::class)->middleware('auth:sanctum');
Route::apiResource('/plans',PlanController::class)->middleware('auth:sanctum');
Route::apiResource('/membership',MemberShipController::class)->middleware('auth:sanctum');

