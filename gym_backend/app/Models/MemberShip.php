<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberShip extends Model
{
    /** @use HasFactory<\Database\Factories\MemberShipFactory> */
    use HasFactory;
     protected $fillable = [
        'user_id',
        'plan_id',
        'start_date',
        'end_date',
        'status',
    ];

    // Relationship to User
    public function user()
    {
        return $this->belongsTo(User::class);
    }

    // Relationship to Plan
    public function plan()
    {
        return $this->belongsTo(Plan::class);
    }
}
