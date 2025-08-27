import { NextRequest, NextResponse } from 'next/server';
import { requireAuth } from '@/lib/jwt';
import { db } from '@/lib/db';

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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

    // Verify the certification belongs to the user's job profile
    const existingCertification = await db.certification.findFirst({
      where: {
        id: params.id,
        profileId: jobProfile.id
      }
    });

    if (!existingCertification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    const updatedCertification = await db.certification.update({
      where: { id: params.id },
      data: {
        name,
        issuer,
        issueDate: new Date(issueDate),
        expiryDate: expiryDate ? new Date(expiryDate) : null,
        credentialNumber,
        description
      }
    });

    return NextResponse.json({ certification: updatedCertification });
  } catch (error) {
    console.error('Error updating certification:', error);
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

    // Verify the certification belongs to the user's job profile
    const existingCertification = await db.certification.findFirst({
      where: {
        id: params.id,
        profileId: jobProfile.id
      }
    });

    if (!existingCertification) {
      return NextResponse.json({ error: 'Certification not found' }, { status: 404 });
    }

    await db.certification.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting certification:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}