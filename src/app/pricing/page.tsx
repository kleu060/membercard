'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import Header from '@/components/header/Header';
import { Check, Star } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';
import PaymentModal from '@/components/payments/PaymentModal';

export default function PricingPage() {
  const [billingCycle, setBillingCycle] = useState<'monthly' | 'annual'>('monthly');
  const [selectedPlan, setSelectedPlan] = useState<any>(null);
  const [isPaymentModalOpen, setIsPaymentModalOpen] = useState(false);
  const { language, t } = useLanguage();

  const pricingPlans = [
    {
      name: language === 'zh-TW' ? '免費版' : language === 'zh-CN' ? '免费版' : 'Free',
      price: 0,
      annualPrice: 0,
      description: language === 'zh-TW' ? '適合個人使用，體驗基本功能' : 
                  language === 'zh-CN' ? '适合个人使用，体验基本功能' : 
                  'Perfect for individuals to try basic features',
      features: [
        language === 'zh-TW' ? '1 個數位名片' : language === 'zh-CN' ? '1 个数字名片' : '1 digital card',
        language === 'zh-TW' ? '基本設計模板' : language === 'zh-CN' ? '基本设计模板' : 'Basic design templates',
        language === 'zh-TW' ? 'QR 碼分享' : language === 'zh-CN' ? '二维码分享' : 'QR code sharing',
        language === 'zh-TW' ? '基本分析' : language === 'zh-CN' ? '基本分析' : 'Basic analytics',
        language === 'zh-TW' ? '社群媒體連結' : language === 'zh-CN' ? '社交媒体链接' : 'Social media links'
      ],
      cta: language === 'zh-TW' ? '開始免費使用' : language === 'zh-CN' ? '开始免费使用' : 'Start Free',
      popular: false
    },
    {
      name: language === 'zh-TW' ? '專業版' : language === 'zh-CN' ? '专业版' : 'Professional',
      price: 9,
      annualPrice: 90,
      description: language === 'zh-TW' ? '適合專業人士和小型企業' : 
                  language === 'zh-CN' ? '适合专业人士和小型企业' : 
                  'Ideal for professionals and small businesses',
      features: [
        language === 'zh-TW' ? '5 個數位名片' : language === 'zh-CN' ? '5 个数字名片' : '5 digital cards',
        language === 'zh-TW' ? '進階設計模板' : language === 'zh-CN' ? '进阶设计模板' : 'Advanced design templates',
        language === 'zh-TW' ? '自訂網域' : language === 'zh-CN' ? '自定义域名' : 'Custom domain',
        language === 'zh-TW' ? '進階分析' : language === 'zh-CN' ? '进阶分析' : 'Advanced analytics',
        language === 'zh-TW' ? '郵件簽名產生器' : language === 'zh-CN' ? '邮件签名生成器' : 'Email signature generator',
        language === 'zh-TW' ? 'NFC 分享' : language === 'zh-CN' ? 'NFC 分享' : 'NFC sharing',
        language === 'zh-TW' ? '優先支援' : language === 'zh-CN' ? '优先支持' : 'Priority support'
      ],
      cta: language === 'zh-TW' ? '立即升級' : language === 'zh-CN' ? '立即升级' : 'Upgrade Now',
      popular: true
    },
    {
      name: language === 'zh-TW' ? '企業版' : language === 'zh-CN' ? '企业版' : 'Enterprise',
      price: 29,
      annualPrice: 290,
      description: language === 'zh-TW' ? '適合大型企業和團隊' : 
                  language === 'zh-CN' ? '适合大型企业和团队' : 
                  'Perfect for large companies and teams',
      features: [
        language === 'zh-TW' ? '無限數位名片' : language === 'zh-CN' ? '无限数字名片' : 'Unlimited digital cards',
        language === 'zh-TW' ? '所有設計模板' : language === 'zh-CN' ? '所有设计模板' : 'All design templates',
        language === 'zh-TW' ? '多個自訂網域' : language === 'zh-CN' ? '多个自定义域名' : 'Multiple custom domains',
        language === 'zh-TW' ? '團隊管理' : language === 'zh-CN' ? '团队管理' : 'Team management',
        language === 'zh-TW' ? 'API 存取' : language === 'zh-CN' ? 'API 访问' : 'API access',
        language === 'zh-TW' ? '白標解決方案' : language === 'zh-CN' ? '白标解决方案' : 'White-label solution',
        language === 'zh-TW' ? '即時名片建立與 Active Directory 同步' : language === 'zh-CN' ? '即时名片创建与 Active Directory 同步' : 'Instant card creation with Active Directory syncing',
        language === 'zh-TW' ? '專屬客戶經理' : language === 'zh-CN' ? '专属客户经理' : 'Dedicated account manager',
        language === 'zh-TW' ? 'SLA 保證' : language === 'zh-CN' ? 'SLA 保证' : 'SLA guarantee'
      ],
      cta: language === 'zh-TW' ? '聯絡銷售' : language === 'zh-CN' ? '联系销售' : 'Contact Sales',
      popular: false
    }
  ];

  const handlePlanSelect = (plan: any) => {
    if (plan.price > 0) {
      setSelectedPlan(plan);
      setIsPaymentModalOpen(true);
    }
    // For free plan, you might want to handle sign up directly
  };

  const discountPercentage = 17;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <Header />

      {/* Hero Section */}
      <section className="py-20 px-4">
        <div className="container mx-auto text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            {language === 'zh-TW' ? '選擇適合您的方案' : 
             language === 'zh-CN' ? '选择适合您的方案' : 
             'Choose the Perfect Plan for You'}
          </h1>
          <p className="text-xl text-gray-600 mb-12 max-w-3xl mx-auto">
            {language === 'zh-TW' ? '無論您是個人專業人士、小型企業還是大型組織，我們都有適合您的數位名片解決方案' : 
             language === 'zh-CN' ? '无论您是个人专业人士、小型企业还是大型组织，我们都有适合您的数字名片解决方案' : 
             'Whether you\'re an individual professional, small business, or large organization, we have the perfect digital card solution for you'}
          </p>

          {/* Billing Toggle */}
          <div className="flex items-center justify-center space-x-6 mb-12">
            <span className={`text-lg font-medium transition-colors duration-200 ${
              billingCycle === 'monthly' ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {language === 'zh-TW' ? '月付' : language === 'zh-CN' ? '月付' : 'Monthly'}
            </span>
            <button
              onClick={() => setBillingCycle(billingCycle === 'monthly' ? 'annual' : 'monthly')}
              className="relative inline-flex h-10 w-20 items-center rounded-full bg-blue-600 transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-blue-500 focus:ring-offset-2 hover:bg-blue-700"
            >
              <span className={`inline-block h-8 w-8 transform rounded-full bg-white shadow-lg transition-transform duration-300 ${
                billingCycle === 'annual' ? 'translate-x-10' : 'translate-x-1'
              }`} />
            </button>
            <span className={`text-lg font-medium transition-colors duration-200 ${
              billingCycle === 'annual' ? 'text-blue-600' : 'text-gray-400'
            }`}>
              {language === 'zh-TW' ? '年付' : language === 'zh-CN' ? '年付' : 'Annual'}
            </span>
            {billingCycle === 'annual' && (
              <Badge className="ml-2 bg-gradient-to-r from-green-500 to-green-600 text-white border-green-600 shadow-md animate-pulse">
                <div className="flex items-center space-x-1">
                  <span>💰</span>
                  <span>
                    {language === 'zh-TW' ? `省下 ${discountPercentage}%` : 
                     language === 'zh-CN' ? `省下 ${discountPercentage}%` : 
                     `Save ${discountPercentage}%`}
                  </span>
                </div>
              </Badge>
            )}
          </div>

          {/* Pricing Cards */}
          <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {pricingPlans.map((plan, index) => (
              <Card key={index} className={`relative overflow-hidden transition-all duration-300 hover:shadow-2xl ${
                plan.popular ? 'border-blue-500 shadow-xl scale-105' : 'border-gray-200 hover:border-gray-300'
              }`}>
                {plan.popular && (
                  <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white text-center py-3 text-sm font-semibold">
                    <div className="flex items-center justify-center space-x-1">
                      <Star className="w-4 h-4 fill-current" />
                      <span>
                        {language === 'zh-TW' ? '最受歡迎' : 
                         language === 'zh-CN' ? '最受欢迎' : 
                         'Most Popular'}
                      </span>
                    </div>
                  </div>
                )}
                <CardHeader className={`${plan.popular ? 'pt-12' : 'pt-6'} pb-6`}>
                  <CardTitle className="text-2xl font-bold text-center">{plan.name}</CardTitle>
                  <CardDescription className="text-center text-gray-600 px-4">
                    {plan.description}
                  </CardDescription>
                  <div className="text-center mt-6">
                    <div className="flex items-baseline justify-center space-x-1">
                      <span className="text-5xl font-bold text-gray-900">
                        ${billingCycle === 'monthly' ? plan.price : plan.annualPrice}
                      </span>
                      <span className="text-gray-500 text-lg">
                        /{billingCycle === 'monthly' ? 
                          (language === 'zh-TW' ? '月' : language === 'zh-CN' ? '月' : 'month') : 
                          (language === 'zh-TW' ? '年' : language === 'zh-CN' ? '年' : 'year')}
                      </span>
                    </div>
                    {billingCycle === 'annual' && plan.price > 0 && (
                      <p className="text-sm text-green-600 mt-2 font-medium">
                        {language === 'zh-TW' ? `相當於每月 $${Math.round(plan.annualPrice / 12)}` : 
                         language === 'zh-CN' ? `相当于每月 $${Math.round(plan.annualPrice / 12)}` : 
                         `Equivalent to $${Math.round(plan.annualPrice / 12)}/month`}
                      </p>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="space-y-4 px-6 pb-6">
                  <Button 
                    className={`w-full text-lg py-3 font-semibold transition-all duration-200 ${
                      plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-lg hover:shadow-xl' 
                        : plan.price > 0 
                          ? 'bg-gradient-to-r from-gray-900 to-gray-800 hover:from-gray-800 hover:to-gray-700 shadow-md hover:shadow-lg'
                          : 'bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md hover:shadow-lg'
                    } text-white`}
                    size="lg"
                    onClick={() => handlePlanSelect(plan)}
                  >
                    {plan.cta}
                  </Button>
                  <div className="space-y-3 mt-6">
                    {plan.features.map((feature, featureIndex) => (
                      <div key={featureIndex} className="flex items-start space-x-3">
                        <div className="flex-shrink-0 mt-1">
                          <div className="w-5 h-5 bg-green-100 rounded-full flex items-center justify-center">
                            <Check className="w-3 h-3 text-green-600" />
                          </div>
                        </div>
                        <span className="text-gray-700 leading-relaxed">{feature}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* FAQ Section */}
          <div className="mt-20 max-w-4xl mx-auto">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              {language === 'zh-TW' ? '常見問題' : 
               language === 'zh-CN' ? '常见问题' : 
               'Frequently Asked Questions'}
            </h2>
            <div className="space-y-4">
              {[
                {
                  question: language === 'zh-TW' ? '我可以隨時更改方案嗎？' : 
                            language === 'zh-CN' ? '我可以随时更改方案吗？' : 
                            'Can I change plans anytime?',
                  answer: language === 'zh-TW' ? '是的，您可以隨時升級或降級您的方案。升級會立即生效，降級會在下一個計費週期生效。' : 
                          language === 'zh-CN' ? '是的，您可以随时升级或降级您的方案。升级会立即生效，降级会在下一个计费周期生效。' : 
                          'Yes, you can upgrade or downgrade your plan anytime. Upgrades take effect immediately, while downgrades take effect at the next billing cycle.'
                },
                {
                  question: language === 'zh-TW' ? '你們提供免費試用嗎？' : 
                            language === 'zh-CN' ? '你们提供免费试用吗？' : 
                            'Do you offer a free trial?',
                  answer: language === 'zh-TW' ? '是的，我們的免費版永遠免費，您可以無限期使用所有基本功能。專業版和企業版提供 14 天免費試用。' : 
                          language === 'zh-CN' ? '是的，我们的免费版永远免费，您可以无限期使用所有基本功能。专业版和企业版提供 14 天免费试用。' : 
                          'Yes, our Free plan is always free with basic features. Professional and Enterprise plans include a 14-day free trial.'
                },
                {
                  question: language === 'zh-TW' ? '付款方式有哪些？' : 
                            language === 'zh-CN' ? '付款方式有哪些？' : 
                            'What payment methods do you accept?',
                  answer: language === 'zh-TW' ? '我們接受信用卡、借記卡、PayPal 以及銀行轉帳。所有付款都通過安全加密處理。' : 
                          language === 'zh-CN' ? '我们接受信用卡、借记卡、PayPal 以及银行转账。所有付款都通过安全加密处理。' : 
                          'We accept credit cards, debit cards, PayPal, and bank transfers. All payments are processed securely with encryption.'
                },
                {
                  question: language === 'zh-TW' ? '可以取消訂閱嗎？' : 
                            language === 'zh-CN' ? '可以取消订阅吗？' : 
                            'Can I cancel my subscription?',
                  answer: language === 'zh-TW' ? '當然可以！您可以隨時在帳戶設定中取消訂閱，沒有手續費或違約金。取消後您仍可使用到當前計費週期結束。' : 
                          language === 'zh-CN' ? '当然可以！您可以随时在账户设置中取消订阅，没有手续费或违约金。取消后您仍可使用到当前计费周期结束。' : 
                          'Absolutely! You can cancel your subscription anytime in your account settings with no cancellation fees. You\'ll continue to have access until the end of your current billing period.'
                }
              ].map((faq, index) => (
                <div key={index} className="bg-white rounded-lg p-6 shadow-sm hover:shadow-md transition-shadow border border-gray-100">
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{faq.question}</h3>
                  <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                </div>
              ))}
            </div>
          </div>

          {/* CTA Section */}
          <div className="mt-20 bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 rounded-2xl p-12 text-center shadow-2xl">
            <h2 className="text-3xl font-bold text-white mb-4">
              {language === 'zh-TW' ? '準備好開始了嗎？' : 
               language === 'zh-CN' ? '准备好开始了吗？' : 
               'Ready to get started?'}
            </h2>
            <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto leading-relaxed">
              {language === 'zh-TW' ? '加入數千名專業人士，使用 APEXCARD 提升您的商務社交' : 
               language === 'zh-CN' ? '加入数千名专业人士，使用 APEXCARD 提升您的商务社交' : 
               'Join thousands of professionals using APEXCARD to elevate their business networking'}
            </p>
            <Button 
              size="lg" 
              variant="secondary" 
              className="text-lg px-8 py-4 bg-white text-blue-600 hover:bg-gray-100 shadow-lg hover:shadow-xl transition-all duration-200 font-semibold"
            >
              {language === 'zh-TW' ? '立即開始免費使用' : 
               language === 'zh-CN' ? '立即开始免费使用' : 
               'Start Free Trial'}
            </Button>
          </div>
        </div>
      </section>
      
      {/* Payment Modal */}
      {selectedPlan && (
        <PaymentModal
          isOpen={isPaymentModalOpen}
          onClose={() => setIsPaymentModalOpen(false)}
          plan={selectedPlan}
          billingCycle={billingCycle}
        />
      )}
    </div>
  );
}