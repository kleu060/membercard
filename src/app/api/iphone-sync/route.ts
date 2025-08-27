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

    const { action, data } = await request.json();

    if (!action) {
      return NextResponse.json({ error: 'Missing action' }, { status: 400 });
    }

    switch (action) {
      case 'setup':
        return await setupIPhoneSync(user.id, data);
      case 'sync':
        return await syncIPhoneContacts(user.id, data);
      case 'updateConfig':
        return await updateSyncConfig(user.id, data);
      case 'generateVCard':
        return await generateVCard(user.id, data);
      case 'importVCard':
        return await importVCard(user.id, data);
      case 'getCardDavUrl':
        return await getCardDavUrl(user.id);
      default:
        return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
    }

  } catch (error) {
    console.error('Error in iPhone sync API:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

async function setupIPhoneSync(userId: string, data: any) {
  const { syncInterval = 3600, syncDirection = 'both', autoSync = false } = data;
  
  // Generate unique CardDAV URL for this user
  const cardDavUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/carddav/${userId}`;
  
  // Create or update iPhone sync config
  const config = await db.iPhoneSyncConfig.upsert({
    where: { userId },
    update: {
      cardDavUrl,
      syncInterval,
      syncDirection,
      autoSync,
      isActive: true,
      updatedAt: new Date()
    },
    create: {
      userId,
      cardDavUrl,
      syncInterval,
      syncDirection,
      autoSync,
      isActive: true
    }
  });

  return NextResponse.json({
    success: true,
    message: 'iPhone sync setup completed',
    config: {
      id: config.id,
      cardDavUrl: config.cardDavUrl,
      syncInterval: config.syncInterval,
      syncDirection: config.syncDirection,
      autoSync: config.autoSync,
      isActive: config.isActive
    },
    setupInstructions: {
      cardDavUrl: config.cardDavUrl,
      username: userId,
      password: 'your-api-key', // In production, this would be a secure token
      serverName: 'APEXCARD Contacts'
    }
  });
}

async function syncIPhoneContacts(userId: string, data: any) {
  const { direction = 'both' } = data;
  const startTime = Date.now();
  
  try {
    const config = await db.iPhoneSyncConfig.findUnique({
      where: { userId }
    });

    if (!config || !config.isActive) {
      return NextResponse.json({ error: 'iPhone sync not configured' }, { status: 400 });
    }

    let importResult = { count: 0, created: 0, updated: 0 };
    let exportResult = { count: 0, created: 0, updated: 0 };

    if (direction === 'import' || direction === 'both') {
      importResult = await importFromIPhone(userId);
    }

    if (direction === 'export' || direction === 'both') {
      exportResult = await exportToIPhone(userId);
    }

    // Log sync result
    await db.iPhoneSyncLog.create({
      data: {
        configId: config.id,
        status: 'success',
        message: 'Sync completed successfully',
        contactsSynced: importResult.count + exportResult.count,
        contactsCreated: importResult.created + exportResult.created,
        contactsUpdated: importResult.updated + exportResult.updated,
        duration: Date.now() - startTime
      }
    });

    // Update last sync time
    await db.iPhoneSyncConfig.update({
      where: { userId },
      data: { lastSyncAt: new Date() }
    });

    return NextResponse.json({
      success: true,
      message: 'iPhone sync completed',
      importResult,
      exportResult,
      totalSynced: importResult.count + exportResult.count
    });

  } catch (error) {
    console.error('Error during iPhone sync:', error);
    
    // Log error
    const config = await db.iPhoneSyncConfig.findUnique({ where: { userId } });
    if (config) {
      await db.iPhoneSyncLog.create({
        data: {
          configId: config.id,
          status: 'error',
          message: 'Sync failed',
          errors: JSON.stringify([error.message]),
          duration: Date.now() - startTime
        }
      });
    }

    return NextResponse.json({ error: 'Sync failed' }, { status: 500 });
  }
}

async function updateSyncConfig(userId: string, data: any) {
  const { syncInterval, syncDirection, autoSync, isActive } = data;
  
  const config = await db.iPhoneSyncConfig.update({
    where: { userId },
    data: {
      ...(syncInterval !== undefined && { syncInterval }),
      ...(syncDirection !== undefined && { syncDirection }),
      ...(autoSync !== undefined && { autoSync }),
      ...(isActive !== undefined && { isActive }),
      updatedAt: new Date()
    }
  });

  return NextResponse.json({
    success: true,
    message: 'Sync configuration updated',
    config
  });
}

async function generateVCard(userId: string, data: any) {
  const { cardIds } = data;
  
  const where = {
    userId,
    ...(cardIds && cardIds.length > 0 && { id: { in: cardIds } })
  };

  const cards = await db.scannedCard.findMany({
    where,
    orderBy: { createdAt: 'desc' }
  });

  // Generate vCard content
  const vCards = cards.map(card => {
    const vCard = [
      'BEGIN:VCARD',
      'VERSION:3.0',
      `FN:${card.name || ''}`,
      `ORG:${card.company || ''}`,
      `TITLE:${card.title || ''}`,
      `TEL:${card.phone || ''}`,
      `EMAIL:${card.email || ''}`,
      `ADR:;;${card.address || ';;;;;'}`,
      `URL:${card.website || ''}`,
      `NOTE:${card.notes || ''}`,
      `REV:${new Date().toISOString().replace(/[-:]/g, '').split('.')[0]}Z`,
      'END:VCARD'
    ].join('\n');

    return vCard;
  });

  const vCardContent = vCards.join('\n\n');

  return NextResponse.json({
    success: true,
    vCardContent,
    count: cards.length,
    message: `Generated vCard for ${cards.length} contacts`
  });
}

async function importVCard(userId: string, data: any) {
  const { vCardContent } = data;
  
  if (!vCardContent) {
    return NextResponse.json({ error: 'Missing vCard content' }, { status: 400 });
  }

  const vCardEntries = vCardContent.split(/BEGIN:VCARD/).filter(entry => entry.trim());
  let importedCount = 0;
  let createdCount = 0;
  let updatedCount = 0;

  for (const entry of vCardEntries) {
    try {
      const vCardData = parseVCard(entry);
      
      // Check if contact already exists
      const existingCard = await db.scannedCard.findFirst({
        where: {
          userId,
          OR: [
            { email: vCardData.email },
            { phone: vCardData.phone }
          ]
        }
      });

      if (existingCard) {
        // Update existing card
        await db.scannedCard.update({
          where: { id: existingCard.id },
          data: {
            name: vCardData.name || existingCard.name,
            company: vCardData.company || existingCard.company,
            title: vCardData.title || existingCard.title,
            phone: vCardData.phone || existingCard.phone,
            email: vCardData.email || existingCard.email,
            address: vCardData.address || existingCard.address,
            website: vCardData.website || existingCard.website,
            notes: vCardData.notes || existingCard.notes,
            tags: JSON.stringify(['iphone_import']),
            ocrData: JSON.stringify({
              source: 'iphone_vcard',
              importedAt: new Date().toISOString()
            }),
            updatedAt: new Date()
          }
        });
        updatedCount++;
      } else {
        // Create new card
        await db.scannedCard.create({
          data: {
            userId,
            name: vCardData.name || '',
            company: vCardData.company || '',
            title: vCardData.title || '',
            phone: vCardData.phone || '',
            email: vCardData.email || '',
            address: vCardData.address || '',
            website: vCardData.website || '',
            notes: vCardData.notes || '',
            tags: JSON.stringify(['iphone_import']),
            ocrData: JSON.stringify({
              source: 'iphone_vcard',
              importedAt: new Date().toISOString()
            })
          }
        });
        createdCount++;
      }
      
      importedCount++;
    } catch (error) {
      console.error('Error importing vCard entry:', error);
    }
  }

  return NextResponse.json({
    success: true,
    message: `Imported ${importedCount} contacts from iPhone (${createdCount} created, ${updatedCount} updated)`,
    importedCount,
    createdCount,
    updatedCount
  });
}

async function getCardDavUrl(userId: string) {
  const config = await db.iPhoneSyncConfig.findUnique({
    where: { userId }
  });

  if (!config || !config.isActive) {
    return NextResponse.json({ error: 'iPhone sync not configured' }, { status: 400 });
  }

  return NextResponse.json({
    success: true,
    cardDavUrl: config.cardDavUrl,
    username: userId,
    serverName: 'APEXCARD Contacts'
  });
}

async function importFromIPhone(userId: string) {
  // Mock implementation - in real app, this would connect to iPhone via CardDAV
  const mockContacts = [
    {
      name: 'John Appleseed',
      phone: '+1 555 123 4567',
      email: 'john.appleseed@icloud.com',
      company: 'Apple Inc.',
      title: 'Software Engineer'
    },
    {
      name: 'Jane Smith',
      phone: '+1 555 987 6543',
      email: 'jane.smith@icloud.com',
      company: 'Tech Corp',
      title: 'Product Manager'
    }
  ];

  let createdCount = 0;
  let updatedCount = 0;

  for (const contact of mockContacts) {
    const existingCard = await db.scannedCard.findFirst({
      where: {
        userId,
        OR: [
          { email: contact.email },
          { phone: contact.phone }
        ]
      }
    });

    if (existingCard) {
      await db.scannedCard.update({
        where: { id: existingCard.id },
        data: {
          name: contact.name || existingCard.name,
          company: contact.company || existingCard.company,
          title: contact.title || existingCard.title,
          phone: contact.phone || existingCard.phone,
          email: contact.email || existingCard.email,
          tags: JSON.stringify(['iphone_import']),
          ocrData: JSON.stringify({
            source: 'iphone_sync',
            importedAt: new Date().toISOString()
          }),
          updatedAt: new Date()
        }
      });
      updatedCount++;
    } else {
      await db.scannedCard.create({
        data: {
          userId,
          name: contact.name || '',
          company: contact.company || '',
          title: contact.title || '',
          phone: contact.phone || '',
          email: contact.email || '',
          tags: JSON.stringify(['iphone_import']),
          ocrData: JSON.stringify({
            source: 'iphone_sync',
            importedAt: new Date().toISOString()
          })
        }
      });
      createdCount++;
    }
  }

  return {
    count: mockContacts.length,
    created: createdCount,
    updated: updatedCount
  };
}

async function exportToIPhone(userId: string) {
  // Mock implementation - in real app, this would push contacts to iPhone via CardDAV
  const cards = await db.scannedCard.findMany({
    where: { userId },
    orderBy: { createdAt: 'desc' }
  });

  // Simulate export to iPhone
  console.log(`Exporting ${cards.length} contacts to iPhone for user ${userId}`);

  return {
    count: cards.length,
    created: cards.length,
    updated: 0
  };
}

function parseVCard(vCardContent: string): any {
  const data: any = {};
  const lines = vCardContent.split('\n');
  
  for (const line of lines) {
    const trimmedLine = line.trim();
    if (trimmedLine.startsWith('FN:')) {
      data.name = trimmedLine.substring(3);
    } else if (trimmedLine.startsWith('ORG:')) {
      data.company = trimmedLine.substring(4);
    } else if (trimmedLine.startsWith('TITLE:')) {
      data.title = trimmedLine.substring(6);
    } else if (trimmedLine.startsWith('TEL:')) {
      data.phone = trimmedLine.substring(4);
    } else if (trimmedLine.startsWith('EMAIL:')) {
      data.email = trimmedLine.substring(6);
    } else if (trimmedLine.startsWith('ADR:')) {
      const addressParts = trimmedLine.substring(4).split(';');
      data.address = addressParts.slice(2, 6).filter(part => part).join(', ');
    } else if (trimmedLine.startsWith('URL:')) {
      data.website = trimmedLine.substring(4);
    } else if (trimmedLine.startsWith('NOTE:')) {
      data.notes = trimmedLine.substring(5);
    }
  }
  
  return data;
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const config = await db.iPhoneSyncConfig.findUnique({
      where: { userId: session.user.id },
      include: {
        syncLogs: {
          orderBy: { syncAt: 'desc' },
          take: 10
        }
      }
    });

    const totalCards = await db.scannedCard.count({
      where: { 
        userId: session.user.id,
        tags: { contains: 'iphone_import' }
      }
    });

    return NextResponse.json({
      success: true,
      config,
      stats: {
        totalIPhoneCards: totalCards,
        isConfigured: !!config,
        isActive: config?.isActive || false,
        lastSync: config?.lastSyncAt
      }
    });

  } catch (error) {
    console.error('Error fetching iPhone sync status:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}