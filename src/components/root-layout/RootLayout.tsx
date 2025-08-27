'use client';

import { ReactNode } from 'react';
import Providers from '@/components/providers/Providers';
import { useAuth } from '@/hooks/useAuth';
import MainPage from '@/components/main-page/MainPage';

interface RootLayoutProps {
  children: ReactNode;
}

export default function RootLayout({ children }: RootLayoutProps) {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <Providers>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-muted-foreground">Loading...</p>
            </div>
          </div>
        </div>
      </Providers>
    );
  }

  if (!user) {
    return (
      <Providers>
        <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
          <div className="flex items-center justify-center h-screen">
            <div className="text-center">
              <h1 className="text-4xl font-bold mb-4">Welcome to APEXCARD</h1>
              <p className="text-lg text-muted-foreground mb-8">
                Please sign in to access your job profile
              </p>
              <button
                onClick={() => window.location.href = '/auth/signin'}
                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </Providers>
    );
  }

  return (
    <Providers>
      <MainPage />
    </Providers>
  );
}