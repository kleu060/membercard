import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Location mapping for English to Chinese
const locationMapping: { [key: string]: string } = {
  'beijing': '北京',
  'shanghai': '上海',
  'guangzhou': '廣州',
  'shenzhen': '深圳',
  'hangzhou': '杭州',
  'nanjing': '南京',
  'london': '倫敦',
  'paris': '巴黎',
  'hong kong': '香港',
  'taipei': '台北',
  'tokyo': '東京',
  'new york': '紐約',
  'los angeles': '洛杉磯',
  'san francisco': '舊金山'
};

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '12');
    const industry = searchParams.get('industry');
    const search = searchParams.get('search');
    const country = searchParams.get('country');
    const city = searchParams.get('city');

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      isPublic: true
    };

    if (industry) {
      where.industryTags = {
        some: {
          OR: [
            {
              tag: {
                startsWith: industry
              }
            },
            {
              tag: {
                contains: `(${industry}`
              }
            }
          ]
        }
      };
    }

    if (search) {
      where.OR = [
        { name: { contains: search } },
        { company: { contains: search } },
        { position: { contains: search } },
        { bio: { contains: search } }
      ];
    }

    if (city) {
      const mappedCity = locationMapping[city.toLowerCase()] || city;
      where.location = {
        contains: mappedCity
      };
    }

    // Get cards with pagination
    const [cards, total] = await Promise.all([
      db.businessCard.findMany({
        where,
        include: {
          user: {
            select: {
              id: true,
              name: true,
              avatar: true
            }
          },
          socialLinks: true,
          products: true,
          industryTags: true
        },
        orderBy: [
          { viewCount: 'desc' },
          { createdAt: 'desc' }
        ],
        skip,
        take: limit
      }),
      db.businessCard.count({ where })
    ]);

    // Get industry statistics
    const industryStats = await db.industryTag.groupBy({
      by: ['tag'],
      _count: {
        tag: true
      },
      orderBy: {
        _count: {
          tag: 'desc'
        }
      },
      take: 10
    });

    return NextResponse.json({
      cards,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit)
      },
      industryStats
    });
  } catch (error) {
    console.error('Marketplace error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}