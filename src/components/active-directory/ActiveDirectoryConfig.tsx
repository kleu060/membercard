'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Switch } from '@/components/ui/switch';
import { 
  Settings, 
  RefreshCw, 
  CheckCircle, 
  AlertCircle, 
  Clock, 
  Users, 
  Building2,
  Shield,
  Database,
  Activity,
  Trash2
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ADConfig {
  id: string;
  domain: string;
  serverUrl: string;
  baseDn: string;
  userFilter?: string;
  syncInterval: number;
  isActive: boolean;
  lastSyncAt?: string;
  createdAt: string;
}

interface SyncLog {
  id: string;
  status: string;
  message?: string;
  usersSynced: number;
  usersUpdated: number;
  usersCreated: number;
  errors?: string;
  duration?: number;
  syncAt: string;
}

export default function ActiveDirectoryConfig() {
  const { language, t } = useLanguage();
  const [config, setConfig] = useState<ADConfig | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);
  const [showConfigForm, setShowConfigForm] = useState(false);
  const [formData, setFormData] = useState({
    domain: '',
    serverUrl: '',
    username: '',
    password: '',
    baseDn: '',
    userFilter: '',
    syncInterval: 3600
  });

  const texts = {
    title: language === 'zh-TW' ? 'Active Directory 設定' : 
           language === 'zh-CN' ? 'Active Directory 设置' : 
           'Active Directory Configuration',
    subtitle: language === 'zh-TW' ? '設定與管理 Active Directory 同步' : 
              language === 'zh-CN' ? '设定与管理 Active Directory 同步' : 
              'Configure and manage Active Directory synchronization',
    configure: language === 'zh-TW' ? '設定 AD 連接' : 
               language === 'zh-CN' ? '设定 AD 连接' : 
               'Configure AD Connection',
    domain: language === 'zh-TW' ? '網域' : '域名',
    serverUrl: language === 'zh-TW' ? '伺服器位址' : '服务器地址',
    username: language === 'zh-TW' ? '使用者名稱' : '用户名',
    password: language === 'zh-TW' ? '密碼' : '密码',
    baseDn: language === 'zh-TW' ? '基礎 DN' : '基础 DN',
    userFilter: language === 'zh-TW' ? '使用者篩選' : '用户筛选',
    syncInterval: language === 'zh-TW' ? '同步間隔 (秒)' : '同步间隔 (秒)',
    saveConfig: language === 'zh-TW' ? '儲存設定' : '保存设置',
    syncNow: language === 'zh-TW' ? '立即同步' : '立即同步',
    deleteConfig: language === 'zh-TW' ? '刪除設定' : '删除设置',
    lastSync: language === 'zh-TW' ? '上次同步' : '上次同步',
    status: language === 'zh-TW' ? '狀態' : '状态',
    active: language === 'zh-TW' ? '啟用' : '启用',
    inactive: language === 'zh-TW' ? '停用' : '停用',
    syncLogs: language === 'zh-TW' ? '同步記錄' : '同步记录',
    usersSynced: language === 'zh-TW' ? '同步使用者' : '同步用户',
    usersUpdated: language === 'zh-TW' ? '更新使用者' : '更新用户',
    usersCreated: language === 'zh-TW' ? '建立使用者' : '创建用户',
    duration: language === 'zh-TW' ? '耗時' : '耗时',
    errors: language === 'zh-TW' ? '錯誤' : '错误',
    success: language === 'zh-TW' ? '成功' : '成功',
    error: language === 'zh-TW' ? '錯誤' : '错误',
    running: language === 'zh-TW' ? '執行中' : '执行中',
    notConfigured: language === 'zh-TW' ? '未設定' : '未设定',
    configured: language === 'zh-TW' ? '已設定' : '已设定',
    confirmDelete: language === 'zh-TW' ? '確定要刪除此設定嗎？' : '确定要删除此设定吗？'
  };

  useEffect(() => {
    fetchConfig();
  }, []);

  const fetchConfig = async () => {
    try {
      const response = await fetch('/api/active-directory/config');
      const data = await response.json();
      
      if (data.configured) {
        setConfig(data.config);
        setSyncLogs(data.config.syncLogs || []);
      }
    } catch (error) {
      console.error('Error fetching AD config:', error);
    }
  };

  const handleSaveConfig = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/active-directory/config', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();
      
      if (response.ok) {
        setConfig(data.config);
        setShowConfigForm(false);
        fetchConfig();
      } else {
        alert(data.error || 'Failed to save configuration');
      }
    } catch (error) {
      console.error('Error saving config:', error);
      alert('Failed to save configuration');
    } finally {
      setLoading(false);
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/active-directory/sync', {
        method: 'POST'
      });

      const data = await response.json();
      
      if (response.ok) {
        alert('Synchronization completed successfully!');
        fetchConfig();
      } else {
        alert(data.error || 'Failed to synchronize');
      }
    } catch (error) {
      console.error('Error syncing:', error);
      alert('Failed to synchronize');
    } finally {
      setSyncing(false);
    }
  };

  const handleDeleteConfig = async () => {
    if (!confirm(texts.confirmDelete)) return;

    try {
      const response = await fetch('/api/active-directory/config', {
        method: 'DELETE'
      });

      if (response.ok) {
        setConfig(null);
        setSyncLogs([]);
        setShowConfigForm(false);
      } else {
        alert('Failed to delete configuration');
      }
    } catch (error) {
      console.error('Error deleting config:', error);
      alert('Failed to delete configuration');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'bg-green-500';
      case 'error': return 'bg-red-500';
      case 'running': return 'bg-blue-500';
      default: return 'bg-gray-500';
    }
  };

  const formatDuration = (ms?: number) => {
    if (!ms) return '-';
    return `${ms}ms`;
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return '-';
    return new Date(dateString).toLocaleString();
  };

  if (!config) {
    return (
      <div className="space-y-6">
        <div className="text-center py-12">
          <Building2 className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            {texts.notConfigured}
          </h3>
          <p className="text-gray-600 mb-6">
            {language === 'zh-TW' ? '設定 Active Directory 連接以開始自動同步員工名片' : 
             language === 'zh-CN' ? '设定 Active Directory 连接以开始自动同步员工名片' : 
             'Configure Active Directory connection to start automatic employee card synchronization'}
          </p>
          <Button onClick={() => setShowConfigForm(true)}>
            <Settings className="w-4 h-4 mr-2" />
            {texts.configure}
          </Button>
        </div>

        {showConfigForm && (
          <Card>
            <CardHeader>
              <CardTitle>{texts.configure}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="domain">{texts.domain} *</Label>
                <Input
                  id="domain"
                  value={formData.domain}
                  onChange={(e) => setFormData({...formData, domain: e.target.value})}
                  placeholder="company.com"
                />
              </div>
              <div>
                <Label htmlFor="serverUrl">{texts.serverUrl} *</Label>
                <Input
                  id="serverUrl"
                  value={formData.serverUrl}
                  onChange={(e) => setFormData({...formData, serverUrl: e.target.value})}
                  placeholder="ldap://company.com:389"
                />
              </div>
              <div>
                <Label htmlFor="username">{texts.username} *</Label>
                <Input
                  id="username"
                  value={formData.username}
                  onChange={(e) => setFormData({...formData, username: e.target.value})}
                  placeholder="admin@company.com"
                />
              </div>
              <div>
                <Label htmlFor="password">{texts.password} *</Label>
                <Input
                  id="password"
                  type="password"
                  value={formData.password}
                  onChange={(e) => setFormData({...formData, password: e.target.value})}
                />
              </div>
              <div>
                <Label htmlFor="baseDn">{texts.baseDn} *</Label>
                <Input
                  id="baseDn"
                  value={formData.baseDn}
                  onChange={(e) => setFormData({...formData, baseDn: e.target.value})}
                  placeholder="OU=Users,DC=company,DC=com"
                />
              </div>
              <div>
                <Label htmlFor="userFilter">{texts.userFilter}</Label>
                <Input
                  id="userFilter"
                  value={formData.userFilter}
                  onChange={(e) => setFormData({...formData, userFilter: e.target.value})}
                  placeholder="(objectClass=user)"
                />
              </div>
              <div>
                <Label htmlFor="syncInterval">{texts.syncInterval}</Label>
                <Input
                  id="syncInterval"
                  type="number"
                  value={formData.syncInterval}
                  onChange={(e) => setFormData({...formData, syncInterval: parseInt(e.target.value)})}
                />
              </div>
              <div className="flex gap-2">
                <Button onClick={handleSaveConfig} disabled={loading}>
                  {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                  {texts.saveConfig}
                </Button>
                <Button variant="outline" onClick={() => setShowConfigForm(false)}>
                  {language === 'zh-TW' ? '取消' : language === 'zh-CN' ? '取消' : 'Cancel'}
                </Button>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Configuration Overview */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <Building2 className="w-5 h-5" />
                {texts.configured}: {config.domain}
              </CardTitle>
              <CardDescription>
                {language === 'zh-TW' ? '伺服器' : language === 'zh-CN' ? '服务器' : 'Server'}: {config.serverUrl}
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <Badge className={config.isActive ? 'bg-green-500' : 'bg-gray-500'}>
                {config.isActive ? texts.active : texts.inactive}
              </Badge>
              <Button variant="outline" size="sm" onClick={() => setShowConfigForm(true)}>
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">{config.syncInterval / 60}</div>
              <div className="text-sm text-gray-600">{language === 'zh-TW' ? '分鐘間隔' : language === 'zh-CN' ? '分钟间隔' : 'Minute interval'}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">
                {config.lastSyncAt ? '✓' : '-'}
              </div>
              <div className="text-sm text-gray-600">{texts.lastSync}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">
                {syncLogs.length > 0 ? syncLogs[0].usersSynced : 0}
              </div>
              <div className="text-sm text-gray-600">{texts.usersSynced}</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">
                {syncLogs.filter(log => log.status === 'error').length}
              </div>
              <div className="text-sm text-gray-600">{texts.errors}</div>
            </div>
          </div>
          
          <div className="flex gap-2">
            <Button onClick={handleSync} disabled={syncing}>
              {syncing ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <RefreshCw className="w-4 h-4 mr-2" />}
              {texts.syncNow}
            </Button>
            <Button variant="outline" onClick={() => setShowConfigForm(true)}>
              <Settings className="w-4 h-4 mr-2" />
              {language === 'zh-TW' ? '編輯設定' : language === 'zh-CN' ? '编辑设定' : 'Edit Config'}
            </Button>
            <Button variant="destructive" onClick={handleDeleteConfig}>
              <Trash2 className="w-4 h-4 mr-2" />
              {texts.deleteConfig}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Configuration Form */}
      {showConfigForm && (
        <Card>
          <CardHeader>
            <CardTitle>{language === 'zh-TW' ? '編輯 AD 設定' : language === 'zh-CN' ? '编辑 AD 设定' : 'Edit AD Configuration'}</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="domain">{texts.domain} *</Label>
              <Input
                id="domain"
                value={formData.domain || config.domain}
                onChange={(e) => setFormData({...formData, domain: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="serverUrl">{texts.serverUrl} *</Label>
              <Input
                id="serverUrl"
                value={formData.serverUrl || config.serverUrl}
                onChange={(e) => setFormData({...formData, serverUrl: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="username">{texts.username} *</Label>
              <Input
                id="username"
                value={formData.username}
                onChange={(e) => setFormData({...formData, username: e.target.value})}
                placeholder={language === 'zh-TW' ? '輸入新密碼' : language === 'zh-CN' ? '输入新密码' : 'Enter new password'}
              />
            </div>
            <div>
              <Label htmlFor="password">{texts.password} *</Label>
              <Input
                id="password"
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({...formData, password: e.target.value})}
                placeholder={language === 'zh-TW' ? '輸入新密碼' : language === 'zh-CN' ? '输入新密码' : 'Enter new password'}
              />
            </div>
            <div>
              <Label htmlFor="baseDn">{texts.baseDn} *</Label>
              <Input
                id="baseDn"
                value={formData.baseDn || config.baseDn}
                onChange={(e) => setFormData({...formData, baseDn: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="userFilter">{texts.userFilter}</Label>
              <Input
                id="userFilter"
                value={formData.userFilter || config.userFilter || ''}
                onChange={(e) => setFormData({...formData, userFilter: e.target.value})}
              />
            </div>
            <div>
              <Label htmlFor="syncInterval">{texts.syncInterval}</Label>
              <Input
                id="syncInterval"
                type="number"
                value={formData.syncInterval || config.syncInterval}
                onChange={(e) => setFormData({...formData, syncInterval: parseInt(e.target.value)})}
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={handleSaveConfig} disabled={loading}>
                {loading ? <RefreshCw className="w-4 h-4 mr-2 animate-spin" /> : <CheckCircle className="w-4 h-4 mr-2" />}
                {texts.saveConfig}
              </Button>
              <Button variant="outline" onClick={() => setShowConfigForm(false)}>
                {language === 'zh-TW' ? '取消' : language === 'zh-CN' ? '取消' : 'Cancel'}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Sync Logs */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Activity className="w-5 h-5" />
            {texts.syncLogs}
          </CardTitle>
        </CardHeader>
        <CardContent>
          {syncLogs.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              {language === 'zh-TW' ? '尚無同步記錄' : language === 'zh-CN' ? '尚无同步记录' : 'No sync logs yet'}
            </div>
          ) : (
            <div className="space-y-3">
              {syncLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-3 h-3 rounded-full ${getStatusColor(log.status)}`} />
                    <div>
                      <div className="font-medium">{log.message}</div>
                      <div className="text-sm text-gray-500">{formatDate(log.syncAt)}</div>
                    </div>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <div className="flex items-center gap-1">
                      <Users className="w-4 h-4" />
                      {log.usersSynced}
                    </div>
                    <div className="text-green-600">+{log.usersCreated}</div>
                    <div className="text-blue-600">↑{log.usersUpdated}</div>
                    {log.errors && JSON.parse(log.errors).length > 0 && (
                      <div className="text-red-600">
                        {JSON.parse(log.errors).length} {texts.errors}
                      </div>
                    )}
                    <div className="text-gray-500">{formatDuration(log.duration)}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}