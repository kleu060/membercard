import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from '@/lib/db';
import { ZAI } from 'z-ai-web-dev-sdk';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userData = await db.user.findUnique({
      where: { id: user.id },
      include: {
        jobProfile: {
          include: {
            careerHistory: {
              orderBy: { startDate: 'desc' }
            },
            education: {
              orderBy: { startDate: 'desc' }
            },
            certifications: true,
            skills: true,
            savedSearches: true,
            savedJobs: true,
            applications: true
          }
        }
      }
    });

    if (!userData) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Debug: Check if education records exist in the database
    if (userData.jobProfile) {
      const allEducation = await db.education.findMany({
        where: { profileId: userData.jobProfile.id }
      });
      console.log('All education records in DB for this profile:', allEducation);
      console.log('Education count from direct DB query:', allEducation.length);
    }

    // If user doesn't have a job profile, create one
    if (!userData.jobProfile) {
      console.log('Creating new job profile for user:', user.id);
      const newJobProfile = await db.jobProfile.create({
        data: {
          userId: userData.id
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

      console.log('Created job profile:', newJobProfile);
      
      // Debug: Check education for newly created profile
      const newProfileEducation = await db.education.findMany({
        where: { profileId: newJobProfile.id }
      });
      console.log('Education for new profile:', newProfileEducation);
      
      return NextResponse.json({ jobProfile: newJobProfile });
    }

    console.log('Existing job profile:', userData.jobProfile);
    console.log('Education data in job profile:', userData.jobProfile?.education);
    console.log('Education data type:', typeof userData.jobProfile?.education);
    console.log('Is education array:', Array.isArray(userData.jobProfile?.education));
    return NextResponse.json({ jobProfile: userData.jobProfile });
  } catch (error) {
    console.error('Error fetching job profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Check if user already has a job profile
    const existingProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (existingProfile) {
      return NextResponse.json({ error: 'Job profile already exists' }, { status: 400 });
    }

    const { summary, resumeUrl } = await request.json();

    const newJobProfile = await db.jobProfile.create({
      data: {
        userId: user.id,
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

    return NextResponse.json({ jobProfile: newJobProfile });
  } catch (error) {
    console.error('Error creating job profile:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}