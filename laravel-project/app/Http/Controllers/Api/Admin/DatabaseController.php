<?php

namespace App\Http\Controllers\Api\Admin;

use App\Http\Controllers\Controller;
use App\Models\User;
use App\Models\BusinessCard;
use App\Models\Lead;
use App\Models\Appointment;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

class DatabaseController extends Controller
{
    /**
     * Get database table information.
     */
    public function getTables()
    {
        $tables = [];
        $tableNames = DB::select("SELECT name FROM sqlite_master WHERE type='table'");

        foreach ($tableNames as $table) {
            $tableName = $table->name;
            $columns = Schema::getColumnListing($tableName);
            
            $tableInfo = [
                'name' => $tableName,
                'columns' => [],
                'record_count' => DB::table($tableName)->count(),
                'size' => $this->getTableSize($tableName),
                'last_updated' => $this->getTableLastUpdated($tableName),
            ];

            foreach ($columns as $column) {
                $columnType = Schema::getColumnType($tableName, $column);
                $tableInfo['columns'][] = [
                    'name' => $column,
                    'type' => $columnType,
                    'nullable' => !Schema::getConnection()->getDoctrineColumn($tableName, $column)->getNotnull(),
                ];
            }

            $tables[] = $tableInfo;
        }

        return response()->json($tables);
    }

    /**
     * Get database statistics.
     */
    public function getStats()
    {
        $stats = [
            'total_tables' => count(DB::select("SELECT name FROM sqlite_master WHERE type='table'")),
            'total_records' => $this->getTotalRecords(),
            'database_size' => $this->getDatabaseSize(),
            'largest_tables' => $this->getLargestTables(),
            'most_active_tables' => $this->getMostActiveTables(),
            'index_info' => $this->getIndexInfo(),
        ];

        return response()->json($stats);
    }

    /**
     * Get database activity.
     */
    public function getActivity(Request $request)
    {
        $days = $request->get('days', 7);
        $startDate = now()->subDays($days);

        $activity = [
            'user_activity' => $this->getUserActivity($startDate),
            'table_activity' => $this->getTableActivity($startDate),
            'peak_hours' => $this->getPeakHours($startDate),
            'growth_trends' => $this->getGrowthTrends($startDate),
        ];

        return response()->json($activity);
    }

    /**
     * Get database performance metrics.
     */
    public function getPerformance()
    {
        $performance = [
            'query_performance' => $this->getQueryPerformance(),
            'slow_queries' => $this->getSlowQueries(),
            'index_usage' => $this->getIndexUsage(),
            'connection_stats' => $this->getConnectionStats(),
            'cache_stats' => $this->getCacheStats(),
        ];

        return response()->json($performance);
    }

    /**
     * Get table size (simplified).
     */
    private function getTableSize($tableName)
    {
        // This is a simplified version. In a real application with MySQL/PostgreSQL,
        // you would query actual table sizes
        return 'Size calculated';
    }

    /**
     * Get table last updated time.
     */
    private function getTableLastUpdated($tableName)
    {
        try {
            $latestRecord = DB::table($tableName)->orderBy('updated_at', 'desc')->first();
            return $latestRecord ? $latestRecord->updated_at : null;
        } catch (\Exception $e) {
            return null;
        }
    }

    /**
     * Get total records count.
     */
    private function getTotalRecords()
    {
        $total = 0;
        $tableNames = DB::select("SELECT name FROM sqlite_master WHERE type='table'");
        
        foreach ($tableNames as $table) {
            $total += DB::table($table->name)->count();
        }
        
        return $total;
    }

    /**
     * Get database size (simplified).
     */
    private function getDatabaseSize()
    {
        // This is a simplified version. In a real application, you would query
        // the actual database file size or use database-specific commands
        return [
            'size_bytes' => 10485760, // 10MB example
            'size_mb' => 10,
            'size_gb' => 0.01,
        ];
    }

    /**
     * Get largest tables by record count.
     */
    private function getLargestTables()
    {
        $tables = [];
        $tableNames = DB::select("SELECT name FROM sqlite_master WHERE type='table'");
        
        foreach ($tableNames as $table) {
            $count = DB::table($table->name)->count();
            $tables[] = [
                'name' => $table->name,
                'record_count' => $count,
            ];
        }
        
        // Sort by record count and return top 10
        usort($tables, function ($a, $b) {
            return $b['record_count'] - $a['record_count'];
        });
        
        return array_slice($tables, 0, 10);
    }

