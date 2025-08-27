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
        education: {
          orderBy: { startDate: 'desc' }
        }
      }
    });

    if (!jobProfile) {
      console.log('Job profile not found for user:', user.id);
      return NextResponse.json({ education: [] });
    }

    console.log('Found job profile with education:', jobProfile.education);
    return NextResponse.json({ education: jobProfile.education });
  } catch (error) {
    console.error('Error fetching education:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { institution, degree, field, startDate, endDate, isCurrent, description } = await request.json();
    
    // Temporarily ignore GPA to test if it's causing issues
    // const { institution, degree, field, startDate, endDate, isCurrent, gpa, description } = await request.json();
    
    console.log('Education POST request data:', {
      institution,
      degree,
      field,
      startDate,
      endDate,
      isCurrent,
      description
    });

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (!jobProfile) {
      console.log('Job profile not found for user:', user.id);
      return NextResponse.json({ error: 'Job profile not found' }, { status: 404 });
    }

    console.log('Found job profile:', jobProfile);
    console.log('Job profile ID:', jobProfile.id);
    console.log('User ID:', user.id);

    const newEducation = await db.education.create({
      data: {
        profileId: jobProfile.id,
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

    console.log('Created education with profileId:', jobProfile.id);
    console.log('Created education record:', newEducation);
    
    // Verify the education was created by fetching it back
    const verifyEducation = await db.education.findUnique({
      where: { id: newEducation.id }
    });
    console.log('Verified education record:', verifyEducation);
    
    // Also verify by profileId
    const verifyByProfile = await db.education.findMany({
      where: { profileId: jobProfile.id }
    });
    console.log('All education for profile:', verifyByProfile);
    
    return NextResponse.json({ education: newEducation });
  } catch (error) {
    console.error('Error creating education:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}