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
        certifications: {
          orderBy: { issueDate: 'desc' }
        }
      }
    });

    if (!jobProfile) {
      return NextResponse.json({ certifications: [] });
    }

    return NextResponse.json({ certifications: jobProfile.certifications });
  } catch (error) {
    console.error('Error fetching certifications:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await requireAuth(request);
    
    if (!user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { name, issuer, issueDate, expiryDate, credentialNumber, description } = await request.json();

    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (!jobProfile) {
      return NextResponse.json({ error: 'Job profile not found' }, { status: 404 });
    }

    const newCertification = await db.certification.create({
      data: {
        profileId: jobProfile.id,
        name,
        issuer,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialNumber,
        description
      }
    });

    return NextResponse.json({ certification: newCertification });
  } catch (error) {
    console.error('Error creating certification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}