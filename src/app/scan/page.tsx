'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import AuthForm from '@/components/auth/AuthForm';
import Dashboard from '@/components/dashboard/Dashboard';
import Header from '@/components/header/Header';
import CardScanner from '@/components/scan/CardScanner';
import { useLanguage } from '@/contexts/LanguageContext';

export default function ScanPage() {
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
    return <CardScanner />;
  }

  // Landing page for non-authenticated users
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header user={user} showAuth={showAuth} setShowAuth={setShowAuth} />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              {language === 'zh-TW' ? '無限制名片掃描' : 
               language === 'zh-CN' ? '无限名片扫描' : 
               'Unlimited Card Scanning'}
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              {language === 'zh-TW' ? '使用OCR技術自動辨識名片內容，儲存圖片和聯絡資料，支援匯出VCF格式' : 
               language === 'zh-CN' ? '使用OCR技术自动识别名片内容，保存图片和联系资料，支持导出VCF格式' : 
               'Use OCR technology to automatically recognize card content, save images and contact data, support VCF export'}
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="text-lg px-8 py-4" onClick={() => setShowAuth(true)}>
                {language === 'zh-TW' ? '立即開始掃描' : language === 'zh-CN' ? '立即开始扫描' : 'Start Scanning Now'}
                <svg className="ml-2 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Button size="lg" variant="outline" className="text-lg px-8 py-4" onClick={() => setShowAuth(true)}>
                {language === 'zh-TW' ? '了解更多功能' : language === 'zh-CN' ? '了解更多功能' : 'Learn More'}
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-16 px-4 bg-white">
        <div className="container mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">
              {language === 'zh-TW' ? '強大功能' : language === 'zh-CN' ? '强大功能' : 'Powerful Features'}
            </h2>
            <p className="text-xl text-gray-600">
              {language === 'zh-TW' ? '專為現代商務人士設計的智能名片管理工具' : 
               language === 'zh-CN' ? '专为现代商务人士设计的智能名片管理工具' : 
               'Smart business card management tool designed for modern professionals'}
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              {
                icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                title: language === 'zh-TW' ? 'OCR文字辨識' : language === 'zh-CN' ? 'OCR文字识别' : 'OCR Text Recognition',
                description: language === 'zh-TW' ? '自動辨識名片上的文字內容，精準提取姓名、公司、職位等資訊' : 
                             language === 'zh-CN' ? '自动识别名片上的文字内容，精准提取姓名、公司、职位等信息' : 
                             'Automatically recognize text content on business cards, accurately extract name, company, position and other information'
              },
              {
                icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg>,
                title: language === 'zh-TW' ? '圖片儲存' : language === 'zh-CN' ? '图片保存' : 'Image Storage',
                description: language === 'zh-TW' ? '自動儲存名片原始圖片，方便隨時查看和比對' : 
                             language === 'zh-CN' ? '自动保存名片原始图片，方便随时查看和比对' : 
                             'Automatically save original business card images for easy viewing and comparison at any time'
              },
              {
                icon: <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>,
                title: language === 'zh-TW' ? 'VCF匯出' : language === 'zh-CN' ? 'VCF导出' : 'VCF Export',
                description: language === 'zh-TW' ? '一鍵匯出VCF格式檔案，直接匯入到手機聯絡人' : 
                             language === 'zh-CN' ? '一键导出VCF格式文件，直接导入到手机联系人' : 
                             'One-click export VCF format files, directly import to phone contacts'
              }
            ].map((feature, index) => (
              <div key={index} className="text-center p-6 rounded-lg border hover:shadow-lg transition-shadow">
                <div className="flex justify-center mb-4">
                  {feature.icon}
                </div>
                <h3 className="text-lg font-semibold mb-2">{feature.title}</h3>
                <p className="text-sm text-gray-600">{feature.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-16 px-4 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="container mx-auto text-center">
          <h2 className="text-4xl font-bold text-white mb-6">
            {language === 'zh-TW' ? '準備好開始掃描了嗎？' : 
             language === 'zh-CN' ? '准备好开始扫描了吗？' : 
             'Ready to start scanning?'}
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            {language === 'zh-TW' ? '立即註冊，體驗智能名片管理的便利' : 
             language === 'zh-CN' ? '立即注册，体验智能名片管理的便利' : 
             'Register now and experience the convenience of smart business card management'}
          </p>
          <Button size="lg" variant="secondary" className="text-lg px-8 py-4" onClick={() => setShowAuth(true)}>
            {language === 'zh-TW' ? '免費開始使用' : language === 'zh-CN' ? '免费开始使用' : 'Start Free Trial'}
          </Button>
        </div>
      </section>
    </div>
  );
}