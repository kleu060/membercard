'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Header from '@/components/header/Header';
import { 
  Camera, 
  Cloud, 
  Download, 
  Smartphone, 
  Users, 
  Mail, 
  Building2, 
  RefreshCw, 
  CheckCircle, 
  Upload,
  FileSpreadsheet,
  Contact,
  QrCode,
  Zap,
  Shield
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

export default function FeaturesPage() {
  const [user, setUser] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [showAuth, setShowAuth] = useState(false);
  const [activeTab, setActiveTab] = useState('scan');
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
    } finally {
      setLoading(false);
    }
  };

  const handleAuthSuccess = () => {
    checkAuth();
    setShowAuth(false);
  };

  const getLocalizedTexts = () => {
    const texts = {
      'zh-TW': {
        title: '高級功能',
        subtitle: '專業名片管理工具，讓您的商務社交更高效',
        scanTab: '名片掃描',
        syncTab: 'CRM 同步',
        exportTab: '資料匯出',
        contactsTab: '手機聯絡人',
        enterpriseTab: '企業功能',
        scanTitle: '無限制名片掃描',
        scanSubtitle: 'OCR辨識文字，儲存圖片和資料',
        scanFeatures: [
          '智能OCR文字辨識',
          '自動提取聯絡資訊',
          '儲存原始名片圖片',
          '支援批量掃描',
          '一鍵匯出VCF格式'
        ],
        syncTitle: 'CRM系統同步',
        syncSubtitle: '與主流CRM系統無縫對接',
        syncPlatforms: [
          { name: 'Google 聯絡人', icon: <Users className="w-5 h-5" />, desc: '同步到Google聯絡人，支援Android' },
          { name: 'Outlook', icon: <Mail className="w-5 h-5" />, desc: '同步到Outlook和Microsoft 365' },
          { name: 'Salesforce', icon: <Building2 className="w-5 h-5" />, desc: '同步到Salesforce CRM系統' }
        ],
        exportTitle: '多格式匯出',
        exportSubtitle: '靈活的資料匯出選項',
        exportFormats: [
          { name: 'Excel/CSV', icon: <FileSpreadsheet className="w-5 h-5" />, desc: '匯出為Excel或CSV格式，方便數據分析' },
          { name: 'VCF名片檔', icon: <Contact className="w-5 h-5" />, desc: '標準vCard格式，可直接匯入手機' },
          { name: '批量匯出', icon: <Download className="w-5 h-5" />, desc: '支援選擇性批量匯出多張名片' }
        ],
        contactsTitle: '手機聯絡人同步',
        contactsSubtitle: '與手機通訊錄雙向同步',
        enterpriseTitle: '企業級解決方案',
        enterpriseSubtitle: '為大型企業設計的高級功能',
        contactsFeatures: [
          '從手機匯入聯絡人',
          '匯出到手機通訊錄',
          '雙向同步避免重複',
          '自動合併相同聯絡人',
          '同步狀態即時顯示'
        ],
        enterpriseFeatures: [
          '即時名片建立與 Active Directory 同步',
          '批量員工名片管理',
          '自動組織架構更新',
          '單一登入(SSO)整合',
          '企業級安全與合規'
        ],
        getStarted: '立即開始使用',
        learnMore: '了解更多',
        comingSoon: '即將推出',
        available: '已可用'
      },
      'zh-CN': {
        title: '高级功能',
        subtitle: '专业名片管理工具，让您的商务社交更高效',
        scanTab: '名片扫描',
        syncTab: 'CRM 同步',
        exportTab: '数据导出',
        contactsTab: '手机联系人',
        enterpriseTab: '企业功能',
        scanTitle: '无限名片扫描',
        scanSubtitle: 'OCR识别文字，保存图片和资料',
        scanFeatures: [
          '智能OCR文字识别',
          '自动提取联系信息',
          '保存原始名片图片',
          '支持批量扫描',
          '一键导出VCF格式'
        ],
        syncTitle: 'CRM系统同步',
        syncSubtitle: '与主流CRM系统无缝对接',
        syncPlatforms: [
          { name: 'Google 联系人', icon: <Users className="w-5 h-5" />, desc: '同步到Google联系人，支持Android' },
          { name: 'Outlook', icon: <Mail className="w-5 h-5" />, desc: '同步到Outlook和Microsoft 365' },
          { name: 'Salesforce', icon: <Building2 className="w-5 h-5" />, desc: '同步到Salesforce CRM系统' }
        ],
        exportTitle: '多格式导出',
        exportSubtitle: '灵活的数据导出选项',
        exportFormats: [
          { name: 'Excel/CSV', icon: <FileSpreadsheet className="w-5 h-5" />, desc: '导出为Excel或CSV格式，方便数据分析' },
          { name: 'VCF名片文件', icon: <Contact className="w-5 h-5" />, desc: '标准vCard格式，可直接导入手机' },
          { name: '批量导出', icon: <Download className="w-5 h-5" />, desc: '支持选择性批量导出多张名片' }
        ],
        contactsTitle: '手机联系人同步',
        contactsSubtitle: '与手机通讯录双向同步',
        enterpriseTitle: '企业级解决方案',
        enterpriseSubtitle: '为大型企业设计的高级功能',
        contactsFeatures: [
          '从手机导入联系人',
          '导出到手机通讯录',
          '双向同步避免重复',
          '自动合并相同联系人',
          '同步状态实时显示'
        ],
        enterpriseFeatures: [
          '即时名片创建与 Active Directory 同步',
          '批量员工名片管理',
          '自动组织架构更新',
          '单一登录(SSO)整合',
          '企业级安全与合规'
        ],
        getStarted: '立即开始使用',
        learnMore: '了解更多',
        comingSoon: '即将推出',
        available: '已可用'
      },
      'en': {
        title: 'Advanced Features',
        subtitle: 'Professional business card management tools for efficient networking',
        scanTab: 'Card Scanning',
        syncTab: 'CRM Sync',
        exportTab: 'Data Export',
        contactsTab: 'Phone Contacts',
        enterpriseTab: 'Enterprise',
        scanTitle: 'Unlimited Card Scanning',
        scanSubtitle: 'OCR text recognition, save images and data',
        scanFeatures: [
          'Smart OCR text recognition',
          'Automatic contact information extraction',
          'Save original card images',
          'Support batch scanning',
          'One-click VCF export'
        ],
        syncTitle: 'CRM System Synchronization',
        syncSubtitle: 'Seamless integration with mainstream CRM systems',
        syncPlatforms: [
          { name: 'Google Contacts', icon: <Users className="w-5 h-5" />, desc: 'Sync to Google Contacts, supports Android' },
          { name: 'Outlook', icon: <Mail className="w-5 h-5" />, desc: 'Sync to Outlook and Microsoft 365' },
          { name: 'Salesforce', icon: <Building2 className="w-5 h-5" />, desc: 'Sync to Salesforce CRM system' }
        ],
        exportTitle: 'Multi-format Export',
        exportSubtitle: 'Flexible data export options',
        exportFormats: [
          { name: 'Excel/CSV', icon: <FileSpreadsheet className="w-5 h-5" />, desc: 'Export to Excel/CSV format for data analysis' },
          { name: 'VCF Card Files', icon: <Contact className="w-5 h-5" />, desc: 'Standard vCard format, direct import to phones' },
          { name: 'Batch Export', icon: <Download className="w-5 h-5" />, desc: 'Support selective batch export of multiple cards' }
        ],
        contactsTitle: 'Phone Contacts Synchronization',
        contactsSubtitle: 'Bidirectional sync with phone contacts',
        enterpriseTitle: 'Enterprise Solutions',
        enterpriseSubtitle: 'Advanced features designed for large organizations',
        contactsFeatures: [
          'Import contacts from phone',
          'Export to phone contacts',
          'Bidirectional sync prevents duplicates',
          'Auto-merge identical contacts',
          'Real-time sync status display'
        ],
        enterpriseFeatures: [
          'Instant card creation with Active Directory syncing',
          'Bulk employee card management',
          'Automatic organization structure updates',
          'Single Sign-On (SSO) integration',
          'Enterprise-grade security and compliance'
        ],
        getStarted: 'Get Started Now',
        learnMore: 'Learn More',
        comingSoon: 'Coming Soon',
        available: 'Available'
      }
    };

    return texts[language as keyof typeof texts] || texts['zh-TW'];
  };

  const texts = getLocalizedTexts();

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
    // In a real app, this would show the auth form
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Authentication Required</CardTitle>
            <CardDescription>Please sign in to access advanced features</CardDescription>
          </CardHeader>
          <CardContent>
            <Button onClick={() => setShowAuth(false)} className="w-full">
              Back to Features
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} showAuth={showAuth} setShowAuth={setShowAuth} />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {texts.title}
            </h1>
            <p className="text-xl text-gray-600 mb-12">
              {texts.subtitle}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4" onClick={() => setShowAuth(true)}>
                {texts.getStarted}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4">
                {texts.learnMore}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Tabs */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-5 max-w-3xl mx-auto">
              <TabsTrigger value="scan" className="flex items-center gap-2">
                <Camera className="w-4 h-4" />
                {texts.scanTab}
              </TabsTrigger>
              <TabsTrigger value="sync" className="flex items-center gap-2">
                <Cloud className="w-4 h-4" />
                {texts.syncTab}
              </TabsTrigger>
              <TabsTrigger value="export" className="flex items-center gap-2">
                <Download className="w-4 h-4" />
                {texts.exportTab}
              </TabsTrigger>
              <TabsTrigger value="contacts" className="flex items-center gap-2">
                <Smartphone className="w-4 h-4" />
                {texts.contactsTab}
              </TabsTrigger>
              <TabsTrigger value="enterprise" className="flex items-center gap-2">
                <Building2 className="w-4 h-4" />
                {texts.enterpriseTab}
              </TabsTrigger>
            </TabsList>

            <div className="mt-12">
              {/* Card Scanning Tab */}
              <TabsContent value="scan" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{texts.scanTitle}</h2>
                  <p className="text-xl text-gray-600">{texts.scanSubtitle}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Zap className="w-5 h-5 text-blue-600" />
                          {t('features.coreFeatures')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {texts.scanFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-center">
                    <Card className="w-full max-w-sm">
                      <CardContent className="p-8 text-center">
                        <div className="mb-6">
                          <Camera className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            {t('features.smartScanning')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t('features.smartScanningDesc')}
                          </p>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          {texts.available}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              {/* CRM Sync Tab */}
              <TabsContent value="sync" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{texts.syncTitle}</h2>
                  <p className="text-xl text-gray-600">{texts.syncSubtitle}</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {texts.syncPlatforms.map((platform, index) => (
                    <Card key={index} className="text-center">
                      <CardHeader>
                        <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                          {platform.icon}
                        </div>
                        <CardTitle>{platform.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{platform.desc}</p>
                        <Badge className="bg-green-500 text-white">
                          {texts.available}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Export Tab */}
              <TabsContent value="export" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{texts.exportTitle}</h2>
                  <p className="text-xl text-gray-600">{texts.exportSubtitle}</p>
                </div>
                
                <div className="grid md:grid-cols-3 gap-6">
                  {texts.exportFormats.map((format, index) => (
                    <Card key={index} className="text-center">
                      <CardHeader>
                        <div className="w-16 h-16 mx-auto mb-4 bg-green-100 rounded-full flex items-center justify-center">
                          {format.icon}
                        </div>
                        <CardTitle>{format.name}</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-600 mb-4">{format.desc}</p>
                        <Badge className="bg-green-500 text-white">
                          {texts.available}
                        </Badge>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>

              {/* Phone Contacts Tab */}
              <TabsContent value="contacts" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{texts.contactsTitle}</h2>
                  <p className="text-xl text-gray-600">{texts.contactsSubtitle}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8">
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <Smartphone className="w-5 h-5 text-blue-600" />
                        {t('features.syncFeatures')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ul className="space-y-3">
                        {texts.contactsFeatures.map((feature, index) => (
                          <li key={index} className="flex items-center gap-3">
                            <CheckCircle className="w-5 h-5 text-green-500" />
                            <span>{feature}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                  
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <QrCode className="w-5 h-5 text-blue-600" />
                        {t('features.quickActions')}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{t('features.importContacts')}</span>
                        <Upload className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{t('features.exportContacts')}</span>
                        <Download className="w-4 h-4 text-gray-600" />
                      </div>
                      <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <span>{t('features.bidirectionalSync')}</span>
                        <RefreshCw className="w-4 h-4 text-gray-600" />
                      </div>
                      <Badge className="bg-yellow-500 text-white w-full justify-center">
                        {texts.comingSoon}
                      </Badge>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Enterprise Tab */}
              <TabsContent value="enterprise" className="space-y-8">
                <div className="text-center mb-12">
                  <h2 className="text-4xl font-bold text-gray-900 mb-4">{texts.enterpriseTitle}</h2>
                  <p className="text-xl text-gray-600">{texts.enterpriseSubtitle}</p>
                </div>
                
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="space-y-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <Building2 className="w-5 h-5 text-blue-600" />
                          {t('features.enterpriseFeatures')}
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-3">
                          {texts.enterpriseFeatures.map((feature, index) => (
                            <li key={index} className="flex items-center gap-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <span>{feature}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  </div>
                  
                  <div className="flex justify-center">
                    <Card className="w-full max-w-sm">
                      <CardContent className="p-8 text-center">
                        <div className="mb-6">
                          <Building2 className="w-16 h-16 text-blue-600 mx-auto mb-4" />
                          <h3 className="text-lg font-semibold mb-2">
                            {t('features.activeDirectoryIntegration')}
                          </h3>
                          <p className="text-sm text-gray-600">
                            {t('features.autoEmployeeCardCreation')}
                          </p>
                        </div>
                        <Badge className="bg-green-500 text-white">
                          {texts.available}
                        </Badge>
                      </CardContent>
                    </Card>
                  </div>
                </div>

                <div className="mt-12 bg-blue-50 rounded-lg p-8">
                  <h3 className="text-2xl font-semibold text-gray-900 mb-4 text-center">
                    {t('features.enterpriseAdvantages')}
                  </h3>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Users className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold mb-2">
                        {t('features.automatedDeployment')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t('features.automatedDeploymentDesc')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <RefreshCw className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold mb-2">
                        {t('features.realtimeSync')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t('features.realtimeSyncDesc')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <Shield className="w-6 h-6 text-blue-600" />
                      </div>
                      <h4 className="font-semibold mb-2">
                        {t('features.securityControl')}
                      </h4>
                      <p className="text-sm text-gray-600">
                        {t('features.securityControlDesc')}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>
          </Tabs>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {t('features.readyToExperience')}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {t('features.registerNow')}
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => setShowAuth(true)}>
            {texts.getStarted}
          </Button>
        </div>
      </section>
    </div>
  );
}