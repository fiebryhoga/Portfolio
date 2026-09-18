<?php

namespace App\Http\Controllers;

use App\Models\ContactMessage;
use Illuminate\Http\Request;

class ContactController extends Controller
{
    public function submit(Request $request)
    {
        $validated = $request->validate([
            'name' => 'required|string|max:100',
            'email' => 'required|email|max:150',
            'subject' => 'nullable|string|max:200',
            'message' => 'required|string',
        ]);

        $message = ContactMessage::create([
            'name' => $validated['name'],
            'email' => $validated['email'],
            'subject' => $validated['subject'] ?? 'Portfolio Inquiry',
            'message' => $validated['message'],
            'is_read' => false,
        ]);

        return response()->json([
            'status' => 'success',
            'message' => 'Your message has been sent successfully!',
            'data' => $message,
        ], 201);
    }

    public function index()
    {
        $messages = ContactMessage::orderBy('created_at', 'desc')->get();

        return response()->json([
            'status' => 'success',
            'data' => $messages,
        ]);
    }

    public function markRead($id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'status' => 'error',
                'message' => 'Message not found',
            ], 404);
        }

        $message->update(['is_read' => true]);

        return response()->json([
            'status' => 'success',
            'message' => 'Message marked as read',
            'data' => $message,
        ]);
    }

    public function destroy($id)
    {
        $message = ContactMessage::find($id);

        if (!$message) {
            return response()->json([
                'status' => 'error',
                'message' => 'Message not found',
            ], 404);
        }

        $message->delete();

        return response()->json([
            'status' => 'success',
            'message' => 'Message deleted successfully',
        ]);
    }
}
