<?php

namespace App\Models;

use App\Models\MemberShip;
use Illuminate\Database\Eloquent\Model;

class Payment extends Model
{
    //
        protected $fillable = [
        'user_id',
        'first_name',
        'last_name',
        'email',
        'phone',
        'amount',
        'tx_ref',
        'status',
        'payment_for',
        'reference_id',
    ];

    // relationships
    public function user() {
        return $this->belongsTo(User::class);
    }

    public function membership() {
        return $this->belongsTo(MemberShip::class, 'reference_id');
    }
}
