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

    const applications = await db.application.findMany({
      where: { profileId: jobProfile.id },
      orderBy: { appliedAt: 'desc' },
    });

    return NextResponse.json(applications);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching applications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { jobId, status, notes } = await request.json();

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id },
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const application = await db.application.create({
      data: {
        profileId: jobProfile.id,
        jobId,
        status,
        notes,
      },
    });

    return NextResponse.json(application);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating application:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}