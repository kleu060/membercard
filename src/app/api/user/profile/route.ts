import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/jwt';

export async function PUT(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const { name, location } = await request.json();

    // Update user profile
    const updatedUser = await db.user.update({
      where: { id: user.id },
      data: {
        name: name || user.name,
        location: location || user.location
      }
    });

    return NextResponse.json({
      message: 'Profile updated successfully',
      user: updatedUser
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Update profile error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}