import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/jwt';

export async function GET(request: NextRequest) {
  try {
    const user = await requireAuth(request);

    const cards = await db.businessCard.findMany({
      where: { userId: user.id },
      include: {
        socialLinks: true,
        products: {
          include: {
            photos: true,
            links: true
          }
        },
        industryTags: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ cards });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Get cards error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('POST /api/cards: Starting card creation');
    const user = await requireAuth(request);

    // Check subscription plan limitations
    const existingCardsCount = await db.businessCard.count({
      where: { userId: user.id }
    });

    let maxCards = 1; // Default for free plan
    if (user.subscriptionPlan === 'professional') {
      maxCards = 3;
    } else if (user.subscriptionPlan === 'enterprise') {
      maxCards = 999; // Essentially unlimited
    }

    if (existingCardsCount >= maxCards) {
      return NextResponse.json(
        { 
          error: 'Card limit reached',
          message: `您的${user.subscriptionPlan === 'free' ? '免费' : '专业'}套餐最多只能创建${maxCards}张名片。请升级套餐以创建更多名片。`,
          currentCards: existingCardsCount,
          maxCards: maxCards,
          subscriptionPlan: user.subscriptionPlan
        },
        { status: 403 }
      );
    }

    const {
      name,
      company,
      position,
      phone,
      officePhone,
      email,
      address,
      website,
      bio,
      avatar,
      coverPhoto,
      logo,
      location,
      template,
      isPublic,
      socialLinks,
      products,
      industryTags
    } = await request.json();

    console.log('POST /api/cards: Creating card with socialLinks:', socialLinks);
    console.log('POST /api/cards: Social links details:', {
      count: socialLinks?.length || 0,
      firstLink: socialLinks?.[0],
      allLinks: socialLinks
    });
    const card = await db.businessCard.create({
      data: {
        userId: user.id,
        name,
        company,
        position,
        phone,
        officePhone,
        email,
        address,
        website,
        bio,
        avatar,
        coverPhoto,
        logo,
        location,
        template: template || 'modern-blue',
        isPublic: isPublic ?? true,
        socialLinks: {
          create: (socialLinks || []).map((link: any) => ({
            platform: link.platform,
            url: link.url,
            username: link.username || null
          }))
        },
        products: {
          create: (products || []).map((product: any) => ({
            name: product.name,
            description: product.description,
            image: product.image,
            photos: {
              create: (product.photos || []).map((photo: string) => ({
                url: photo
              }))
            },
            links: {
              create: (product.links || []).map((link: any) => ({
                title: link.title,
                url: link.url
              }))
            }
          }))
        },
        industryTags: {
          createMany: {
            data: industryTags?.map((tag: string) => ({ tag })) || []
          }
        }
      },
      include: {
        socialLinks: true,
        products: {
          include: {
            photos: true,
            links: true
          }
        },
        industryTags: true
      }
    });

    return NextResponse.json({
      message: 'Business card created successfully',
      card
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('POST /api/cards: Create card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}