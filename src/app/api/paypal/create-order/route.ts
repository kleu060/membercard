import { NextRequest, NextResponse } from 'next/server';
import { getPayPalService } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { amount, currency = 'USD', description } = body;

    if (!amount || isNaN(parseFloat(amount))) {
      return NextResponse.json(
        { error: 'Invalid amount provided' },
        { status: 400 }
      );
    }

    const paypalService = getPayPalService();
    const order = await paypalService.createOrder(amount, currency, description);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      links: order.links,
    });
  } catch (error) {
    console.error('Create PayPal order error:', error);
    return NextResponse.json(
      { error: 'Failed to create PayPal order' },
      { status: 500 }
    );
  }
}