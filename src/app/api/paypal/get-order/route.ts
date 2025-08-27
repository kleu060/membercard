import { NextRequest, NextResponse } from 'next/server';
import { getPayPalService } from '@/lib/paypal';

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { orderId } = body;

    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required' },
        { status: 400 }
      );
    }

    const paypalService = getPayPalService();
    const order = await paypalService.getOrderDetails(orderId);

    return NextResponse.json({
      success: true,
      orderId: order.id,
      status: order.status,
      intent: order.intent,
      payer: order.payer,
      purchase_units: order.purchase_units,
      create_time: order.create_time,
      update_time: order.update_time,
      links: order.links,
    });
  } catch (error) {
    console.error('Get PayPal order details error:', error);
    return NextResponse.json(
      { error: 'Failed to get PayPal order details' },
      { status: 500 }
    );
  }
}