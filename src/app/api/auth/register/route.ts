import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import bcrypt from 'bcryptjs';

export async function POST(request: NextRequest) {
  try {
    console.log('Registration request received');
    
    const { email, password, name } = await request.json();
    
    console.log('Registration data:', { email, name, password: '***' });

    // Validate input
    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, password, and name are required' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters long' },
        { status: 400 }
      );
    }

    // Check if user already exists
    const existingUser = await db.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12);

    // Create user
    const user = await db.user.create({
      data: {
        email,
        name,
        password: hashedPassword
      },
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        subscriptionPlan: true,
        createdAt: true
      }
    });

    console.log('User created successfully:', user.id);

    // Create job profile for the new user
    try {
      const jobProfile = await db.jobProfile.create({
        data: {
          userId: user.id,
          summary: '',
          resumeUrl: ''
        }
      });
      console.log('Job profile created successfully:', jobProfile.id);
    } catch (jobProfileError) {
      console.error('Error creating job profile:', jobProfileError);
      // Don't fail registration if job profile creation fails
    }

    return NextResponse.json({
      message: 'User created successfully',
      user
    });
  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}