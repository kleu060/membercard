import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/jwt';

export async function DELETE(
  request: NextRequest,
  { params }: { params: { jobId: string } }
) {
  try {
    const user = await requireAuth(request);
    const { jobId } = params;

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id },
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const deletedJob = await db.savedJob.deleteMany({
      where: {
        profileId: jobProfile.id,
        jobId: jobId,
      },
    });

    if (deletedJob.count === 0) {
      return NextResponse.json({ error: 'Saved job not found' }, { status: 404 });
    }

    return NextResponse.json({ message: 'Job removed from saved list' });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error deleting saved job:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}