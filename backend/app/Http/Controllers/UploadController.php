<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'file' => 'required|file|mimes:jpeg,png,jpg,gif,svg,webp,pdf,txt|max:10240',
        ]);

        $file = $request->file('file');
        $size = $file->getSize();
        
        // Generate unique microsecond timestamp filename matching Go's convention
        $timestamp = (int)(microtime(true) * 1000000000);
        $extension = $file->getClientOriginalExtension();
        $filename = "{$timestamp}.{$extension}";

        $uploadDir = public_path('uploads');
        if (!file_exists($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $file->move($uploadDir, $filename);

        $baseUrl = config('app.url', 'http://localhost:8080');
        $url = rtrim($baseUrl, '/') . "/uploads/{$filename}";

        return response()->json([
            'status' => 'success',
            'message' => 'File uploaded successfully',
            'url' => $url,
            'filename' => $filename,
            'data' => [
                'url' => $url,
                'filename' => $filename,
                'size' => $size,
            ],
        ], 200);
    }
}
