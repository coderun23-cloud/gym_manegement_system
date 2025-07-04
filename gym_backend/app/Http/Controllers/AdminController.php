<?php

namespace App\Http\Controllers;

use Log;
use Exception;
use Carbon\Carbon;
use App\Models\Plan;
use App\Models\User;
use App\Models\MemberShip;
use App\Mail\DeleteUserMail;
use Illuminate\Http\Request;
use App\Mail\UserWelcomeMail;
use Illuminate\Support\Facades\Mail;

class AdminController extends Controller
{
    //
    public function members(){
        $memeber=User::where('role','memeber')->paginate(10);
        return [
            'members'=>$memeber
        ];
    }
        public function staffs(){
        $memeber=User::where('role','trainer')->orWhere('role','receptionist')->paginate(10);
        return [
            'members'=>$memeber
        ];
    }
    public function addStaffs(Request $request){
          try{
       $fields = $request->validate([
            'name' => 'required|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'role'=>'required',
            'phone_number' => 'required|unique:users|max:12',
        ]);
        $fields['password'] = bcrypt($fields['password']);
        $user=User::create($fields);
        $token = $user->createToken($user->email)->plainTextToken;
        Mail::to($user->email)->send(new UserWelcomeMail( $user));
            return [
                'message' => 'User registered and welcome email sent successfully.',
                'user'=>$user,
                'token'=>$token
            ];
    }
    catch(Exception $e){
            Log::error('Mail sending failed: ' . $e->getMessage());

    }
    }
    public function deleteStaff($id){
        $staff=User::find($id);
        $staff->delete();
        Mail::to($staff->email)->send(new DeleteUserMail($staff));
        return response()->json([
            'message' => 'Staff member account deleted successfully!'
        ]);
    }
    public function plans(){
        return Plan::all();
    }
    public function addPlan(Request $request){
        $fields=$request->validate([
            'name'=>"required|max:100|unique:plans",
            "price"=>"required|numeric",
            "duration_days"=>'required|integer',
            'description'=>'required'

        ]);
        $plan=Plan::create($fields);
        return [
            'message'=>'Plan set successfully',
            'plan'=>$plan
        ];
    }
    public function showPlan($id){
        $plan=Plan::find($id);
        return [
            $plan
        ];
    }
       public function editPlan(Request $request,$id){
        $fields=$request->validate([
            'name'=>"required|max:100",
            "price"=>"required|numeric",
            "duration_days"=>'required|integer',
            'description'=>'required'

        ]);
        $plan=Plan::find($id);
        $plan->update($fields);
        return [
            'message'=>'Plan updated successfully',
            'plan'=>$plan
        ];
    }
      public function deletePlan($id){
        $plan=Plan::find($id);
        $plan->delete();
        return [
            'message'=>'Plan deleted successfully'
        ];
    }
     public function memberShip()
    {
        $memberships = MemberShip::with(['user', 'plan'])->latest()->get();

        return response()->json([
            'memberships' => $memberships
        ]);
    }
    public function storeMembership(Request $request)
    {
        $request->validate([
            'user_id' => 'required|exists:users,id',
            'plan_id' => 'required|exists:plans,id',
            'start_date' => 'required|date'
        ]);

        $plan = Plan::findOrFail($request->plan_id);
        $start = Carbon::parse($request->start_date);
        $end = $start->copy()->addDays($plan->duration_days);

        $membership = MemberShip::create([
            'user_id' => $request->user_id,
            'plan_id' => $plan->id,
            'start_date' => $start,
            'end_date' => $end,
            'status' => 'active',
        ]);

        return response()->json([
            'message' => 'Membership assigned successfully.',
            'membership' => $membership
        ]);
    }
        public function showMemberShip($id)
    {
        $membership = MemberShip::with(['user', 'plan'])->findOrFail($id);

        return response()->json($membership);
    }
      public function updateMemberShip(Request $request, $id)
    {
        $membership = MemberShip::findOrFail($id);

        $request->validate([
            'start_date' => 'required|date',
            'plan_id' => 'required|exists:plans,id'
        ]);

        $plan = Plan::find($request->plan_id);
        $start = Carbon::parse($request->start_date);
        $end = $start->copy()->addDays($plan->duration_days);

        $membership->update([
            'plan_id' => $plan->id,
            'start_date' => $start,
            'end_date' => $end,
            'status' => 'active'
        ]);

        return response()->json([
            'message' => 'Membership renewed/updated.',
            'membership' => $membership
        ]);
    }

    // 🔹 Cancel a membership
    public function deleteMemberShip($id)
    {
        $membership = MemberShip::findOrFail($id);
        $membership->update([
            'status' => 'cancelled'
        ]);

        return response()->json([
            'message' => 'Membership cancelled.'
        ]);
    }



}
