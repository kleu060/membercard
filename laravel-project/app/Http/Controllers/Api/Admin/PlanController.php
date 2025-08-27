<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Cache;

class PlanController extends Controller
{
    /**
     * Display a listing of subscription plans.
     */
    public function index()
    {
        $plans = [
            [
                'id' => 'free',
                'name' => 'Free Plan',
                'description' => 'Perfect for individuals getting started',
                'price' => 0,
                'currency' => 'USD',
                'interval' => 'month',
                'features' => [
                    '1 Business Card',
                    'Basic Templates',
                    'Email Support',
                    'Mobile App Access',
                ],
                'limits' => [
                    'max_cards' => 1,
                    'max_leads' => 10,
                    'max_appointments' => 5,
                    'storage' => 100, // MB
                ],
                'is_popular' => false,
                'is_active' => true,
            ],
            [
                'id' => 'professional',
                'name' => 'Professional Plan',
                'description' => 'For professionals and small businesses',
                'price' => 29,
                'currency' => 'USD',
                'interval' => 'month',
                'features' => [
                    '10 Business Cards',
                    'Premium Templates',
                    'Appointment Booking',
                    'CRM & Lead Management',
                    'Priority Support',
                    'API Access',
                    'Custom Domain',
                ],
                'limits' => [
                    'max_cards' => 10,
                    'max_leads' => 500,
                    'max_appointments' => 100,
                    'storage' => 1000, // MB
                ],
                'is_popular' => true,
                'is_active' => true,
            ],
            [
                'id' => 'enterprise',
                'name' => 'Enterprise Plan',
                'description' => 'For large teams and organizations',
                'price' => 99,
                'currency' => 'USD',
                'interval' => 'month',
                'features' => [
                    'Unlimited Business Cards',
                    'All Premium Templates',
                    'Advanced Appointment System',
                    'Full CRM Suite',
                    'Email Automation',
                    'Team Collaboration',
                    'Advanced Analytics',
                    'White-label Solution',
                    'Dedicated Support',
                    'Custom Integrations',
                ],
                'limits' => [
                    'max_cards' => -1, // Unlimited
                    'max_leads' => -1, // Unlimited
                    'max_appointments' => -1, // Unlimited
                    'storage' => -1, // Unlimited
                ],
                'is_popular' => false,
                'is_active' => true,
            ],
        ];

        return response()->json($plans);
    }

    /**
     * Update the specified plan.
     */
    public function update(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'name' => 'required|string|max:255',
            'description' => 'required|string|max:500',
            'price' => 'required|numeric|min:0',
            'currency' => 'required|string|size:3',
            'interval' => 'required|string|in:month,year',
            'features' => 'required|array',
            'features.*' => 'required|string',
            'limits' => 'required|array',
            'limits.max_cards' => 'required|integer|min:-1',
            'limits.max_leads' => 'required|integer|min:-1',
            'limits.max_appointments' => 'required|integer|min:-1',
            'limits.storage' => 'required|integer|min:-1',
            'is_popular' => 'boolean',
            'is_active' => 'boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // In a real application, you would update the plan in the database
        Cache::forget("plan_{$id}");
        Cache::put("plan_{$id}", $request->all(), now()->addDays(30));

        return response()->json(['message' => 'Plan updated successfully']);
    }

    /**
     * Update plan status.
     */
    public function updateStatus(Request $request, $id)
    {
        $validator = Validator::make($request->all(), [
            'is_active' => 'required|boolean',
        ]);

        if ($validator->fails()) {
            return response()->json(['errors' => $validator->errors()], 422);
        }

        // In a real application, you would update the plan status in the database
        Cache::forget("plan_{$id}_status");
        Cache::put("plan_{$id}_status", $request->is_active, now()->addDays(30));

        return response()->json(['message' => 'Plan status updated successfully']);
    }

    /**
     * Get plan usage statistics.
     */
    public function getUsageStats()
    {
        $stats = [
            'total_users' => User::count(),
            'by_plan' => User::select('subscription_plan', \DB::raw('count(*) as count'))
                           ->groupBy('subscription_plan')
                           ->get()
                           ->pluck('count', 'subscription_plan'),
            'revenue' => [
                'monthly' => $this->calculateMonthlyRevenue(),
                'yearly' => $this->calculateYearlyRevenue(),
                'by_plan' => $this->getRevenueByPlan(),
            ],
            'churn_rate' => $this->calculateChurnRate(),
            'conversion_rate' => $this->calculateConversionRate(),
        ];

        return response()->json($stats);
    }

    /**
     * Calculate monthly revenue.
     */
    private function calculateMonthlyRevenue()
    {
        $plans = $this->index()->getData(true);
        $usersByPlan = User::select('subscription_plan', \DB::raw('count(*) as count'))
                           ->groupBy('subscription_plan')
                           ->get()
                           ->pluck('count', 'subscription_plan');

        $totalRevenue = 0;
        foreach ($plans as $plan) {
            $userCount = $usersByPlan[$plan['id']] ?? 0;
            $totalRevenue += $plan['price'] * $userCount;
        }

        return $totalRevenue;
    }

    /**
     * Calculate yearly revenue.
     */
    private function calculateYearlyRevenue()
    {
        return $this->calculateMonthlyRevenue() * 12;
    }

    /**
     * Get revenue by plan.
     */
    private function getRevenueByPlan()
    {
        $plans = $this->index()->getData(true);
        $usersByPlan = User::select('subscription_plan', \DB::raw('count(*) as count'))
                           ->groupBy('subscription_plan')
                           ->get()
                           ->pluck('count', 'subscription_plan');

        $revenueByPlan = [];
        foreach ($plans as $plan) {
            $userCount = $usersByPlan[$plan['id']] ?? 0;
            $revenueByPlan[$plan['id']] = [
                'users' => $userCount,
                'monthly_revenue' => $plan['price'] * $userCount,
                'yearly_revenue' => $plan['price'] * $userCount * 12,
            ];
        }

        return $revenueByPlan;
    }

    /**
     * Calculate churn rate (simplified).
     */
    private function calculateChurnRate()
    {
        // This is a simplified version. In a real application, you would track
        // subscription cancellations and downgrades over time
        return 2.5; // 2.5% monthly churn rate
    }

    /**
     * Calculate conversion rate from free to paid.
     */
    private function calculateConversionRate()
    {
        $freeUsers = User::where('subscription_plan', 'free')->count();
        $paidUsers = User::whereIn('subscription_plan', ['professional', 'enterprise'])->count();
        $totalUsers = $freeUsers + $paidUsers;

        return $totalUsers > 0 ? round(($paidUsers / $totalUsers) * 100, 2) : 0;
    }

    /**
     * Get plan upgrade suggestions.
     */
    public function getUpgradeSuggestions()
    {
        $freeUsers = User::where('subscription_plan', 'free')->get();
        $suggestions = [];

        foreach ($freeUsers as $user) {
            $cardCount = $user->businessCards()->count();
            $leadCount = $user->leads()->count();
            $appointmentCount = $user->appointments()->count();

            if ($cardCount >= 1 || $leadCount >= 5 || $appointmentCount >= 3) {
                $suggestions[] = [
                    'user_id' => $user->id,
                    'user_email' => $user->email,
                    'current_plan' => 'free',
                    'recommended_plan' => 'professional',
                    'reason' => 'Approaching free plan limits',
                    'usage' => [
                        'cards' => $cardCount,
                        'leads' => $leadCount,
                        'appointments' => $appointmentCount,
                    ],
                ];
            }
        }

        return response()->json($suggestions);
    }
}