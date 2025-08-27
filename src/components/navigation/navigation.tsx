'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Home, Briefcase, Settings, User, Bell, Save, Search, Calendar, MapPin, Mail, Phone, Shield } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { useLanguage } from '@/contexts/LanguageContext';
import { User } from '@/types/user';

export default function Navigation() {
  const pathname = usePathname();
  const { user } = useAuth();
  const { t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.home'), href: '/', icon: Home },
    { name: t('jobProfile.title'), href: '/job-profile', icon: Briefcase },
    { name: t('nav.settings'), href: '/settings', icon: Settings },
  ];

  // Add admin link for admin users (you can customize this logic based on your auth system)
  const isAdmin = user?.email === 'admin@example.com' || user?.role === 'admin'; // Adjust this logic based on your auth system
  
  if (isAdmin) {
    navigation.push({ name: 'Admin', href: '/admin', icon: Shield });
  }

  return (
    <nav className="bg-background border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center">
            <Link href="/" className="flex items-center space-x-2">
              <Briefcase className="h-6 w-6" />
              <span className="font-semibold">{t('jobProfile.title')}</span>
            </Link>
          </div>

          <div className="hidden md:flex items-center space-x-4">
            {navigation.map((item) => (
              <Link key={item.name} href={item.href}>
                <Button
                  variant={pathname === item.href ? 'default' : 'ghost'}
                  className="flex items-center space-x-2"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.name}</span>
                </Button>
              </Link>
            ))}
          </div>

          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <User className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {isMenuOpen && (
        <div className="md:hidden border-t">
          <div className="container mx-auto px-4 py-4">
            <div className="space-y-2">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <Button
                    variant={pathname === item.href ? 'default' : 'ghost'}
                    className="w-full justify-start"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    <item.icon className="h-4 w-4 mr-2" />
                    {item.name}
                  </Button>
                </Link>
              ))}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}