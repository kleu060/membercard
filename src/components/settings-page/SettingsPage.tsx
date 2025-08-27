'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Mail, Bell, Save, User } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/user';
import { toast } from 'sonner';

interface SettingsData {
  email: string;
  visibility: boolean;
  jobOpportunitiesNotification: boolean;
}

export default function SettingsPage() {
  const { user } = useAuth();
  const [settings, setSettings] = useState<SettingsData>({
    email: '',
    visibility: true,
    jobOpportunitiesNotification: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const response = await fetch('/api/settings');
      if (response.ok) {
        const data = await response.json();
        setSettings(data);
      }
    } catch (error) {
      console.error('Error fetching settings:', error);
      toast.error('Failed to load settings');
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async () => {
    try {
      const response = await fetch('/api/settings', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(settings),
      });
      if (response.ok) {
        toast.success('Settings updated successfully');
        // Refresh user data if email changed
        if (settings.email !== user?.email) {
          // In JWT auth, we might need to re-authenticate or update token
          window.location.reload(); // Simple refresh for now
        }
      }
    } catch (error) {
      console.error('Error updating settings:', error);
      toast.error('Failed to update settings');
    }
  };

  const handleSave = () => {
    updateSettings();
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

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Settings className="h-5 w-5" />
              Settings
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="flex items-center gap-2">
                <Mail className="h-4 w-4" />
                Email Address
              </Label>
              <Input
                id="email"
                type="email"
                value={settings.email}
                onChange={(e) => setSettings({ ...settings, email: e.target.value })}
              />
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Bell className="h-4 w-4" />
                Job Opportunities Notification
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="jobOpportunitiesNotification"
                  checked={settings.jobOpportunitiesNotification}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, jobOpportunitiesNotification: checked })
                  }
                />
                <Label htmlFor="jobOpportunitiesNotification">
                  {settings.jobOpportunitiesNotification ? 'Enabled' : 'Disabled'}
                </Label>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="flex items-center gap-2">
                <Save className="h-4 w-4" />
                Profile Visibility
              </Label>
              <div className="flex items-center space-x-2">
                <Switch
                  id="visibility"
                  checked={settings.visibility}
                  onCheckedChange={(checked) =>
                    setSettings({ ...settings, visibility: checked })
                  }
                />
                <Label htmlFor="visibility">
                  {settings.visibility ? 'Visible' : 'Hidden'}
                </Label>
              </div>
            </div>

            <Button onClick={handleSave} className="w-full">
              Save Settings
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}