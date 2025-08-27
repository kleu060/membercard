<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class FeatureController extends Controller
{
    /**
     * Display a listing of features.
     */
    public function index()
    {
        // In a real application, you might store features in a database table
        // For now, we'll use a configuration-based approach
        $features = [
            [
                'id' => 'business_cards',
                'name' => 'Business Cards',
                'description' => 'Create and manage digital business cards',
                'is_enabled' => true,
                'plans' => ['free', 'professional', 'enterprise'],
            ],
            [
                'id' => 'appointments',
                'name' => 'Appointment Booking',
                'description' => 'Schedule and manage appointments',
                'is_enabled' => true,
                'plans' => ['professional', 'enterprise'],
            ],
            [
                'id' => 'job_profile',
                'name' => 'Job Profile',
                'description' => 'Create and manage professional profiles',
                'is_enabled' => true,
                'plans' => ['free', 'professional', 'enterprise'],
            ],
            [
                'id' => 'crm',
                'name' => 'CRM & Lead Management',
                'description' => 'Manage leads and customer relationships',
                'is_enabled' => true,
                'plans' => ['professional', 'enterprise'],
            ],
            [
                'id' => 'email_automation',
                'name' => 'Email Automation',
                'description' => 'Automated email campaigns and sequences',
                'is_enabled' => false,
                'plans' => ['enterprise'],
            ],
            [
                'id' => 'team_collaboration',
                'name' => 'Team Collaboration',
                'description' => 'Collaborate with team members on leads',
                'is_enabled' => false,
                'plans' => ['enterprise'],
            ],
            [
                'id' => 'advanced_analytics',
                'name' => 'Advanced Analytics',
                'description' => 'Detailed analytics and reporting',
                'is_enabled' => false,
                'plans' => ['enterprise'],
            ],
            [
                'id' => 'api_access',
                'name' => 'API Access',
                'description' => 'Full API access for integrations',
                'is_enabled' => true,
                'plans' => ['professional', 'enterprise'],
            ],
        ];

        return response()->json($features);
    }

    /**
     * Update the specified feature.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'is_enabled' => 'required|boolean',
            'plans' => 'required|array',
            'plans.*' => 'required|string|in:free,professional,enterprise',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // In a real application, you would update the feature in the database
        // For now, we'll just return a success response
        Cache::forget("feature_{$id}");
        Cache::put("feature_{$id}", [
            'is_enabled' => $request->is_enabled,
            'plans' => $request->plans,
        ], now()->addDays(30));

        return response()->json(['message' => 'Feature updated successfully']);
    }

    /**
     * Get feature status for a specific plan.
     */
    public function getPlanFeatures($plan)
    {
        $features = $this->index()->getData(true);
        $planFeatures = [];

        foreach ($features as $feature) {
            if (in_array($plan, $feature['plans'])) {
                $planFeatures[] = [
                    'id' => $feature['id'],
                    'name' => $feature['name'],
                    'description' => $feature['description'],
                    'is_enabled' => $feature['is_enabled'],
                ];
            }
        }

        return response()->json($planFeatures);
    }

    /**
     * Check if a feature is enabled for a user.
     */
    public function checkFeatureAccess(Request $request, $featureId)
    {
        $user = $request->user();
        $feature = Cache::get("feature_{$featureId}");

        if (!$feature) {
            // If not in cache, get from the default features list
            $features = $this->index()->getData(true);
            $featureData = collect($features)->firstWhere('id', $featureId);
            
            if (!$featureData) {
                return response()->json(['message' => 'Feature not found'], 404);
            }

            $feature = [
                'is_enabled' => $featureData['is_enabled'],
                'plans' => $featureData['plans'],
            ];
        }

        $hasAccess = $feature['is_enabled'] && in_array($user->subscription_plan, $feature['plans']);

        return response()->json([
            'feature_id' => $featureId,
            'has_access' => $hasAccess,
            'user_plan' => $user->subscription_plan,
            'feature_enabled' => $feature['is_enabled'],
            'available_plans' => $feature['plans'],
        ]);
    }

    /**
     * Get global feature settings.
     */
    public function getGlobalSettings()
    {
        $settings = [
            'registration_enabled' => true,
            'social_login_enabled' => true,
            'email_verification_required' => false,
            'max_cards_per_user' => 10,
            'max_leads_per_user' => 100,
            'max_appointments_per_user' => 50,
            'file_upload_limit' => 10, // MB
            'supported_file_types' => ['jpg', 'jpeg', 'png', 'gif', 'pdf'],
            'api_rate_limit' => 60, // requests per minute
            'session_timeout' => 120, // minutes
        ];

        return response()->json($settings);
    }

    /**
     * Update global feature settings.
     */
    public function updateGlobalSettings(Request $request)
    {
        $validator = Validator::make($request->all(), [
            'registration_enabled' => 'boolean',
            'social_login_enabled' => 'boolean',
            'email_verification_required' => 'boolean',
            'max_cards_per_user' => 'integer|min:1|max:100',
            'max_leads_per_user' => 'integer|min:1|max:1000',
            'max_appointments_per_user' => 'integer|min:1|max:500',
            'file_upload_limit' => 'integer|min:1|max:100',
            'supported_file_types' => 'array',
            'supported_file_types.*' => 'string',
            'api_rate_limit' => 'integer|min:1|max:1000',
            'session_timeout' => 'integer|min:5|max:1440',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // In a real application, you would save these settings to a database or config file
        Cache::put('global_settings', $request->all(), now()->addDays(30));

        return response()->json(['message' => 'Global settings updated successfully']);
    }
}