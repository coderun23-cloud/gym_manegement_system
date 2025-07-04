<?php

namespace App\Http\Controllers\Admin;

use App\Models\MemberShip;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class MemberShipController extends Controller
{
 
    public function index()
    {
        $memberships = MemberShip::paginate(10);
        return response()->json($memberships);
    }
    
    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|unique:memberships,name',
            'description' => 'nullable|string',
        ]);

        $membership = MemberShip::create($validated);

        return response()->json([
            'message' => 'Membership created successfully',
            'membership' => $membership,
        ], 201);
    }

    public function show($id)
    {
        $membership = MemberShip::findOrFail($id);
        return response()->json($membership);
    }

  
    public function update(Request $request, $id)
    {
        $membership = MemberShip::findOrFail($id);

        $validated = $request->validate([
            'name' => 'required|string|unique:memberships,name,' . $id,
            'description' => 'nullable|string',
        ]);

        $membership->update($validated);

        return response()->json([
            'message' => 'Membership updated successfully',
            'membership' => $membership,
        ]);
    }

    public function destroy($id)
    {
        $membership = MemberShip::findOrFail($id);
        $membership->delete();

        return response()->json([
            'message' => 'Membership deleted successfully',
        ]);
    }
    

}