    /**
     * Get most active tables (by recent updates).
     */
    private function getMostActiveTables()
    {
        $tables = [];
        $tableNames = DB::select("SELECT name FROM sqlite_master WHERE type='table'");
        
        foreach ($tableNames as $table) {
            try {
                $recentUpdates = DB::table($table->name)
                                   ->where('updated_at', '>=', now()->subDays(7))
                                   ->count();
                $tables[] = [
                    'name' => $table->name,
                    'recent_updates' => $recentUpdates,
                ];
            } catch (\Exception $e) {
                // Skip tables that don't have updated_at column
            }
        }
        
        // Sort by recent updates and return top 10
        usort($tables, function ($a, $b) {
            return $b['recent_updates'] - $a['recent_updates'];
        });
        
        return array_slice($tables, 0, 10);
    }

    /**
     * Get index information (simplified).
     */
    private function getIndexInfo()
    {
        // This is a simplified version. In a real application, you would query
        // actual index information from the database
        return [
            'total_indexes' => 25,
            'unused_indexes' => 3,
            'fragmented_indexes' => 1,
        ];
    }

    /**
     * Get user activity statistics.
     */
    private function getUserActivity($startDate)
    {
        return [
            'active_users' => User::where('updated_at', '>=', $startDate)->count(),
            'new_users' => User::where('created_at', '>=', $startDate)->count(),
            'users_with_cards' => User::whereHas('businessCards', function ($query) use ($startDate) {
                $query->where('business_cards.updated_at', '>=', $startDate);
            })->count(),
            'users_with_leads' => User::whereHas('leads', function ($query) use ($startDate) {
                $query->where('leads.updated_at', '>=', $startDate);
            })->count(),
        ];
    }

    /**
     * Get table activity statistics.
     */
    private function getTableActivity($startDate)
    {
        return [
            'cards_created' => BusinessCard::where('created_at', '>=', $startDate)->count(),
            'cards_updated' => BusinessCard::where('updated_at', '>=', $startDate)
                                           ->where('created_at', '<', $startDate)
                                           ->count(),
            'leads_created' => Lead::where('created_at', '>=', $startDate)->count(),
            'leads_updated' => Lead::where('updated_at', '>=', $startDate)
                                      ->where('created_at', '<', $startDate)
                                      ->count(),
            'appointments_created' => Appointment::where('created_at', '>=', $startDate)->count(),
            'appointments_updated' => Appointment::where('updated_at', '>=', $startDate)
                                             ->where('created_at', '<', $startDate)
                                             ->count(),
        ];
    }

    /**
     * Get peak activity hours.
     */
    private function getPeakHours($startDate)
    {
        $hourlyActivity = [];
        
        for ($hour = 0; $hour < 24; $hour++) {
            $hourlyActivity[$hour] = 0;
        }
        
        // This is a simplified version. In a real application, you would analyze
        // actual timestamp data to determine peak hours
        return [
            'peak_hours' => [9, 10, 14, 15, 16], // Business hours
            'hourly_distribution' => $hourlyActivity,
        ];
    }

    /**
     * Get growth trends.
     */
    private function getGrowthTrends($startDate)
    {
        $days = $startDate->diffInDays(now());
        $trends = [];
        
        for ($i = 0; $i < $days; $i++) {
            $date = $startDate->copy()->addDays($i);
            $trends[] = [
                'date' => $date->toDateString(),
                'users' => User::whereDate('created_at', $date)->count(),
                'cards' => BusinessCard::whereDate('created_at', $date)->count(),
                'leads' => Lead::whereDate('created_at', $date)->count(),
            ];
        }
        
        return $trends;
    }

    /**
     * Get query performance (simplified).
     */
    private function getQueryPerformance()
    {
        return [
            'avg_query_time' => 25, // milliseconds
            'slow_query_count' => 5,
            'query_cache_hit_rate' => 85, // percentage
        ];
    }

    /**
     * Get slow queries (simplified).
     */
    private function getSlowQueries()
    {
        return [
            [
                'query' => 'SELECT * FROM leads WHERE status = ?',
                'avg_time' => 150,
                'count' => 45,
            ],
            [
                'query' => 'SELECT * FROM business_cards WHERE user_id = ?',
                'avg_time' => 120,
                'count' => 32,
            ],
        ];
    }

    /**
     * Get index usage (simplified).
     */
    private function getIndexUsage()
    {
        return [
            'index_usage_rate' => 92, // percentage
            'unused_indexes' => [
                'users_email_index',
                'leads_status_index',
            ],
        ];
    }

    /**
     * Get connection statistics (simplified).
     */
    private function getConnectionStats()
    {
        return [
            'active_connections' => 15,
            'max_connections' => 100,
            'connection_pool_size' => 20,
        ];
    }

    /**
     * Get cache statistics (simplified).
     */
    private function getCacheStats()
    {
        return [
            'cache_hit_rate' => 78, // percentage
            'cache_size' => 256, // MB
            'cached_queries' => 1250,
        ];
    }
}