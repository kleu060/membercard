'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Search, 
  Filter, 
  MoreHorizontal, 
  Edit, 
  Trash2, 
  Eye,
  UserPlus,
  Mail,
  Phone,
  Calendar,
  CreditCard,
  Shield,
  AlertCircle,
  CheckCircle,
  Clock,
  Ban,
  Check
} from 'lucide-react';

interface User {
  id: string;
  email: string;
  name?: string;
  avatar?: string;
  location?: string;
  subscriptionPlan: string;
  createdAt: string;
  updatedAt: string;
  isActive: boolean;
  lastLoginAt?: string;
  businessCardsCount: number;
  appointmentsCount: number;
  bookingSettingsCount: number;
}

interface UserFilters {
  search: string;
  subscriptionPlan: string;
  isActive: string;
  dateRange: string;
}

export default function UserManagement() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [users, setUsers] = useState<User[]>([]);
  const [filteredUsers, setFilteredUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [filters, setFilters] = useState<UserFilters>({
    search: '',
    subscriptionPlan: 'all',
    isActive: 'all',
    dateRange: 'all'
  });
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    loadUsers();
  }, []);

  useEffect(() => {
    filterUsers();
  }, [users, filters]);

  const loadUsers = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/users');
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      } else {
        setError('載入用戶數據失敗');
      }
    } catch (error) {
      console.error('Failed to load users:', error);
      setError('載入用戶數據失敗');
    } finally {
      setLoading(false);
    }
  };

  const filterUsers = () => {
    let filtered = users;

    // Search filter
    if (filters.search) {
      filtered = filtered.filter(user => 
        user.email.toLowerCase().includes(filters.search.toLowerCase()) ||
        user.name?.toLowerCase().includes(filters.search.toLowerCase())
      );
    }

    // Subscription plan filter
    if (filters.subscriptionPlan !== 'all') {
      filtered = filtered.filter(user => user.subscriptionPlan === filters.subscriptionPlan);
    }

    // Active status filter
    if (filters.isActive !== 'all') {
      filtered = filtered.filter(user => 
        filters.isActive === 'active' ? user.isActive : !user.isActive
      );
    }

    // Date range filter (simplified)
    if (filters.dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (filters.dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      filtered = filtered.filter(user => new Date(user.createdAt) >= cutoffDate);
    }

    setFilteredUsers(filtered);
  };

  const updateUserStatus = async (userId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/users/${userId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        await loadUsers();
      } else {
        setError('更新用戶狀態失敗');
      }
    } catch (error) {
      console.error('Failed to update user status:', error);
      setError('更新用戶狀態失敗');
    }
  };

  const getSubscriptionPlanLabel = (plan: string) => {
    switch (plan) {
      case 'free': return '免費版';
      case 'professional': return '專業版';
      case 'enterprise': return '企業版';
      default: return plan;
    }
  };

  const getSubscriptionPlanColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'secondary';
      case 'professional': return 'default';
      case 'enterprise': return 'destructive';
      default: return 'secondary';
    }
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>載入用戶數據中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">用戶管理</h2>
          <p className="text-gray-600">管理所有用戶賬戶和權限</p>
        </div>
        <Button>
          <UserPlus className="w-4 h-4 mr-2" />
          新增用戶
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Filter className="w-5 h-5" />
            篩選條件
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <Label htmlFor="search">搜索用戶</Label>
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                <Input
                  id="search"
                  placeholder="輸入郵箱或姓名"
                  value={filters.search}
                  onChange={(e) => setFilters(prev => ({ ...prev, search: e.target.value }))}
                  className="pl-10"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="subscriptionPlan">訂閱方案</Label>
              <Select 
                value={filters.subscriptionPlan} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, subscriptionPlan: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部方案</SelectItem>
                  <SelectItem value="free">免費版</SelectItem>
                  <SelectItem value="professional">專業版</SelectItem>
                  <SelectItem value="enterprise">企業版</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="isActive">賬戶狀態</Label>
              <Select 
                value={filters.isActive} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, isActive: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部狀態</SelectItem>
                  <SelectItem value="active">活躍</SelectItem>
                  <SelectItem value="inactive">停用</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="dateRange">註冊時間</Label>
              <Select 
                value={filters.dateRange} 
                onValueChange={(value) => setFilters(prev => ({ ...prev, dateRange: value }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">全部時間</SelectItem>
                  <SelectItem value="today">今天</SelectItem>
                  <SelectItem value="week">本週</SelectItem>
                  <SelectItem value="month">本月</SelectItem>
                  <SelectItem value="year">今年</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>用戶列表</CardTitle>
          <CardDescription>
            顯示 {filteredUsers.length} 個用戶（總共 {users.length} 個）
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>用戶信息</TableHead>
                  <TableHead>訂閱方案</TableHead>
                  <TableHead>狀態</TableHead>
                  <TableHead>統計數據</TableHead>
                  <TableHead>註冊時間</TableHead>
                  <TableHead>最後登入</TableHead>
                  <TableHead>操作</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          {user.avatar ? (
                            <img src={user.avatar} alt={user.name} className="w-full h-full rounded-full object-cover" />
                          ) : (
                            <span className="text-xs font-medium">
                              {user.name?.charAt(0) || user.email.charAt(0)}
                            </span>
                          )}
                        </div>
                        <div>
                          <p className="font-medium">{user.name || '未設置姓名'}</p>
                          <p className="text-sm text-gray-500">{user.email}</p>
                          {user.location && (
                            <p className="text-xs text-gray-400">{user.location}</p>
                          )}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getSubscriptionPlanColor(user.subscriptionPlan) as any}>
                        {getSubscriptionPlanLabel(user.subscriptionPlan)}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <div className={`w-2 h-2 rounded-full ${user.isActive ? 'bg-green-500' : 'bg-red-500'}`}></div>
                        <span className="text-sm">{user.isActive ? '活躍' : '停用'}</span>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-1">
                        <div className="flex items-center space-x-2 text-xs">
                          <CreditCard className="w-3 h-3" />
                          <span>{user.businessCardsCount} 名片</span>
                        </div>
                        <div className="flex items-center space-x-2 text-xs">
                          <Calendar className="w-3 h-3" />
                          <span>{user.appointmentsCount} 預約</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {new Date(user.createdAt).toLocaleDateString('zh-TW')}
                      </span>
                    </TableCell>
                    <TableCell>
                      <span className="text-sm">
                        {user.lastLoginAt 
                          ? new Date(user.lastLoginAt).toLocaleDateString('zh-TW')
                          : '從未登入'
                        }
                      </span>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button variant="outline" size="sm">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => updateUserStatus(user.id, !user.isActive)}
                        >
                          {user.isActive ? (
                            <Ban className="w-4 h-4" />
                          ) : (
                            <Check className="w-4 h-4" />
                          )}
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}