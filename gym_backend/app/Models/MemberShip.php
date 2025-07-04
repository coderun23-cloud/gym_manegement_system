<?php

namespace App\Models;

use App\Models\Payment;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Factories\HasFactory;

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
    public function payments() {
        return $this->hasMany(Payment::class, 'reference_id');
    }

}
