'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Check, Star, X } from 'lucide-react';
import PayPalPayment from '@/components/payments/PayPalPayment';
import { useLanguage } from '@/contexts/LanguageContext';

interface PricingPlan {
  name: string;
  price: number;
  annualPrice: number;
  description: string;
  features: string[];
  cta: string;
  popular: boolean;
}

interface PaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  plan: PricingPlan;
  billingCycle: 'monthly' | 'annual';
}

export default function PaymentModal({ isOpen, onClose, plan, billingCycle }: PaymentModalProps) {
  const [showPayPal, setShowPayPal] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const { language } = useLanguage();

  const amount = billingCycle === 'monthly' ? plan.price : plan.annualPrice;
  const description = language === 'zh-TW' 
    ? `${plan.name} - ${billingCycle === 'monthly' ? '月付' : '年付'}`
    : language === 'zh-CN'
    ? `${plan.name} - ${billingCycle === 'monthly' ? '月付' : '年付'}`
    : `${plan.name} - ${billingCycle === 'monthly' ? 'Monthly' : 'Annual'}`;

  const handlePaymentSuccess = (details: any) => {
    setPaymentSuccess(true);
    console.log('Payment successful:', details);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
  };

  const handleClose = () => {
    setShowPayPal(false);
    setPaymentSuccess(false);
    onClose();
  };

  if (paymentSuccess) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <DialogTitle className="flex items-center gap-2">
                <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                {language === 'zh-TW' ? '付款成功' : language === 'zh-CN' ? '付款成功' : 'Payment Successful'}
              </DialogTitle>
              <Button variant="ghost" size="icon" onClick={handleClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogHeader>
          <div className="text-center py-6">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Check className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {language === 'zh-TW' ? '恭喜！付款成功' : language === 'zh-CN' ? '恭喜！付款成功' : 'Congratulations! Payment Successful'}
            </h3>
            <p className="text-gray-600 mb-6">
              {language === 'zh-TW' 
                ? `您已成功訂閱 ${plan.name} 方案`
                : language === 'zh-CN'
                ? `您已成功订阅 ${plan.name} 方案`
                : `You have successfully subscribed to ${plan.name} plan`
              }
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-6">
              <p className="text-sm font-medium mb-2">
                {language === 'zh-TW' ? '訂閱詳情' : language === 'zh-CN' ? '订阅详情' : 'Subscription Details'}
              </p>
              <div className="space-y-1 text-sm text-gray-600">
                <p>{plan.name}</p>
                <p>
                  ${amount} / {billingCycle === 'monthly' 
                    ? (language === 'zh-TW' ? '月' : language === 'zh-CN' ? '月' : 'month') 
                    : (language === 'zh-TW' ? '年' : language === 'zh-CN' ? '年' : 'year')
                  }
                </p>
              </div>
            </div>
            <Button onClick={handleClose} className="w-full">
              {language === 'zh-TW' ? '開始使用' : language === 'zh-CN' ? '开始使用' : 'Get Started'}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
                <span className="text-white text-sm font-bold">P</span>
              </div>
              {language === 'zh-TW' ? '選擇付款方式' : language === 'zh-CN' ? '选择付款方式' : 'Choose Payment Method'}
            </DialogTitle>
            <Button variant="ghost" size="icon" onClick={handleClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
          <DialogDescription>
            {language === 'zh-TW' 
              ? `為您的 ${plan.name} 訂閱選擇付款方式`
              : language === 'zh-CN'
              ? `为您的 ${plan.name} 订阅选择付款方式`
              : `Choose payment method for your ${plan.name} subscription`
            }
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">
                {language === 'zh-TW' ? '訂單摘要' : language === 'zh-CN' ? '订单摘要' : 'Order Summary'}
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <div>
                    <p className="font-medium">{plan.name}</p>
                    <p className="text-sm text-gray-600">{plan.description}</p>
                  </div>
                  <div className="text-right">
                    <p className="text-lg font-semibold">${amount}</p>
                    <p className="text-sm text-gray-600">
                      /{billingCycle === 'monthly' 
                        ? (language === 'zh-TW' ? '月' : language === 'zh-CN' ? '月' : 'month') 
                        : (language === 'zh-TW' ? '年' : language === 'zh-CN' ? '年' : 'year')
                      }
                    </p>
                  </div>
                </div>
                {plan.popular && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300">
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-current" />
                      <span>
                        {language === 'zh-TW' ? '最受歡迎' : language === 'zh-CN' ? '最受欢迎' : 'Most Popular'}
                      </span>
                    </div>
                  </Badge>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Payment Options */}
          {showPayPal ? (
            <PayPalPayment
              amount={amount.toString()}
              currency="USD"
              description={description}
              onSuccess={handlePaymentSuccess}
              onError={handlePaymentError}
            />
          ) : (
            <div className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                {/* PayPal Option */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-200"
                     onClick={() => setShowPayPal(true)}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-blue-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-xl font-bold">P</span>
                      </div>
                      <h3 className="font-semibold mb-2">PayPal</h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {language === 'zh-TW' 
                          ? '使用 PayPal、信用卡或借記卡付款'
                          : language === 'zh-CN'
                          ? '使用 PayPal、信用卡或借记卡付款'
                          : 'Pay with PayPal, credit or debit card'
                        }
                      </p>
                      <div className="flex justify-center space-x-2">
                        <div className="w-8 h-6 bg-gray-800 rounded text-white text-xs flex items-center justify-center">VISA</div>
                        <div className="w-8 h-6 bg-red-600 rounded text-white text-xs flex items-center justify-center">MC</div>
                        <div className="w-8 h-6 bg-blue-600 rounded text-white text-xs flex items-center justify-center">PP</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Bank Transfer Option */}
                <Card className="cursor-pointer hover:shadow-md transition-shadow border-2 border-transparent hover:border-blue-200 opacity-50"
                     title={language === 'zh-TW' ? '即將推出' : language === 'zh-CN' ? '即将推出' : 'Coming soon'}>
                  <CardContent className="p-6">
                    <div className="text-center">
                      <div className="w-16 h-16 bg-gray-500 rounded-full flex items-center justify-center mx-auto mb-4">
                        <span className="text-white text-xl font-bold">B</span>
                      </div>
                      <h3 className="font-semibold mb-2">
                        {language === 'zh-TW' ? '銀行轉帳' : language === 'zh-CN' ? '银行转账' : 'Bank Transfer'}
                      </h3>
                      <p className="text-sm text-gray-600 mb-4">
                        {language === 'zh-TW' 
                          ? '直接銀行轉帳'
                          : language === 'zh-CN'
                          ? '直接银行转账'
                          : 'Direct bank transfer'
                        }
                      </p>
                      <Badge variant="secondary">
                        {language === 'zh-TW' ? '即將推出' : language === 'zh-CN' ? '即将推出' : 'Coming Soon'}
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Alert>
                <AlertDescription>
                  {language === 'zh-TW' 
                    ? '所有付款都通過安全加密處理。我們不會儲存您的信用卡資訊。'
                    : language === 'zh-CN'
                    ? '所有付款都通过安全加密处理。我们不会存储您的信用卡信息。'
                    : 'All payments are processed securely with encryption. We do not store your credit card information.'
                  }
                </AlertDescription>
              </Alert>

              <div className="flex justify-between">
                <Button variant="outline" onClick={handleClose}>
                  {language === 'zh-TW' ? '取消' : language === 'zh-CN' ? '取消' : 'Cancel'}
                </Button>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}