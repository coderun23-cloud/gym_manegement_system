<?php

namespace App\Http\Controllers\Admin;

use Log;
use Exception;
use App\Models\User;
use App\Models\Reason;
use App\Mail\DeleteUserMail;
use Illuminate\Http\Request;
use App\Mail\UserWelcomeMail;
use App\Http\Controllers\Controller;
use Illuminate\Support\Facades\Mail;

class UserController extends Controller
{
   
        public function index()
        {
            //
            return User::where('role','trainer')->orWhere('role','receptionist')->paginate(7);
        }

 
    public function store(Request $request)
    {
        //
            try{
       $fields = $request->validate([
            'name' => 'required|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
            'phone_number' => 'required|unique:users|max:12',
            'gender'=>'required',
            'role'=>'required'
        ]);
        $fields['password'] = bcrypt($fields['password']);
        $user=User::create($fields);
        $token = $user->createToken($user->email)->plainTextToken;
        Mail::to($user->email)->send(new UserWelcomeMail( $user));
        return response()->json([
            'message' => 'User registered and welcome email sent successfully.',
            'user' => $user,
            'token' => $token
        ], 201);

    }
    catch(Exception $e){
    Log::error('Mail sending failed: ' . $e->getMessage());
    
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
