<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Reason extends Model
{
    //
    protected $fillable=[
        'reason','user_id'
    ];
    public function user()
    {
        return $this->belongsTo(User::class);
    }
  
}
