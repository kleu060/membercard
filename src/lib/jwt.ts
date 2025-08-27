import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { verifyToken as authVerifyToken, JWTPayload } from '@/lib/auth';

export interface DecodedToken extends JWTPayload {
  iat?: number;
  exp?: number;
}

export async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = authVerifyToken(token);
    if (!decoded) {
      return null;
    }
    
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });
    
    return user;
  } catch (error) {
    console.error('JWT verification error:', error);
    return null;
  }
}

export async function requireAuth(request: NextRequest) {
  const user = await getUserFromToken(request);
  
  if (!user) {
    throw new Error('Unauthorized');
  }
  
  return user;
}

export { verifyToken as authVerifyToken } from '@/lib/auth';