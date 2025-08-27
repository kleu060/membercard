import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET(request: NextRequest) {
  try {
    // Temporarily disable authentication for debugging
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Temporarily disable user ID check for debugging
    // if (userId !== session.user.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const bookingSettings = await db.bookingSettings.findUnique({
      where: { userId },
      include: {
        timeSlots: {
          orderBy: [
            { dayOfWeek: 'asc' },
            { startTime: 'asc' }
          ]
        }
      }
    });

    return NextResponse.json(bookingSettings);
  } catch (error) {
    console.error('Error fetching booking settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    // Temporarily disable authentication for debugging
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const {
      userId,
      locationType,
      locationAddress,
      onlineMeetingLink,
      basePrice,
      currency,
      duration,
      maxAdvanceDays,
      minAdvanceHours,
      cancellationPolicy,
      lunchBreakStart,
      lunchBreakEnd,
      // Working hours
      monEnabled,
      monStart,
      monEnd,
      tueEnabled,
      tueStart,
      tueEnd,
      wedEnabled,
      wedStart,
      wedEnd,
      thuEnabled,
      thuStart,
      thuEnd,
      friEnabled,
      friStart,
      friEnd,
      satEnabled,
      satStart,
      satEnd,
      sunEnabled,
      sunStart,
      sunEnd
    } = body;

    // Temporarily disable user ID check for debugging
    // if (!userId || userId !== session.user.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Check if booking settings already exist
    const existingSettings = await db.bookingSettings.findUnique({
      where: { userId }
    });

    if (existingSettings) {
      return NextResponse.json({ error: 'Booking settings already exist' }, { status: 400 });
    }

    const bookingSettings = await db.bookingSettings.create({
      data: {
        userId,
        locationType,
        locationAddress: locationAddress || null,
        onlineMeetingLink: onlineMeetingLink || null,
        basePrice: basePrice || 0,
        currency: currency || 'TWD',
        duration: duration || 60,
        maxAdvanceDays: maxAdvanceDays || 30,
        minAdvanceHours: minAdvanceHours || 2,
        cancellationPolicy: cancellationPolicy || null,
        lunchBreakStart: lunchBreakStart || null,
        lunchBreakEnd: lunchBreakEnd || null,
        // Working hours
        monEnabled: monEnabled ?? true,
        monStart: monStart || '09:00',
        monEnd: monEnd || '18:00',
        tueEnabled: tueEnabled ?? true,
        tueStart: tueStart || '09:00',
        tueEnd: tueEnd || '18:00',
        wedEnabled: wedEnabled ?? true,
        wedStart: wedStart || '09:00',
        wedEnd: wedEnd || '18:00',
        thuEnabled: thuEnabled ?? true,
        thuStart: thuStart || '09:00',
        thuEnd: thuEnd || '18:00',
        friEnabled: friEnabled ?? true,
        friStart: friStart || '09:00',
        friEnd: friEnd || '18:00',
        satEnabled: satEnabled ?? false,
        satStart: satStart || '09:00',
        satEnd: satEnd || '18:00',
        sunEnabled: sunEnabled ?? false,
        sunStart: sunStart || '09:00',
        sunEnd: sunEnd || '18:00'
      },
      include: {
        timeSlots: {
          orderBy: [
            { dayOfWeek: 'asc' },
            { startTime: 'asc' }
          ]
        }
      }
    });

    return NextResponse.json(bookingSettings);
  } catch (error) {
    console.error('Error creating booking settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}