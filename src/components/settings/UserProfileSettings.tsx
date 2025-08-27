'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { MapPin, Save, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface UserProfileSettingsProps {
  user: any;
  onUpdate?: (user: any) => void;
}

export default function UserProfileSettings({ user, onUpdate }: UserProfileSettingsProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [formData, setFormData] = useState({
    name: user?.name || '',
    location: user?.location || ''
  });

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('/api/user/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess(t('settings.profileUpdateSuccess'));
        onUpdate?.(data.user);
      } else {
        setError(data.error || t('settings.updateError'));
      }
    } catch (error) {
      setError(t('settings.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <User className="w-5 h-5" />
          {t('settings.personalInfo')}
        </CardTitle>
        <CardDescription>
          {t('settings.personalInfoDesc')}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <Alert variant="destructive">
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}
          
          {success && (
            <Alert className="border-green-200 bg-green-50">
              <AlertDescription className="text-green-800">{success}</AlertDescription>
            </Alert>
          )}

          <div className="space-y-2">
            <Label htmlFor="name">{t('settings.name')}</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              placeholder={t('settings.namePlaceholder')}
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="location">{t('settings.location')}</Label>
            <div className="relative">
              <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                id="location"
                value={formData.location}
                onChange={(e) => handleInputChange('location', e.target.value)}
                placeholder={t('settings.locationPlaceholder')}
                className="pl-10"
              />
            </div>
            <p className="text-sm text-gray-500">
              {t('settings.locationDesc')}
            </p>
          </div>

          <div className="flex justify-end pt-4">
            <Button type="submit" disabled={isLoading}>
              <Save className="w-4 h-4 mr-2" />
              {isLoading ? t('settings.saving') : t('settings.saveChanges')}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}