import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { db } from '@/lib/db';

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const integrationId = params.id;

    // Get the integration first to check ownership
    const existingIntegration = await db.calendarIntegration.findUnique({
      where: { id: integrationId }
    });

    if (!existingIntegration) {
      return NextResponse.json({ error: 'Integration not found' }, { status: 404 });
    }

    // Check if user is authorized to delete this integration
    const user = await db.user.findUnique({
      where: { email: session.user.email }
    });

    if (!user || user.id !== existingIntegration.userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    // Delete the integration
    await db.calendarIntegration.delete({
      where: { id: integrationId }
    });

    return NextResponse.json({ message: 'Calendar integration deleted successfully' });
  } catch (error) {
    console.error('Error deleting calendar integration:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}