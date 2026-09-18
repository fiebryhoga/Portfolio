<?php

namespace App\Http\Controllers;

use App\Models\Project;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class ProjectController extends Controller
{
    public function index()
    {
        $projects = Project::orderBy('order_index', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $projects,
        ]);
    }

    public function show($slug)
    {
        $project = Project::where('slug', $slug)->first();

        if (!$project) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $project,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:200',
            'slug' => 'nullable|string|max:200',
            'short_description' => 'nullable|string|max:500',
            'full_description' => 'nullable|string',
            'image_url' => 'nullable|string|max:500',
            'demo_url' => 'nullable|string|max:500',
            'github_url' => 'nullable|string|max:500',
            'tech_stack' => 'nullable|string|max:500',
            'featured' => 'nullable|boolean',
            'order_index' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        $project = Project::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Project created successfully',
            'data' => $project,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:200',
            'slug' => 'nullable|string|max:200',
            'short_description' => 'nullable|string|max:500',
            'full_description' => 'nullable|string',
            'image_url' => 'nullable|string|max:500',
            'demo_url' => 'nullable|string|max:500',
            'github_url' => 'nullable|string|max:500',
            'tech_stack' => 'nullable|string|max:500',
            'featured' => 'nullable|boolean',
            'order_index' => 'nullable|integer',
        ]);

        $project->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Project updated successfully',
            'data' => $project,
        ]);
    }

    public function destroy($id)
    {
        $project = Project::find($id);

        if (!$project) {
            return response()->json([
                'status' => 'error',
                'message' => 'Project not found',
            ], 404);
        }

        $project->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Project deleted successfully',
        ]);
    }
}
