import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock database activity log
    // In a real application, you would query database logs or audit tables
    
    const activity = [
      {
        timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
        operation: 'INSERT',
        table: 'BusinessCard',
        user: 'user@example.com',
        status: 'success' as const,
        duration: 45
      },
      {
        timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
        operation: 'UPDATE',
        table: 'User',
        user: 'admin@example.com',
        status: 'success' as const,
        duration: 23
      },
      {
        timestamp: new Date(Date.now() - 15 * 60 * 1000).toISOString(),
        operation: 'SELECT',
        table: 'Appointment',
        user: 'user@example.com',
        status: 'success' as const,
        duration: 12
      },
      {
        timestamp: new Date(Date.now() - 20 * 60 * 1000).toISOString(),
        operation: 'DELETE',
        table: 'SavedCard',
        user: 'user@example.com',
        status: 'success' as const,
        duration: 8
      },
      {
        timestamp: new Date(Date.now() - 25 * 60 * 1000).toISOString(),
        operation: 'UPDATE',
        table: 'JobProfile',
        user: 'user@example.com',
        status: 'failed' as const,
        duration: 150
      },
      {
        timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
        operation: 'INSERT',
        table: 'Appointment',
        user: 'user@example.com',
        status: 'success' as const,
        duration: 67
      },
      {
        timestamp: new Date(Date.now() - 35 * 60 * 1000).toISOString(),
        operation: 'SELECT',
        table: 'BusinessCard',
        user: 'user@example.com',
        status: 'success' as const,
        duration: 15
      },
      {
        timestamp: new Date(Date.now() - 40 * 60 * 1000).toISOString(),
        operation: 'UPDATE',
        table: 'BookingSettings',
        user: 'user@example.com',
        status: 'success' as const,
        duration: 34
      }
    ];

    return NextResponse.json(activity);
  } catch (error) {
    console.error('Error fetching database activity:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database activity' },
      { status: 500 }
    );
  }
}