import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify the user can only access their own appointments
    if (user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointments = await db.appointment.findMany({
      where: { userId },
      include: {
        businessCard: {
          select: {
            id: true,
            name: true,
            company: true,
            template: true
          }
        }
      },
      orderBy: { appointmentDate: 'desc' }
    });

    return NextResponse.json(appointments);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching appointments:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const body = await request.json();
    const {
      cardId,
      title,
      description,
      appointmentDate,
      duration,
      contactName,
      contactEmail,
      contactPhone,
      notes
    } = body;

    // Validate required fields
    if (!cardId || !title || !appointmentDate || !contactName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user from session
    // User is already available from requireAuth()

    // Verify the business card exists and is public
    const businessCard = await db.businessCard.findUnique({
      where: { id: cardId }
    });

    if (!businessCard || !businessCard.isPublic) {
      return NextResponse.json({ error: 'Business card not found or not public' }, { status: 404 });
    }

    // Check if the appointment time is available
    const appointmentDateTime = new Date(appointmentDate);
    const dayOfWeek = appointmentDateTime.getDay();
    
    // Get availability for that day
    const availability = await db.appointmentAvailability.findMany({
      where: {
        cardId,
        dayOfWeek,
        isAvailable: true
      }
    });

    if (availability.length === 0) {
      return NextResponse.json({ error: 'No availability for the selected date' }, { status: 400 });
    }

    // Check if the time slot is available
    const appointmentTime = appointmentDateTime.toTimeString().slice(0, 5); // HH:mm format
    const isTimeAvailable = availability.some(slot => {
      const startTime = slot.startTime;
      const endTime = slot.endTime;
      return appointmentTime >= startTime && appointmentTime < endTime;
    });

    if (!isTimeAvailable) {
      return NextResponse.json({ error: 'Selected time is not available' }, { status: 400 });
    }

    // Check for conflicting appointments
    const conflictingAppointments = await db.appointment.findMany({
      where: {
        cardId,
        status: { in: ['pending', 'confirmed'] },
        appointmentDate: {
          gte: new Date(appointmentDateTime.getTime() - duration * 60000), // Start time minus duration
          lte: new Date(appointmentDateTime.getTime() + duration * 60000)   // End time
        }
      }
    });

    if (conflictingAppointments.length > 0) {
      return NextResponse.json({ error: 'Time slot is already booked' }, { status: 400 });
    }

    // Create the appointment
    const appointment = await db.appointment.create({
      data: {
        cardId,
        userId: user.id,
        title,
        description,
        appointmentDate: appointmentDateTime,
        duration: duration || 30,
        status: 'pending',
        contactName,
        contactEmail,
        contactPhone,
        notes
      },
      include: {
        businessCard: {
          select: {
            id: true,
            name: true,
            company: true,
            template: true
          }
        }
      }
    });

    // TODO: Send notification to business card owner
    // TODO: Add to calendar if integration is set up

    return NextResponse.json(appointment);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}