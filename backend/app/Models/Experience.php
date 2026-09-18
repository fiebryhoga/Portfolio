<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Experience extends Model
{
    use HasFactory;

    protected $fillable = [
        'role',
        'company',
        'company_url',
        'location',
        'start_date',
        'end_date',
        'is_current',
        'description',
        'bullet_points',
        'order_index',
    ];

    protected $casts = [
        'is_current' => 'boolean',
        'order_index' => 'integer',
    ];
}
