<?php

namespace App\Http\Controllers\Admin;

use Log;
use Exception;
use App\Models\User;
use App\Models\Reason;
use App\Mail\DeleteUserMail;
use Illuminate\Http\Request;
use App\Mail\UserWelcomeMail;
use App\Mail\StaffWelcomeMail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
   
    public function index()
        {
            //
            return User::where('role','trainer')->orWhere('role','receptionist')->paginate(7);
        }
      public function members() {
        $members = User::where('role', 'memeber')->with('membership.plan')->paginate(7);
        return response()->json($members);
    }
//    public function membership()
// {
//     $membersWithMembership = User::whereHas('membership') // Only users with a membership
//         ->where('role', 'member')                         // Optional: limit to "member" role
//         ->with('membership')                              // Eager-load membership data
//         ->paginate(7);

//     return response()->json($membersWithMembership);
// }

    public function trainer(){
         $trainer=User::where('role','trainer')->get();
         return response()->json([
            'trainer'=>$trainer
         ]);
    }
    public function receptionist(){
        return User::where('role','receptionist')->get();
    }

 
  public function store(Request $request)
{
    try {
        $fields = $request->validate([
            'name' => 'required|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'phone_number' => 'required|unique:users|max:12',
            'gender' => 'required',
            'role' => 'required'
        ]);
        
        $plainPassword = $fields['password']; // Store the plain password before hashing
        $fields['password'] = bcrypt($fields['password']);
        
        $user = User::create($fields);
        $token = $user->createToken($user->email)->plainTextToken;
        
        try {
            Mail::to($user->email)->send(new StaffWelcomeMail($user, $plainPassword));
        } catch (\Exception $mailEx) {
            \Log::warning('Mail failed: ' . $mailEx->getMessage());
        }
        
        return response()->json([
            'message' => 'User registered and welcome email sent successfully.',
            'user' => $user,
            'token' => $token
        ], 201);

    } catch(Exception $e) {
        \Log::error('Registration error: ' . $e->getMessage()); // More detailed logging
        
        return response()->json([
            'message' => 'Registration failed due to mail sending error.',
            'error' => $e->getMessage()
        ], 500);
    }
}

    public function show(string $id)
    {
        //
        $user=User::find($id);
        return response()->json([
            $user
        ]);
    }


   public function destroy(string $id, Request $request)
{
    
    $user = User::findOrFail($id);
    $fields = $request->validate([
        'reason' => 'required|string|max:255'
    ]);
    $reason = Reason::create([
        'reason' => $fields['reason'],
        'user_id' => $user->id, 
    ]);
    Mail::to($user->email)->send(new DeleteUserMail($user, $reason));
    $user->delete();
    return response()->json([
        'message' => 'Account deleted successfully and email sent.'
    ]);
}

}
