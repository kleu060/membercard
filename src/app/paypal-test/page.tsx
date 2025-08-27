'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import PayPalPayment from '@/components/payments/PayPalPayment';

export default function PayPalTestPage() {
  const [amount, setAmount] = useState('10.00');
  const [currency, setCurrency] = useState('USD');
  const [description, setDescription] = useState('Test Payment');
  const [showPayment, setShowPayment] = useState(false);
  const [paymentResult, setPaymentResult] = useState<any>(null);

  const handlePaymentSuccess = (details: any) => {
    console.log('Payment successful:', details);
    setPaymentResult({
      success: true,
      details
    });
    setShowPayment(false);
  };

  const handlePaymentError = (error: any) => {
    console.error('Payment error:', error);
    setPaymentResult({
      success: false,
      error: error.message || 'Payment failed'
    });
    setShowPayment(false);
  };

  const resetTest = () => {
    setPaymentResult(null);
    setShowPayment(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="text-center mb-12">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            PayPal Integration Test
          </h1>
          <p className="text-lg text-gray-600">
            Test the PayPal payment integration with different amounts and currencies
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Configuration Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Payment Configuration</CardTitle>
              <CardDescription>
                Configure the payment details for testing
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="amount">Amount</Label>
                <Input
                  id="amount"
                  type="number"
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="10.00"
                  step="0.01"
                  min="0.01"
                />
              </div>

              <div>
                <Label htmlFor="currency">Currency</Label>
                <Select value={currency} onValueChange={setCurrency}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="USD">USD - US Dollar</SelectItem>
                    <SelectItem value="EUR">EUR - Euro</SelectItem>
                    <SelectItem value="GBP">GBP - British Pound</SelectItem>
                    <SelectItem value="CAD">CAD - Canadian Dollar</SelectItem>
                    <SelectItem value="AUD">AUD - Australian Dollar</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Input
                  id="description"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Payment description"
                />
              </div>

              {!showPayment && (
                <Button 
                  onClick={() => setShowPayment(true)}
                  className="w-full"
                >
                  Show PayPal Payment
                </Button>
              )}

              {showPayment && (
                <Button 
                  onClick={() => setShowPayment(false)}
                  variant="outline"
                  className="w-full"
                >
                  Hide PayPal Payment
                </Button>
              )}
            </CardContent>
          </Card>

          {/* Payment Panel */}
          <div>
            {showPayment ? (
              <PayPalPayment
                amount={amount}
                currency={currency}
                description={description}
                onSuccess={handlePaymentSuccess}
                onError={handlePaymentError}
              />
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle>Payment Result</CardTitle>
                  <CardDescription>
                    Complete a payment to see the result here
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  {paymentResult ? (
                    <div className={`p-4 rounded-lg ${
                      paymentResult.success 
                        ? 'bg-green-50 border border-green-200' 
                        : 'bg-red-50 border border-red-200'
                    }`}>
                      <h3 className={`font-semibold mb-2 ${
                        paymentResult.success ? 'text-green-800' : 'text-red-800'
                      }`}>
                        {paymentResult.success ? '✅ Payment Successful!' : '❌ Payment Failed'}
                      </h3>
                      {paymentResult.success ? (
                        <div className="text-sm text-green-700">
                          <p><strong>Amount:</strong> {amount} {currency}</p>
                          <p><strong>Description:</strong> {description}</p>
                          <p><strong>Transaction ID:</strong> {
                            paymentResult.details.purchase_units?.[0]?.payments?.captures?.[0]?.id || 'N/A'
                          }</p>
                          <p><strong>Status:</strong> {
                            paymentResult.details.purchase_units?.[0]?.payments?.captures?.[0]?.status || 'N/A'
                          }</p>
                        </div>
                      ) : (
                        <div className="text-sm text-red-700">
                          <p><strong>Error:</strong> {paymentResult.error}</p>
                          <p>Please try again or check your PayPal credentials.</p>
                        </div>
                      )}
                      <Button 
                        onClick={resetTest}
                        variant="outline"
                        size="sm"
                        className="mt-4"
                      >
                        Test Another Payment
                      </Button>
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <p>No payment completed yet.</p>
                      <p className="text-sm">Configure a payment and click "Show PayPal Payment" to begin.</p>
                    </div>
                  )}
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Instructions */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Testing Instructions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Sandbox Testing</h4>
                <p>This integration uses PayPal's sandbox environment for testing. No real money is charged.</p>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Test Credentials</h4>
                <p>You can use PayPal's sandbox test accounts:</p>
                <ul className="list-disc list-inside ml-4 space-y-1">
                  <li>Buyer: buyer@example.com / password</li>
                  <li>Seller: seller@example.com / password</li>
                </ul>
              </div>
              <div>
                <h4 className="font-semibold text-gray-900 mb-1">Configuration</h4>
                <p>Make sure your .env file has the correct PayPal credentials:</p>
                <div className="bg-gray-100 p-3 rounded font-mono text-xs mt-2">
                  PAYPAL_CLIENT_ID=your_sandbox_client_id<br/>
                  PAYPAL_CLIENT_SECRET=your_sandbox_client_secret<br/>
                  PAYPAL_ENVIRONMENT=sandbox<br/>
                  NEXT_PUBLIC_PAYPAL_CLIENT_ID=sb
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}