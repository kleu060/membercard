'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Badge } from '@/components/ui/badge';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Briefcase, 
  Calendar, 
  Edit,
  Save,
  X,
  Camera,
  Upload
} from 'lucide-react';
import { toast } from 'sonner';

interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  phone?: string;
  location?: string;
  bio?: string;
  company?: string;
  position?: string;
  website?: string;
  joinedAt: string;
  subscriptionPlan: string;
}

export default function ProfilePage() {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);
  const [formData, setFormData] = useState<Partial<UserProfile>>({});

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const fetchUserProfile = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
        setFormData(data.user);
      }
    } catch (error) {
      console.error('Failed to fetch user profile:', error);
      toast.error('Failed to load profile');
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const updatedUser = await response.json();
        setUser(updatedUser);
        setEditing(false);
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (error) {
      console.error('Failed to update profile:', error);
      toast.error('Failed to update profile');
    }
  };

  const handleCancel = () => {
    setFormData(user || {});
    setEditing(false);
  };

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      const formData = new FormData();
      formData.append('file', file);

      try {
        const response = await fetch('/api/upload', {
          method: 'POST',
          body: formData,
        });

        if (response.ok) {
          const data = await response.json();
          setFormData(prev => ({ ...prev, avatar: data.url }));
          toast.success('Avatar uploaded successfully');
        } else {
          toast.error('Failed to upload avatar');
        }
      } catch (error) {
        console.error('Failed to upload avatar:', error);
        toast.error('Failed to upload avatar');
      }
    }
  };

  const getPlanBadgeColor = (plan: string) => {
    switch (plan) {
      case 'free': return 'bg-gray-100 text-gray-800';
      case 'professional': return 'bg-blue-100 text-blue-800';
      case 'enterprise': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPlanName = (plan: string) => {
    switch (plan) {
      case 'free': return '免费';
      case 'professional': return '专业';
      case 'enterprise': return '企业';
      default: return '免费';
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">User not found</h1>
          <Button onClick={() => window.location.href = '/'}>Go Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">个人资料</h1>
            <p className="text-gray-600 mt-2">管理您的个人信息和账户设置</p>
          </div>
          {!editing && (
            <Button onClick={() => setEditing(true)}>
              <Edit className="w-4 h-4 mr-2" />
              编辑资料
            </Button>
          )}
        </div>

        <Tabs defaultValue="profile" className="space-y-6">
          <TabsList>
            <TabsTrigger value="profile">个人资料</TabsTrigger>
            <TabsTrigger value="account">账户信息</TabsTrigger>
            <TabsTrigger value="subscription">订阅计划</TabsTrigger>
          </TabsList>

          <TabsContent value="profile">
            <Card>
              <CardHeader>
                <CardTitle>个人资料</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Avatar Section */}
                <div className="flex items-center space-x-6">
                  <div className="relative">
                    <Avatar className="w-24 h-24">
                      <AvatarImage src={formData.avatar} alt={formData.name} />
                      <AvatarFallback className="text-2xl">
                        {formData.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    {editing && (
                      <div className="absolute -bottom-2 -right-2">
                        <Label htmlFor="avatar-upload" className="cursor-pointer">
                          <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center hover:bg-blue-700 transition-colors">
                            <Camera className="w-4 h-4 text-white" />
                          </div>
                        </Label>
                        <Input
                          id="avatar-upload"
                          type="file"
                          accept="image/*"
                          className="hidden"
                          onChange={handleAvatarUpload}
                        />
                      </div>
                    )}
                  </div>
                  <div>
                    <h3 className="text-xl font-semibold">{formData.name}</h3>
                    <p className="text-gray-600">{formData.email}</p>
                    <Badge className={`mt-2 ${getPlanBadgeColor(user.subscriptionPlan)}`}>
                      {getPlanName(user.subscriptionPlan)} 套餐
                    </Badge>
                  </div>
                </div>

                {/* Profile Information */}
                <div className="grid md:grid-cols-2 gap-6">
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="name">姓名</Label>
                      <Input
                        id="name"
                        value={formData.name || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="email">邮箱</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, email: e.target.value }))}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">电话</Label>
                      <Input
                        id="phone"
                        value={formData.phone || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="company">公司</Label>
                      <Input
                        id="company"
                        value={formData.company || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, company: e.target.value }))}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="position">职位</Label>
                      <Input
                        id="position"
                        value={formData.position || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, position: e.target.value }))}
                        disabled={!editing}
                      />
                    </div>
                    <div>
                      <Label htmlFor="location">地区</Label>
                      <Input
                        id="location"
                        value={formData.location || ''}
                        onChange={(e) => setFormData(prev => ({ ...prev, location: e.target.value }))}
                        disabled={!editing}
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <Label htmlFor="bio">个人简介</Label>
                  <Textarea
                    id="bio"
                    value={formData.bio || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
                    disabled={!editing}
                    rows={4}
                  />
                </div>

                <div>
                  <Label htmlFor="website">个人网站</Label>
                  <Input
                    id="website"
                    value={formData.website || ''}
                    onChange={(e) => setFormData(prev => ({ ...prev, website: e.target.value }))}
                    disabled={!editing}
                  />
                </div>

                {editing && (
                  <div className="flex space-x-4">
                    <Button onClick={handleSave}>
                      <Save className="w-4 h-4 mr-2" />
                      保存更改
                    </Button>
                    <Button variant="outline" onClick={handleCancel}>
                      <X className="w-4 h-4 mr-2" />
                      取消
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="account">
            <Card>
              <CardHeader>
                <CardTitle>账户信息</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="grid md:grid-cols-2 gap-6">
                  <div>
                    <Label className="text-sm font-medium text-gray-700">用户ID</Label>
                    <p className="text-sm text-gray-600">{user.id}</p>
                  </div>
                  <div>
                    <Label className="text-sm font-medium text-gray-700">注册时间</Label>
                    <p className="text-sm text-gray-600">
                      {new Date(user.joinedAt).toLocaleDateString('zh-CN')}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="subscription">
            <Card>
              <CardHeader>
                <CardTitle>订阅计划</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-lg font-semibold">当前套餐</h3>
                    <p className="text-gray-600">{getPlanName(user.subscriptionPlan)} 套餐</p>
                  </div>
                  <Badge className={getPlanBadgeColor(user.subscriptionPlan)}>
                    {getPlanName(user.subscriptionPlan)}
                  </Badge>
                </div>
                
                <div className="border-t pt-6">
                  <h4 className="font-medium mb-4">套餐功能</h4>
                  <div className="space-y-2">
                    {user.subscriptionPlan === 'free' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">1张数字名片</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">基础模板</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">基础分析</span>
                        </div>
                      </>
                    )}
                    {user.subscriptionPlan === 'professional' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">3张数字名片</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">高级模板</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">详细分析</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">自定义域名</span>
                        </div>
                      </>
                    )}
                    {user.subscriptionPlan === 'enterprise' && (
                      <>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">无限数字名片</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">所有模板</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">高级分析</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">自定义域名</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">API 访问</span>
                        </div>
                        <div className="flex items-center space-x-2">
                          <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                          <span className="text-sm">优先支持</span>
                        </div>
                      </>
                    )}
                  </div>
                </div>

                <div className="flex space-x-4">
                  <Button onClick={() => window.location.href = '/pricing'}>
                    查看套餐
                  </Button>
                  {user.subscriptionPlan === 'free' && (
                    <Button variant="outline" onClick={() => window.location.href = '/pricing'}>
                      升级套餐
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}