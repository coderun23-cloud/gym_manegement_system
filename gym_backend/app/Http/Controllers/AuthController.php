<?php

namespace App\Http\Controllers;

use Log;
use Exception;
use App\Models\User;
use Illuminate\Support\Str;
use Illuminate\Http\Request;
use App\Mail\UserWelcomeMail;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Hash;
use Illuminate\Support\Facades\Mail;
use Illuminate\Support\Facades\Password;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    //
  public function register(Request $request)
{
    try {
        $fields = $request->validate([
        'name' => 'required|string|max:100',
        'email' => 'required|email|unique:users,email',
        'password' => 'required|string|confirmed|min:8',
        'phone_number' => 'required|string|unique:users,phone_number|max:12',
        'gender' => 'required|in:male,female',
        ]);

        $user = User::create($fields);

        $token = $user->createToken('authToken')->plainTextToken;

        try {
            Mail::to($user->email)->send(new UserWelcomeMail($user));
        } catch (\Exception $e) {
            \Log::error('Welcome email failed: '.$e->getMessage());
        }

        return response()->json([
            'user' => $user,
            'token' => $token,
            'message' => 'Registration successful'
        ], 201);

    } catch (ValidationException $e) {
        return response()->json([
            'errors' => $e->errors(),
            'message' => 'Validation failed'
        ], 422);
    } catch (\Exception $e) {
        \Log::error('Registration error: '.$e->getMessage());
        return response()->json([
            'message' => 'Registration failed',
            'error' => $e->getMessage()
        ], 500);
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
    public function profile()
    {
        return response()->json(Auth::user());
    }
    public function updateProfile(Request $request)
    {
        $user = $request->user();

        $data = $request->validate([
            'name' => 'required|string|max:255',
            'email' => 'required|email|unique:users,email,' . $user->id,
            'phone_number'=>'required',
            'gender'=>'required'

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
public function sendResetLinkEmail(Request $request)
{
    $request->validate([
        'email' => 'required|email',
    ]);

    $status = Password::sendResetLink(
        $request->only('email')
    );

    return $status === Password::RESET_LINK_SENT
        ? response()->json(['message' => 'Password reset link sent!'])
        : response()->json(['message' => 'Failed to send reset link.'], 400);
}
 public function reset(Request $request)
{
    $request->validate([
        'token'    => 'required',
        'email'    => 'required|email',
        'password' => 'required|min:8|confirmed',
    ]);

    $status = Password::reset(
        $request->only('email', 'password', 'password_confirmation', 'token'),
        function ($user, $password) {
            $user->forceFill([
                'password'       => Hash::make($password),
                'remember_token' => Str::random(60),
            ])->save();
        }
    );

    return $status === Password::PASSWORD_RESET
        ? response()->json(['message' => 'Password reset successful.'])
        : response()->json(['message' => __($status)], 400);
}
    
}
