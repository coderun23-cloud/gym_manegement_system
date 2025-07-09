<?php

namespace App\Http\Controllers\Admin;

use App\Models\Membership;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Auth;

class MembershipController extends Controller
{
    public function index()
    {
        $memberships = Membership::with(['user', 'plan'])->paginate(10);

        return response()->json($memberships);
    }
public function memebership()
{
    $user = Auth::id();
    $memberships = Membership::with(['user', 'plan'])
                  ->where('user_id', $user)
                  ->paginate(10);

    return response()->json([
        'data' => $memberships->items(),
        'current_page' => $memberships->currentPage(),
        'last_page' => $memberships->lastPage(),
        'per_page' => $memberships->perPage(),
        'total' => $memberships->total(),
    ]);
}
    public function store(Request $request)
    {
        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:plans,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:active,expired,cancelled',
        ]);

        $membership = Membership::create($validated);

        return response()->json([
            'message' => 'Membership created successfully',
            'membership' => $membership->load(['user', 'plan']),
        ], 201);
    }

    public function show($id)
    {
        $membership = Membership::with(['user', 'plan'])->findOrFail($id);
        return response()->json($membership);
    }

    public function update(Request $request, $id)
    {
        $membership = Membership::findOrFail($id);

        $validated = $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:plans,id',
            'start_date' => 'required|date',
            'end_date' => 'nullable|date|after_or_equal:start_date',
            'status' => 'required|in:active,expired,cancelled',
        ]);

        $membership->update($validated);

        return response()->json([
            'message' => 'Membership updated successfully',
            'membership' => $membership->load(['user', 'plan']),
        ]);
    }
    public function destroy($id)
    {
        $membership = Membership::findOrFail($id);
        $membership->delete();

        return response()->json([
            'message' => 'Membership deleted successfully',
        ]);
    }
}
