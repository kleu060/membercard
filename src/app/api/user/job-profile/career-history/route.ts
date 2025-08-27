import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id },
      include: {
        careerHistory: {
          orderBy: { startDate: 'desc' }
        }
      }
    });

    if (!jobProfile) {
      return NextResponse.json({ careerHistory: [] });
    }

    return NextResponse.json({ careerHistory: jobProfile.careerHistory });
  } catch (error) {
    console.error('Error fetching career history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { title, company, startDate, endDate, isCurrent, description } = await request.json();

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Job profile not found' }, { status: 404 });
    }

    const newCareerHistory = await db.careerHistory.create({
      data: {
        profileId: jobProfile.id,
        title,
        company,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent,
        description
      }
    });

    console.log('Created career history:', newCareerHistory);
    return NextResponse.json({ careerHistory: newCareerHistory });
  } catch (error) {
    console.error('Error creating career history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}