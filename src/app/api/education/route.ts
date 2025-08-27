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

    const education = await db.education.findMany({
      where: { profileId: jobProfile.id },
      orderBy: { startDate: 'desc' },
    });

    return NextResponse.json(education);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching education:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { institution, degree, field, startDate, endDate, isCurrent, gpa, description } = await request.json();

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id },
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const education = await db.education.create({
      data: {
        profileId: jobProfile.id,
        institution,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent,
        gpa,
        description,
      },
    });

    return NextResponse.json(education);
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error creating education:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}