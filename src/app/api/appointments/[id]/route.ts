import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointmentId = params.id;

    const appointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        businessCard: {
          select: {
            id: true,
            name: true,
            company: true,
            template: true,
            userId: true
          }
        },
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    if (!appointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check if user is authorized to view this appointment
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.id !== appointment.userId && user.id !== appointment.businessCard.userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json(appointment);
  } catch (error) {
    console.error('Error fetching appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointmentId = params.id;
    const body = await request.json();
    const { status, notes } = body;

    // Get the appointment first to check ownership
    const existingAppointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        businessCard: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check if user is authorized to update this appointment
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.id !== existingAppointment.businessCard.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Update the appointment
    const updatedAppointment = await db.appointment.update({
      where: { id: appointmentId },
      data: {
        status: status || existingAppointment.status,
        notes: notes !== undefined ? notes : existingAppointment.notes
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

    // TODO: Send notification to the user who made the appointment
    // TODO: Update calendar event if status changes

    return NextResponse.json(updatedAppointment);
  } catch (error) {
    console.error('Error updating appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const appointmentId = params.id;

    // Get the appointment first to check ownership
    const existingAppointment = await db.appointment.findUnique({
      where: { id: appointmentId },
      include: {
        businessCard: {
          select: {
            userId: true
          }
        }
      }
    });

    if (!existingAppointment) {
      return NextResponse.json({ error: 'Appointment not found' }, { status: 404 });
    }

    // Check if user is authorized to delete this appointment
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || (user.id !== existingAppointment.userId && user.id !== existingAppointment.businessCard.userId)) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the appointment
    await db.appointment.delete({
      where: { id: appointmentId }
    });

    // TODO: Remove from calendar if it exists

    return NextResponse.json({ message: 'Appointment deleted successfully' });
  } catch (error) {
    console.error('Error deleting appointment:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}