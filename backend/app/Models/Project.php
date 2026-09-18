<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'short_description',
        'full_description',
        'image_url',
        'demo_url',
        'github_url',
        'tech_stack',
        'featured',
        'order_index',
    ];

    protected $casts = [
        'featured' => 'boolean',
        'order_index' => 'integer',
    ];
}
