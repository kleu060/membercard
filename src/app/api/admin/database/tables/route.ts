import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Get table information
    // In a real application, you would query database system tables
    // For now, we'll use mock data based on the Prisma schema
    
    const tables = [
      {
        name: 'User',
        rowCount: 150,
        size: '2.5 MB',
        lastUpdated: new Date().toISOString(),
        growthRate: 5.2
      },
      {
        name: 'BusinessCard',
        rowCount: 320,
        size: '15.8 MB',
        lastUpdated: new Date().toISOString(),
        growthRate: 8.7
      },
      {
        name: 'Appointment',
        rowCount: 85,
        size: '3.2 MB',
        lastUpdated: new Date().toISOString(),
        growthRate: 12.3
      },
      {
        name: 'BookingSettings',
        rowCount: 45,
        size: '1.8 MB',
        lastUpdated: new Date().toISOString(),
        growthRate: 3.1
      },
      {
        name: 'JobProfile',
        rowCount: 120,
        size: '8.5 MB',
        lastUpdated: new Date().toISOString(),
        growthRate: 6.8
      },
      {
        name: 'CareerHistory',
        rowCount: 280,
        size: '4.2 MB',
        lastUpdated: new Date().toISOString(),
        growthRate: 4.5
      },
      {
        name: 'Education',
        rowCount: 95,
        size: '2.1 MB',
        lastUpdated: new Date().toISOString(),
        growthRate: 2.8
      },
      {
        name: 'Skill',
        rowCount: 180,
        size: '3.7 MB',
        lastUpdated: new Date().toISOString(),
        growthRate: 7.2
      }
    ];

    return NextResponse.json(tables);
  } catch (error) {
    console.error('Error fetching database tables:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database tables' },
      { status: 500 }
    );
  }
}