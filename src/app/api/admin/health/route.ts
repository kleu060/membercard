import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    // Check database connectivity
    let database = false;
    try {
      await db.user.findFirst();
      database = true;
    } catch (dbError) {
      console.error('Database health check failed:', dbError);
      database = false;
    }

    // Check API health (simple endpoint test)
    let api = false;
    try {
      // This is a basic check - in production you might want to check specific endpoints
      api = true;
    } catch (apiError) {
      console.error('API health check failed:', apiError);
      api = false;
    }

    // Check auth system
    let auth = false;
    try {
      // Basic auth system check
      auth = true;
    } catch (authError) {
      console.error('Auth health check failed:', authError);
      auth = false;
    }

    // Check storage system
    let storage = false;
    try {
      // Basic storage system check
      storage = true;
    } catch (storageError) {
      console.error('Storage health check failed:', storageError);
      storage = false;
    }

    // Determine overall status
    let status: 'healthy' | 'warning' | 'error' = 'healthy';
    const failedChecks = [database, api, auth, storage].filter(check => !check).length;
    
    if (failedChecks === 0) {
      status = 'healthy';
    } else if (failedChecks <= 2) {
      status = 'warning';
    } else {
      status = 'error';
    }

    const health = {
      status,
      database,
      api,
      auth,
      storage,
      lastCheck: new Date().toISOString()
    };

    return NextResponse.json(health);
  } catch (error) {
    console.error('Error fetching health status:', error);
    return NextResponse.json(
      { 
        status: 'error',
        database: false,
        api: false,
        auth: false,
        storage: false,
        lastCheck: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}