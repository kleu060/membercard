'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import CRMSync from '@/components/sync/CRMSync';
import IPhoneSync from '@/components/sync/IPhoneSync';
import { 
  Cloud, 
  Smartphone, 
  ArrowLeft,
  RefreshCw
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import Link from 'next/link';

export default function SyncPage() {
  const { t } = useLanguage();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Link href="/">
                <Button variant="outline" size="sm" className="flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  {t('sync.backToDashboard')}
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{t('sync.title')}</h1>
                <p className="text-gray-600">{t('sync.subtitle')}</p>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 py-8">
        <Tabs defaultValue="crm" className="w-full">
          <TabsList className="grid w-full grid-cols-2 max-w-md">
            <TabsTrigger value="crm" className="flex items-center gap-2">
              <Cloud className="w-4 h-4" />
              {t('sync.crmSync')}
            </TabsTrigger>
            <TabsTrigger value="iphone" className="flex items-center gap-2">
              <Smartphone className="w-4 h-4" />
              {t('sync.iphoneSync')}
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="crm" className="mt-6">
            <CRMSync />
          </TabsContent>
          
          <TabsContent value="iphone" className="mt-6">
            <IPhoneSync />
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}