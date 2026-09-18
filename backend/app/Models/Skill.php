<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Skill extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'category',
        'proficiency',
        'icon_name',
        'order_index',
    ];

    protected $casts = [
        'proficiency' => 'integer',
        'order_index' => 'integer',
    ];
}
