import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');

    if (!userId) {
      return NextResponse.json({ error: 'User ID required' }, { status: 400 });
    }

    // First, check if the card is saved by this user
    const savedCard = await db.savedCard.findUnique({
      where: {
        userId_cardId: {
          userId,
          cardId: params.cardId
        }
      }
    });

    if (!savedCard) {
      return NextResponse.json({ error: 'Saved card not found' }, { status: 404 });
    }

    const tags = await db.contactTag.findMany({
      where: {
        savedCardId: savedCard.id
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    return NextResponse.json(tags);
  } catch (error) {
    console.error('Error fetching tags:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function POST(request: NextRequest, { params }: { params: { cardId: string } }) {
  try {
    const { userId, tag, color } = await request.json();

    if (!userId || !tag) {
      return NextResponse.json({ error: 'User ID and tag are required' }, { status: 400 });
    }

    // First, check if the card is saved by this user
    const savedCard = await db.savedCard.findUnique({
      where: {
        userId_cardId: {
          userId,
          cardId: params.cardId
        }
      }
    });

    if (!savedCard) {
      return NextResponse.json({ error: 'Saved card not found' }, { status: 404 });
    }

    // Check if tag already exists
    const existingTag = await db.contactTag.findUnique({
      where: {
        savedCardId_tag: {
          savedCardId: savedCard.id,
          tag
        }
      }
    });

    if (existingTag) {
      return NextResponse.json({ error: 'Tag already exists' }, { status: 400 });
    }

    const newTag = await db.contactTag.create({
      data: {
        savedCardId: savedCard.id,
        tag,
        color: color || '3B82F6'
      }
    });

    return NextResponse.json(newTag);
  } catch (error) {
    console.error('Error creating tag:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}