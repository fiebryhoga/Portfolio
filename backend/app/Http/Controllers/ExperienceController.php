<?php

namespace App\Http\Controllers;

use App\Models\Experience;
use Illuminate\Http\Request;

class ExperienceController extends Controller
{
    public function index()
    {
        $experiences = Experience::orderBy('order_index', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $experiences,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'role' => 'required|string|max:150',
            'company' => 'required|string|max:150',
            'company_url' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:100',
            'start_date' => 'required|string|max:50',
            'end_date' => 'nullable|string|max:50',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'bullet_points' => 'nullable|string',
            'order_index' => 'nullable|integer',
        ]);

        $experience = Experience::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Experience created successfully',
            'data' => $experience,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return response()->json([
                'status' => 'error',
                'message' => 'Experience not found',
            ], 404);
        }

        $validated = $request->validate([
            'role' => 'nullable|string|max:150',
            'company' => 'nullable|string|max:150',
            'company_url' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:100',
            'start_date' => 'nullable|string|max:50',
            'end_date' => 'nullable|string|max:50',
            'is_current' => 'nullable|boolean',
            'description' => 'nullable|string',
            'bullet_points' => 'nullable|string',
            'order_index' => 'nullable|integer',
        ]);

        $experience->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Experience updated successfully',
            'data' => $experience,
        ]);
    }

    public function destroy($id)
    {
        $experience = Experience::find($id);

        if (!$experience) {
            return response()->json([
                'status' => 'error',
                'message' => 'Experience not found',
            ], 404);
        }

        $experience->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Experience deleted successfully',
        ]);
    }
}
