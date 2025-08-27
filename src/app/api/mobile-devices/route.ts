import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const devices = await db.mobileDevice.findMany({
      where: { userId },
      orderBy: { lastSeenAt: 'desc' }
    });

    return NextResponse.json({ devices });
  } catch (error) {
    console.error('Error fetching mobile devices:', error);
    return NextResponse.json(
      { error: 'Failed to fetch mobile devices' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      deviceType,
      deviceToken
    } = body;

    // Validate required fields
    if (!userId || !deviceType) {
      return NextResponse.json(
        { error: 'User ID and device type are required' },
        { status: 400 }
      );
    }

    // Check if device already exists
    const existingDevice = await db.mobileDevice.findFirst({
      where: {
        userId,
        deviceType,
        deviceToken
      }
    });

    if (existingDevice) {
      // Update existing device
      const updatedDevice = await db.mobileDevice.update({
        where: { id: existingDevice.id },
        data: {
          isActive: true,
          lastSeenAt: new Date()
        }
      });

      return NextResponse.json(updatedDevice);
    }

    // Create new device
    const device = await db.mobileDevice.create({
      data: {
        userId,
        deviceType,
        deviceToken: deviceToken || null,
        isActive: true,
        lastSeenAt: new Date()
      }
    });

    return NextResponse.json(device);
  } catch (error) {
    console.error('Error registering mobile device:', error);
    return NextResponse.json(
      { error: 'Failed to register mobile device' },
      { status: 500 }
    );
  }
}