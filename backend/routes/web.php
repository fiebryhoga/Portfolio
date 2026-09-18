<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'healthy',
        'framework' => 'Laravel 12 (PHP 8.4)',
        'message' => 'Dimas Portfolio REST API',
    ]);
});

Route::get('/health', function () {
    return response()->json([
        'status' => 'healthy',
        'framework' => 'Laravel 12 (PHP 8.4)',
        'timestamp' => now()->toIso8601String(),
    ]);
});

