<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\AdminController;
use App\Http\Controllers\PaymentController;
use App\Http\Controllers\Admin\PlanController;
use App\Http\Controllers\Admin\UserController;
use App\Http\Controllers\AttendanceController;
use App\Http\Controllers\Admin\ScheduleController;
use App\Http\Controllers\Memeber\MemberController;
use App\Http\Controllers\Trainer\TrainerController;
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
Route::post('forgot-password', [AuthController::class, 'sendResetLinkEmail']);
Route::post('reset-password', [AuthController::class, 'reset']);


/** Admin Functionality */

Route::get('/members',[UserController::class,'members'])->middleware('auth:sanctum');
Route::get('/members_lists',[UserController::class,'membership'])->middleware('auth:sanctum');
Route::get('/trainer',[UserController::class,'trainer'])->middleware('auth:sanctum');
Route::get('/receptionist',[UserController::class,'receptionist'])->middleware('auth:sanctum');

Route::apiResource('/users',UserController::class)->middleware('auth:sanctum');
Route::apiResource('/plans',PlanController::class)->middleware('auth:sanctum');
Route::apiResource('/memberships',MemberShipController::class)->middleware('auth:sanctum');
Route::apiResource('/schedules',ScheduleController::class)->middleware('auth:sanctum');
Route::get('/schedule',[ScheduleController::class,'show_schedules'])->middleware('auth:sanctum');

/** Trainer Functionality */

Route::get('{trainerId}/members', [TrainerController::class, 'assignedMembers'])->middleware('auth:sanctum');
Route::get('{trainerId}/schedules', [TrainerController::class, 'schedules'])->middleware('auth:sanctum');

/**Memebership */

Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('membership', [MemberController::class, 'membership']);
    Route::get('schedule', [MemberController::class, 'schedule']);
    Route::get('my_memebership',[MemberController::class,'membership']);
    Route::delete('delete-account', [MemberController::class, 'deleteAccount']);

});

/**Attendance */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/attendance', [AttendanceController::class, 'index']); // Admin
    Route::get('/users_attendance', [AttendanceController::class, 'users']); // Admin
    Route::get('/attendance_detail',[AttendanceController::class,'attendance']);
    Route::post('/attendance/mark', [AttendanceController::class, 'mark']); // Receptionist
    Route::post('/attendance/mark-trainer', [AttendanceController::class, 'markTrainer']); // Trainer
});

/**Payment  */
Route::middleware(['auth:sanctum'])->group(function () {
    Route::get('/payments', [PaymentController::class, 'index']);
    Route::get('/payment', [PaymentController::class, 'payment']);
    Route::post('/payments', [PaymentController::class, 'store']);
    Route::get('/callback', [PaymentController::class, 'callback'])->name('payment.callback');
});