<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\Account;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Laravel\Socialite\Facades\Socialite;
use Exception;

class OAuthController extends Controller
{
    /**
     * Redirect to Google OAuth provider.
     */
    public function redirectToGoogle()
    {
        return Socialite::driver('google')->stateless()->redirect();
    }

    /**
     * Handle Google OAuth callback.
     */
    public function handleGoogleCallback()
    {
        try {
            $googleUser = Socialite::driver('google')->stateless()->user();
            
            $user = User::where('email', $googleUser->email)->first();
            
            if (!$user) {
                $user = User::create([
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'avatar' => $googleUser->avatar,
                ]);
            }
            
            // Create or update account
            Account::updateOrCreate(
                [
                    'provider' => 'google',
                    'provider_account_id' => $googleUser->id,
                ],
                [
                    'user_id' => $user->id,
                    'type' => 'oauth',
                    'name' => $googleUser->name,
                    'email' => $googleUser->email,
                    'avatar' => $googleUser->avatar,
                    'access_token' => $googleUser->token,
                    'refresh_token' => $googleUser->refreshToken,
                    'expires_at' => $googleUser->expiresIn ? now()->addSeconds($googleUser->expiresIn) : null,
                ]
            );
            
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
            
        } catch (Exception $e) {
            return response()->json(['message' => 'Google authentication failed'], 401);
        }
    }

    /**
     * Redirect to Facebook OAuth provider.
     */
    public function redirectToFacebook()
    {
        return Socialite::driver('facebook')->stateless()->redirect();
    }

    /**
     * Handle Facebook OAuth callback.
     */
    public function handleFacebookCallback()
    {
        try {
            $facebookUser = Socialite::driver('facebook')->stateless()->user();
            
            $user = User::where('email', $facebookUser->email)->first();
            
            if (!$user) {
                $user = User::create([
                    'name' => $facebookUser->name,
                    'email' => $facebookUser->email,
                    'avatar' => $facebookUser->avatar,
                ]);
            }
            
            // Create or update account
            Account::updateOrCreate(
                [
                    'provider' => 'facebook',
                    'provider_account_id' => $facebookUser->id,
                ],
                [
                    'user_id' => $user->id,
                    'type' => 'oauth',
                    'name' => $facebookUser->name,
                    'email' => $facebookUser->email,
                    'avatar' => $facebookUser->avatar,
                    'access_token' => $facebookUser->token,
                    'refresh_token' => $facebookUser->refreshToken,
                    'expires_at' => $facebookUser->expiresIn ? now()->addSeconds($facebookUser->expiresIn) : null,
                ]
            );
            
            $token = $user->createToken('auth_token')->plainTextToken;
            
            return response()->json([
                'user' => $user,
                'token' => $token,
                'token_type' => 'Bearer',
            ]);
            
        } catch (Exception $e) {
            return response()->json(['message' => 'Facebook authentication failed'], 401);
        }
    }
}