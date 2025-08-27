import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper function to calculate lead score
function calculateLeadScore(lead: any): number {
  let score = 0;
  
  // Information completeness (40 points)
  if (lead.name) score += 10;
  if (lead.email) score += 10;
  if (lead.phone) score += 10;
  if (lead.company) score += 10;
  
  // Source quality (30 points)
  const sourceScores: Record<string, number> = {
    referral: 30,
    website: 25,
    social: 20,
    email: 18,
    event: 15,
    manual: 12,
    cold_call: 8,
    advertisement: 5
  };
  score += sourceScores[lead.source] || 0;
  
  // Priority (20 points)
  const priorityScores: Record<string, number> = {
    urgent: 20,
    high: 15,
    medium: 10,
    low: 5
  };
  score += priorityScores[lead.priority] || 0;
  
  // Engagement (10 points)
  if (lead.lastContactAt) {
    const daysSinceContact = Math.floor((Date.now() - new Date(lead.lastContactAt).getTime()) / (1000 * 60 * 60 * 24));
    if (daysSinceContact <= 7) score += 10;
    else if (daysSinceContact <= 30) score += 7;
    else if (daysSinceContact <= 90) score += 4;
  }
  
  return Math.min(score, 100);
}

// Helper function to create lead activity
async function createLeadActivity(leadId: string, type: string, title: string, description?: string, userId?: string) {
  try {
    await db.leadActivity.create({
      data: {
        leadId,
        type,
        title,
        description,
        userId: userId || 'system'
      }
    });
  } catch (error) {
    console.error('Failed to create lead activity:', error);
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const source = searchParams.get('source');
    const search = searchParams.get('search');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {};
    if (status && status !== 'all') where.status = status;
    if (priority && priority !== 'all') where.priority = priority;
    if (source && source !== 'all') where.source = source;
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } }
      ];
    }

    // Fetch leads with related data
    const [leads, totalCount] = await Promise.all([
      db.lead.findMany({
        where,
        include: {
          businessCard: true,
          assignedUser: {
            select: {
              id: true,
              name: true,
              email: true
            }
          },
          _count: {
            select: {
              interactions: true,
              activities: true
            }
          }
        },
        orderBy: [
          { priority: 'desc' },
          { score: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      db.lead.count({ where })
    ]);

    // Calculate analytics
    const analytics = await getLeadsAnalytics();

    return NextResponse.json({
      leads,
      pagination: {
        page,
        limit,
        total: totalCount,
        pages: Math.ceil(totalCount / limit)
      },
      analytics
    });
  } catch (error) {
    console.error('Error fetching leads:', error);
    return NextResponse.json(
      { error: 'Failed to fetch leads' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const {
      name,
      email,
      phone,
      company,
      position,
      message,
      interest,
      source,
      priority,
      estimatedValue,
      currency,
      website,
      linkedin,
      twitter,
      address,
      city,
      country,
      tags,
      notes,
      userId
    } = body;

    // Validate required fields
    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      );
    }

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    // Create lead with calculated score
    const leadData: any = {
      name,
      email: email || null,
      phone: phone || null,
      company: company || null,
      position: position || null,
      message: message || null,
      interest: interest || 'general',
      source: source || 'manual',
      priority: priority || 'medium',
      estimatedValue: estimatedValue || null,
      currency: currency || 'TWD',
      website: website || null,
      linkedin: linkedin || null,
      twitter: twitter || null,
      address: address || null,
      city: city || null,
      country: country || null,
      tags: tags || null,
      notes: notes || null,
      status: 'new',
      score: 0, // Will be calculated after creation
      userId: userId || null // Add the userId
    };

    const lead = await db.lead.create({
      data: leadData,
      include: {
        businessCard: true,
        assignedUser: {
          select: {
            id: true,
            name: true,
            email: true
          }
        },
        _count: {
          select: {
            interactions: true,
            activities: true
          }
        }
      }
    });

    // Calculate and update score
    const score = calculateLeadScore(lead);
    await db.lead.update({
      where: { id: lead.id },
      data: { score }
    });

    // Create activity
    await createLeadActivity(lead.id, 'created', 'Lead created manually');

    // Update lead with calculated score
    lead.score = score;

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error creating lead:', error);
    return NextResponse.json(
      { error: 'Failed to create lead' },
      { status: 500 }
    );
  }
}

async function getLeadsAnalytics() {
  try {
    const [
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      convertedLeads,
      lostLeads,
      totalEstimatedValue,
      allLeads
    ] = await Promise.all([
      db.lead.count(),
      db.lead.count({ 
        where: { 
          status: 'new',
          createdAt: { gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) }
        }
      }),
      db.lead.count({ where: { status: 'contacted' } }),
      db.lead.count({ where: { status: 'qualified' } }),
      db.lead.count({ where: { status: 'converted' } }),
      db.lead.count({ where: { status: 'lost' } }),
      db.lead.aggregate({
        _sum: { estimatedValue: true },
        where: { estimatedValue: { not: null } }
      }),
      db.lead.findMany({
        select: { score: true, estimatedValue: true }
      })
    ]);

    // Calculate conversion rate
    const conversionRate = totalLeads > 0 ? Math.round((convertedLeads / totalLeads) * 100) : 0;

    // Calculate average score
    const averageScore = allLeads.length > 0 
      ? Math.round(allLeads.reduce((sum, lead) => sum + (lead.score || 0), 0) / allLeads.length)
      : 0;

    // Calculate revenue per lead
    const revenuePerLead = convertedLeads > 0 
      ? Math.round((totalEstimatedValue._sum.estimatedValue || 0) / convertedLeads)
      : 0;

    return {
      totalLeads,
      newLeads,
      contactedLeads,
      qualifiedLeads,
      convertedLeads,
      lostLeads,
      conversionRate,
      averageScore,
      totalEstimatedValue: totalEstimatedValue._sum.estimatedValue || 0,
      averageResponseTime: 24, // Mock data - would need to calculate from interactions
      revenuePerLead
    };
  } catch (error) {
    console.error('Error calculating analytics:', error);
    return {
      totalLeads: 0,
      newLeads: 0,
      contactedLeads: 0,
      qualifiedLeads: 0,
      convertedLeads: 0,
      lostLeads: 0,
      conversionRate: 0,
      averageScore: 0,
      totalEstimatedValue: 0,
      averageResponseTime: 0,
      revenuePerLead: 0
    };
  }
}