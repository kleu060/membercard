import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id },
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json({
      email: user.email,
      visibility: true,
      jobOpportunitiesNotification: true,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { email, visibility, jobOpportunitiesNotification } = await request.json();

    // Update user email if changed
    if (email && email !== user.email) {
      await db.user.update({
        where: { id: user.id },
        data: { email },
      });
    }

    return NextResponse.json({
      email: email || user.email,
      visibility,
      jobOpportunitiesNotification,
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error updating settings:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}