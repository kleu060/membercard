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

    const careerHistory = await db.careerHistory.findMany({
      where: { profileId: jobProfile.id },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json(careerHistory);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching career history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { title, company, startDate, endDate, isCurrent, description } = await request.json();

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id },
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const careerHistory = await db.careerHistory.create({
      data: {
        profileId: jobProfile.id,
        title,
        company,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent,
        description,
      },
    });

    return NextResponse.json(careerHistory);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating career history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}