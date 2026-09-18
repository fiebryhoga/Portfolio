<?php

namespace App\Http\Controllers;

use App\Models\Profile;
use Illuminate\Http\Request;

class ProfileController extends Controller
{
    public function show()
    {
        $profile = Profile::first();

        if (!$profile) {
            return response()->json([
                'status' => 'error',
                'message' => 'Profile not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $profile,
        ]);
    }

    public function update(Request $request)
    {
        $profile = Profile::first();

        if (!$profile) {
            $profile = new Profile();
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:100',
            'headline' => 'nullable|string|max:255',
            'bio' => 'nullable|string',
            'philosophy' => 'nullable|string',
            'education_title' => 'nullable|string|max:150',
            'education_degree' => 'nullable|string|max:150',
            'education_gpa' => 'nullable|string|max:50',
            'avatar_url' => 'nullable|string|max:500',
            'resume_url' => 'nullable|string|max:500',
            'github_url' => 'nullable|string|max:255',
            'linkedin_url' => 'nullable|string|max:255',
            'twitter_url' => 'nullable|string|max:255',
            'email' => 'nullable|string|max:150',
            'phone' => 'nullable|string|max:50',
            'location' => 'nullable|string|max:100',
            'available_for_work' => 'nullable|boolean',
            'years_experience' => 'nullable|integer',
            'completed_projects' => 'nullable|integer',
            'satisfied_clients' => 'nullable|integer',
        ]);

        $profile->fill($validated);
        $profile->save();

        return response()->json([
            'status' => 'success',
            'message' => 'Profile updated successfully',
            'data' => $profile,
        ]);
    }
}
