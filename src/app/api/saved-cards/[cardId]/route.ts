import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const savedCard = await db.savedCard.findUnique({
      where: {
        userId_cardId: {
          userId,
          cardId: params.cardId
        }
      },
      include: {
        businessCard: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                avatar: true
              }
            },
            socialLinks: true,
            products: true,
            industryTags: true
          }
        },
        tags: {
          orderBy: {
            createdAt: 'desc'
          }
        }
      }
    });

    if (!savedCard) {
      return NextResponse.json({ error: 'Saved card not found' }, { status: 404 });
    }

    return NextResponse.json(savedCard);
  } catch (error) {
    console.error('Error fetching saved card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function PUT(request: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    const { userId, notes } = await request.json();

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const savedCard = await db.savedCard.update({
      where: {
        userId_cardId: {
          userId,
          cardId: params.cardId
        }
      },
      data: {
        notes,
        updatedAt: new Date()
      },
      include: {
        businessCard: true,
        tags: true
      }
    });

    return NextResponse.json(savedCard);
  } catch (error) {
    console.error('Error updating saved card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    await db.savedCard.delete({
      where: {
        userId_cardId: {
          userId,
          cardId: params.cardId
        }
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting saved card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}