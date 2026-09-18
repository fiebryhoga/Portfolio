<?php

namespace App\Http\Controllers;

use App\Models\Skill;
use Illuminate\Http\Request;

class SkillController extends Controller
{
    public function index()
    {
        $skills = Skill::orderBy('order_index', 'asc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $skills,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'category' => 'required|string|max:100',
            'proficiency' => 'nullable|integer|min:1|max:100',
            'icon_name' => 'nullable|string|max:100',
            'order_index' => 'nullable|integer',
        ]);

        $skill = Skill::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Skill created successfully',
            'data' => $skill,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $skill = Skill::find($id);

        if (!$skill) {
            return response()->json([
                'status' => 'error',
                'message' => 'Skill not found',
            ], 404);
        }

        $validated = $request->validate([
            'name' => 'nullable|string|max:100',
            'category' => 'nullable|string|max:100',
            'proficiency' => 'nullable|integer|min:1|max:100',
            'icon_name' => 'nullable|string|max:100',
            'order_index' => 'nullable|integer',
        ]);

        $skill->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Skill updated successfully',
            'data' => $skill,
        ]);
    }

    public function destroy($id)
    {
        $skill = Skill::find($id);

        if (!$skill) {
            return response()->json([
                'status' => 'error',
                'message' => 'Skill not found',
            ], 404);
        }

        $skill->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Skill deleted successfully',
        ]);
    }
}
