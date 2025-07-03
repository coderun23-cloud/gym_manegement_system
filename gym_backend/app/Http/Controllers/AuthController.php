<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class AuthController extends Controller
{
    //
    public function register(){
        return "Regsiter";
    }
    public function login(){
        return "login";

    }
    public function logout(){
        return "logout";

    }
}
