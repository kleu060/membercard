'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  ToggleLeft, 
  Settings, 
  Save, 
  Plus, 
  Edit, 
  Trash2, 
  AlertCircle,
  CheckCircle,
  Calendar,
  CreditCard,
  Users,
  Shield,
  Database,
  Globe,
  Mail,
  Phone,
  MapPin,
  Image,
  FileText,
  BarChart3,
  Zap,
  Lock,
  Cloud,
  Smartphone,
  Monitor,
  Bell,
  Search,
  Filter
} from 'lucide-react';

interface Feature {
  id: string;
  name: string;
  description: string;
  category: string;
  enabled: boolean;
  globalEnabled: boolean;
  plans: string[];
  settings: Record<string, any>;
  createdAt: string;
  updatedAt: string;
}

interface FeatureCategory {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  features: Feature[];
}

const defaultCategories: FeatureCategory[] = [
  {
    id: 'booking',
    name: '預約管理',
    description: '預約系統相關功能',
    icon: <Calendar className="w-5 h-5" />,
    features: []
  },
  {
    id: 'digital-cards',
    name: '數位名片',
    description: '數位名片創建和管理功能',
    icon: <CreditCard className="w-5 h-5" />,
    features: []
  },
  {
    id: 'user-management',
    name: '用戶管理',
    description: '用戶賬戶和權限管理',
    icon: <Users className="w-5 h-5" />,
    features: []
  },
  {
    id: 'communication',
    name: '通訊功能',
    description: '郵件、短信等通訊功能',
    icon: <Mail className="w-5 h-5" />,
    features: []
  },
  {
    id: 'analytics',
    name: '數據分析',
    description: '統計分析和報告功能',
    icon: <BarChart3 className="w-5 h-5" />,
    features: []
  },
  {
    id: 'integrations',
    name: '第三方整合',
    description: '外部系統整合功能',
    icon: <Globe className="w-5 h-5" />,
    features: []
  }
];

const subscriptionPlans = [
  { value: 'free', label: '免費版', color: 'secondary' },
  { value: 'professional', label: '專業版', color: 'default' },
  { value: 'enterprise', label: '企業版', color: 'destructive' }
];

