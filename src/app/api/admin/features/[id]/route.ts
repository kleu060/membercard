import { NextRequest, NextResponse } from 'next/server';

// Mock features data (same as in the main features route)
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

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { enabled } = await request.json();
    
    // Find and update the feature (mock implementation)
    const featureIndex = mockFeatures.findIndex(f => f.id === params.id);
    if (featureIndex === -1) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      );
    }

    const updatedFeature = {
      ...mockFeatures[featureIndex],
      enabled,
      updatedAt: new Date().toISOString()
    };

    // In a real application, you would update this in the database
    return NextResponse.json(updatedFeature);
  } catch (error) {
    console.error('Error updating feature:', error);
    return NextResponse.json(
      { error: 'Failed to update feature' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    // Find and delete the feature (mock implementation)
    const featureIndex = mockFeatures.findIndex(f => f.id === params.id);
    if (featureIndex === -1) {
      return NextResponse.json(
        { error: 'Feature not found' },
        { status: 404 }
      );
    }

    // In a real application, you would delete this from the database
    return NextResponse.json({ message: 'Feature deleted successfully' });
  } catch (error) {
    console.error('Error deleting feature:', error);
    return NextResponse.json(
      { error: 'Failed to delete feature' },
      { status: 500 }
    );
  }
}