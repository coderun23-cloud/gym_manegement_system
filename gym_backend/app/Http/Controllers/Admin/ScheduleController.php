<?php

namespace App\Http\Controllers\Admin;

use App\Models\Schedule;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class ScheduleController extends Controller
{
    // List all schedules with trainer and member info
    public function index()
    {
        $schedules = Schedule::with(['trainer', 'member'])->paginate(10);
        return response()->json($schedules);
    }

    // Store new schedule and assign trainer to member
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date|before:end_time',
            'end_time' => 'required|date|after:start_time',
            'trainer_id' => 'required|exists:users,id',
            'member_id' => 'required|exists:users,id',
        ]);

        $schedule = Schedule::create($validated);

        return response()->json([
            'message' => 'Schedule created successfully',
            'schedule' => $schedule->load(['trainer', 'member']),
        ], 201);
    }

    // Show a schedule
    public function show($id)
    {
        $schedule = Schedule::with(['trainer', 'member'])->findOrFail($id);
        return response()->json($schedule);
    }
  public function show_schedules()
{
    $user=Auth::id();
    $schedules = Schedule::with(['trainer'])
        ->where('user_id', $user)
        ->get();

    return response()->json($schedules);
}


    // Update schedule
    public function update(Request $request, $id)
    {
        $schedule = Schedule::findOrFail($id);

        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'nullable|string',
            'start_time' => 'required|date|before:end_time',
            'end_time' => 'required|date|after:start_time',
            'trainer_id' => 'required|exists:users,id',
            'member_id' => 'required|exists:users,id',
        ]);

        $schedule->update($validated);

        return response()->json([
            'message' => 'Schedule updated successfully',
            'schedule' => $schedule->load(['trainer', 'member']),
        ]);
    }

    // Delete schedule
    public function destroy($id)
    {
        $schedule = Schedule::findOrFail($id);
        $schedule->delete();

        return response()->json([
            'message' => 'Schedule deleted successfully',
        ]);
    }
}
