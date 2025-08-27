import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';

export async function GET() {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const savedSearches = await db.savedSearch.findMany({
      where: { profileId: jobProfile.id },
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(savedSearches);
  } catch (error) {
    console.error('Error fetching saved searches:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, keywords, industry, location, jobType, remoteOption, salaryRange } = await request.json();

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: session.user.id },
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    const savedSearch = await db.savedSearch.create({
      data: {
        profileId: jobProfile.id,
        name,
        keywords,
        industry,
        location,
        jobType,
        remoteOption,
        salaryRange,
      },
    });

    return NextResponse.json(savedSearch);
  } catch (error) {
    console.error('Error creating saved search:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}