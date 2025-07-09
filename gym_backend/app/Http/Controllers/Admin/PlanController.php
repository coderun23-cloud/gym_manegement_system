<?php

namespace App\Http\Controllers\Admin;

use App\Models\Plan;
use Illuminate\Http\Request;
use App\Http\Controllers\Controller;

class PlanController extends Controller
{
    
  public function index()
{
    $plan = Plan::all();
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
   
}
