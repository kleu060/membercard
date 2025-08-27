import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to get user from JWT token
async function getUserFromRequest(request: NextRequest) {
  try {
    // Get token from cookie
    const token = request.cookies.get('token')?.value;
    
    if (!token) {
      return null;
    }

    // Verify token
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string; email: string };
    
    // Get user from database
    const user = await db.user.findUnique({
      where: { id: decoded.userId },
      select: { id: true, email: true, name: true }
    });

    return user;
  } catch (error) {
    console.error('Error verifying token:', error);
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id },
      include: {
        careerHistory: true,
        education: true,
        certifications: true,
        skills: true,
        savedSearches: true,
        savedJobs: true,
        applications: true,
      },
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
    }

    return NextResponse.json(jobProfile);
  } catch (error) {
    console.error('Error fetching job profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { summary, resumeUrl } = await request.json();

    // Check if profile already exists
    const existingProfile = await db.jobProfile.findUnique({
      where: { userId: user.id },
    });

    if (existingProfile) {
      return NextResponse.json({ error: 'Profile already exists' }, { status: 400 });
    }

    const jobProfile = await db.jobProfile.create({
      data: {
        userId: user.id,
        summary,
        resumeUrl,
      },
    });

    return NextResponse.json(jobProfile);
  } catch (error) {
    console.error('Error creating job profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { summary, resumeUrl } = await request.json();

    const jobProfile = await db.jobProfile.update({
      where: { userId: user.id },
      data: {
        summary,
        resumeUrl,
        updatedAt: new Date(),
      },
    });

    return NextResponse.json(jobProfile);
  } catch (error) {
    console.error('Error updating job profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}