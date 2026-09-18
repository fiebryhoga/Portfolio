<?php

namespace App\Http\Controllers;

use App\Models\Article;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Carbon\Carbon;

class ArticleController extends Controller
{
    public function index()
    {
        $articles = Article::where('is_published', true)
            ->orderBy('order_index', 'asc')
            ->orderBy('published_at', 'desc')
            ->get();

        return response()->json([
            'status' => 'success',
            'data' => $articles,
        ]);
    }

    public function show($slug)
    {
        $article = Article::where('slug', $slug)->first();

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Article not found',
            ], 404);
        }

        return response()->json([
            'status' => 'success',
            'data' => $article,
        ]);
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'slug' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'required|string',
            'category' => 'nullable|string|max:100',
            'reading_time' => 'nullable|string|max:50',
            'published_at' => 'nullable|date',
            'is_published' => 'nullable|boolean',
            'order_index' => 'nullable|integer',
        ]);

        if (empty($validated['slug'])) {
            $validated['slug'] = Str::slug($validated['title']);
        }

        if (empty($validated['published_at'])) {
            $validated['published_at'] = Carbon::now();
        }

        $article = Article::create($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Article created successfully',
            'data' => $article,
        ], 201);
    }

    public function update(Request $request, $id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Article not found',
            ], 404);
        }

        $validated = $request->validate([
            'title' => 'nullable|string|max:255',
            'slug' => 'nullable|string|max:255',
            'excerpt' => 'nullable|string|max:500',
            'content' => 'nullable|string',
            'category' => 'nullable|string|max:100',
            'reading_time' => 'nullable|string|max:50',
            'published_at' => 'nullable|date',
            'is_published' => 'nullable|boolean',
            'order_index' => 'nullable|integer',
        ]);

        $article->update($validated);

        return response()->json([
            'status' => 'success',
            'message' => 'Article updated successfully',
            'data' => $article,
        ]);
    }

    public function destroy($id)
    {
        $article = Article::find($id);

        if (!$article) {
            return response()->json([
                'status' => 'error',
                'message' => 'Article not found',
            ], 404);
        }

        $article->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Article deleted successfully',
        ]);
    }
}
