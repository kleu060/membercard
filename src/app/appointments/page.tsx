'use client';

import { useState, useEffect } from 'react';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import AppointmentManagement from '@/components/appointments/AppointmentManagement';
import CalendarIntegration from '@/components/appointments/CalendarIntegration';
import { 
  Calendar as CalendarIcon, 
  Settings, 
  Clock, 
  CheckCircle,
  Users,
  Plus
} from 'lucide-react';

interface AppointmentStats {
  total: number;
  pending: number;
  confirmed: number;
  completed: number;
  cancelled: number;
}

export default function AppointmentsPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState<AppointmentStats>({
    total: 0,
    pending: 0,
    confirmed: 0,
    completed: 0,
    cancelled: 0
  });

  useEffect(() => {
    loadUserAndStats();
  }, []);

  const loadUserAndStats = async () => {
    try {
      // Get user session
      const session = await getServerSession(authOptions);
      if (session?.user?.email) {
        const response = await fetch(`/api/auth/me`);
        if (response.ok) {
          const userData = await response.json();
          setUser(userData);
          
          // Load appointment stats
          await loadAppointmentStats(userData.id);
        }
      }
    } catch (error) {
      console.error('Failed to load user data:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadAppointmentStats = async (userId: string) => {
    try {
      const response = await fetch(`/api/appointments?userId=${userId}`);
      if (response.ok) {
        const appointments = await response.json();
        const newStats: AppointmentStats = {
          total: appointments.length,
          pending: appointments.filter((a: any) => a.status === 'pending').length,
          confirmed: appointments.filter((a: any) => a.status === 'confirmed').length,
          completed: appointments.filter((a: any) => a.status === 'completed').length,
          cancelled: appointments.filter((a: any) => a.status === 'cancelled').length
        };
        setStats(newStats);
      }
    } catch (error) {
      console.error('Failed to load appointment stats:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold mb-4">請先登入</h2>
            <p className="text-gray-600 mb-4">您需要登入才能使用預約管理功能</p>
            <Button onClick={() => window.location.href = '/api/auth/login'}>
              登入
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-3">
              <CalendarIcon className="w-8 h-8 text-blue-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">預約管理</h1>
                <p className="text-sm text-gray-600">管理您的預約和行事曆整合</p>
              </div>
            </div>
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              {user.name || user.email}
            </Badge>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6 mb-8">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">總預約數</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <CalendarIcon className="w-8 h-8 text-blue-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">待確認</p>
                  <p className="text-3xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已確認</p>
                  <p className="text-3xl font-bold text-green-600">{stats.confirmed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-green-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已完成</p>
                  <p className="text-3xl font-bold text-purple-600">{stats.completed}</p>
                </div>
                <CheckCircle className="w-8 h-8 text-purple-500" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">已取消</p>
                  <p className="text-3xl font-bold text-red-600">{stats.cancelled}</p>
                </div>
                <Clock className="w-8 h-8 text-red-500" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Tabs */}
        <Tabs defaultValue="appointments" className="space-y-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="appointments" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              預約管理
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              行事曆整合
            </TabsTrigger>
          </TabsList>

          <TabsContent value="appointments" className="space-y-6">
            <AppointmentManagement userId={user.id} />
          </TabsContent>

          <TabsContent value="calendar" className="space-y-6">
            <CalendarIntegration 
              userId={user.id} 
              onIntegrationChange={() => loadAppointmentStats(user.id)} 
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}