'use client';

import { useState } from 'react';
import { PayPalScriptProvider, PayPalButtons, FUNDING } from '@paypal/react-paypal-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { CheckCircle, XCircle, Loader2 } from 'lucide-react';

interface PayPalPaymentProps {
  amount: string;
  currency?: string;
  description?: string;
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

export default function PayPalPayment({
  amount,
  currency = 'USD',
  description,
  onSuccess,
  onError,
  className = ''
}: PayPalPaymentProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [orderDetails, setOrderDetails] = useState<any>(null);

  const paypalClientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID || 'sb';

  const createOrder = async () => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/paypal/create-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount,
          currency,
          description,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Failed to create order');
      }

      return data.orderId;
    } catch (error) {
      console.error('Create order error:', error);
      setError(error instanceof Error ? error.message : 'Failed to create order');
      onError?.(error);
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const onApprove = async (data: any) => {
    try {
      setLoading(true);
      setError(null);

      const response = await fetch('/api/paypal/capture-order', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          orderId: data.orderID,
        }),
      });

      const captureData = await response.json();

      if (!response.ok) {
        throw new Error(captureData.error || 'Failed to capture payment');
      }

      setOrderDetails(captureData);
      setSuccess(true);
      onSuccess?.(captureData);
    } catch (error) {
      console.error('Capture order error:', error);
      setError(error instanceof Error ? error.message : 'Failed to capture payment');
      onError?.(error);
    } finally {
      setLoading(false);
    }
  };

  const onErrorHandler = (error: any) => {
    console.error('PayPal button error:', error);
    setError('PayPal payment failed. Please try again.');
    onError?.(error);
  };

  const resetPayment = () => {
    setSuccess(false);
    setError(null);
    setOrderDetails(null);
  };

  if (success && orderDetails) {
    return (
      <Card className={className}>
        <CardContent className="p-6">
          <div className="text-center">
            <CheckCircle className="w-16 h-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-green-700 mb-2">
              Payment Successful!
            </h3>
            <p className="text-gray-600 mb-4">
              Thank you for your payment. Your transaction has been completed successfully.
            </p>
            <div className="bg-gray-50 rounded-lg p-4 mb-4 text-left">
              <p className="text-sm font-medium">Transaction Details:</p>
              <p className="text-sm text-gray-600">
                Amount: {orderDetails.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.value}{' '}
                {orderDetails.purchase_units?.[0]?.payments?.captures?.[0]?.amount?.currency_code}
              </p>
              <p className="text-sm text-gray-600">
                Transaction ID: {orderDetails.purchase_units?.[0]?.payments?.captures?.[0]?.id}
              </p>
              <p className="text-sm text-gray-600">
                Status: {orderDetails.purchase_units?.[0]?.payments?.captures?.[0]?.status}
              </p>
            </div>
            <Button onClick={resetPayment} variant="outline">
              Make Another Payment
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={className}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center">
            <span className="text-white text-sm font-bold">P</span>
          </div>
          PayPal Payment
        </CardTitle>
        <CardDescription>
          Pay securely with PayPal. You can pay with your PayPal balance, credit card, or debit card.
        </CardDescription>
      </CardHeader>
      <CardContent>
        {error && (
          <Alert variant="destructive" className="mb-4">
            <XCircle className="h-4 w-4" />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-4">
          <div className="flex justify-between items-center p-3 bg-gray-50 rounded-lg">
            <span className="font-medium">Amount:</span>
            <span className="text-lg font-semibold">
              {amount} {currency}
            </span>
          </div>

          {description && (
            <div className="p-3 bg-gray-50 rounded-lg">
              <span className="font-medium">Description:</span>
              <p className="text-sm text-gray-600 mt-1">{description}</p>
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="w-8 h-8 animate-spin" />
              <span className="ml-2">Processing...</span>
            </div>
          ) : (
            <PayPalScriptProvider
              options={{
                clientId: paypalClientId,
                currency: currency,
                intent: 'capture',
              }}
            >
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'pay',
                }}
                fundingSource={FUNDING.PAYPAL}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onErrorHandler}
              />
              <PayPalButtons
                style={{
                  layout: 'vertical',
                  color: 'blue',
                  shape: 'rect',
                  label: 'pay',
                }}
                fundingSource={FUNDING.CARD}
                createOrder={createOrder}
                onApprove={onApprove}
                onError={onErrorHandler}
              />
            </PayPalScriptProvider>
          )}
        </div>
      </CardContent>
    </Card>
  );
}