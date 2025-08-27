import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    return NextResponse.json({ 
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar,
        role: user.role || 'user',
        subscriptionPlan: user.subscriptionPlan || 'free'
      } 
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Auth me error:', error);
    return NextResponse.json(
      { error: 'Session error' },
      { status: 401 }
    );
  }
}