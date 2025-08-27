import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function POST(request: NextRequest) {
  try {
    const { cardId, userId } = await request.json();

    if (!cardId || !userId) {
      return NextResponse.json({ error: 'Card ID and User ID are required' }, { status: 400 });
    }

    // Check if card exists
    const card = await db.businessCard.findUnique({
      where: { id: cardId }
    });

    if (!card) {
      return NextResponse.json({ error: 'Card not found' }, { status: 404 });
    }

    // Check if already saved
    const existingSavedCard = await db.savedCard.findUnique({
      where: {
        userId_cardId: {
          userId,
          cardId
        }
      }
    });

    if (existingSavedCard) {
      return NextResponse.json({ error: 'Card already saved' }, { status: 400 });
    }

    // Create saved card
    const savedCard = await db.savedCard.create({
      data: {
        userId,
        cardId
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
        }
      }
    });

    return NextResponse.json(savedCard);
  } catch (error) {
    console.error('Error saving card:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    const savedCards = await db.savedCard.findMany({
      where: { userId },
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
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(savedCards);
  } catch (error) {
    console.error('Error fetching saved cards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}