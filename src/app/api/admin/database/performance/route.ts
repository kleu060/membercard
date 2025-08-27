import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    // Mock database performance metrics
    // In a real application, you would query database performance counters
    
    const performance = {
      avgQueryTime: 45,
      slowQueries: 2,
      connectionCount: 12,
      maxConnections: 100,
      cacheHitRate: 87
    };

    return NextResponse.json(performance);
  } catch (error) {
    console.error('Error fetching database performance:', error);
    return NextResponse.json(
      { error: 'Failed to fetch database performance' },
      { status: 500 }
    );
  }
}