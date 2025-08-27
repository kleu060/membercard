'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { 
  Users, 
  Settings, 
  Database, 
  Shield, 
  BarChart3, 
  Calendar,
  CreditCard,
  ToggleLeft,
  Search,
  Filter,
  Download,
  RefreshCw,
  AlertCircle,
  CheckCircle,
  Clock,
  TrendingUp,
  UserCheck,
  CreditCard as CardIcon,
  CalendarDays
} from 'lucide-react';
import AdminLayout from '@/components/admin/AdminLayout';
import UserManagement from '@/components/admin/UserManagement';
import FeatureToggles from '@/components/admin/FeatureToggles';
import DatabaseOverview from '@/components/admin/DatabaseOverview';
import PlanManagement from '@/components/admin/PlanManagement';

interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalBusinessCards: number;
  totalAppointments: number;
  totalBookings: number;
  totalRevenue: number;
  newUsersToday: number;
  newUsersThisWeek: number;
  newUsersThisMonth: number;
}

interface SystemHealth {
  status: 'healthy' | 'warning' | 'error';
  database: boolean;
  api: boolean;
  auth: boolean;
  storage: boolean;
  lastCheck: string;
}

export default function AdminPage() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AdminStats | null>(null);
  const [systemHealth, setSystemHealth] = useState<SystemHealth | null>(null);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    loadAdminData();
  }, []);

  const loadAdminData = async () => {
    try {
      setLoading(true);
      
      // Load stats
      const statsResponse = await fetch('/api/admin/stats');
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats(statsData);
      }

      // Load system health
      const healthResponse = await fetch('/api/admin/health');
      if (healthResponse.ok) {
        const healthData = await healthResponse.json();
        setSystemHealth(healthData);
      }
    } catch (error) {
      console.error('Failed to load admin data:', error);
      setError('載入管理員數據失敗');
    } finally {
      setLoading(false);
    }
  };

  if (!mounted || loading) {
    return (
      <AdminLayout>
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
            <p>載入中...</p>
          </div>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold">管理員面板</h1>
            <p className="text-gray-600">系統管理、用戶監控與功能配置</p>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={loadAdminData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              刷新數據
            </Button>
            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              導出報告
            </Button>
          </div>
        </div>

        {/* Error Message */}
        {error && (
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Stats Overview */}
        {stats && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">總用戶數</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalUsers}</div>
                <p className="text-xs text-muted-foreground">
                  今日新增 {stats.newUsersToday} 人
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">活躍用戶</CardTitle>
                <UserCheck className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.activeUsers}</div>
                <p className="text-xs text-muted-foreground">
                  本週新增 {stats.newUsersThisWeek} 人
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">數位名片</CardTitle>
                <CardIcon className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalBusinessCards}</div>
                <p className="text-xs text-muted-foreground">
                  總名片數量
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">預約管理</CardTitle>
                <CalendarDays className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.totalAppointments}</div>
                <p className="text-xs text-muted-foreground">
                  預約設定 {stats.totalBookings} 個
                </p>
              </CardContent>
            </Card>
          </div>
        )}

        {/* System Health */}
        {systemHealth && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                系統健康狀態
              </CardTitle>
              <CardDescription>
                最後檢查時間: {new Date(systemHealth.lastCheck).toLocaleString('zh-TW')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${systemHealth.status === 'healthy' ? 'bg-green-500' : systemHealth.status === 'warning' ? 'bg-yellow-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm font-medium">整體狀態</span>
                  <Badge variant={systemHealth.status === 'healthy' ? 'default' : systemHealth.status === 'warning' ? 'secondary' : 'destructive'}>
                    {systemHealth.status === 'healthy' ? '正常' : systemHealth.status === 'warning' ? '警告' : '錯誤'}
                  </Badge>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${systemHealth.database ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">數據庫</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${systemHealth.api ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">API 服務</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${systemHealth.auth ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">認證系統</span>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className={`w-3 h-3 rounded-full ${systemHealth.storage ? 'bg-green-500' : 'bg-red-500'}`}></div>
                  <span className="text-sm">存儲系統</span>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* Main Tabs */}
        <Tabs defaultValue="users" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="users">用戶管理</TabsTrigger>
            <TabsTrigger value="features">功能開關</TabsTrigger>
            <TabsTrigger value="database">數據庫概覽</TabsTrigger>
            <TabsTrigger value="plans">方案管理</TabsTrigger>
          </TabsList>

          <TabsContent value="users">
            <UserManagement />
          </TabsContent>

          <TabsContent value="features">
            <FeatureToggles />
          </TabsContent>

          <TabsContent value="database">
            <DatabaseOverview />
          </TabsContent>

          <TabsContent value="plans">
            <PlanManagement />
          </TabsContent>
        </Tabs>
      </div>
    </AdminLayout>
  );
}