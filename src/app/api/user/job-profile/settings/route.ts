import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (!jobProfile) {
      return NextResponse.json({ settings: null });
    }

    // For now, we'll return the job profile itself as settings
    // In a real implementation, you might have a separate settings table
    return NextResponse.json({ 
      settings: {
        email: user.email,
        searchable: true, // Default value
        notifications: true // Default value
      }
    });
  } catch (error) {
    console.error('Error fetching user settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchable, notifications } = await request.json();

    // For now, we'll just return the updated settings
    // In a real implementation, you might update a separate settings table
    return NextResponse.json({ 
      settings: {
        email: user.email,
        searchable,
        notifications
      }
    });
  } catch (error) {
    console.error('Error updating user settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}