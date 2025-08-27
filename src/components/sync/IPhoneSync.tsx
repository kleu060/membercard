'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Smartphone, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Upload,
  Settings,
  Clock,
  Users,
  FileText
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SyncConfig {
  id: string;
  cardDavUrl: string;
  syncInterval: number;
  syncDirection: string;
  autoSync: boolean;
  isActive: boolean;
  lastSyncAt?: string;
}

interface SyncLog {
  id: string;
  status: string;
  message: string;
  contactsSynced: number;
  contactsCreated: number;
  contactsUpdated: number;
  duration?: number;
  syncAt: string;
}

interface SyncStats {
  totalIPhoneCards: number;
  isConfigured: boolean;
  isActive: boolean;
  lastSync?: string;
}

export default function IPhoneSync() {
  const [config, setConfig] = useState<SyncConfig | null>(null);
  const [syncLogs, setSyncLogs] = useState<SyncLog[]>([]);
  const [stats, setStats] = useState<SyncStats | null>(null);
  const [syncing, setSyncing] = useState(false);
  const [syncResult, setSyncResult] = useState<{ success: boolean; message: string; count?: number } | null>(null);
  const [loading, setLoading] = useState(true);
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/iphone-sync');
      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
        setSyncLogs(data.config?.syncLogs || []);
        setStats(data.stats);
      }
    } catch (error) {
      console.error('Error fetching iPhone sync status:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSetup = async () => {
    try {
      const response = await fetch('/api/iphone-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'setup',
          data: {
            syncInterval: 3600,
            syncDirection: 'both',
            autoSync: false
          }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
        setStats(data.stats);
        setSyncResult({ success: true, message: data.message });
        fetchSyncStatus();
      }
    } catch (error) {
      console.error('Error setting up iPhone sync:', error);
      setSyncResult({ success: false, message: 'Setup failed' });
    }
  };

  const handleSync = async () => {
    setSyncing(true);
    try {
      const response = await fetch('/api/iphone-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'sync',
          data: { direction: 'both' }
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSyncResult({ 
          success: true, 
          message: data.message, 
          count: data.totalSynced 
        });
        fetchSyncStatus();
      }
    } catch (error) {
      console.error('Error syncing iPhone contacts:', error);
      setSyncResult({ success: false, message: 'Sync failed' });
    } finally {
      setSyncing(false);
    }
  };

  const handleUpdateConfig = async (updates: any) => {
    try {
      const response = await fetch('/api/iphone-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'updateConfig',
          data: updates
        })
      });

      if (response.ok) {
        const data = await response.json();
        setConfig(data.config);
        setSyncResult({ success: true, message: data.message });
        fetchSyncStatus();
      }
    } catch (error) {
      console.error('Error updating config:', error);
      setSyncResult({ success: false, message: 'Update failed' });
    }
  };

  const handleGenerateVCard = async () => {
    try {
      const response = await fetch('/api/iphone-sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'generateVCard',
          data: {}
        })
      });

      if (response.ok) {
        const data = await response.json();
        // Download vCard file
        const blob = new Blob([data.vCardContent], { type: 'text/vcard' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'contacts.vcf';
        a.click();
        URL.revokeObjectURL(url);
        
        setSyncResult({ success: true, message: data.message, count: data.count });
      }
    } catch (error) {
      console.error('Error generating vCard:', error);
      setSyncResult({ success: false, message: 'vCard generation failed' });
    }
  };

  const texts = {
    title: t('sync.iphone.setup'),
    subtitle: t('sync.iphone.notConfigured'),
    setup: t('sync.iphone.setup'),
    sync: t('sync.iphone.sync'),
    syncing: t('sync.iphone.syncing'),
    autoSync: t('sync.iphone.autoSync'),
    isActive: t('sync.iphone.isActive'),
    syncDirection: t('sync.iphone.syncDirection'),
    syncInterval: t('sync.iphone.syncInterval'),
    lastSync: t('sync.iphone.lastSync'),
    syncSuccess: t('sync.iphone.syncSuccess'),
    syncFailed: t('sync.iphone.syncFailed'),
    contactsSynced: t('sync.iphone.contactsSynced'),
    notConfigured: t('sync.iphone.notConfigured'),
    generateVCard: t('sync.iphone.generateVCard'),
    importVCard: t('sync.iphone.importVCard'),
    setupInstructions: t('sync.iphone.setupInstructions'),
    serverUrl: t('sync.iphone.serverUrl'),
    username: t('sync.iphone.username'),
    password: t('sync.iphone.password'),
    iphoneSetup: t('sync.iphone.iphoneSetup'),
    step1: t('sync.iphone.step1'),
    step2: t('sync.iphone.step2'),
    step3: t('sync.iphone.step3'),
    step4: t('sync.iphone.step4'),
    step5: t('sync.iphone.step5'),
    directionBoth: t('sync.iphone.directionBoth'),
    directionImport: t('sync.iphone.directionImport'),
    directionExport: t('sync.iphone.directionExport'),
    interval1h: t('sync.iphone.interval1h'),
    interval6h: t('sync.iphone.interval6h'),
    interval24h: t('sync.iphone.interval24h'),
    interval7d: t('sync.iphone.interval7d'),
    contactsSyncedCount: t('sync.iphone.contactsSyncedCount'),
    totalContacts: t('sync.iphone.totalContacts'),
    setupFailed: t('sync.iphone.setupFailed'),
    syncFailedMessage: t('sync.iphone.syncFailedMessage'),
    vCardFailed: t('sync.iphone.vCardFailed'),
    updateFailed: t('sync.iphone.updateFailed'),
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">{texts.syncing}</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{texts.title}</h1>
        <p className="text-gray-600">{texts.subtitle}</p>
      </div>

      {/* Sync Status Card */}
      <Card className="mb-6">
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-lg bg-gray-800 text-white">
                <Smartphone className="w-6 h-6" />
              </div>
              <div>
                <CardTitle className="text-lg">{texts.title}</CardTitle>
                <CardDescription>
                  {stats?.isConfigured ? 
                    `${stats.totalIPhoneCards} ${t('sync.iphone.contactsSyncedCount')}` :
                    texts.notConfigured
                  }
                </CardDescription>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge 
                variant={stats?.isActive ? "default" : "secondary"}
                className={stats?.isActive ? "bg-green-500" : ""}
              >
                {stats?.isActive ? texts.isActive : texts.notConfigured}
              </Badge>
              {stats?.lastSync && (
                <div className="text-sm text-gray-500 flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  {new Date(stats.lastSync).toLocaleString()}
                </div>
              )}
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {!stats?.isConfigured ? (
                <Button onClick={handleSetup} className="flex items-center gap-2">
                  <Settings className="w-4 h-4" />
                  {texts.setup}
                </Button>
              ) : (
                <>
                  <Button 
                    onClick={handleSync} 
                    disabled={syncing || !stats?.isActive}
                    className="flex items-center gap-2"
                  >
                    <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
                    {syncing ? texts.syncing : texts.sync}
                  </Button>
                  <Button 
                    onClick={handleGenerateVCard}
                    variant="outline"
                    className="flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    {texts.generateVCard}
                  </Button>
                </>
              )}
            </div>
            <div className="text-sm text-gray-500">
              {stats?.totalIPhoneCards || 0} {t('sync.iphone.totalContacts')}
            </div>
          </div>

          {/* Sync Result */}
          {syncResult && (
            <div className={`mt-4 p-3 rounded-lg ${
              syncResult.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-2">
                {syncResult.success ? (
                  <CheckCircle className="w-4 h-4 text-green-600" />
                ) : (
                  <XCircle className="w-4 h-4 text-red-600" />
                )}
                <span className={`text-sm ${
                  syncResult.success ? 'text-green-800' : 'text-red-800'
                }`}>
                  {syncResult.message}
                </span>
              </div>
              {syncResult.count && (
                <p className="text-xs text-green-700 mt-1">
                  {texts.contactsSynced.replace('{count}', syncResult.count.toString())}
                </p>
              )}
            </div>
          )}
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Configuration Panel */}
        {config && (
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Settings className="w-5 h-5" />
                {texts.setupInstructions}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Server Info */}
              <div className="space-y-2">
                <Label className="text-sm font-medium">{texts.serverUrl}</Label>
                <Input value={config.cardDavUrl} readOnly className="bg-gray-50" />
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{texts.username}</Label>
                  <Input value={config.cardDavUrl.split('/').pop() || ''} readOnly className="bg-gray-50" />
                </div>
                <div className="space-y-2">
                  <Label className="text-sm font-medium">{texts.password}</Label>
                  <Input type="password" value="your-api-key" readOnly className="bg-gray-50" />
                </div>
              </div>

              {/* Sync Settings */}
              <div className="space-y-4 pt-4 border-t">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{texts.isActive}</Label>
                  <Switch
                    checked={config.isActive}
                    onCheckedChange={(checked) => handleUpdateConfig({ isActive: checked })}
                  />
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{texts.syncDirection}</Label>
                  <Select 
                    value={config.syncDirection} 
                    onValueChange={(value) => handleUpdateConfig({ syncDirection: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="both">{texts.directionBoth}</SelectItem>
                      <SelectItem value="import">{texts.directionImport}</SelectItem>
                      <SelectItem value="export">{texts.directionExport}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium">{texts.syncInterval}</Label>
                  <Select 
                    value={config.syncInterval.toString()} 
                    onValueChange={(value) => handleUpdateConfig({ syncInterval: parseInt(value) })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="3600">{texts.interval1h}</SelectItem>
                      <SelectItem value="21600">{texts.interval6h}</SelectItem>
                      <SelectItem value="86400">{texts.interval24h}</SelectItem>
                      <SelectItem value="604800">{texts.interval7d}</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium">{texts.autoSync}</Label>
                  <Switch
                    checked={config.autoSync}
                    onCheckedChange={(checked) => handleUpdateConfig({ autoSync: checked })}
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {/* iPhone Setup Guide */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Smartphone className="w-5 h-5" />
              {texts.iphoneSetup}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  1
                </div>
                <div>
                  <p className="font-medium">{texts.step1}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'zh-TW' ? '在 iPhone 上打開「設置」應用' : 
                     language === 'zh-CN' ? '在 iPhone 上打开「设置」应用' : 
                     'Open the Settings app on your iPhone'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  2
                </div>
                <div>
                  <p className="font-medium">{texts.step2}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'zh-TW' ? '向下滾動並點擊「聯絡人」，然後點擊「帳戶」' : 
                     language === 'zh-CN' ? '向下滚动并点击「通讯录」，然后点击「账户」' : 
                     'Scroll down and tap Contacts, then tap Accounts'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  3
                </div>
                <div>
                  <p className="font-medium">{texts.step3}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'zh-TW' ? '點擊「新增帳戶」' : 
                     language === 'zh-CN' ? '点击「添加账户」' : 
                     'Tap Add Account'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  4
                </div>
                <div>
                  <p className="font-medium">{texts.step4}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'zh-TW' ? '選擇「其他」，然後選擇「CardDAV 帳戶」' : 
                     language === 'zh-CN' ? '选择「其他」，然后选择「CardDAV 账户」' : 
                     'Choose Other, then select CardDAV Account'}
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-sm font-medium">
                  5
                </div>
                <div>
                  <p className="font-medium">{texts.step5}</p>
                  <p className="text-sm text-gray-600">
                    {language === 'zh-TW' ? '輸入伺服器資訊（如左側所示）並點擊「下一步」完成設置' : 
                     language === 'zh-CN' ? '输入服务器信息（如左侧所示）并点击「下一步」完成设置' : 
                     'Enter server info (as shown left) and tap Next to complete setup'}
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Sync Logs */}
      {syncLogs.length > 0 && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="w-5 h-5" />
              {language === 'zh-TW' ? '同步記錄' : language === 'zh-CN' ? '同步记录' : 'Sync Logs'}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {syncLogs.map((log) => (
                <div key={log.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    {log.status === 'success' ? (
                      <CheckCircle className="w-4 h-4 text-green-600" />
                    ) : log.status === 'error' ? (
                      <XCircle className="w-4 h-4 text-red-600" />
                    ) : (
                      <AlertCircle className="w-4 h-4 text-yellow-600" />
                    )}
                    <div>
                      <p className="text-sm font-medium">{log.message}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(log.syncAt).toLocaleString()}
                        {log.duration && ` • ${log.duration}ms`}
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium">
                      {log.contactsSynced} {language === 'zh-TW' ? '個聯絡人' : language === 'zh-CN' ? '个联系人' : 'contacts'}
                    </p>
                    <p className="text-xs text-gray-500">
                      {log.contactsCreated} {language === 'zh-TW' ? '新增' : language === 'zh-CN' ? '新增' : 'created'}, 
                      {log.contactsUpdated} {language === 'zh-TW' ? '更新' : language === 'zh-CN' ? '更新' : 'updated'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}