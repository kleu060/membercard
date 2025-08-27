import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify the career history belongs to the user's job profile
    const existingCareerHistory = await db.careerHistory.findFirst({
      where: {
        id: params.id,
        profileId: jobProfile.id
      }
    });

    if (!existingCareerHistory) {
      return NextResponse.json({ error: 'Career history not found' }, { status: 404 });
    }

    const updatedCareerHistory = await db.careerHistory.update({
      where: { id: params.id },
      data: {
        title,
        company,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent,
        description
      }
    });

    return NextResponse.json({ careerHistory: updatedCareerHistory });
  } catch (error) {
    console.error('Error updating career history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Job profile not found' }, { status: 404 });
    }

    // Verify the career history belongs to the user's job profile
    const existingCareerHistory = await db.careerHistory.findFirst({
      where: {
        id: params.id,
        profileId: jobProfile.id
      }
    });

    if (!existingCareerHistory) {
      return NextResponse.json({ error: 'Career history not found' }, { status: 404 });
    }

    await db.careerHistory.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting career history:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}