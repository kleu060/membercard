import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; timeSlotId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const {
      dayOfWeek,
      startTime,
      endTime,
      isAvailable,
      maxBookings
    } = body;

    // Check if the booking settings exist and belong to the user
    const bookingSettings = await db.bookingSettings.findUnique({
      where: { id: params.id }
    });

    if (!bookingSettings) {
      return NextResponse.json({ error: 'Booking settings not found' }, { status: 404 });
    }

    if (bookingSettings.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the time slot exists and belongs to the booking settings
    const existingTimeSlot = await db.timeSlot.findUnique({
      where: { id: params.timeSlotId }
    });

    if (!existingTimeSlot) {
      return NextResponse.json({ error: 'Time slot not found' }, { status: 404 });
    }

    if (existingTimeSlot.bookingSettingsId !== params.id) {
      return NextResponse.json({ error: 'Time slot does not belong to these booking settings' }, { status: 400 });
    }

    // Validate time slot
    if (dayOfWeek !== undefined && (dayOfWeek < 0 || dayOfWeek > 6)) {
      return NextResponse.json({ error: 'Invalid day of week' }, { status: 400 });
    }

    if (startTime && endTime && startTime >= endTime) {
      return NextResponse.json({ error: 'Start time must be before end time' }, { status: 400 });
    }

    const timeSlot = await db.timeSlot.update({
      where: { id: params.timeSlotId },
      data: {
        ...(dayOfWeek !== undefined && { dayOfWeek }),
        ...(startTime !== undefined && { startTime }),
        ...(endTime !== undefined && { endTime }),
        ...(isAvailable !== undefined && { isAvailable }),
        ...(maxBookings !== undefined && { maxBookings })
      }
    });

    return NextResponse.json(timeSlot);
  } catch (error) {
    console.error('Error updating time slot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; timeSlotId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the booking settings exist and belong to the user
    const bookingSettings = await db.bookingSettings.findUnique({
      where: { id: params.id }
    });

    if (!bookingSettings) {
      return NextResponse.json({ error: 'Booking settings not found' }, { status: 404 });
    }

    if (bookingSettings.userId !== session.user.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if the time slot exists and belongs to the booking settings
    const existingTimeSlot = await db.timeSlot.findUnique({
      where: { id: params.timeSlotId }
    });

    if (!existingTimeSlot) {
      return NextResponse.json({ error: 'Time slot not found' }, { status: 404 });
    }

    if (existingTimeSlot.bookingSettingsId !== params.id) {
      return NextResponse.json({ error: 'Time slot does not belong to these booking settings' }, { status: 400 });
    }

    await db.timeSlot.delete({
      where: { id: params.timeSlotId }
    });

    return NextResponse.json({ message: 'Time slot deleted successfully' });
  } catch (error) {
    console.error('Error deleting time slot:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}