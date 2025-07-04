<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;

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


