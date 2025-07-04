<?php

namespace App\Http\Controllers\Trainer;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Schedule;
use Illuminate\Http\Request;

class TrainerController extends Controller
{
    public function assignedMembers($trainerId)
    {
        $members = User::where('role', 'memeber')
            ->whereHas('memberSchedules', function ($query) use ($trainerId) {
                $query->where('trainer_id', $trainerId);
            })
            ->with(['membership.plan'])
            ->paginate(10);

        return response()->json($members);
    }

    public function schedules($trainerId)
    {
        $schedules = Schedule::with(['member'])
            ->where('trainer_id', $trainerId)
            ->orderBy('start_time', 'asc')
            ->paginate(10);

        return response()->json($schedules);
    }
}
