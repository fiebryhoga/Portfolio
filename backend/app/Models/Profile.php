<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Profile extends Model
{
    use HasFactory;

    protected $fillable = [
        'name',
        'headline',
        'bio',
        'philosophy',
        'education_title',
        'education_degree',
        'education_gpa',
        'avatar_url',
        'resume_url',
        'github_url',
        'linkedin_url',
        'twitter_url',
        'email',
        'phone',
        'location',
        'available_for_work',
        'years_experience',
        'completed_projects',
        'satisfied_clients',
    ];

    protected $casts = [
        'available_for_work' => 'boolean',
        'years_experience' => 'integer',
        'completed_projects' => 'integer',
        'satisfied_clients' => 'integer',
    ];
}
