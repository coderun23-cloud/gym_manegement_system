<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    //
     protected $fillable = ['user_id', 'role', 'status', 'date'];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
