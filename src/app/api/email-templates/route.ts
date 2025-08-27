import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const type = searchParams.get('type');
    const category = searchParams.get('category');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (type && type !== 'all') where.type = type;
    if (category && category !== 'all') where.category = category;

    const [templates, totalCount] = await Promise.all([
      db.emailTemplate.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              campaigns: true,
              automations: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      db.emailTemplate.count({ where })
    ]);

    return NextResponse.json({
      templates,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching email templates:', error);
    return NextResponse.json(
      { error: 'Failed to fetch email templates' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      subject,
      content,
      type,
      category
    } = body;

    // Validate required fields
    if (!name || !subject || !content) {
      return NextResponse.json(
        { error: 'Name, subject, and content are required' },
        { status: 400 }
      );
    }

    // Get user ID from session (you'll need to implement authentication)
    const userId = 'current-user-id'; // This should come from authentication

    const template = await db.emailTemplate.create({
      data: {
        userId,
        name,
        subject,
        content,
        type: type || 'campaign',
        category: category || null
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    return NextResponse.json(template);
  } catch (error) {
    console.error('Error creating email template:', error);
    return NextResponse.json(
      { error: 'Failed to create email template' },
      { status: 500 }
    );
  }
}