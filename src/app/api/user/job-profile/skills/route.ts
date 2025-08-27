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
        skills: {
          orderBy: { name: 'asc' }
        }
      }
    });

    if (!jobProfile) {
      return NextResponse.json({ skills: [] });
    }

    return NextResponse.json({ skills: jobProfile.skills });
  } catch (error) {
    console.error('Error fetching skills:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, level, yearsExperience } = await request.json();

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Job profile not found' }, { status: 404 });
    }

    const newSkill = await db.skill.create({
      data: {
        profileId: jobProfile.id,
        name,
        level,
        yearsExperience
      }
    });

    return NextResponse.json({ skill: newSkill });
  } catch (error) {
    console.error('Error creating skill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}