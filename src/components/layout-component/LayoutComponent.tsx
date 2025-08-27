'use client';

import { useState } from 'react';
import Navigation from '@/components/navigation/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Bell, Save, Search, User, Settings, Briefcase, Home, MapPin, Mail, Phone } from 'lucide-react';
import { useSession } from 'next-auth/react';
import MainPage from '@/components/main-page/MainPage';

interface LayoutComponentProps {
  children: React.ReactNode;
}

export default function LayoutComponent({ children }: LayoutComponentProps) {
  const { data: session } = useSession();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
}