<?php

namespace App\Http\Controllers;
use App\Models\Attendance;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;

class AttendanceController extends Controller
{
    // 🧑‍💼 Admin: View all attendance records
    public function index()
    {
        return Attendance::with('user')->where('role','receptionist')->orWhere('role','trainer')->orderBy('date', 'desc')->paginate(10);
    }
    public function users(){
        return User::where('role','trainer')->orWhere('role','memeber')->get();
    }
    public function attendance(){
        $user=Auth::id();
        return Attendance::where('user_id',$user)->get();
    }

public function mark(Request $request)
{
    $data = $request->validate([
        'user_id' => 'required|exists:users,id',
        'role' => 'required|in:member,trainer',
        'status' => 'required|in:present,absent,late',
        'date' => 'required|date',
    ]);

    $existing = Attendance::where('user_id', $data['user_id'])
        ->where('date', $data['date'])
        ->first();

    if ($existing) {
        return response()->json([
            'message' => 'Attendance has already been marked for this user on this date.'
        ], 409); // 409 Conflict
    }

    $attendance = Attendance::create($data);

    return response()->json([
        'message' => 'Attendance recorded.',
        'attendance' => $attendance
    ]);
}


 public function markTrainer(Request $request)
{
    $user = Auth::user();

    if ($user->role !== 'trainer') {
        return response()->json(['message' => 'Unauthorized'], 403);
    }

    $data = $request->validate([
        'status' => 'required|in:present,absent,late',
        'date' => 'required|date',
    ]);

    $existing = Attendance::where('user_id', $user->id)
        ->where('date', $data['date'])
        ->first();

    if ($existing) {
        return response()->json([
            'message' => 'Attendance already marked for today.'
        ], 409); // 409 Conflict
    }

    $attendance = Attendance::create([
        'user_id' => $user->id,
        'role' => 'trainer',
        'status' => $data['status'],
        'date' => $data['date'],
    ]);

    return response()->json([
        'message' => 'Trainer attendance marked.',
        'attendance' => $attendance
    ]);
}

}
