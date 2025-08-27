import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');

    const skip = (page - 1) * limit;

    const [teams, totalCount] = await Promise.all([
      db.team.findMany({
        include: {
          leader: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          members: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                  email: true
                }
              }
            }
          },
          _count: {
            select: {
              assignments: true,
              collaborations: true
            }
          }
        },
        orderBy: { updatedAt: 'desc' },
        skip,
        take: limit
      }),
      db.team.count()
    ]);

    return NextResponse.json({
      teams,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      }
    });
  } catch (error) {
    console.error('Error fetching teams:', error);
    return NextResponse.json(
      { error: 'Failed to fetch teams' },
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
      leaderId
    } = body;

    // Validate required fields
    if (!name || !leaderId) {
      return NextResponse.json(
        { error: 'Name and leader ID are required' },
        { status: 400 }
      );
    }

    // Check if leader exists
    const leader = await db.user.findUnique({
      where: { id: leaderId }
    });

    if (!leader) {
      return NextResponse.json(
        { error: 'Leader not found' },
        { status: 404 }
      );
    }

    const team = await db.team.create({
      data: {
        name,
        description: description || null,
        leaderId
      },
      include: {
        leader: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        members: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true
              }
            }
          }
        }
      }
    });

    // Add leader as a team member with admin role
    await db.teamMember.create({
      data: {
        teamId: team.id,
        userId: leaderId,
        role: 'leader'
      }
    });

    return NextResponse.json(team);
  } catch (error) {
    console.error('Error creating team:', error);
    return NextResponse.json(
      { error: 'Failed to create team' },
      { status: 500 }
    );
  }
}