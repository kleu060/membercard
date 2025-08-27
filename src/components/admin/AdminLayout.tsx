'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Shield, 
  Settings, 
  Users, 
  Database, 
  BarChart3, 
  Menu,
  Home,
  LogOut,
  Bell,
  Search
} from 'lucide-react';
import { useSession } from 'next-auth/react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const pathname = usePathname();
  const { data: session } = useSession();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const adminNavigation = [
    { name: '管理員首頁', href: '/admin', icon: BarChart3 },
    { name: '用戶管理', href: '/admin?tab=users', icon: Users },
    { name: '功能開關', href: '/admin?tab=features', icon: Settings },
    { name: '數據庫概覽', href: '/admin?tab=database', icon: Database },
    { name: '方案管理', href: '/admin?tab=plans', icon: BarChart3 },
  ];

  const mainNavigation = [
    { name: '返回主站', href: '/', icon: Home },
  ];

  const NavigationItems = ({ items, mobile = false }: { items: typeof adminNavigation; mobile?: boolean }) => (
    <>
      {items.map((item) => (
        <Link key={item.name} href={item.href}>
          <Button
            variant={pathname === item.href ? 'default' : 'ghost'}
            className={`flex items-center space-x-2 ${mobile ? 'w-full justify-start' : ''}`}
            onClick={() => mobile && setIsMobileMenuOpen(false)}
          >
            <item.icon className="h-4 w-4" />
            <span>{item.name}</span>
          </Button>
        </Link>
      ))}
    </>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Admin Header */}
      <header className="bg-white border-b border-gray-200 shadow-sm">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Navigation */}
            <div className="flex items-center space-x-8">
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-blue-600" />
                <span className="font-bold text-lg">管理員面板</span>
                <Badge variant="secondary" className="text-xs">Admin</Badge>
              </div>
              
              {/* Desktop Navigation */}
              <nav className="hidden md:flex items-center space-x-4">
                <NavigationItems items={adminNavigation} />
              </nav>
            </div>

            {/* Right side actions */}
            <div className="flex items-center space-x-4">
              {/* Main site link */}
              <div className="hidden md:flex">
                <NavigationItems items={mainNavigation} />
              </div>

              {/* User info */}
              <div className="flex items-center space-x-2">
                <div className="hidden md:block text-right">
                  <p className="text-sm font-medium">{session?.user?.name || '管理員'}</p>
                  <p className="text-xs text-gray-500">{session?.user?.email}</p>
                </div>
                
                {/* Mobile menu trigger */}
                <Sheet open={isMobileMenuOpen} onOpenChange={setIsMobileMenuOpen}>
                  <SheetTrigger asChild>
                    <Button variant="ghost" size="sm" className="md:hidden">
                      <Menu className="h-4 w-4" />
                    </Button>
                  </SheetTrigger>
                  <SheetContent side="right" className="w-80">
                    <div className="space-y-4">
                      <div className="flex items-center space-x-2 pb-4 border-b">
                        <Shield className="h-6 w-6 text-blue-600" />
                        <span className="font-bold">管理員面板</span>
                      </div>
                      
                      <div className="space-y-2">
                        <h3 className="text-sm font-medium text-gray-500">管理功能</h3>
                        <NavigationItems items={adminNavigation} mobile />
                      </div>
                      
                      <div className="space-y-2 pt-4 border-t">
                        <h3 className="text-sm font-medium text-gray-500">主站功能</h3>
                        <NavigationItems items={mainNavigation} mobile />
                      </div>
                      
                      <div className="pt-4 border-t">
                        <div className="text-center">
                          <p className="text-sm font-medium">{session?.user?.name || '管理員'}</p>
                          <p className="text-xs text-gray-500">{session?.user?.email}</p>
                        </div>
                      </div>
                    </div>
                  </SheetContent>
                </Sheet>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>

      {/* Admin Footer */}
      <footer className="bg-white border-t border-gray-200 mt-auto">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              <span>© 2024 管理員面板</span>
              <Badge variant="outline">v1.0.0</Badge>
            </div>
            <div className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span>安全連接</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}