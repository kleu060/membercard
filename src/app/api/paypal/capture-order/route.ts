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
    const capture = await paypalService.captureOrder(orderId);

    return NextResponse.json({
      success: true,
      captureId: capture.id,
      status: capture.status,
      payer: capture.payer,
      purchase_units: capture.purchase_units,
      create_time: capture.create_time,
      update_time: capture.update_time,
    });
  } catch (error) {
    console.error('Capture PayPal order error:', error);
    return NextResponse.json(
      { error: 'Failed to capture PayPal order' },
      { status: 500 }
    );
  }
}