export default function FeatureToggles() {
  const [mounted, setMounted] = useState(false);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<FeatureCategory[]>(defaultCategories);
  const [selectedFeature, setSelectedFeature] = useState<Feature | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [error, setError] = useState<string>('');

  useEffect(() => {
    setMounted(true);
    loadFeatures();
  }, []);

  const loadFeatures = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/admin/features');
      if (response.ok) {
        const data = await response.json();
        // Organize features by category
        const organizedCategories = defaultCategories.map(category => ({
          ...category,
          features: data.filter((feature: Feature) => feature.category === category.id)
        }));
        setCategories(organizedCategories);
      } else {
        setError('載入功能設置失敗');
      }
    } catch (error) {
      console.error('Failed to load features:', error);
      setError('載入功能設置失敗');
    } finally {
      setLoading(false);
    }
  };

  const toggleFeature = async (featureId: string, enabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/features/${featureId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ enabled }),
      });

      if (response.ok) {
        await loadFeatures();
      } else {
        setError('更新功能狀態失敗');
      }
    } catch (error) {
      console.error('Failed to toggle feature:', error);
      setError('更新功能狀態失敗');
    }
  };

  const toggleGlobalFeature = async (featureId: string, globalEnabled: boolean) => {
    try {
      const response = await fetch(`/api/admin/features/${featureId}/global`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ globalEnabled }),
      });

      if (response.ok) {
        await loadFeatures();
      } else {
        setError('更新全局功能狀態失敗');
      }
    } catch (error) {
      console.error('Failed to toggle global feature:', error);
      setError('更新全局功能狀態失敗');
    }
  };

  const updateFeaturePlans = async (featureId: string, plans: string[]) => {
    try {
      const response = await fetch(`/api/admin/features/${featureId}/plans`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ plans }),
      });

      if (response.ok) {
        await loadFeatures();
      } else {
        setError('更新功能方案失敗');
      }
    } catch (error) {
      console.error('Failed to update feature plans:', error);
      setError('更新功能方案失敗');
    }
  };

  const getPlanBadge = (plan: string) => {
    const planConfig = subscriptionPlans.find(p => p.value === plan);
    return planConfig ? (
      <Badge variant={planConfig.color as any}>{planConfig.label}</Badge>
    ) : (
      <Badge variant="outline">{plan}</Badge>
    );
  };

  if (!mounted || loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-2"></div>
          <p>載入功能設置中...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold">功能開關管理</h2>
          <p className="text-gray-600">控制各項功能的開啟狀態和方案權限</p>
        </div>
        <Button onClick={() => setIsDialogOpen(true)}>
          <Plus className="w-4 h-4 mr-2" />
          新增功能
        </Button>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Feature Categories */}
      <Tabs defaultValue="booking" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="flex items-center gap-2">
              {category.icon}
              <span className="hidden sm:inline">{category.name}</span>
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id} className="space-y-6">
            {/* Category Header */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {category.icon}
                  {category.name}
                </CardTitle>
                <CardDescription>{category.description}</CardDescription>
              </CardHeader>
            </Card>

            {/* Features Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {category.features.map((feature) => (
                <Card key={feature.id} className="relative">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg">{feature.name}</CardTitle>
                      <div className="flex items-center space-x-2">
                        <div className="flex items-center space-x-1">
                          <Label htmlFor={`global-${feature.id}`} className="text-xs">全局</Label>
                          <Switch
                            id={`global-${feature.id}`}
                            checked={feature.globalEnabled}
                            onCheckedChange={(checked) => toggleGlobalFeature(feature.id, checked)}
                          />
                        </div>
                        <Switch
                          checked={feature.enabled}
                          onCheckedChange={(checked) => toggleFeature(feature.id, checked)}
                        />
                      </div>
                    </div>
                    <CardDescription>{feature.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {/* Status */}
                    <div className="flex items-center space-x-2">
                      <div className={`w-2 h-2 rounded-full ${feature.enabled ? 'bg-green-500' : 'bg-red-500'}`}></div>
                      <span className="text-sm">
                        {feature.enabled ? '功能已啟用' : '功能已停用'}
                      </span>
                      {feature.globalEnabled && (
                        <Badge variant="outline" className="text-xs">全局啟用</Badge>
                      )}
                    </div>

                    {/* Available Plans */}
                    <div>
                      <Label className="text-sm font-medium">可用方案</Label>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {feature.plans.map((plan) => getPlanBadge(plan))}
                      </div>
                    </div>

                    {/* Actions */}
                    <div className="flex justify-between items-center pt-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setSelectedFeature(feature);
                          setIsDialogOpen(true);
                        }}
                      >
                        <Edit className="w-4 h-4 mr-1" />
                        編輯
                      </Button>
                      <div className="text-xs text-gray-500">
                        更新於 {new Date(feature.updatedAt).toLocaleDateString('zh-TW')}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {category.features.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <ToggleLeft className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">暫無功能</h3>
                  <p className="text-gray-600 mb-4">此分類下尚未添加任何功能</p>
                  <Button onClick={() => setIsDialogOpen(true)}>
                    <Plus className="w-4 h-4 mr-2" />
                    新增功能
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        ))}
      </Tabs>

      {/* Feature Edit Dialog */}
      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedFeature ? '編輯功能' : '新增功能'}
            </DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featureName">功能名稱</Label>
                <Input
                  id="featureName"
                  placeholder="輸入功能名稱"
                  defaultValue={selectedFeature?.name}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="featureCategory">功能分類</Label>
                <Select defaultValue={selectedFeature?.category}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.map((category) => (
                      <SelectItem key={category.id} value={category.id}>
                        {category.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="featureDescription">功能描述</Label>
              <Textarea
                id="featureDescription"
                placeholder="輸入功能描述"
                rows={3}
                defaultValue={selectedFeature?.description}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="featurePlans">可用方案</Label>
                <div className="space-y-2">
                  {subscriptionPlans.map((plan) => (
                    <div key={plan.value} className="flex items-center space-x-2">
                      <Switch
                        id={`plan-${plan.value}`}
                        defaultChecked={selectedFeature?.plans.includes(plan.value)}
                      />
                      <Label htmlFor={`plan-${plan.value}`}>{plan.label}</Label>
                    </div>
                  ))}
                </div>
              </div>
              <div className="space-y-2">
                <Label>功能設置</Label>
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="globalEnabled"
                      defaultChecked={selectedFeature?.globalEnabled}
                    />
                    <Label htmlFor="globalEnabled">全局啟用</Label>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Switch
                      id="enabled"
                      defaultChecked={selectedFeature?.enabled}
                    />
                    <Label htmlFor="enabled">功能啟用</Label>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex gap-2 pt-4">
              <Button variant="outline" onClick={() => setIsDialogOpen(false)} className="flex-1">
                取消
              </Button>
              <Button className="flex-1">
                <Save className="w-4 h-4 mr-2" />
                儲存
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}