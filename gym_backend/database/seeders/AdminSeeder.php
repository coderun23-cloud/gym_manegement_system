<?php

namespace Database\Seeders;

use App\Models\User;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;

class AdminSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
   public function run(): void
    {
        $admin = User::create([
        'name' => 'System Admin',
        'email' => 'SuperAdmin@gmail.com',
        'password' => Hash::make('admin1234'),
        'role' => 'admin',
        'phone_number'=>"0982847823",
        'gender'=>'male'

    ]);

    // Generate token and print to console
    $token = $admin->createToken('admin-token')->plainTextToken;
    }
}
