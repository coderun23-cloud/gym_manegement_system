<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MemberShip extends Model
{
    /** @use HasFactory<\Database\Factories\MemberShipFactory> */
    use HasFactory;
     protected $fillable = [
        'name',
        'description',
    ];
    public function users()
    {
        return $this->hasMany(User::class);
    }
}
