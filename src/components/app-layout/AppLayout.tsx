'use client';

import { useState } from 'react';
import { SessionProvider } from 'next-auth/react';
import LayoutComponent from '@/components/layout-component/LayoutComponent';
import MainPage from '@/components/main-page/MainPage';

interface AppLayoutProps {
  children: React.ReactNode;
  session: any;
}

export default function AppLayout({ children, session }: AppLayoutProps) {
  return (
    <SessionProvider session={session}>
      <LayoutComponent>
        {children}
      </LayoutComponent>
    </SessionProvider>
  );
}