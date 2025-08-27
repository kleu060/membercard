import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status && status !== 'all') where.status = status;

    const [campaigns, totalCount] = await Promise.all([
      db.emailCampaign.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          template: {
            select: {
              id: true,
              name: true,
              subject: true
            }
          },
          _count: {
            select: {
              deliveries: true
            }
          }
        },
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.emailCampaign.count({ where })
    ]);

    return NextResponse.json({
      campaigns,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching email campaigns:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email campaigns' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      templateId,
      name,
      description,
      scheduleType,
      scheduledAt,
      targetSegment
    } = body;

    // Validate required fields
    if (!templateId || !name) {
      return NextResponse.json(
        { error: 'Template ID and name are required' },
        { status: 400 }
      );
    }

    // Get user ID from session
    const userId = 'current-user-id'; // This should come from authentication

    // Check if template exists
    const template = await db.emailTemplate.findUnique({
      where: { id: templateId }
    });

    if (!template) {
      return NextResponse.json(
        { error: 'Template not found' },
        { status: 404 }
      );
    }

    const campaign = await db.emailCampaign.create({
      data: {
        userId,
        templateId,
        name,
        description: description || null,
        scheduleType: scheduleType || 'immediate',
        scheduledAt: scheduledAt || null,
        targetSegment: targetSegment || null,
        status: scheduleType === 'immediate' ? 'active' : 'scheduled'
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        template: {
          select: {
            id: true,
            name: true,
            subject: true
          }
        }
      }
    });

    // If immediate, start processing the campaign
    if (scheduleType === 'immediate') {
      // This would typically trigger a background job
      // For now, we'll just mark it as active
      await db.emailCampaign.update({
        where: { id: campaign.id },
        data: { status: 'active' }
      });
    }

    return NextResponse.json(campaign);
  } catch (error) {
    console.error('Error creating email campaign:', error);
    return NextResponse.json(
      { error: 'Failed to create email campaign' },
      { status: 500 }
    );
  }
}