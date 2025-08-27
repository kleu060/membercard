import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search') || '';
    const subscriptionPlan = searchParams.get('subscriptionPlan') || 'all';
    const isActive = searchParams.get('isActive') || 'all';
    const dateRange = searchParams.get('dateRange') || 'all';

    // Build where clause
    const where: any = {};

    // Search filter
    if (search) {
      where.OR = [
        { email: { contains: search, mode: 'insensitive' } },
        { name: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Subscription plan filter
    if (subscriptionPlan !== 'all') {
      where.subscriptionPlan = subscriptionPlan;
    }

    // Active status filter
    if (isActive !== 'all') {
      where.isActive = isActive === 'active';
    }

    // Date range filter
    if (dateRange !== 'all') {
      const now = new Date();
      let cutoffDate = new Date();
      
      switch (dateRange) {
        case 'today':
          cutoffDate.setHours(0, 0, 0, 0);
          break;
        case 'week':
          cutoffDate.setDate(now.getDate() - 7);
          break;
        case 'month':
          cutoffDate.setMonth(now.getMonth() - 1);
          break;
        case 'year':
          cutoffDate.setFullYear(now.getFullYear() - 1);
          break;
      }
      
      where.createdAt = {
        gte: cutoffDate
      };
    }

    // Get users with counts
    const users = await db.user.findMany({
      where,
      select: {
        id: true,
        email: true,
        name: true,
        avatar: true,
        location: true,
        subscriptionPlan: true,
        createdAt: true,
        updatedAt: true,
        isActive: true,
        lastLoginAt: true,
        _count: {
          select: {
            businessCards: true,
            appointments: true,
            bookingSettings: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    });

    // Transform the data to match the expected format
    const transformedUsers = users.map(user => ({
      ...user,
      businessCardsCount: user._count.businessCards,
      appointmentsCount: user._count.appointments,
      bookingSettingsCount: user._count.bookingSettings
    }));

    return NextResponse.json(transformedUsers);
  } catch (error) {
    console.error('Error fetching users:', error);
    return NextResponse.json(
      { error: 'Failed to fetch users' },
      { status: 500 }
    );
  }
}