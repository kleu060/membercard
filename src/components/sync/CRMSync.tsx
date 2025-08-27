'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { 
  Cloud, 
  Users, 
  Mail, 
  Building2, 
  RefreshCw, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Download,
  Upload,
  Settings
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ConnectedPlatform {
  provider: string;
  connected: boolean;
  lastSync?: string;
  autoSync: boolean;
}

export default function CRMSync() {
  const [platforms, setPlatforms] = useState<ConnectedPlatform[]>([
    { provider: 'google', connected: false, autoSync: false },
    { provider: 'outlook', connected: false, autoSync: false },
    { provider: 'salesforce', connected: false, autoSync: false },
    { provider: 'iphone', connected: false, autoSync: false }
  ]);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [syncResults, setSyncResults] = useState<{[key: string]: { success: boolean; message: string; count?: number } }>({});
  const { language, t } = useLanguage();

  useEffect(() => {
    fetchSyncStatus();
  }, []);

  const fetchSyncStatus = async () => {
    try {
      const response = await fetch('/api/sync');
      if (response.ok) {
        const data = await response.json();
        const connectedPlatforms = data.connectedPlatforms || [];
        
        setPlatforms(prev => prev.map(platform => ({
          ...platform,
          connected: connectedPlatforms.includes(platform.provider)
        })));
      }

      // Check iPhone sync status separately
      const iphoneResponse = await fetch('/api/iphone-sync');
      if (iphoneResponse.ok) {
        const iphoneData = await iphoneResponse.json();
        setPlatforms(prev => prev.map(platform => 
          platform.provider === 'iphone' 
            ? { ...platform, connected: iphoneData.stats?.isConfigured || false }
            : platform
        ));
      }
    } catch (error) {
      console.error('Error fetching sync status:', error);
    }
  };

  const handleConnect = async (platform: string) => {
    try {
      if (platform === 'iphone') {
        // Special handling for iPhone sync setup
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
          setPlatforms(prev => prev.map(p => 
            p.provider === platform ? { ...p, connected: true } : p
          ));
          setSyncResults(prev => ({
            ...prev,
            [platform]: { 
              success: true, 
              message: data.message,
              setupInstructions: data.setupInstructions
            }
          }));
        }
      } else {
        // Mock OAuth flow - in real app, this would redirect to OAuth provider
        const mockData = {
          providerAccountId: `${platform}_user_${Date.now()}`,
          accessToken: 'mock_access_token',
          refreshToken: 'mock_refresh_token',
          expiresAt: Date.now() + 3600000, // 1 hour
          scope: 'contacts.read contacts.write'
        };

        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform,
            action: 'connect',
            data: mockData
          })
        });

        if (response.ok) {
          setPlatforms(prev => prev.map(p => 
            p.provider === platform ? { ...p, connected: true } : p
          ));
          setSyncResults(prev => ({
            ...prev,
            [platform]: { success: true, message: 'Connected successfully' }
          }));
        }
      }
    } catch (error) {
      console.error('Error connecting platform:', error);
      setSyncResults(prev => ({
        ...prev,
        [platform]: { success: false, message: 'Connection failed' }
      }));
    }
  };

  const handleDisconnect = async (platform: string) => {
    try {
      if (platform === 'iphone') {
        const response = await fetch('/api/iphone-sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'updateConfig',
            data: { isActive: false }
          })
        });

        if (response.ok) {
          setPlatforms(prev => prev.map(p => 
            p.provider === platform ? { ...p, connected: false, autoSync: false } : p
          ));
          setSyncResults(prev => ({
            ...prev,
            [platform]: { success: true, message: 'Disconnected successfully' }
          }));
        }
      } else {
        const response = await fetch('/api/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            platform,
            action: 'disconnect'
          })
        });

        if (response.ok) {
          setPlatforms(prev => prev.map(p => 
            p.provider === platform ? { ...p, connected: false, autoSync: false } : p
          ));
          setSyncResults(prev => ({
            ...prev,
            [platform]: { success: true, message: 'Disconnected successfully' }
          }));
        }
      }
    } catch (error) {
      console.error('Error disconnecting platform:', error);
    }
  };

  const handleSync = async (platform: string) => {
    setSyncing(platform);
    try {
      const response = await fetch('/api/sync', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          platform,
          action: 'sync'
        })
      });

      if (response.ok) {
        const data = await response.json();
        setSyncResults(prev => ({
          ...prev,
          [platform]: { 
            success: true, 
            message: data.message, 
            count: data.syncedCount || data.totalSynced 
          }
        }));
      }
    } catch (error) {
      console.error('Error syncing platform:', error);
      setSyncResults(prev => ({
        ...prev,
        [platform]: { success: false, message: 'Sync failed' }
      }));
    } finally {
      setSyncing(null);
    }
  };

  const handleAutoSyncToggle = (platform: string, checked: boolean) => {
    setPlatforms(prev => prev.map(p => 
      p.provider === platform ? { ...p, autoSync: checked } : p
    ));
  };

  const getPlatformInfo = (platform: string) => {
    const info = {
      google: {
        name: t('sync.crm.googleContacts'),
        description: t('sync.crm.googleContactsDesc'),
        icon: <Users className="w-6 h-6" />,
        color: 'bg-blue-500'
      },
      outlook: {
        name: t('sync.crm.outlook'),
        description: t('sync.crm.outlookDesc'),
        icon: <Mail className="w-6 h-6" />,
        color: 'bg-blue-600'
      },
      salesforce: {
        name: t('sync.crm.salesforce'),
        description: t('sync.crm.salesforceDesc'),
        icon: <Building2 className="w-6 h-6" />,
        color: 'bg-green-600'
      },
      iphone: {
        name: t('sync.crm.iphoneContacts'),
        description: t('sync.crm.iphoneContactsDesc'),
        icon: <RefreshCw className="w-6 h-6" />,
        color: 'bg-gray-800'
      }
    };

    return info[platform as keyof typeof info] || info.google;
  };

  const texts = {
    title: t('sync.crm.settings'),
    subtitle: t('sync.crm.platformsConnectedDesc'),
    connect: t('sync.crm.connect'),
    disconnect: t('sync.crm.disconnect'),
    sync: t('sync.crm.sync'),
    syncing: t('sync.crm.syncing'),
    autoSync: t('sync.crm.autoSync'),
    connected: t('sync.crm.connected'),
    disconnected: t('sync.crm.disconnected'),
    lastSync: t('sync.crm.lastSync'),
    syncSuccess: t('sync.crm.syncSuccess'),
    syncFailed: t('sync.crm.syncFailed'),
    contactsSynced: t('sync.crm.contactsSynced'),
    noPlatforms: t('sync.crm.noPlatforms'),
    syncAll: t('sync.crm.syncAll'),
    settings: t('sync.crm.settings'),
    setupInstructions: t('sync.crm.setupInstructions'),
    serverUrl: t('sync.crm.serverUrl'),
    username: t('sync.crm.username'),
    password: t('sync.crm.password'),
    iphoneSetup: t('sync.crm.iphoneSetup'),
    connectSuccess: t('sync.crm.connectSuccess'),
    disconnectSuccess: t('sync.crm.disconnectSuccess'),
    syncSuccessMessage: t('sync.crm.syncSuccessMessage'),
    syncFailedMessage: t('sync.crm.syncFailedMessage'),
    connectionFailed: t('sync.crm.connectionFailed'),
    platformsConnectedDesc: t('sync.crm.platformsConnectedDesc'),
  };

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{texts.title}</h1>
        <p className="text-gray-600">{texts.subtitle}</p>
      </div>

      {/* Sync All Button */}
      <Card className="mb-6">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Cloud className="w-6 h-6 text-blue-600" />
              <div>
                <h3 className="text-lg font-semibold">{texts.syncAll}</h3>
                <p className="text-sm text-gray-600">
                  {platforms.filter(p => p.connected).length} {t('common.platformsConnected')}
                </p>
              </div>
            </div>
            <Button
              onClick={() => platforms.filter(p => p.connected).forEach(p => handleSync(p.provider))}
              disabled={platforms.filter(p => p.connected).length === 0 || !!syncing}
              className="flex items-center gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${syncing ? 'animate-spin' : ''}`} />
              {syncing ? texts.syncing : texts.sync}
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Platform Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {platforms.map((platform) => {
          const platformInfo = getPlatformInfo(platform.provider);
          const result = syncResults[platform.provider];

          return (
            <Card key={platform.provider} className="relative">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`p-2 rounded-lg ${platformInfo.color} text-white`}>
                      {platformInfo.icon}
                    </div>
                    <div>
                      <CardTitle className="text-lg">{platformInfo.name}</CardTitle>
                      <CardDescription className="text-sm">
                        {platform.connected ? texts.connected : texts.disconnected}
                      </CardDescription>
                    </div>
                  </div>
                  <Badge 
                    variant={platform.connected ? "default" : "secondary"}
                    className={platform.connected ? "bg-green-500" : ""}
                  >
                    {platform.connected ? texts.connected : texts.disconnected}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <p className="text-sm text-gray-600">{platformInfo.description}</p>

                {/* Sync Status */}
                {result && (
                  <div className={`p-3 rounded-lg ${
                    result.success ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
                  }`}>
                    <div className="flex items-center gap-2">
                      {result.success ? (
                        <CheckCircle className="w-4 h-4 text-green-600" />
                      ) : (
                        <XCircle className="w-4 h-4 text-red-600" />
                      )}
                      <span className={`text-sm ${
                        result.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {result.message}
                      </span>
                    </div>
                    {result.count && (
                      <p className="text-xs text-green-700 mt-1">
                        {texts.contactsSynced.replace('{count}', result.count.toString())}
                      </p>
                    )}
                  </div>
                )}

                {/* iPhone Setup Instructions */}
                {platform.provider === 'iphone' && result?.setupInstructions && (
                  <div className="p-3 rounded-lg bg-blue-50 border border-blue-200">
                    <div className="flex items-center gap-2 mb-2">
                      <Settings className="w-4 h-4 text-blue-600" />
                      <span className="text-sm font-medium text-blue-800">
                        {t('sync.crm.iphoneSetup')}
                      </span>
                    </div>
                    <div className="text-xs text-blue-700 space-y-1">
                      <p><strong>{t('sync.crm.serverUrl')}:</strong> {result.setupInstructions.cardDavUrl}</p>
                      <p><strong>{t('sync.crm.username')}:</strong> {result.setupInstructions.username}</p>
                      <p><strong>{t('sync.crm.password')}:</strong> {result.setupInstructions.password}</p>
                      <p className="mt-2 text-blue-600">
                        {t('sync.crm.iphoneSetupDesc')}
                      </p>
                    </div>
                  </div>
                )}

                {/* Actions */}
                <div className="space-y-3">
                  {platform.connected ? (
                    <>
                      <div className="flex items-center justify-between">
                        <span className="text-sm font-medium">{texts.autoSync}</span>
                        <Switch
                          checked={platform.autoSync}
                          onCheckedChange={(checked) => handleAutoSyncToggle(platform.provider, checked)}
                        />
                      </div>
                      <div className="flex gap-2">
                        <Button
                          onClick={() => handleSync(platform.provider)}
                          disabled={syncing === platform.provider}
                          size="sm"
                          className="flex-1"
                        >
                          {syncing === platform.provider ? (
                            <RefreshCw className="w-4 h-4 animate-spin" />
                          ) : (
                            <RefreshCw className="w-4 h-4" />
                          )}
                          {syncing === platform.provider ? texts.syncing : texts.sync}
                        </Button>
                        <Button
                          onClick={() => handleDisconnect(platform.provider)}
                          size="sm"
                          variant="outline"
                          className="flex items-center gap-1"
                        >
                          <XCircle className="w-4 h-4" />
                          {texts.disconnect}
                        </Button>
                      </div>
                    </>
                  ) : (
                    <Button
                      onClick={() => handleConnect(platform.provider)}
                      size="sm"
                      className="w-full"
                    >
                      <Upload className="w-4 h-4 mr-2" />
                      {texts.connect}
                    </Button>
                  )}
                </div>

                {/* Last Sync Info */}
                {platform.connected && platform.lastSync && (
                  <div className="text-xs text-gray-500">
                    {texts.lastSync}: {new Date(platform.lastSync).toLocaleString()}
                  </div>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* No Platforms Connected */}
      {platforms.filter(p => p.connected).length === 0 && (
        <Card>
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-500 mb-4">{texts.noPlatforms}</p>
            <p className="text-sm text-gray-400">
              {t('sync.crm.platformsConnectedDesc')}
            </p>
          </CardContent>
        </Card>
      )}
    </div>
  );
}