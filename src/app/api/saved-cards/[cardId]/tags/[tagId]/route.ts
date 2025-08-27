import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function DELETE(request: NextRequest, { params }: { params: { cardId: string; tagId: string } }) {
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

    // Verify the tag belongs to this saved card
    const tag = await db.contactTag.findFirst({
      where: {
        id: params.tagId,
        savedCardId: savedCard.id
      }
    });

    if (!tag) {
      return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
    }

    await db.contactTag.delete({
      where: {
        id: params.tagId
      }
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error deleting tag:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}