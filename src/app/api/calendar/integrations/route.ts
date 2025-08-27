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

    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    // Verify the user can only access their own integrations
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.id !== userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integrations = await db.calendarIntegration.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json(integrations);
  } catch (error) {
    console.error('Error fetching calendar integrations:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { provider, accessToken, refreshToken, expiresAt, calendarId } = body;

    if (!provider || !accessToken) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Get user from session
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if integration already exists for this provider
    const existingIntegration = await db.calendarIntegration.findFirst({
      where: {
        userId: user.id,
        provider
      }
    });

    if (existingIntegration) {
      // Update existing integration
      const updatedIntegration = await db.calendarIntegration.update({
        where: { id: existingIntegration.id },
        data: {
          accessToken,
          refreshToken,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          calendarId,
          isActive: true
        }
      });

      return NextResponse.json(updatedIntegration);
    } else {
      // Create new integration
      const newIntegration = await db.calendarIntegration.create({
        data: {
          userId: user.id,
          provider,
          accessToken,
          refreshToken,
          expiresAt: expiresAt ? new Date(expiresAt) : null,
          calendarId,
          isActive: true
        }
      });

      return NextResponse.json(newIntegration);
    }
  } catch (error) {
    console.error('Error creating calendar integration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}