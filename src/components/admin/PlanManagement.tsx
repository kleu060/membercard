'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  CreditCard, 
  Crown, 
  Star, 
  Users, 
  Plus, 
  Edit, 
  Trash2, 
  Settings,
  Save,
  AlertCircle,
  CheckCircle,
  Zap,
  Shield,
  Database,
  Globe,
  Mail,
  Phone,
  Calendar,
  BarChart3,
  FileText,
  Image,
  Cloud,
  Smartphone,
  Monitor,
  Bell,
  TrendingUp,
  DollarSign,
  Clock,
  Check,
  X
} from 'lucide-react';

interface Plan {
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  billingCycle: 'monthly' | 'yearly';
  features: string[];
  maxUsers: number;
  maxStorage: number;
  maxBusinessCards: number;
  maxAppointments: number;
  prioritySupport: boolean;
  customDomain: boolean;
  analytics: boolean;
  apiAccess: boolean;
  whiteLabel: boolean;
  isActive: boolean;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  icon: React.ReactNode;
}

const defaultFeatures: Feature[] = [
  { id: 'digital-cards', name: '數位名片', description: '創建和管理數位名片', category: 'core', icon: <CreditCard className="w-4 h-4" /> },
  { id: 'booking-system', name: '預約系統', description: '在線預約管理', category: 'core', icon: <Calendar className="w-4 h-4" /> },
  { id: 'user-management', name: '用戶管理', description: '多用戶賬戶管理', category: 'core', icon: <Users className="w-4 h-4" /> },
  { id: 'analytics', name: '數據分析', description: '詳細統計和報告', category: 'analytics', icon: <BarChart3 className="w-4 h-4" /> },
  { id: 'api-access', name: 'API 接入', description: 'RESTful API 接入', category: 'advanced', icon: <Globe className="w-4 h-4" /> },
  { id: 'priority-support', name: '優先支持', description: '24/7 優先技術支持', category: 'support', icon: <Shield className="w-4 h-4" /> },
  { id: 'custom-domain', name: '自定義域名', description: '使用自定義域名', category: 'branding', icon: <Globe className="w-4 h-4" /> },
  { id: 'white-label', name: '白標解決方案', description: '完全品牌定制', category: 'branding', icon: <Monitor className="w-4 h-4" /> },
  { id: 'email-notifications', name: '郵件通知', description: '自動郵件通知', category: 'communication', icon: <Mail className="w-4 h-4" /> },
  { id: 'sms-integration', name: '短信整合', description: '短信通知功能', category: 'communication', icon: <Phone className="w-4 h-4" /> },
  { id: 'cloud-storage', name: '雲端存儲', description: '擴展雲端存儲空間', category: 'storage', icon: <Cloud className="w-4 h-4" /> },
  { id: 'advanced-analytics', name: '高級分析', description: 'AI 驅動的數據分析', category: 'analytics', icon: <TrendingUp className="w-4 h-4" /> }
];

