import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

// Mock Active Directory client - in production, use a proper LDAP client
class MockADClient {
  private config: any;

  constructor(config: any) {
    this.config = config;
  }

  async connect() {
    // Mock connection
    return new Promise((resolve) => {
      setTimeout(() => resolve(true), 1000);
    });
  }

  async searchUsers() {
    // Mock user data - in production, this would query actual AD
    return new Promise((resolve) => {
      setTimeout(() => {
        resolve([
          {
            dn: 'CN=John Doe,OU=Users,DC=company,DC=com',
            cn: 'John Doe',
            mail: 'john.doe@company.com',
            telephoneNumber: '+1-555-0123',
            department: 'Engineering',
            title: 'Senior Software Engineer',
            company: 'Company Inc'
          },
          {
            dn: 'CN=Jane Smith,OU=Users,DC=company,DC=com',
            cn: 'Jane Smith',
            mail: 'jane.smith@company.com',
            telephoneNumber: '+1-555-0456',
            department: 'Marketing',
            title: 'Marketing Manager',
            company: 'Company Inc'
          },
          {
            dn: 'CN=Bob Johnson,OU=Users,DC=company,DC=com',
            cn: 'Bob Johnson',
            mail: 'bob.johnson@company.com',
            telephoneNumber: '+1-555-0789',
            department: 'Sales',
            title: 'Sales Representative',
            company: 'Company Inc'
          }
        ]);
      }, 2000);
    });
  }

  disconnect() {
    // Mock disconnect
  }
}

export async function POST(request: NextRequest) {
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
      where: { userId: user.id }
    });

    if (!config) {
      return NextResponse.json({ 
        error: 'No Active Directory configuration found' 
      }, { status: 404 });
    }

    if (!config.isActive) {
      return NextResponse.json({ 
        error: 'Active Directory synchronization is disabled' 
      }, { status: 400 });
    }

    const startTime = Date.now();
    let syncLog: any;
    let usersSynced = 0;
    let usersUpdated = 0;
    let usersCreated = 0;
    const errors: string[] = [];

    try {
      // Create sync log entry
      syncLog = await db.activeDirectorySyncLog.create({
        data: {
          configId: config.id,
          status: 'running',
          message: 'Synchronization started',
          usersSynced: 0,
          usersUpdated: 0,
          usersCreated: 0,
          errors: JSON.stringify([])
        }
      });

      // Initialize AD client
      const adClient = new MockADClient(config);
      await adClient.connect();

      // Get users from AD
      const adUsers = await adClient.searchUsers() as any[];
      usersSynced = adUsers.length;

      for (const adUser of adUsers) {
        try {
          // Check if business card already exists for this user
          const existingCard = await db.businessCard.findFirst({
            where: {
              userId: user.id,
              email: adUser.mail
            }
          });

          if (existingCard) {
            // Update existing card
            await db.businessCard.update({
              where: { id: existingCard.id },
              data: {
                name: adUser.cn,
                company: adUser.company,
                position: adUser.title,
                phone: adUser.telephoneNumber,
                updatedAt: new Date()
              }
            });
            usersUpdated++;
          } else {
            // Create new business card
            await db.businessCard.create({
              data: {
                userId: user.id,
                name: adUser.cn,
                company: adUser.company,
                position: adUser.title,
                phone: adUser.telephoneNumber,
                email: adUser.mail,
                isPublic: false // AD created cards are private by default
              }
            });
            usersCreated++;
          }
        } catch (error) {
          errors.push(`Failed to process user ${adUser.cn}: ${error}`);
        }
      }

      adClient.disconnect();

      // Update sync log with success
      await db.activeDirectorySyncLog.update({
        where: { id: syncLog.id },
        data: {
          status: 'success',
          message: 'Synchronization completed successfully',
          usersSynced,
          usersUpdated,
          usersCreated,
          errors: JSON.stringify(errors),
          duration: Date.now() - startTime
        }
      });

      // Update last sync time
      await db.activeDirectoryConfig.update({
        where: { id: config.id },
        data: {
          lastSyncAt: new Date()
        }
      });

      return NextResponse.json({
        message: 'Active Directory synchronization completed successfully',
        syncResult: {
          usersSynced,
          usersUpdated,
          usersCreated,
          errors: errors.length,
          duration: Date.now() - startTime
        }
      });

    } catch (error) {
      // Update sync log with error
      if (syncLog) {
        await db.activeDirectorySyncLog.update({
          where: { id: syncLog.id },
          data: {
            status: 'error',
            message: 'Synchronization failed',
            errors: JSON.stringify([error]),
            duration: Date.now() - startTime
          }
        });
      }

      console.error('AD sync error:', error);
      return NextResponse.json({ 
        error: 'Failed to synchronize with Active Directory',
        details: error 
      }, { status: 500 });
    }

  } catch (error) {
    console.error('Sync endpoint error:', error);
    return NextResponse.json({ 
      error: 'Failed to process synchronization request' 
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
      where: { userId: user.id }
    });

    if (!config) {
      return NextResponse.json({ 
        configured: false,
        message: 'No Active Directory configuration found' 
      });
    }

    // Get recent sync logs
    const syncLogs = await db.activeDirectorySyncLog.findMany({
      where: { configId: config.id },
      orderBy: { syncAt: 'desc' },
      take: 10
    });

    // Get business cards created from AD sync
    const adCards = await db.businessCard.findMany({
      where: { 
        userId: user.id,
        isPublic: false // AD created cards are typically private
      },
      orderBy: { createdAt: 'desc' },
      take: 20
    });

    return NextResponse.json({
      configured: true,
      config: {
        id: config.id,
        domain: config.domain,
        isActive: config.isActive,
        lastSyncAt: config.lastSyncAt,
        syncInterval: config.syncInterval
      },
      syncLogs,
      adCards: {
        count: adCards.length,
        cards: adCards
      }
    });

  } catch (error) {
    console.error('Error fetching sync status:', error);
    return NextResponse.json({ 
      error: 'Failed to fetch synchronization status' 
    }, { status: 500 });
  }
}