import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify the skill belongs to the user's job profile
    const existingSkill = await db.skill.findFirst({
      where: {
        id: params.id,
        profileId: jobProfile.id
      }
    });

    if (!existingSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    const updatedSkill = await db.skill.update({
      where: { id: params.id },
      data: {
        name,
        level,
        yearsExperience
      }
    });

    return NextResponse.json({ skill: updatedSkill });
  } catch (error) {
    console.error('Error updating skill:', error);
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

    // Verify the skill belongs to the user's job profile
    const existingSkill = await db.skill.findFirst({
      where: {
        id: params.id,
        profileId: jobProfile.id
      }
    });

    if (!existingSkill) {
      return NextResponse.json({ error: 'Skill not found' }, { status: 404 });
    }

    await db.skill.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting skill:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}