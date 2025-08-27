import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get total users count
    const totalUsers = await db.user.count();
    
    // Get active users (users who have logged in or created content in the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const activeUsers = await db.user.count({
      where: {
        OR: [
          {
            updatedAt: {
              gte: thirtyDaysAgo
            }
          },
          {
            businessCards: {
              some: {
                updatedAt: {
                  gte: thirtyDaysAgo
                }
              }
            }
          },
          {
            appointments: {
              some: {
                updatedAt: {
                  gte: thirtyDaysAgo
                }
              }
            }
          }
        ]
      }
    });

    // Get total business cards
    const totalBusinessCards = await db.businessCard.count();

    // Get total appointments
    const totalAppointments = await db.appointment.count();

    // Get total booking settings
    const totalBookings = await db.bookingSettings.count();

    // Calculate revenue (this would need to be integrated with payment system)
    const totalRevenue = 0; // Placeholder

    // Get new users today
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const newUsersToday = await db.user.count({
      where: {
        createdAt: {
          gte: today
        }
      }
    });

    // Get new users this week
    const weekAgo = new Date();
    weekAgo.setDate(weekAgo.getDate() - 7);
    const newUsersThisWeek = await db.user.count({
      where: {
        createdAt: {
          gte: weekAgo
        }
      }
    });

    // Get new users this month
    const monthAgo = new Date();
    monthAgo.setMonth(monthAgo.getMonth() - 1);
    const newUsersThisMonth = await db.user.count({
      where: {
        createdAt: {
          gge: monthAgo
        }
      }
    });

    const stats = {
      totalUsers,
      activeUsers,
      totalBusinessCards,
      totalAppointments,
      totalBookings,
      totalRevenue,
      newUsersToday,
      newUsersThisWeek,
      newUsersThisMonth
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Failed to fetch admin stats' },
      { status: 500 }
    );
  }
}