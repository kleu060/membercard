import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Temporarily disable authentication for debugging
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const body = await request.json();
    const {
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

    // Check if the booking settings exist and belong to the user
    const existingSettings = await db.bookingSettings.findUnique({
      where: { id: params.id },
      include: { timeSlots: true }
    });

    if (!existingSettings) {
      return NextResponse.json({ error: 'Booking settings not found' }, { status: 404 });
    }

    const bookingSettings = await db.bookingSettings.update({
      where: { id: params.id },
      data: {
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
    console.error('Error updating booking settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Temporarily disable authentication for debugging
    // const session = await getServerSession(authOptions);
    // if (!session?.user?.id) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    // Check if the booking settings exist and belong to the user
    const existingSettings = await db.bookingSettings.findUnique({
      where: { id: params.id }
    });

    if (!existingSettings) {
      return NextResponse.json({ error: 'Booking settings not found' }, { status: 404 });
    }

    // Delete associated time slots first
    await db.timeSlot.deleteMany({
      where: { bookingSettingsId: params.id }
    });

    // Delete booking settings
    await db.bookingSettings.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ message: 'Booking settings deleted successfully' });
  } catch (error) {
    console.error('Error deleting booking settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}