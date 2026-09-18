<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'identifier' => 'nullable|string',
            'username' => 'nullable|string',
            'email' => 'nullable|string',
            'password' => 'required|string',
        ]);

        $username = $request->input('identifier')
            ?? $request->input('username')
            ?? $request->input('email');

        $user = User::where('username', $username)
            ->orWhere('email', $username)
            ->first();

        if (!$user || !Hash::check($request->password, $user->password)) {
            return response()->json([
                'status' => 'error',
                'error' => 'Invalid username or password',
                'message' => 'Invalid username or password',
            ], 401);
        }

        // Generate token
        $token = $user->createToken('admin-token')->plainTextToken;

        $userData = [
            'id' => $user->id,
            'username' => $user->username ?? 'admin',
            'name' => $user->name,
            'email' => $user->email,
        ];

        return response()->json([
            'status' => 'success',
            'token' => $token,
            'user' => $userData,
            'data' => [
                'token' => $token,
                'user' => $userData,
            ],
        ]);
    }

    public function me(Request $request)
    {
        $user = $request->user();
        return response()->json([
            'status' => 'success',
            'data' => [
                'id' => $user->id,
                'username' => $user->username ?? 'admin',
                'name' => $user->name,
                'email' => $user->email,
            ],
        ]);
    }
}
