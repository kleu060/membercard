import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper function to create lead activity
async function createLeadActivity(leadId: string, type: string, title: string, description?: string, userId?: string) {
  try {
    await db.leadActivity.create({
      data: {
        leadId,
        type,
        title,
        description,
        userId: userId || 'system'
      }
    });
  } catch (error) {
    console.error('Failed to create lead activity:', error);
  }
}

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const interactions = await db.leadInteraction.findMany({
      where: { leadId: params.id },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ interactions });
  } catch (error) {
    console.error('Error fetching interactions:', error);
    return NextResponse.json(
      { error: 'Failed to fetch interactions' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await request.json();
    const { type, direction, title, description, duration, userId } = body;

    // Validate required fields
    if (!type || !direction || !title) {
      return NextResponse.json(
        { error: 'Type, direction, and title are required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Check if lead exists
    const lead = await db.lead.findUnique({
      where: { id }
    });

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Create interaction
    const interaction = await db.leadInteraction.create({
      data: {
        leadId: id,
        type,
        direction,
        title,
        description: description || null,
        duration: duration || null,
        userId
      },
      include: {
        user: {
          select: {
            id: true,
            name: true
          }
        }
      }
    });

    // Update lead's last contact time
    await db.lead.update({
      where: { id },
      data: { lastContactAt: new Date() }
    });

    // Create activity
    await createLeadActivity(
      id, 
      'interaction', 
      `Interaction logged: ${title}`,
      description,
      userId
    );

    return NextResponse.json(interaction);
  } catch (error) {
    console.error('Error creating interaction:', error);
    return NextResponse.json(
      { error: 'Failed to create interaction' },
      { status: 500 }
    );
  }
}