export default function PlanManagement() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [plans, setPlans] = useState<Plan[]>([]);
  const [selectedPlan, setSelectedPlan] = useState<Plan | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    loadPlans();
  }, []);

  const loadPlans = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/plans');
      if (response.ok) {
        const data = await response.json();
        setPlans(data);
      } else {
        setError('載入方案數據失敗');
      }
    } catch (error) {
      console.error('Failed to load plans:', error);
      setError('載入方案數據失敗');
    } finally {
      setLoading(false);
    }
  };

  const savePlan = async (planData: Partial<Plan>) => {
    try {
      const method = selectedPlan ? 'PUT' : 'POST';
      const url = selectedPlan ? `/api/admin/plans/${selectedPlan.id}` : '/api/admin/plans';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(planData),
      });

      if (response.ok) {
        await loadPlans();
        setIsDialogOpen(false);
        setSelectedPlan(null);
      } else {
        setError('儲存方案失敗');
      }
    } catch (error) {
      console.error('Failed to save plan:', error);
      setError('儲存方案失敗');
    }
  };

  const deletePlan = async (planId: string) => {
    if (!confirm('確定要刪除這個方案嗎？此操作無法撤銷。')) {
      return;
    }

    try {
      const response = await fetch(`/api/admin/plans/${planId}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await loadPlans();
      } else {
        setError('刪除方案失敗');
      }
    } catch (error) {
      console.error('Failed to delete plan:', error);
      setError('刪除方案失敗');
    }
  };

  const togglePlanStatus = async (planId: string, isActive: boolean) => {
    try {
      const response = await fetch(`/api/admin/plans/${planId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ isActive }),
      });

      if (response.ok) {
        await loadPlans();
      } else {
        setError('更新方案狀態失敗');
      }
    } catch (error) {
      console.error('Failed to toggle plan status:', error);
      setError('更新方案狀態失敗');
    }
  };

  const getPlanIcon = (planName: string) => {
    if (planName.includes('Free') || planName.includes('免費')) return <Star className="w-5 h-5 text-gray-400" />;
    if (planName.includes('Pro') || planName.includes('專業')) return <Crown className="w-5 h-5 text-blue-500" />;
    if (planName.includes('Enterprise') || planName.includes('企業')) return <Crown className="w-5 h-5 text-purple-500" />;
    return <CreditCard className="w-5 h-5" />;
  };

  const formatFileSize = (gb: number) => {
    if (gb >= 1024) return `${(gb / 1024).toFixed(1)} TB`;
    return `${gb} GB`;
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>載入方案管理中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">方案管理</h2>
          <p className="text-gray-600">管理訂閱方案和功能分配</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新增方案
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Plans Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {plans.map((plan) => (
          <Card key={plan.id} className={`relative ${plan.isActive ? 'border-green-200 bg-green-50' : 'border-gray-200 bg-gray-50'}`}>
            <CardHeader>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  {getPlanIcon(plan.name)}
                  <CardTitle className="text-lg">{plan.name}</CardTitle>
                </div>
                <div className="flex items-center space-x-2">
                  <Switch
                    checked={plan.isActive}
                    onCheckedChange={(checked) => togglePlanStatus(plan.id, checked)}
                  />
                  <Badge variant={plan.isActive ? 'default' : 'secondary'}>
                    {plan.isActive ? '啟用' : '停用'}
                  </Badge>
                </div>
              </div>
              <CardDescription>{plan.description}</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Price */}
              <div className="text-center">
                <div className="text-3xl font-bold">
                  {plan.currency === 'TWD' ? 'NT$' : plan.currency === 'USD' ? '$' : plan.currency}
                  {plan.price}
                </div>
                <div className="text-sm text-gray-500">
                  /{plan.billingCycle === 'monthly' ? '月' : '年'}
                </div>
              </div>

              {/* Key Features */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span>最大用戶數</span>
                  <span className="font-medium">{plan.maxUsers === -1 ? '無限制' : plan.maxUsers}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>存儲空間</span>
                  <span className="font-medium">{formatFileSize(plan.maxStorage)}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>數位名片</span>
                  <span className="font-medium">{plan.maxBusinessCards === -1 ? '無限制' : plan.maxBusinessCards}</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span>預約管理</span>
                  <span className="font-medium">{plan.maxAppointments === -1 ? '無限制' : plan.maxAppointments}</span>
                </div>
              </div>

              {/* Special Features */}
              <div className="space-y-2">
                {plan.prioritySupport && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>優先技術支持</span>
                  </div>
                )}
                {plan.customDomain && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>自定義域名</span>
                  </div>
                )}
                {plan.analytics && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>數據分析</span>
                  </div>
                )}
                {plan.apiAccess && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>API 接入</span>
                  </div>
                )}
                {plan.whiteLabel && (
                  <div className="flex items-center space-x-2 text-sm">
                    <Check className="w-4 h-4 text-green-500" />
                    <span>白標解決方案</span>
                  </div>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-2 pt-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    setSelectedPlan(plan);
                    setIsDialogOpen(true);
                  }}
                  className="flex-1"
                >
                  <Edit className="w-4 h-4 mr-1" />
                  編輯
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => deletePlan(plan.id)}
                  className="text-red-600 hover:text-red-700"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Plan Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {selectedPlan ? '編輯方案' : '新增方案'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-6">
            <Tabs defaultValue="basic" className="space-y-6">
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="basic">基本信息</TabsTrigger>
                <TabsTrigger value="limits">限制設置</TabsTrigger>
                <TabsTrigger value="features">功能分配</TabsTrigger>
                <TabsTrigger value="advanced">高級設置</TabsTrigger>
              </TabsList>

              <TabsContent value="basic" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planName">方案名稱</Label>
                    <Input
                      id="planName"
                      placeholder="輸入方案名稱"
                      defaultValue={selectedPlan?.name}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planDescription">方案描述</Label>
                    <Input
                      id="planDescription"
                      placeholder="輸入方案描述"
                      defaultValue={selectedPlan?.description}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="planPrice">價格</Label>
                    <Input
                      id="planPrice"
                      type="number"
                      placeholder="0"
                      defaultValue={selectedPlan?.price}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="planCurrency">貨幣</Label>
                    <Select defaultValue={selectedPlan?.currency || 'TWD'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="TWD">新台幣 (TWD)</SelectItem>
                        <SelectItem value="USD">美元 (USD)</SelectItem>
                        <SelectItem value="CNY">人民幣 (CNY)</SelectItem>
                        <SelectItem value="EUR">歐元 (EUR)</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="billingCycle">計費週期</Label>
                    <Select defaultValue={selectedPlan?.billingCycle || 'monthly'}>
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="monthly">按月</SelectItem>
                        <SelectItem value="yearly">按年</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="limits" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="maxUsers">最大用戶數</Label>
                    <Input
                      id="maxUsers"
                      type="number"
                      placeholder="-1 表示無限制"
                      defaultValue={selectedPlan?.maxUsers}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxStorage">存儲空間 (GB)</Label>
                    <Input
                      id="maxStorage"
                      type="number"
                      placeholder="-1 表示無限制"
                      defaultValue={selectedPlan?.maxStorage}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxBusinessCards">最大名片數</Label>
                    <Input
                      id="maxBusinessCards"
                      type="number"
                      placeholder="-1 表示無限制"
                      defaultValue={selectedPlan?.maxBusinessCards}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="maxAppointments">最大預約數</Label>
                    <Input
                      id="maxAppointments"
                      type="number"
                      placeholder="-1 表示無限制"
                      defaultValue={selectedPlan?.maxAppointments}
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="features" className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  {defaultFeatures.map((feature) => (
                    <div key={feature.id} className="flex items-center space-x-3 p-3 border rounded-lg">
                      {feature.icon}
                      <div className="flex-1">
                        <p className="font-medium">{feature.name}</p>
                        <p className="text-sm text-gray-500">{feature.description}</p>
                      </div>
                      <Switch
                        id={`feature-${feature.id}`}
                        defaultChecked={selectedPlan?.features.includes(feature.id)}
                      />
                    </div>
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="advanced" className="space-y-4">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="prioritySupport"
                        defaultChecked={selectedPlan?.prioritySupport}
                      />
                      <Label htmlFor="prioritySupport">優先技術支持</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="customDomain"
                        defaultChecked={selectedPlan?.customDomain}
                      />
                      <Label htmlFor="customDomain">自定義域名</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="analytics"
                        defaultChecked={selectedPlan?.analytics}
                      />
                      <Label htmlFor="analytics">數據分析</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="apiAccess"
                        defaultChecked={selectedPlan?.apiAccess}
                      />
                      <Label htmlFor="apiAccess">API 接入</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="whiteLabel"
                        defaultChecked={selectedPlan?.whiteLabel}
                      />
                      <Label htmlFor="whiteLabel">白標解決方案</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                      <Switch
                        id="isActive"
                        defaultChecked={selectedPlan?.isActive}
                      />
                      <Label htmlFor="isActive">啟用方案</Label>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </Tabs>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                取消
              </Button>
              <Button className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                儲存方案
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}