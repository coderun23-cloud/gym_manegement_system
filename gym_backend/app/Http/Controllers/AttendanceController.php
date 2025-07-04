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
        return Attendance::with('user')->orderBy('date', 'desc')->paginate(10);
    }

    // 👩‍💼 Receptionist: Mark member/trainer attendance
    public function mark(Request $request)
    {
        $data = $request->validate([
            'user_id' => 'required|exists:users,id',
            'role' => 'required|in:member,trainer',
            'status' => 'required|in:present,absent,late',
            'date' => 'required|date',
        ]);

        $attendance = Attendance::updateOrCreate(
            ['user_id' => $data['user_id'], 'date' => $data['date']],
            ['role' => $data['role'], 'status' => $data['status']]
        );

        return response()->json([
            'message' => 'Attendance recorded.',
            'attendance' => $attendance
        ]);
    }

    // 🏋️‍♂️ Trainer: Mark their own attendance
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

        $attendance = Attendance::updateOrCreate(
            ['user_id' => $user->id, 'date' => $data['date']],
            ['role' => 'trainer', 'status' => $data['status']]
        );

        return response()->json([
            'message' => 'Trainer attendance marked.',
            'attendance' => $attendance
        ]);
    }
}
