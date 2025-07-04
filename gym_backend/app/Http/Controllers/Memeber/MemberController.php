<?php

namespace App\Http\Controllers\Memeber;

use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Hash;

class MemberController extends Controller
{
    //
     public function membership(Request $request)
    {
        $user = $request->user();

        $membership = $user->membership()->with('plan','user')->first();

        if (!$membership) {
            return response()->json(['message' => 'No active membership found'], 404);
        }

        return response()->json($membership);
    }

    public function schedule(Request $request)
    {
        $user = $request->user();

        $schedules = $user->memberSchedules()->with('trainer')->orderBy('start_time')->get();

        return response()->json($schedules);
    }
    public function deleteAccount(Request $request)
    {
        $user = $request->user();

        $request->validate([
            'password' => 'required|string',
        ]);

        if (!Hash::check($request->password, $user->password)) {
            return response()->json([
                'message' => 'Incorrect password. Account not deleted.'
            ], 403);
        }

        $user->delete();

        return response()->json([
            'message' => 'Your account has been deleted successfully.'
        ]);
    }
}
