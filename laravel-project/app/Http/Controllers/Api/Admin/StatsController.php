<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\BusinessCard;
use App\Models\Lead;
use App\Models\Appointment;
use App\Models\SavedCard;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;

class StatsController extends Controller
{
    /**
     * Get comprehensive dashboard statistics.
     */
    public function index(Request $request)
    {
        // Date range filtering
        $startDate = $request->get('start_date', now()->subDays(30)->toDateString());
        $endDate = $request->get('end_date', now()->toDateString());

        $stats = [
            // User Statistics
            'users' => [
                'total' => User::count(),
                'new_this_period' => User::whereBetween('created_at', [$startDate, $endDate])->count(),
                'active' => User::where('updated_at', '>=', now()->subDays(30))->count(),
                'by_role' => User::select('role', DB::raw('count(*) as count'))
                               ->groupBy('role')
                               ->get()
                               ->pluck('count', 'role'),
                'by_subscription' => User::select('subscription_plan', DB::raw('count(*) as count'))
                                       ->groupBy('subscription_plan')
                                       ->get()
                                       ->pluck('count', 'subscription_plan'),
            ],

            // Business Card Statistics
            'business_cards' => [
                'total' => BusinessCard::count(),
                'new_this_period' => BusinessCard::whereBetween('created_at', [$startDate, $endDate])->count(),
                'public' => BusinessCard::where('is_public', true)->count(),
                'total_views' => BusinessCard::sum('view_count'),
                'by_template' => BusinessCard::select('template', DB::raw('count(*) as count'))
                                         ->groupBy('template')
                                         ->get()
                                         ->pluck('count', 'template'),
            ],

            // Lead Statistics
            'leads' => [
                'total' => Lead::count(),
                'new_this_period' => Lead::whereBetween('created_at', [$startDate, $endDate])->count(),
                'by_status' => Lead::select('status', DB::raw('count(*) as count'))
                                ->groupBy('status')
                                ->get()
                                ->pluck('count', 'status'),
                'by_priority' => Lead::select('priority', DB::raw('count(*) as count'))
                                 ->groupBy('priority')
                                 ->get()
                                 ->pluck('count', 'priority'),
                'by_source' => Lead::select('source', DB::raw('count(*) as count'))
                               ->groupBy('source')
                               ->get()
                               ->pluck('count', 'source'),
                'conversion_rate' => $this->calculateConversionRate(),
                'avg_score' => Lead::avg('score'),
            ],

            // Appointment Statistics
            'appointments' => [
                'total' => Appointment::count(),
                'new_this_period' => Appointment::whereBetween('created_at', [$startDate, $endDate])->count(),
                'by_status' => Appointment::select('status', DB::raw('count(*) as count'))
                                        ->groupBy('status')
                                        ->get()
                                        ->pluck('count', 'status'),
                'upcoming' => Appointment::where('appointment_date', '>=', now())
                                         ->where('status', '!=', 'cancelled')
                                         ->count(),
                'completed_this_period' => Appointment::whereBetween('appointment_date', [$startDate, $endDate])
                                                   ->where('status', 'completed')
                                                   ->count(),
            ],

            // Saved Cards Statistics
            'saved_cards' => [
                'total' => SavedCard::count(),
                'new_this_period' => SavedCard::whereBetween('created_at', [$startDate, $endDate])->count(),
                'unique_users' => SavedCard::distinct('user_id')->count(),
            ],

            // Growth Trends
            'growth' => [
                'user_growth' => $this->getGrowthData(User::class, $startDate, $endDate),
                'card_growth' => $this->getGrowthData(BusinessCard::class, $startDate, $endDate),
                'lead_growth' => $this->getGrowthData(Lead::class, $startDate, $endDate),
                'appointment_growth' => $this->getGrowthData(Appointment::class, $startDate, $endDate),
            ],

            // Top Performers
            'top_performers' => [
                'most_cards' => User::withCount('businessCards')
                                   ->orderBy('business_cards_count', 'desc')
                                   ->take(5)
                                   ->get(),
                'most_leads' => User::withCount('leads')
                                   ->orderBy('leads_count', 'desc')
                                   ->take(5)
                                   ->get(),
                'most_appointments' => User::withCount('appointments')
                                         ->orderBy('appointments_count', 'desc')
                                         ->take(5)
                                         ->get(),
            ],

            // System Health
            'system_health' => [
                'database_size' => $this->getDatabaseSize(),
                'storage_usage' => $this->getStorageUsage(),
                'error_rate' => $this->getErrorRate($startDate, $endDate),
                'response_time' => $this->getAverageResponseTime(),
            ],
        ];

        return response()->json($stats);
    }

    /**
     * Calculate lead conversion rate.
     */
    private function calculateConversionRate()
    {
        $totalLeads = Lead::count();
        $convertedLeads = Lead::where('status', 'converted')->count();
        
        return $totalLeads > 0 ? round(($convertedLeads / $totalLeads) * 100, 2) : 0;
    }

    /**
     * Get growth data for a model.
     */
    private function getGrowthData($model, $startDate, $endDate)
    {
        return $model::select(DB::raw('DATE(created_at) as date'), DB::raw('count(*) as count'))
                     ->whereBetween('created_at', [$startDate, $endDate])
                     ->groupBy('date')
                     ->orderBy('date')
                     ->get()
                     ->pluck('count', 'date');
    }

    /**
     * Get database size (simplified).
     */
    private function getDatabaseSize()
    {
        // This is a simplified version. In a real application, you might want to
        // query the database for actual size information
        return 'Approximate size calculated';
    }

    /**
     * Get storage usage (simplified).
     */
    private function getStorageUsage()
    {
        // This is a simplified version. In a real application, you might want to
        // check actual file storage usage
        return [
            'total' => '100 GB',
            'used' => '45 GB',
            'available' => '55 GB',
            'percentage' => 45,
        ];
    }

    /**
     * Get error rate (simplified).
     */
    private function getErrorRate($startDate, $endDate)
    {
        // This is a simplified version. In a real application, you might want to
        // check actual error logs
        return 0.5; // 0.5% error rate
    }

    /**
     * Get average response time (simplified).
     */
    private function getAverageResponseTime()
    {
        // This is a simplified version. In a real application, you might want to
        // check actual response times from monitoring
        return 150; // 150ms average response time
    }

    /**
     * Get real-time statistics.
     */
    public function realtime()
    {
        return response()->json([
            'active_users' => User::where('updated_at', '>=', now()->subMinutes(5))->count(),
            'pending_appointments' => Appointment::where('status', 'pending')->count(),
            'new_leads_today' => Lead::whereDate('created_at', today())->count(),
            'system_load' => $this->getSystemLoad(),
        ]);
    }

    /**
     * Get system load (simplified).
     */
    private function getSystemLoad()
    {
        // This is a simplified version. In a real application, you might want to
        // check actual system metrics
        return [
            'cpu' => 45,
            'memory' => 67,
            'disk' => 34,
        ];
    }
}