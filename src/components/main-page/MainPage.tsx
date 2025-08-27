'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Home, Briefcase, Settings, User, Bell, Save, Search, Calendar, MapPin, Mail, Phone, FileText, Plus, Edit, Trash2 } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { User } from '@/types/user';
import { toast } from 'sonner';
import JobProfilePage from '@/components/job-profile-page/JobProfilePage';
import SettingsPage from '@/components/settings-page/SettingsPage';

interface NavigationItem {
  name: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function MainPage() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [activeTab, setActiveTab] = useState('overview');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  const navigation: NavigationItem[] = [
    { name: t('dashboard.overview'), href: '/overview', icon: Home },
    { name: t('jobProfile.title'), href: '/job-profile', icon: Briefcase },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

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
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">APEXCARD</span>
            </div>
            <div className="flex items-center space-x-4">
              <nav className="hidden md:flex items-center space-x-6">
                {navigation.map((item) => (
                  <a
                    key={item.name}
                    href={item.href}
                    className={`text-gray-600 hover:text-blue-600 transition-colors ${
                      activeTab === item.name.toLowerCase() ? 'text-blue-600' : ''
                    }`}
                    onClick={(e) => {
                      e.preventDefault();
                      setActiveTab(item.name.toLowerCase());
                    }}
                  >
                    {item.name}
                  </a>
                ))}
              </nav>
              <div className="flex items-center space-x-2">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                  <span className="text-sm text-gray-600">
                    {user?.email?.split('@')[0] || 'User'}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {activeTab === 'overview' && <Overview />}
        {activeTab === 'job profile' && <JobProfilePage />}
        {activeTab === 'settings' && <SettingsPage />}
      </main>
    </div>
  );
}

function Overview() {
  const { user } = useAuth();
  const { t } = useLanguage();
  const [stats, setStats] = useState({
    profileViews: 0,
    savedJobs: 0,
    applications: 0,
    interviews: 0,
  });

  useEffect(() => {
    // Simulate fetching stats
    const timer = setTimeout(() => {
      setStats({
        profileViews: 1234,
        savedJobs: 56,
        applications: 23,
        interviews: 5,
      });
    }, 1000);
    return () => clearTimeout(timer);
  }, []);

  return (
    <div className="space-y-6">
      {/* Welcome Section */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Home className="h-5 w-5" />
            {t('dashboard.welcomeBack', { name: user?.email?.split('@')[0] || 'User' })}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {t('dashboard.welcomeDescription')}
          </p>
        </CardContent>
      </Card>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.profileViews')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{stats.profileViews}</div>
              <div className="text-green-500 text-sm">+12%</div>
            </div>
            <p className="text-xs text-muted-foreground">{t('dashboard.last30Days')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.savedJobs')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{stats.savedJobs}</div>
              <div className="text-green-500 text-sm">+3</div>
            </div>
            <p className="text-xs text-muted-foreground">{t('dashboard.activeSavedJobs')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.applications')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{stats.applications}</div>
              <div className="text-green-500 text-sm">+2</div>
            </div>
            <p className="text-xs text-muted-foreground">{t('dashboard.totalApplications')}</p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              {t('dashboard.interviews')}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center space-x-2">
              <div className="text-2xl font-bold">{stats.interviews}</div>
              <div className="text-green-500 text-sm">+1</div>
            </div>
            <p className="text-xs text-muted-foreground">{t('dashboard.upcomingInterviews')}</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.quickActions')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button className="flex items-center space-x-2 h-auto p-4">
              <Briefcase className="h-5 w-5" />
              <span>{t('dashboard.editProfile')}</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 h-auto p-4">
              <Save className="h-5 w-5" />
              <span>{t('dashboard.saveJobSearch')}</span>
            </Button>
            <Button variant="outline" className="flex items-center space-x-2 h-auto p-4">
              <FileText className="h-5 w-5" />
              <span>{t('dashboard.uploadResume')}</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>{t('dashboard.recentActivity')}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Briefcase className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('dashboard.appliedToPosition')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.timeAgo', { time: '2 hours' })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <Save className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('dashboard.savedJobSearch')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.timeAgo', { time: '1 day' })}</p>
              </div>
            </div>
            <div className="flex items-center space-x-4 p-4 border rounded-lg">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <FileText className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="text-sm font-medium">{t('dashboard.updatedResume')}</p>
                <p className="text-xs text-muted-foreground">{t('dashboard.timeAgo', { time: '3 days' })}</p>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}