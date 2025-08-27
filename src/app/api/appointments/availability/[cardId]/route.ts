import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    const cardId = params.cardId;

    // Get availability settings for the business card
    const availability = await db.appointmentAvailability.findMany({
      where: {
        cardId,
        isAvailable: true
      },
      orderBy: [
        { dayOfWeek: 'asc' },
        { startTime: 'asc' }
      ]
    });

    return NextResponse.json(availability);
  } catch (error) {
    console.error('Error fetching availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const cardId = params.cardId;
    const body = await request.json();
    const { dayOfWeek, startTime, endTime, maxAppointments, bufferTime } = body;

    // Validate required fields
    if (dayOfWeek === undefined || !startTime || !endTime) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Validate dayOfWeek range
    if (dayOfWeek < 0 || dayOfWeek > 6) {
      return NextResponse.json({ error: 'Day of week must be between 0 and 6' }, { status: 400 });
    }

    // Validate time format (HH:mm)
    const timeRegex = /^([01]?[0-9]|2[0-3]):[0-5][0-9]$/;
    if (!timeRegex.test(startTime) || !timeRegex.test(endTime)) {
      return NextResponse.json({ error: 'Invalid time format. Use HH:mm' }, { status: 400 });
    }

    // Check if the business card exists and user owns it
    const businessCard = await db.businessCard.findUnique({
      where: { id: cardId },
      include: {
        user: {
          select: {
            email: true
          }
        }
      }
    });

    if (!businessCard) {
      return NextResponse.json({ error: 'Business card not found' }, { status: 404 });
    }

    if (businessCard.user.email !== session.user.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if availability already exists for this day and time
    const existingAvailability = await db.appointmentAvailability.findUnique({
      where: {
        cardId_dayOfWeek_startTime: {
          cardId,
          dayOfWeek,
          startTime
        }
      }
    });

    if (existingAvailability) {
      // Update existing availability
      const updatedAvailability = await db.appointmentAvailability.update({
        where: { id: existingAvailability.id },
        data: {
          endTime,
          maxAppointments: maxAppointments || 1,
          bufferTime: bufferTime || 0,
          isAvailable: true
        }
      });

      return NextResponse.json(updatedAvailability);
    } else {
      // Create new availability
      const newAvailability = await db.appointmentAvailability.create({
        data: {
          cardId,
          dayOfWeek,
          startTime,
          endTime,
          maxAppointments: maxAppointments || 1,
          bufferTime: bufferTime || 0,
          isAvailable: true
        }
      });

      return NextResponse.json(newAvailability);
    }
  } catch (error) {
    console.error('Error creating/updating availability:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}