import { NextRequest, NextResponse } from 'next/server';

// Mock subscription plans data
const mockPlans = [
  {
    id: 'free',
    name: '免費版',
    description: '基礎功能，適合個人用戶',
    price: 0,
    currency: 'TWD',
    billingCycle: 'monthly' as const,
    features: ['digital-cards', 'basic-analytics'],
    maxUsers: 1,
    maxStorage: 1,
    maxBusinessCards: 3,
    maxAppointments: 10,
    prioritySupport: false,
    customDomain: false,
    analytics: false,
    apiAccess: false,
    whiteLabel: false,
    isActive: true,
    sortOrder: 1,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'professional',
    name: '專業版',
    description: '進階功能，適合小型企業',
    price: 299,
    currency: 'TWD',
    billingCycle: 'monthly' as const,
    features: ['digital-cards', 'booking-system', 'api-access', 'analytics'],
    maxUsers: 5,
    maxStorage: 10,
    maxBusinessCards: 25,
    maxAppointments: 100,
    prioritySupport: true,
    customDomain: true,
    analytics: true,
    apiAccess: true,
    whiteLabel: false,
    isActive: true,
    sortOrder: 2,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'enterprise',
    name: '企業版',
    description: '完整功能，適合大型企業',
    price: 999,
    currency: 'TWD',
    billingCycle: 'monthly' as const,
    features: ['digital-cards', 'booking-system', 'api-access', 'advanced-analytics', 'white-label'],
    maxUsers: -1,
    maxStorage: -1,
    maxBusinessCards: -1,
    maxAppointments: -1,
    prioritySupport: true,
    customDomain: true,
    analytics: true,
    apiAccess: true,
    whiteLabel: true,
    isActive: true,
    sortOrder: 3,
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch from database
    return NextResponse.json(mockPlans);
  } catch (error) {
    console.error('Error fetching plans:', error);
    return NextResponse.json(
      { error: 'Failed to fetch plans' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const planData = await request.json();
    
    // In a real application, you would save to database
    const newPlan = {
      id: `plan-${Date.now()}`,
      ...planData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(newPlan);
  } catch (error) {
    console.error('Error creating plan:', error);
    return NextResponse.json(
      { error: 'Failed to create plan' },
      { status: 500 }
    );
  }
}