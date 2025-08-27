import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper function to evaluate segment criteria against leads
async function evaluateSegmentCriteria(criteria: any, userId: string) {
  try {
    const where: any = { userId };
    
    // Parse criteria and build where clause
    if (criteria.status && criteria.status.length > 0) {
      where.status = { in: criteria.status };
    }
    
    if (criteria.priority && criteria.priority.length > 0) {
      where.priority = { in: criteria.priority };
    }
    
    if (criteria.source && criteria.source.length > 0) {
      where.source = { in: criteria.source };
    }
    
    if (criteria.scoreRange) {
      if (criteria.scoreRange.min !== undefined) {
        where.score = { gte: criteria.scoreRange.min };
      }
      if (criteria.scoreRange.max !== undefined) {
        where.score = { ...where.score, lte: criteria.scoreRange.max };
      }
    }
    
    if (criteria.tags && criteria.tags.length > 0) {
      // This would need more complex logic for JSON tags field
      where.tags = { contains: criteria.tags[0] }; // Simplified for now
    }
    
    if (criteria.createdAt) {
      if (criteria.createdAt.after) {
        where.createdAt = { gte: new Date(criteria.createdAt.after) };
      }
      if (criteria.createdAt.before) {
        where.createdAt = { ...where.createdAt, lte: new Date(criteria.createdAt.before) };
      }
    }
    
    if (criteria.estimatedValue) {
      if (criteria.estimatedValue.min !== undefined) {
        where.estimatedValue = { gte: criteria.estimatedValue.min };
      }
      if (criteria.estimatedValue.max !== undefined) {
        where.estimatedValue = { ...where.estimatedValue, lte: criteria.estimatedValue.max };
      }
    }

    const leads = await db.lead.findMany({
      where,
      select: { id: true }
    });

    return leads.map(lead => lead.id);
  } catch (error) {
    console.error('Error evaluating segment criteria:', error);
    return [];
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const [segments, totalCount] = await Promise.all([
      db.leadSegment.findMany({
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              segmentMemberships: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      db.leadSegment.count()
    ]);

    return NextResponse.json({
      segments,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching lead segments:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead segments' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      description,
      criteria,
      isDynamic
    } = body;

    // Validate required fields
    if (!name || !criteria) {
      return NextResponse.json(
        { error: 'Name and criteria are required' },
        { status: 400 }
      );
    }

    // Get user ID from session
    const userId = 'current-user-id'; // This should come from authentication

    const segment = await db.leadSegment.create({
      data: {
        userId,
        name,
        description: description || null,
        criteria: JSON.stringify(criteria),
        isDynamic: isDynamic !== undefined ? isDynamic : true
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true
          }
        }
      }
    });

    // If dynamic segment, evaluate criteria and add leads
    if (isDynamic !== false) {
      const leadIds = await evaluateSegmentCriteria(criteria, userId);
      
      if (leadIds.length > 0) {
        await db.leadSegmentMembership.createMany({
          data: leadIds.map(leadId => ({
            segmentId: segment.id,
            leadId
          }))
        });
      }

      // Update lead count
      await db.leadSegment.update({
        where: { id: segment.id },
        data: { leadCount: leadIds.length }
      });
    }

    return NextResponse.json(segment);
  } catch (error) {
    console.error('Error creating lead segment:', error);
    return NextResponse.json(
      { error: 'Failed to create lead segment' },
      { status: 500 }
    );
  }
}