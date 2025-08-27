import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const body = await request.json();
    const { domain, serverUrl, username, password, baseDn, userFilter, syncInterval } = body;

    // Validate required fields
    if (!domain || !serverUrl || !username || !password || !baseDn) {
      return NextResponse.json({ 
        error: 'Missing required fields: domain, serverUrl, username, password, baseDn' 
      }, { status: 400 });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Check if user already has an AD config
    const existingConfig = await db.activeDirectoryConfig.findFirst({
      where: { userId: user.id }
    });

    let config;
    
    if (existingConfig) {
      // Update existing config
      config = await db.activeDirectoryConfig.update({
        where: { id: existingConfig.id },
        data: {
          domain,
          serverUrl,
          username,
          password, // Note: In production, encrypt this
          baseDn,
          userFilter,
          syncInterval: syncInterval || 3600,
          isActive: true,
          updatedAt: new Date()
        }
      });
    } else {
      // Create new config
      config = await db.activeDirectoryConfig.create({
        data: {
          userId: user.id,
          domain,
          serverUrl,
          username,
          password, // Note: In production, encrypt this
          baseDn,
          userFilter,
          syncInterval: syncInterval || 3600,
          isActive: true
        }
      });
    }

    return NextResponse.json({ 
      message: 'Active Directory configuration saved successfully',
      config: {
        id: config.id,
        domain: config.domain,
        serverUrl: config.serverUrl,
        baseDn: config.baseDn,
        userFilter: config.userFilter,
        syncInterval: config.syncInterval,
        isActive: config.isActive,
        lastSyncAt: config.lastSyncAt
      }
    });

  } catch (error) {
    console.error('Error saving AD config:', error);
    return NextResponse.json({ 
      error: 'Failed to save Active Directory configuration' 
    }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Get AD config for user
    const config = await db.activeDirectoryConfig.findFirst({
      where: { userId: user.id },
      include: {
        syncLogs: {
          orderBy: { syncAt: 'desc' },
          take: 5
        }
      }
    });

    if (!config) {
      return NextResponse.json({ 
        configured: false,
        message: 'No Active Directory configuration found' 
      });
    }

    // Don't return sensitive data
    return NextResponse.json({
      configured: true,
      config: {
        id: config.id,
        domain: config.domain,
        serverUrl: config.serverUrl,
        baseDn: config.baseDn,
        userFilter: config.userFilter,
        syncInterval: config.syncInterval,
        isActive: config.isActive,
        lastSyncAt: config.lastSyncAt,
        createdAt: config.createdAt,
        syncLogs: config.syncLogs
      }
    });

  } catch (error) {
    console.error('Error fetching AD config:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch Active Directory configuration' 
    }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get user from database
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Delete AD config and related logs
    await db.activeDirectoryConfig.deleteMany({
      where: { userId: user.id }
    });

    return NextResponse.json({ 
      message: 'Active Directory configuration deleted successfully' 
    });

  } catch (error) {
    console.error('Error deleting AD config:', error);
    return NextResponse.json({ 
      error: 'Failed to delete Active Directory configuration' 
    }, { status: 500 });
  }
}