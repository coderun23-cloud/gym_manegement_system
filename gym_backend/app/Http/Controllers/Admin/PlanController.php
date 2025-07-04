<?php

namespace App\Http\Controllers\Admin;

use App\Models\Plan;
use App\Models\User;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PlanController extends Controller
{
    
  public function index()
{
    $plan = Plan::paginate(7);
    return response()->json([
        'message' => 'Plans fetched successfully',
        'data' => $plan
    ]);
}


   
    public function store(Request $request)
    {
        $fields=$request->validate([
            'name'=>"required|unique:plans",
            "price"=>'required|numeric|min:0',
            "duration_days"=>'required',
            "description"=>"required"
        ]);
        $plan=Plan::create($fields);
        return response()->json([
            "message"=>'Plan created successfully',
            'plan'=>$plan
        ]);
    }

      public function show(string $id)
    {
        //
        $plan=Plan::findOrFail($id);
        return response()->json([
            $plan
        ]);
    }


  
    public function update(Request $request, string $id)
    {
        //
         $fields=$request->validate([
            'name' => 'required|unique:plans,name,' . $id, 
            "price"=>'required|numeric|min:0',
            "duration_days"=>'required',
            "description"=>"required"
        ]);
        $plan=Plan::findOrFail($id);
        $plan->update($fields);
        return response()->json([
            "message"=>'Plan updated successfully',
            'plan'=>$plan
        ]);
    }

   
    public function destroy(string $id)
    {
        $plan=Plan::findOrFail($id);
        $plan->delete();
        return response()->json([
            "message"=>'plan deleted successfully'
        ]);
    }
public function assignPlanAndMembership(Request $request)
{
    $validated = $request->validate([
        'user_id' => 'required|exists:users,id',
        'plan_id' => 'required|exists:plans,id',
        'membership_id' => 'required|exists:memberships,id',
    ]);

    $user = User::findOrFail($validated['user_id']);
    $user->plan_id = $validated['plan_id'];
    $user->membership_id = $validated['membership_id'];
    $user->save();

    return response()->json([
        'message' => 'Plan and Membership assigned successfully',
        'user' => $user->load(['plan', 'membership']),
    ]);
}


}
