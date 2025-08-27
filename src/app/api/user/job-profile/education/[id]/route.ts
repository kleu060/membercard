import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { institution, degree, field, startDate, endDate, isCurrent, description } = await request.json();

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Job profile not found' }, { status: 404 });
    }

    // Verify the education belongs to the user's job profile
    const existingEducation = await db.education.findFirst({
      where: {
        id: params.id,
        profileId: jobProfile.id
      }
    });

    if (!existingEducation) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    const updatedEducation = await db.education.update({
      where: { id: params.id },
      data: {
        institution,
        degree,
        field,
        startDate: new Date(startDate),
        endDate: endDate ? new Date(endDate) : null,
        isCurrent,
        // Temporarily exclude GPA to test
        // gpa,
        description
      }
    });

    return NextResponse.json({ education: updatedEducation });
  } catch (error) {
    console.error('Error updating education:', error);
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

    // Verify the education belongs to the user's job profile
    const existingEducation = await db.education.findFirst({
      where: {
        id: params.id,
        profileId: jobProfile.id
      }
    });

    if (!existingEducation) {
      return NextResponse.json({ error: 'Education not found' }, { status: 404 });
    }

    await db.education.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting education:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}