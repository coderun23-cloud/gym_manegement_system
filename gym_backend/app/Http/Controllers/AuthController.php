<?php

namespace App\Http\Controllers;

use Log;
use Exception;
use App\Models\User;
use Illuminate\Http\Request;
use App\Mail\UserWelcomeMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;

class AuthController extends Controller
{
    //
    public function register(Request $request){
        
    try{
       $fields = $request->validate([
            'name' => 'required|max:100',
            'email' => 'required|email|unique:users',
            'password' => 'required|confirmed',
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
    public function login(Request $request){
        $request->validate([
            'email' => 'required|email|exists:users',
            'password' => 'required'
        ]);

        $user = User::where('email', $request->email)->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'errors' => [
                    'email' => ['The provided credentials are incorrect.']
                ]
            ], 401); 
        }

        $token = $user->createToken($user->email);
        return response()->json([
            'user' => $user,
            'token' => $token->plainTextToken
        ]);
    }
    public function logout(Request $request){
        $request->user()->tokens()->delete();
        return[
            'message'=>'You are logged out'
        ];

    }
    public function profile(Request $request)
    {
        return response()->json(Auth::user());
    }
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone_number'=>'required'
        ]);

        $user->update($data);
        return response()->json($user);
    }
    public function deleteAccount(Request $request)
{
     $request->validate([
        'password' => 'required|string',
    ]);

    $user = $request->user();

    if (!Hash::check($request->password, $user->password)) {
        return response()->json(['message' => 'Incorrect password'], 403);
    }

    $user->tokens()->delete();
    $user->delete();

    return response()->json(['message' => 'Account deleted successfully']);
}

}
