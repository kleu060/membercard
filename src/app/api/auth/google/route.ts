import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID;
const GOOGLE_CLIENT_SECRET = process.env.GOOGLE_CLIENT_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    // Get user info from Google
    const googleResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${accessToken}`
      }
    });

    if (!googleResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get Google user info' },
        { status: 400 }
      );
    }

    const googleUser = await googleResponse.json();

    // Check if user exists
    let user = await db.user.findUnique({
      where: { email: googleUser.email },
      include: {
        accounts: true
      }
    });

    if (!user) {
      // Create new user
      user = await db.user.create({
        data: {
          email: googleUser.email,
          name: googleUser.name,
          avatar: googleUser.picture,
          accounts: {
            create: {
              type: 'oauth',
              provider: 'google',
              providerAccountId: googleUser.id,
              access_token: accessToken
            }
          }
        },
        include: {
          accounts: true
        }
      });
    } else {
      // Check if Google account exists
      const googleAccount = user.accounts.find(acc => acc.provider === 'google');
      
      if (!googleAccount) {
        // Link Google account
        await db.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: 'google',
            providerAccountId: googleUser.id,
            access_token: accessToken
          }
        });
      } else {
        // Update access token
        await db.account.update({
          where: { id: googleAccount.id },
          data: { access_token: accessToken }
        });
      }
    }

    // Generate JWT token
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      JWT_SECRET,
      { expiresIn: '7d' }
    );

    // Create response
    const response = NextResponse.json({
      message: 'Google login successful',
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        avatar: user.avatar
      }
    });

    // Set HTTP-only cookie
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 // 7 days
    });

    return response;
  } catch (error) {
    console.error('Google OAuth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}