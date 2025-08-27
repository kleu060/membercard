import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/jwt';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const card = await db.businessCard.findUnique({
      where: { id },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            avatar: true
          }
        },
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

    if (!card) {
      return NextResponse.json(
        { error: 'Card not found' },
        { status: 404 }
      );
    }

    // Increment view count for public cards
    if (card.isPublic) {
      await db.businessCard.update({
        where: { id },
        data: { viewCount: { increment: 1 } }
      });
    }

    // Check if user is authenticated and is the card owner
    let isOwner = false;
    const authHeader = request.headers.get('authorization');
    if (authHeader && authHeader.startsWith('Bearer ')) {
      try {
        const token = authHeader.substring(7);
        const user = await requireAuth(request);
        isOwner = user.id === card.userId;
      } catch (error) {
        // User not authenticated or invalid token
      }
    }

    // Create a response object that excludes private analytics for non-owners
    const responseCard = {
      ...card,
      // Only include viewCount for the card owner
      viewCount: isOwner ? card.viewCount : undefined,
      // Always include other public card data
      id: card.id,
      userId: card.userId,
      name: card.name,
      company: card.company,
      position: card.position,
      phone: card.phone,
      officePhone: card.officePhone,
      email: card.email,
      address: card.address,
      website: card.website,
      bio: card.bio,
      avatar: card.avatar,
      coverPhoto: card.coverPhoto,
      location: card.location,
      template: card.template,
      isPublic: card.isPublic,
      createdAt: card.createdAt,
      updatedAt: card.updatedAt,
      user: card.user,
      socialLinks: card.socialLinks,
      products: card.products,
      industryTags: card.industryTags
    };

    return NextResponse.json({ card: responseCard });
  } catch (error) {
    console.error('Get card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    console.log('PUT /api/cards/[id]: Starting update for card', id);
    const user = await requireAuth(request);

    const existingCard = await db.businessCard.findUnique({
      where: { id }
    });

    if (!existingCard || existingCard.userId !== user.id) {
      console.log('PUT /api/cards/[id]: Card not found or unauthorized', { cardId: id, userId: user.id });
      return NextResponse.json(
        { error: 'Card not found or unauthorized' },
        { status: 404 }
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

    console.log('PUT /api/cards/[id]: Social links details:', {
      count: socialLinks?.length || 0,
      firstLink: socialLinks?.[0],
      allLinks: socialLinks,
      socialLinksType: typeof socialLinks,
      isArray: Array.isArray(socialLinks)
    });

    // Use a transaction to ensure data consistency
    const result = await db.$transaction(async (tx) => {
      // Update the main card data
      const updatedCard = await tx.businessCard.update({
        where: { id },
        data: {
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

      // Handle social links - delete all and recreate
      console.log('PUT /api/cards/[id]: Deleting existing social links...');
      await tx.socialLink.deleteMany({
        where: { cardId: id }
      });

      if (socialLinks && socialLinks.length > 0) {
        console.log('PUT /api/cards/[id]: Creating new social links:', socialLinks);
        const socialLinksToCreate = socialLinks.map((link: any) => ({
          cardId: id,
          platform: link.platform,
          url: link.url,
          username: link.username || null
        }));
        console.log('PUT /api/cards/[id]: Formatted social links for creation:', socialLinksToCreate);
        
        await tx.socialLink.createMany({
          data: socialLinksToCreate
        });
        console.log('PUT /api/cards/[id]: Social links created successfully');
      } else {
        console.log('PUT /api/cards/[id]: No social links to create');
      }

      // Handle products - delete all and recreate with transaction safety
      await tx.productLink.deleteMany({
        where: {
          product: {
            cardId: id
          }
        }
      });

      await tx.productPhoto.deleteMany({
        where: {
          product: {
            cardId: id
          }
        }
      });

      await tx.product.deleteMany({
        where: { cardId: id }
      });

      if (products && products.length > 0) {
        for (const product of products) {
          const newProduct = await tx.product.create({
            data: {
              cardId: id,
              name: product.name,
              description: product.description || null,
              image: product.image || null,
            }
          });

          // Add product photos
          if (product.photos && product.photos.length > 0) {
            await tx.productPhoto.createMany({
              data: product.photos.map((photo: string) => ({
                productId: newProduct.id,
                url: photo
              }))
            });
          }

          // Add product links
          if (product.links && product.links.length > 0) {
            await tx.productLink.createMany({
              data: product.links.map((link: any) => ({
                productId: newProduct.id,
                title: link.title,
                url: link.url
              }))
            });
          }
        }
      }

      // Handle industry tags
      await tx.industryTag.deleteMany({
        where: { cardId: id }
      });

      if (industryTags && industryTags.length > 0) {
        await tx.industryTag.createMany({
          data: industryTags.map((tag: string) => ({
            cardId: id,
            tag
          }))
        });
      }

      // Return the updated card with all relations
      return tx.businessCard.findUnique({
        where: { id },
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
    });

    console.log('PUT /api/cards/[id]: Card updated successfully');
    return NextResponse.json({
      message: 'Business card updated successfully',
      card: result
    });
  } catch (error) {
    console.error('PUT /api/cards/[id]: Update card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const user = await requireAuth(request);

    const existingCard = await db.businessCard.findUnique({
      where: { id }
    });

    if (!existingCard || existingCard.userId !== user.id) {
      return NextResponse.json(
        { error: 'Card not found or unauthorized' },
        { status: 404 }
      );
    }

    await db.businessCard.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Business card deleted successfully'
    });
  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }
    console.error('Delete card error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}