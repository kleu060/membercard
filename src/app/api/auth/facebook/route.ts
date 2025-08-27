import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const FACEBOOK_APP_ID = process.env.FACEBOOK_APP_ID;
const FACEBOOK_APP_SECRET = process.env.FACEBOOK_APP_SECRET;
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

export async function POST(request: NextRequest) {
  try {
    const { accessToken } = await request.json();

    // Get user info from Facebook
    const facebookResponse = await fetch(
      `https://graph.facebook.com/me?fields=id,name,email,picture&access_token=${accessToken}`
    );

    if (!facebookResponse.ok) {
      return NextResponse.json(
        { error: 'Failed to get Facebook user info' },
        { status: 400 }
      );
    }

    const facebookUser = await facebookResponse.json();

    // Check if user exists
    let user = await db.user.findUnique({
      where: { email: facebookUser.email },
      include: {
        accounts: true
      }
    });

    if (!user) {
      // Create new user
      user = await db.user.create({
        data: {
          email: facebookUser.email,
          name: facebookUser.name,
          avatar: facebookUser.picture?.data?.url,
          accounts: {
            create: {
              type: 'oauth',
              provider: 'facebook',
              providerAccountId: facebookUser.id,
              access_token: accessToken
            }
          }
        },
        include: {
          accounts: true
        }
      });
    } else {
      // Check if Facebook account exists
      const facebookAccount = user.accounts.find(acc => acc.provider === 'facebook');
      
      if (!facebookAccount) {
        // Link Facebook account
        await db.account.create({
          data: {
            userId: user.id,
            type: 'oauth',
            provider: 'facebook',
            providerAccountId: facebookUser.id,
            access_token: accessToken
          }
        });
      } else {
        // Update access token
        await db.account.update({
          where: { id: facebookAccount.id },
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
      message: 'Facebook login successful',
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
    console.error('Facebook OAuth error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}