<?php

use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\ProjectController;
use App\Http\Controllers\SkillController;
use App\Http\Controllers\ExperienceController;
use App\Http\Controllers\ArticleController;
use App\Http\Controllers\ContactController;
use App\Http\Controllers\UploadController;
use Illuminate\Support\Facades\Route;

// Health check
Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'framework' => 'Laravel 12 (PHP 8.4)',
        'timestamp' => now()->toIso8601String(),
    ]);
});

Route::prefix('v1')->group(function () {
    // Public Endpoints
    Route::get('/health', function () {
        return response()->json([
            'status' => 'healthy',
            'framework' => 'Laravel 12 (PHP 8.4)',
            'timestamp' => now()->toIso8601String(),
        ]);
    });

    Route::get('/profile', [ProfileController::class, 'show']);
    Route::get('/projects', [ProjectController::class, 'index']);
    Route::get('/projects/{slug}', [ProjectController::class, 'show']);
    Route::get('/skills', [SkillController::class, 'index']);
    Route::get('/experiences', [ExperienceController::class, 'index']);
    Route::get('/articles', [ArticleController::class, 'index']);
    Route::get('/articles/{slug}', [ArticleController::class, 'show']);
    Route::post('/articles', [ArticleController::class, 'store']);
    Route::delete('/articles/{id}', [ArticleController::class, 'destroy']);
    Route::post('/contact', [ContactController::class, 'submit']);

    // Authentication
    Route::post('/auth/login', [AuthController::class, 'login']);

    // Protected Admin Routes (Sanctum)
    Route::middleware('auth:sanctum')->group(function () {
        Route::get('/auth/me', [AuthController::class, 'me']);

        // Admin Profile
        Route::put('/admin/profile', [ProfileController::class, 'update']);

        // Admin Projects
        Route::post('/admin/projects', [ProjectController::class, 'store']);
        Route::put('/admin/projects/{id}', [ProjectController::class, 'update']);
        Route::delete('/admin/projects/{id}', [ProjectController::class, 'destroy']);

        // Admin Skills
        Route::post('/admin/skills', [SkillController::class, 'store']);
        Route::put('/admin/skills/{id}', [SkillController::class, 'update']);
        Route::delete('/admin/skills/{id}', [SkillController::class, 'destroy']);

        // Admin Experiences
        Route::post('/admin/experiences', [ExperienceController::class, 'store']);
        Route::put('/admin/experiences/{id}', [ExperienceController::class, 'update']);
        Route::delete('/admin/experiences/{id}', [ExperienceController::class, 'destroy']);

        // Admin Articles
        Route::post('/admin/articles', [ArticleController::class, 'store']);
        Route::put('/admin/articles/{id}', [ArticleController::class, 'update']);
        Route::delete('/admin/articles/{id}', [ArticleController::class, 'destroy']);

        // Admin Contact Messages
        Route::get('/admin/messages', [ContactController::class, 'index']);
        Route::patch('/admin/messages/{id}/read', [ContactController::class, 'markRead']);
        Route::delete('/admin/messages/{id}', [ContactController::class, 'destroy']);

        // Admin File Upload
        Route::post('/admin/upload', [UploadController::class, 'upload']);
    });
});
