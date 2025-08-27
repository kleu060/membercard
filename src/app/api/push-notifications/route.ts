import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    const skip = (page - 1) * limit;

    const [notifications, totalCount] = await Promise.all([
      db.pushNotification.findMany({
        where: { userId },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.pushNotification.count({ where: { userId } })
    ]);

    return NextResponse.json({
      notifications,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching push notifications:', error);
    return NextResponse.json(
      { error: 'Failed to fetch push notifications' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      userId,
      type,
      title,
      message,
      data
    } = body;

    // Validate required fields
    if (!userId || !type || !title || !message) {
      return NextResponse.json(
        { error: 'User ID, type, title, and message are required' },
        { status: 400 }
      );
    }

    // Get user's active devices
    const devices = await db.mobileDevice.findMany({
      where: {
        userId,
        isActive: true
      }
    });

    // Create notifications for each device
    const notifications = await Promise.all(
      devices.map(device =>
        db.pushNotification.create({
          data: {
            userId,
            deviceId: device.id,
            type,
            title,
            message,
            data: data ? JSON.stringify(data) : null
          }
        })
      )
    );

    // Here you would typically integrate with a push notification service
    // like Firebase Cloud Messaging, Apple Push Notification Service, etc.
    // For now, we'll just create the records

    return NextResponse.json({ notifications });
  } catch (error) {
    console.error('Error creating push notification:', error);
    return NextResponse.json(
      { error: 'Failed to create push notification' },
      { status: 500 }
    );
  }
}