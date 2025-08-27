import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/jwt';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth(request);

    const { action, data } = await request.json();

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    switch (action) {
      case 'import':
        return await importContacts(user.id, data);
      case 'export':
        return await exportContacts(user.id, data);
      case 'sync':
        return await syncContacts(user.id, data);
      case 'getContacts':
        return await getPhoneContacts(user.id);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error in contacts API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function importContacts(userId: string, data: any) {
  const { contacts } = data;
  
  if (!contacts || !Array.isArray(contacts)) {
    return NextResponse.json({ error: 'Invalid contacts data' }, { status: 400 });
  }

  let importedCount = 0;
  
  for (const contact of contacts) {
    try {
      // Check if contact already exists
      const existingCard = await db.scannedCard.findFirst({
        where: {
          userId,
          OR: [
            { email: contact.email },
            { phone: contact.phone }
          ]
        }
      });

      if (!existingCard) {
        await db.scannedCard.create({
          data: {
            userId,
            name: contact.name || '',
            company: contact.company || '',
            title: contact.title || '',
            email: contact.email || '',
            phone: contact.phone || '',
            address: contact.address || '',
            website: contact.website || '',
            notes: contact.notes || '',
            tags: JSON.stringify(['phone_import']),
            ocrData: JSON.stringify({
              source: 'phone_contacts',
              importedAt: new Date().toISOString()
            })
          }
        });
        importedCount++;
      }
    } catch (error) {
      console.error('Error importing contact:', error);
    }
  }

  return NextResponse.json({
    success: true,
    message: `Imported ${importedCount} contacts from phone`,
    importedCount
  });
}

async function exportContacts(userId: string, data: any) {
  const { cardIds } = data;
  
  const where = {
    userId,
    ...(cardIds && cardIds.length > 0 && { id: { in: cardIds } })
  };

  const cards = await db.scannedCard.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  // Format contacts for phone export
  const phoneContacts = cards.map(card => ({
    name: card.name,
    phone: card.phone,
    email: card.email,
    company: card.company,
    title: card.title
  }));

  return NextResponse.json({
    success: true,
    contacts: phoneContacts,
    count: phoneContacts.length,
    message: `Prepared ${phoneContacts.length} contacts for phone export`
  });
}

async function syncContacts(userId: string, data: any) {
  const { direction = 'both' } = data;
  
  let importResult = null;
  let exportResult = null;

  if (direction === 'import' || direction === 'both') {
    // Mock import from phone contacts
    const mockPhoneContacts = [
      {
        name: '陳大明',
        phone: '+886 912 345 678',
        email: 'chen.ming@example.com',
        company: '創新科技',
        title: '工程師'
      },
      {
        name: '林美麗',
        phone: '+886 923 456 789',
        email: 'lin.meili@example.com',
        company: '設計工作室',
        title: '設計師'
      }
    ];

    importResult = await importContacts(userId, { contacts: mockPhoneContacts });
  }

  if (direction === 'export' || direction === 'both') {
    exportResult = await exportContacts(userId, {});
  }

  return NextResponse.json({
    success: true,
    importResult,
    exportResult,
    message: `Sync completed successfully`
  });
}

async function getPhoneContacts(userId: string) {
  // Mock phone contacts - in real app, this would access device contacts
  const mockContacts = [
    {
      id: '1',
      name: '陳大明',
      phone: '+886 912 345 678',
      email: 'chen.ming@example.com',
      company: '創新科技',
      title: '工程師'
    },
    {
      id: '2',
      name: '林美麗',
      phone: '+886 923 456 789',
      email: 'lin.meili@example.com',
      company: '設計工作室',
      title: '設計師'
    },
    {
      id: '3',
      name: '王志明',
      phone: '+886 934 567 890',
      email: 'wang.zhiming@example.com',
      company: '行銷公司',
      title: '行銷經理'
    }
  ];

  return NextResponse.json({
    success: true,
    contacts: mockContacts,
    count: mockContacts.length
  });
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth(request);

    // Get sync status and statistics
    const totalCards = await db.scannedCard.count({
      where: { userId: user.id }
    });

    const recentSync = await db.scannedCard.findFirst({
      where: { 
        userId: user.id,
        tags: { contains: 'phone_import' }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({
      success: true,
      stats: {
        totalCards,
        lastSync: recentSync?.createdAt,
        hasPhoneImport: !!recentSync
      }
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching contacts status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}