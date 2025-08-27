import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { platform, action, data } = await request.json();

    if (!platform || !action) {
      return NextResponse.json({ error: 'Missing platform or action' }, { status: 400 });
    }

    switch (platform) {
      case 'google':
        return await handleGoogleSync(user.id, action, data);
      case 'outlook':
        return await handleOutlookSync(user.id, action, data);
      case 'salesforce':
        return await handleSalesforceSync(user.id, action, data);
      case 'iphone':
        return await handleIPhoneSync(user.id, action, data);
      default:
        return NextResponse.json({ error: 'Unsupported platform' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in sync:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function handleGoogleSync(userId: string, action: string, data: any) {
  switch (action) {
    case 'connect':
      // Store Google OAuth credentials
      await db.account.create({
        data: {
          userId,
          type: 'oauth',
          provider: 'google',
          providerAccountId: data.providerAccountId,
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
          expires_at: data.expiresAt,
          token_type: 'Bearer',
          scope: data.scope
        }
      });
      return NextResponse.json({ success: true, message: 'Google Contacts connected' });

    case 'sync':
      // Sync contacts with Google
      const contacts = await getScannedCards(userId);
      const syncedCount = await syncToGoogleContacts(userId, contacts);
      return NextResponse.json({ 
        success: true, 
        message: `Synced ${syncedCount} contacts to Google Contacts`,
        syncedCount 
      });

    case 'disconnect':
      await db.account.deleteMany({
        where: {
          userId,
          provider: 'google'
        }
      });
      return NextResponse.json({ success: true, message: 'Google Contacts disconnected' });

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

async function handleOutlookSync(userId: string, action: string, data: any) {
  switch (action) {
    case 'connect':
      await db.account.create({
        data: {
          userId,
          type: 'oauth',
          provider: 'outlook',
          providerAccountId: data.providerAccountId,
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
          expires_at: data.expiresAt,
          token_type: 'Bearer',
          scope: data.scope
        }
      });
      return NextResponse.json({ success: true, message: 'Outlook connected' });

    case 'sync':
      const contacts = await getScannedCards(userId);
      const syncedCount = await syncToOutlookContacts(userId, contacts);
      return NextResponse.json({ 
        success: true, 
        message: `Synced ${syncedCount} contacts to Outlook`,
        syncedCount 
      });

    case 'disconnect':
      await db.account.deleteMany({
        where: {
          userId,
          provider: 'outlook'
        }
      });
      return NextResponse.json({ success: true, message: 'Outlook disconnected' });

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

async function handleSalesforceSync(userId: string, action: string, data: any) {
  switch (action) {
    case 'connect':
      await db.account.create({
        data: {
          userId,
          type: 'oauth',
          provider: 'salesforce',
          providerAccountId: data.providerAccountId,
          access_token: data.accessToken,
          refresh_token: data.refreshToken,
          expires_at: data.expiresAt,
          token_type: 'Bearer',
          scope: data.scope
        }
      });
      return NextResponse.json({ success: true, message: 'Salesforce connected' });

    case 'sync':
      const contacts = await getScannedCards(userId);
      const syncedCount = await syncToSalesforce(userId, contacts);
      return NextResponse.json({ 
        success: true, 
        message: `Synced ${syncedCount} contacts to Salesforce`,
        syncedCount 
      });

    case 'disconnect':
      await db.account.deleteMany({
        where: {
          userId,
          provider: 'salesforce'
        }
      });
      return NextResponse.json({ success: true, message: 'Salesforce disconnected' });

    default:
      return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  }
}

async function handleIPhoneSync(userId: string, action: string, data: any) {
  // Forward to iPhone sync API
  const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/iphone-sync`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ action, data })
  });

  const result = await response.json();
  return NextResponse.json(result);
}

async function getScannedCards(userId: string) {
  return await db.scannedCard.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });
}

async function syncToGoogleContacts(userId: string, contacts: any[]) {
  // Mock implementation - in real app, this would use Google People API
  console.log(`Syncing ${contacts.length} contacts to Google for user ${userId}`);
  return contacts.length;
}

async function syncToOutlookContacts(userId: string, contacts: any[]) {
  // Mock implementation - in real app, this would use Microsoft Graph API
  console.log(`Syncing ${contacts.length} contacts to Outlook for user ${userId}`);
  return contacts.length;
}

async function syncToSalesforce(userId: string, contacts: any[]) {
  // Mock implementation - in real app, this would use Salesforce REST API
  console.log(`Syncing ${contacts.length} contacts to Salesforce for user ${userId}`);
  return contacts.length;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Get connected platforms
    const accounts = await db.account.findMany({
      where: { userId: session.user.id },
      select: {
        provider: true,
        createdAt: true
      }
    });

    const connectedPlatforms = accounts.map(account => account.provider);

    return NextResponse.json({
      success: true,
      connectedPlatforms,
      accounts
    });

  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}