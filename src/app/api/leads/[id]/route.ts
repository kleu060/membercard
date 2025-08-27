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

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const lead = await db.lead.findUnique({
      where: { id: params.id },
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

    if (!lead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(lead);
  } catch (error) {
    console.error('Error fetching lead:', error);
    return NextResponse.json(
      { error: 'Failed to fetch lead' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
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
      status
    } = body;

    // Check if lead exists
    const existingLead = await db.lead.findUnique({
      where: { id: params.id }
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Prepare update data
    const updateData: any = {};
    if (name !== undefined) updateData.name = name;
    if (email !== undefined) updateData.email = email;
    if (phone !== undefined) updateData.phone = phone;
    if (company !== undefined) updateData.company = company;
    if (position !== undefined) updateData.position = position;
    if (message !== undefined) updateData.message = message;
    if (interest !== undefined) updateData.interest = interest;
    if (source !== undefined) updateData.source = source;
    if (priority !== undefined) updateData.priority = priority;
    if (estimatedValue !== undefined) updateData.estimatedValue = estimatedValue;
    if (currency !== undefined) updateData.currency = currency;
    if (website !== undefined) updateData.website = website;
    if (linkedin !== undefined) updateData.linkedin = linkedin;
    if (twitter !== undefined) updateData.twitter = twitter;
    if (address !== undefined) updateData.address = address;
    if (city !== undefined) updateData.city = city;
    if (country !== undefined) updateData.country = country;
    if (tags !== undefined) updateData.tags = tags;
    if (notes !== undefined) updateData.notes = notes;
    if (status !== undefined) updateData.status = status;

    // Update lead
    const updatedLead = await db.lead.update({
      where: { id: params.id },
      data: updateData,
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
    const score = calculateLeadScore(updatedLead);
    await db.lead.update({
      where: { id: params.id },
      data: { score }
    });

    // Create activity
    await createLeadActivity(params.id, 'updated', 'Lead information updated');

    // Update lead with calculated score
    updatedLead.score = score;

    return NextResponse.json(updatedLead);
  } catch (error) {
    console.error('Error updating lead:', error);
    return NextResponse.json(
      { error: 'Failed to update lead' },
      { status: 500 }
    );
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    // Check if lead exists
    const existingLead = await db.lead.findUnique({
      where: { id: params.id }
    });

    if (!existingLead) {
      return NextResponse.json(
        { error: 'Lead not found' },
        { status: 404 }
      );
    }

    // Delete lead (cascade will handle related records)
    await db.lead.delete({
      where: { id: params.id }
    });

    return NextResponse.json({ 
      message: 'Lead deleted successfully',
      id: params.id 
    });
  } catch (error) {
    console.error('Error deleting lead:', error);
    return NextResponse.json(
      { error: 'Failed to delete lead' },
      { status: 500 }
    );
  }
}