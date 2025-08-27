import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

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

    const { summary, resumeUrl } = await request.json();

    const updatedJobProfile = await db.jobProfile.update({
      where: { userId: user.id },
      data: {
        summary,
        resumeUrl
      },
      include: {
        careerHistory: true,
        education: true,
        certifications: true,
        skills: true,
        savedSearches: true,
        savedJobs: true,
        applications: true
      }
    });

    return NextResponse.json({ jobProfile: updatedJobProfile });
  } catch (error) {
    console.error('Error updating job profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}