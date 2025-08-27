'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { 
  Calendar as CalendarIcon, 
  ExternalLink, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Plus,
  Settings,
  RefreshCw
} from 'lucide-react';

interface CalendarIntegrationProps {
  userId: string;
  onIntegrationChange?: () => void;
}

interface CalendarProvider {
  id: string;
  name: string;
  icon: string;
  description: string;
  authUrl: string;
}

interface CalendarIntegrationData {
  id: string;
  provider: string;
  isActive: boolean;
  calendarId?: string;
  createdAt: string;
}

const calendarProviders: CalendarProvider[] = [
  {
    id: 'google',
    name: 'Google Calendar',
    icon: '📅',
    description: '連接到您的Google Calendar帳戶',
    authUrl: '/api/calendar/google/auth'
  },
  {
    id: 'outlook',
    name: 'Outlook Calendar',
    icon: '📧',
    description: '連接到您的Outlook Calendar帳戶',
    authUrl: '/api/calendar/outlook/auth'
  },
  {
    id: 'apple',
    name: 'Apple Calendar',
    icon: '🍎',
    description: '連接到您的Apple Calendar帳戶',
    authUrl: '/api/calendar/apple/auth'
  }
];

export default function CalendarIntegration({ userId, onIntegrationChange }: CalendarIntegrationProps) {
  const [integrations, setIntegrations] = useState<CalendarIntegrationData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const [isConnecting, setIsConnecting] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState<CalendarProvider | null>(null);

  useEffect(() => {
    loadIntegrations();
  }, [userId]);

  const loadIntegrations = async () => {
    try {
      const response = await fetch(`/api/calendar/integrations?userId=${userId}`);
      if (response.ok) {
        const data = await response.json();
        setIntegrations(data);
      } else {
        setError('載入行事曆整合失敗');
      }
    } catch (error) {
      console.error('Failed to load calendar integrations:', error);
      setError('載入行事曆整合失敗');
    } finally {
      setLoading(false);
    }
  };

  const handleConnect = (provider: CalendarProvider) => {
    setSelectedProvider(provider);
    setIsConnecting(true);
    
    // Open OAuth window
    const width = 600;
    const height = 700;
    const left = (window.innerWidth - width) / 2;
    const top = (window.innerHeight - height) / 2;
    
    const authWindow = window.open(
      provider.authUrl,
      'Calendar Auth',
      `width=${width},height=${height},left=${left},top=${top}`
    );

    // Listen for messages from the auth window
    const handleMessage = (event: MessageEvent) => {
      if (event.data.type === 'CALENDAR_AUTH_SUCCESS') {
        authWindow?.close();
        setIsConnecting(false);
        setSelectedProvider(null);
        loadIntegrations();
        if (onIntegrationChange) onIntegrationChange();
        window.removeEventListener('message', handleMessage);
      } else if (event.data.type === 'CALENDAR_AUTH_ERROR') {
        authWindow?.close();
        setIsConnecting(false);
        setSelectedProvider(null);
        setError(event.data.message || '連接失敗');
        window.removeEventListener('message', handleMessage);
      }
    };

    window.addEventListener('message', handleMessage);
  };

  const handleDisconnect = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/calendar/integrations/${integrationId}`, {
        method: 'DELETE'
      });

      if (response.ok) {
        await loadIntegrations();
        if (onIntegrationChange) onIntegrationChange();
      } else {
        setError('斷開連接失敗');
      }
    } catch (error) {
      console.error('Failed to disconnect calendar:', error);
      setError('斷開連接失敗');
    }
  };

  const handleSyncNow = async (integrationId: string) => {
    try {
      const response = await fetch(`/api/calendar/sync/${integrationId}`, {
        method: 'POST'
      });

      if (response.ok) {
        // Show success message
        const data = await response.json();
        alert(`同步完成！已同步 ${data.syncedCount} 個預約`);
      } else {
        setError('同步失敗');
      }
    } catch (error) {
      console.error('Failed to sync calendar:', error);
      setError('同步失敗');
    }
  };

  const getProviderIcon = (providerId: string) => {
    const provider = calendarProviders.find(p => p.id === providerId);
    return provider?.icon || '📅';
  };

  const getProviderName = (providerId: string) => {
    const provider = calendarProviders.find(p => p.id === providerId);
    return provider?.name || providerId;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-32">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold flex items-center gap-2">
            <CalendarIcon className="w-5 h-5" />
            行事曆整合
          </h2>
          <p className="text-gray-600 text-sm">連接您的行事曆以自動同步預約</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {/* Available Providers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Plus className="w-4 h-4" />
            可用的行事曆服務
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {calendarProviders.map((provider) => {
              const isConnected = integrations.some(int => int.provider === provider.id);
              
              return (
                <Card key={provider.id} className="border-2 hover:border-gray-300 transition-colors">
                  <CardContent className="p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center gap-2">
                        <span className="text-2xl">{provider.icon}</span>
                        <h3 className="font-semibold">{provider.name}</h3>
                      </div>
                      {isConnected && (
                        <Badge variant="secondary" className="bg-green-100 text-green-800">
                          已連接
                        </Badge>
                      )}
                    </div>
                    
                    <p className="text-sm text-gray-600 mb-4">{provider.description}</p>
                    
                    <div className="flex gap-2">
                      {isConnected ? (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const integration = integrations.find(int => int.provider === provider.id);
                            if (integration) handleDisconnect(integration.id);
                          }}
                          className="flex-1"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          斷開連接
                        </Button>
                      ) : (
                        <Button
                          onClick={() => handleConnect(provider)}
                          size="sm"
                          className="flex-1"
                          disabled={isConnecting}
                        >
                          <Plus className="w-4 h-4 mr-1" />
                          連接
                        </Button>
                      )}
                      
                      {isConnected && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            const integration = integrations.find(int => int.provider === provider.id);
                            if (integration) handleSyncNow(integration.id);
                          }}
                        >
                          <RefreshCw className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Connected Integrations */}
      {integrations.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="w-4 h-4" />
              已連接的行事曆
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {integrations.map((integration) => (
                <div key={integration.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <span className="text-xl">{getProviderIcon(integration.provider)}</span>
                    <div>
                      <h4 className="font-medium">{getProviderName(integration.provider)}</h4>
                      <p className="text-sm text-gray-600">
                        連接於 {new Date(integration.createdAt).toLocaleDateString('zh-TW')}
                      </p>
                      {integration.calendarId && (
                        <p className="text-xs text-gray-500">
                          行事曆ID: {integration.calendarId}
                        </p>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Badge variant={integration.isActive ? "default" : "secondary"}>
                      {integration.isActive ? "啟用" : "停用"}
                    </Badge>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSyncNow(integration.id)}
                    >
                      <RefreshCw className="w-4 h-4" />
                    </Button>
                    
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleDisconnect(integration.id)}
                    >
                      <XCircle className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Connection Status */}
      {isConnecting && selectedProvider && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
              <h3 className="font-semibold mb-2">正在連接到 {selectedProvider.name}</h3>
              <p className="text-gray-600 text-sm">
                請在彈出的視窗中完成授權流程...
              </p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Info Section */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-blue-500 mt-0.5" />
            <div>
              <h4 className="font-medium text-blue-900 mb-1">行事曆整合功能說明</h4>
              <ul className="text-sm text-blue-700 space-y-1">
                <li>• 連接後，新的預約會自動添加到您的行事曆</li>
                <li>• 預約狀態變更時會同步更新行事曆事件</li>
                <li>• 支援Google Calendar、Outlook Calendar和Apple Calendar</li>
                <li>• 可以隨時手動同步或斷開連接</li>
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}