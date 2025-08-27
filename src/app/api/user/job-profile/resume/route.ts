import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';
import { writeFile, mkdir } from 'fs/promises';
import path from 'path';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const data = await request.formData();
    const file: File | null = data.get('file') as unknown as File;

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Generate unique filename
    const filename = `${user.id}-${Date.now()}-${file.name}`;
    const filepath = path.join(process.cwd(), 'public', 'resumes', filename);

    // Ensure directory exists
    const dir = path.dirname(filepath);
    try {
      await mkdir(dir, { recursive: true });
    } catch (error) {
      // Directory already exists or other error
      console.log('Directory already exists or error:', error);
    }

    // Write file to disk
    await writeFile(filepath, buffer);

    // Update job profile with resume URL
    const jobProfile = await db.jobProfile.findUnique({
      where: { userId: user.id }
    });

    if (!jobProfile) {
      // Create job profile if it doesn't exist
      await db.jobProfile.create({
        data: {
          userId: user.id,
          resumeUrl: `/resumes/${filename}`
        }
      });
    } else {
      await db.jobProfile.update({
        where: { userId: user.id },
        data: {
          resumeUrl: `/resumes/${filename}`
        }
      });
    }

    return NextResponse.json({ 
      message: 'Resume uploaded successfully',
      resumeUrl: `/resumes/${filename}`
    });
  } catch (error) {
    console.error('Error uploading resume:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}