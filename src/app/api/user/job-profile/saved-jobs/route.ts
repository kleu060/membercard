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

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id },
      include: {
        savedJobs: {
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!jobProfile) {
      return NextResponse.json({ savedJobs: [] });
    }

    return NextResponse.json({ savedJobs: jobProfile.savedJobs });
  } catch (error) {
    console.error('Error fetching saved jobs:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
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

    const { jobId, notes } = await request.json();

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Job profile not found' }, { status: 404 });
    }

    const newSavedJob = await db.savedJob.create({
      data: {
        profileId: jobProfile.id,
        jobId,
        notes
      }
    });

    return NextResponse.json({ savedJob: newSavedJob });
  } catch (error) {
    console.error('Error creating saved job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}