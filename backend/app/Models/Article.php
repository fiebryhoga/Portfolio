<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Article extends Model
{
    use HasFactory;

    protected $fillable = [
        'title',
        'slug',
        'excerpt',
        'content',
        'category',
        'reading_time',
        'published_at',
        'is_published',
        'order_index',
    ];

    protected $casts = [
        'is_published' => 'boolean',
        'order_index' => 'integer',
        'published_at' => 'datetime',
    ];
}
