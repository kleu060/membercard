'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/auth/AuthForm';
import Dashboard from '@/components/dashboard/Dashboard';
import Header from '@/components/header/Header';
import NamecardTemplates from '@/components/namecard/NamecardTemplates';
import { useLanguage } from '@/contexts/LanguageContext';

export default function TemplatesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const { language, setLanguage, t } = useLanguage();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      // User not authenticated
      console.log('Auth check failed:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    checkAuth();
    setShowAuth(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">{t('loading')}</p>
        </div>
      </div>
    );
  }

  if (showAuth) {
    return <AuthForm onSuccess={handleAuthSuccess} />;
  }

  if (user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header user={user} showAuth={showAuth} setShowAuth={setShowAuth} />

        {/* Main Content */}
        <main className="py-8">
          <NamecardTemplates />
        </main>
      </div>
    );
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} showAuth={showAuth} setShowAuth={setShowAuth} />

      {/* Main Content */}
      <main className="py-8">
        <NamecardTemplates />
      </main>
    </div>
  );
}