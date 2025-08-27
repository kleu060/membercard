import { NextRequest, NextResponse } from 'next/server';
import { getPayPalService } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    // Get PayPal webhook headers
    const headers = {
      'paypal-transmission-id': request.headers.get('paypal-transmission-id'),
      'paypal-cert-url': request.headers.get('paypal-cert-url'),
      'paypal-auth-algo': request.headers.get('paypal-auth-algo'),
      'paypal-transmission-sig': request.headers.get('paypal-transmission-sig'),
      'paypal-transmission-time': request.headers.get('paypal-transmission-time'),
    };

    const body = await request.json();

    // Verify webhook signature
    const paypalService = getPayPalService();
    const verification = await paypalService.verifyWebhookSignature(headers, body);

    if (verification.verification_status !== 'SUCCESS') {
      console.error('PayPal webhook verification failed:', verification);
      return NextResponse.json(
        { error: 'Webhook verification failed' },
        { status: 400 }
      );
    }

    // Process the webhook event
    const eventType = body.event_type;
    const resource = body.resource;

    console.log(`PayPal webhook received: ${eventType}`, resource);

    // Handle different event types
    switch (eventType) {
      case 'PAYMENT.CAPTURE.COMPLETED':
        await handlePaymentCompleted(resource);
        break;
      case 'PAYMENT.CAPTURE.DENIED':
        await handlePaymentDenied(resource);
        break;
      case 'PAYMENT.CAPTURE.PENDING':
        await handlePaymentPending(resource);
        break;
      case 'PAYMENT.CAPTURE.REFUNDED':
        await handlePaymentRefunded(resource);
        break;
      default:
        console.log(`Unhandled PayPal event type: ${eventType}`);
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('PayPal webhook error:', error);
    return NextResponse.json(
      { error: 'Failed to process webhook' },
      { status: 500 }
    );
  }
}

async function handlePaymentCompleted(resource: any) {
  console.log('Payment completed:', resource);
  
  // Update your database with payment completion
  // Example: Update order status, send confirmation email, etc.
  
  // You can access payment details like:
  // - resource.id: Capture ID
  // - resource.amount: Payment amount
  // - resource.payer: Payer information
  // - resource.create_time: Payment completion time
}

async function handlePaymentDenied(resource: any) {
  console.log('Payment denied:', resource);
  
  // Handle denied payments
  // Example: Update order status, notify user, etc.
}

async function handlePaymentPending(resource: any) {
  console.log('Payment pending:', resource);
  
  // Handle pending payments
  // Example: Update order status to pending, etc.
}

async function handlePaymentRefunded(resource: any) {
  console.log('Payment refunded:', resource);
  
  // Handle refunds
  // Example: Update order status, process refund, etc.
}