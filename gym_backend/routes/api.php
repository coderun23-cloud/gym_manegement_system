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

//
/*Admin Functionalities*/

Route::get('members',[AdminController::class,'members'])->middleware('auth:sanctum');
Route::get('staffs',[AdminController::class,'staffs'])->middleware('auth:sanctum');
Route::post('addstaffs',[AdminController::class,'addStaffs'])->middleware('auth:sanctum');
Route::delete('deletestaffs/{id}',[AdminController::class,'deleteStaff'])->middleware('auth:sanctum');
/*Plans*/

Route::get('/plan',[AdminController::class,'plans']);
Route::post('addplan',[AdminController::class,'addPlan'])->middleware('auth:sanctum');
Route::get('showplan/{id}',[AdminController::class,'showPlan']);
Route::put('editplan/{id}',[AdminController::class,'editPlan']);
Route::delete('deleteplan/{id}',[AdminController::class,'deletePlan']);
 /** Memberships */

 Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/memberships', [AdminController::class, 'memberShip']);
    Route::post('/memberships', [AdminController::class, 'storeMembership']);
    Route::get('/memberships/{id}', [AdminController::class, 'showMemberShip']);
    Route::put('/memberships/{id}', [AdminController::class, 'updateMemberShip']);
    Route::delete('/memberships/{id}', [AdminController::class, 'deleteMemberShip']);
});


