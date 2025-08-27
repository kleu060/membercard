import { NextRequest, NextResponse } from 'next/server';

// Mock features data - in a real application, this would come from a database
const mockFeatures = [
  {
    id: 'booking-system',
    name: '預約系統',
    description: '完整的在線預約管理系統',
    category: 'booking',
    enabled: true,
    globalEnabled: true,
    plans: ['professional', 'enterprise'],
    settings: {
      maxAppointmentsPerDay: 10,
      allowCancellation: true,
      requireApproval: false
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'digital-cards',
    name: '數位名片',
    description: '創建和管理專業數位名片',
    category: 'digital-cards',
    enabled: true,
    globalEnabled: true,
    plans: ['free', 'professional', 'enterprise'],
    settings: {
      maxCardsPerUser: 3,
      allowCustomDesign: true,
      enableAnalytics: false
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'advanced-analytics',
    name: '高級分析',
    description: '詳細的數據分析和報告功能',
    category: 'analytics',
    enabled: false,
    globalEnabled: false,
    plans: ['enterprise'],
    settings: {
      realTimeAnalytics: true,
      customReports: true,
      dataExport: true
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'api-access',
    name: 'API 接入',
    description: 'RESTful API 接入和開發工具',
    category: 'integrations',
    enabled: true,
    globalEnabled: false,
    plans: ['professional', 'enterprise'],
    settings: {
      rateLimit: '1000/hour',
      allowWebhooks: true,
      documentationAccess: true
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  },
  {
    id: 'white-label',
    name: '白標解決方案',
    description: '完全品牌定制的白標解決方案',
    category: 'branding',
    enabled: false,
    globalEnabled: false,
    plans: ['enterprise'],
    settings: {
      customDomain: true,
      removeBranding: true,
      customCSS: true
    },
    createdAt: '2024-01-01T00:00:00.000Z',
    updatedAt: '2024-01-01T00:00:00.000Z'
  }
];

export async function GET(request: NextRequest) {
  try {
    // In a real application, you would fetch from database
    return NextResponse.json(mockFeatures);
  } catch (error) {
    console.error('Error fetching features:', error);
    return NextResponse.json(
      { error: 'Failed to fetch features' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const featureData = await request.json();
    
    // In a real application, you would save to database
    const newFeature = {
      id: `feature-${Date.now()}`,
      ...featureData,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    return NextResponse.json(newFeature);
  } catch (error) {
    console.error('Error creating feature:', error);
    return NextResponse.json(
      { error: 'Failed to create feature' },
      { status: 500 }
    );
  }
}