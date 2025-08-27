'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import LanguageSelector from '@/components/LanguageSelector';
import { useLanguage } from '@/contexts/LanguageContext';

interface HeaderProps {
  user?: any;
  showAuth?: boolean;
  setShowAuth?: (show: boolean) => void;
}

export default function Header({ user, showAuth, setShowAuth }: HeaderProps) {
  const pathname = usePathname();
  const { language, setLanguage, t } = useLanguage();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navigation = [
    { name: t('nav.home'), href: '/' },
    { name: t('nav.scan'), href: '/scan' },
    { name: t('nav.jobMarket'), href: '/job-market' },
    { name: t('nav.features'), href: '/features' },
    { name: t('nav.templates'), href: '/templates' },
    { name: t('nav.marketplace'), href: '/marketplace' },
    { name: t('nav.pricing'), href: '/pricing' },
  ];

  const isActive = (href: string) => {
    if (href === '/') {
      return pathname === '/';
    }
    return pathname.startsWith(href);
  };

  return (
    <header className="bg-white shadow-sm">
      <div className="container mx-auto px-4 py-4">
        <div className="flex items-center justify-between h-16">
          <div className="flex items-center space-x-2">
            <Link href="/" className="flex items-center space-x-2">
              <div className="w-10 h-10 bg-blue-600 rounded-lg flex items-center justify-center">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
              </div>
              <span className="text-xl font-bold text-gray-900">APEXCARD</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            <nav className="flex items-center space-x-6">
              {navigation.map((item) => (
                <Link key={item.name} href={item.href}>
                  <span
                    className={`transition-colors ${
                      isActive(item.href)
                        ? 'text-blue-600 font-medium'
                        : 'text-gray-600 hover:text-blue-600'
                    }`}
                  >
                    {item.name}
                  </span>
                </Link>
              ))}
            </nav>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={setLanguage} 
              />
              {setShowAuth && (
                <Button onClick={() => setShowAuth(true)}>
                  {t('nav.getStarted')}
                </Button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </Button>
          </div>
        </div>

        {/* Mobile menu */}
        {isMenuOpen && (
          <div className="md:hidden border-t">
            <div className="container mx-auto px-4 py-4">
              <div className="space-y-2">
                {navigation.map((item) => (
                  <Link key={item.name} href={item.href}>
                    <span
                      className={`block px-3 py-2 rounded-md text-base font-medium transition-colors ${
                        isActive(item.href)
                          ? 'text-blue-600 bg-blue-50'
                          : 'text-gray-600 hover:text-blue-600 hover:bg-gray-50'
                      }`}
                      onClick={() => setIsMenuOpen(false)}
                    >
                      {item.name}
                    </span>
                  </Link>
                ))}
                <div className="flex items-center justify-between px-3 py-2">
                  <LanguageSelector 
                    currentLanguage={language} 
                    onLanguageChange={setLanguage} 
                  />
                  {setShowAuth && (
                    <Button onClick={() => {
                      setShowAuth(true);
                      setIsMenuOpen(false);
                    }}>
                      {t('nav.getStarted')}
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </header>
  );
}