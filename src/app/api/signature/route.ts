import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Helper function to get user from token
async function getUserFromToken(request: NextRequest) {
  const token = request.cookies.get('token')?.value;
  
  if (!token) {
    return null;
  }

  try {
    const decoded = jwt.verify(token, JWT_SECRET) as { userId: string };
    const user = await db.user.findUnique({
      where: { id: decoded.userId }
    });
    
    return user;
  } catch (error) {
    console.error('Token verification error:', error);
    return null;
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getUserFromToken(request);
    
    if (!user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    const { cardId, template } = await request.json();

    // Get the business card
    const card = await db.businessCard.findUnique({
      where: { id: cardId },
      include: {
        socialLinks: true,
        products: true
      }
    });

    if (!card || card.userId !== user.id) {
      return NextResponse.json(
        { error: 'Card not found or unauthorized' },
        { status: 404 }
      );
    }

    // Generate HTML signature
    const htmlSignature = generateHTMLSignature(card, template);
    
    // Generate plain text signature
    const plainTextSignature = generatePlainTextSignature(card);

    return NextResponse.json({
      htmlSignature,
      plainTextSignature,
      card
    });
  } catch (error) {
    console.error('Generate signature error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

function generateHTMLSignature(card: any, template: string = 'modern') {
  const socialIcons = {
    linkedin: '🔗',
    facebook: '📘',
    instagram: '📷',
    twitter: '🐦',
    website: '🌐',
    email: '📧',
    phone: '📱'
  };

  const socialLinks = card.socialLinks || [];
  
  let html = '';
  
  if (template === 'modern') {
    html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0; padding: 20px; border-left: 4px solid #007bff; background-color: #f8f9fa;">
        <div style="margin-bottom: 15px;">
          <strong style="font-size: 18px; color: #333;">${card.name}</strong>
          ${card.position ? `<br><span style="color: #666; font-size: 14px;">${card.position}</span>` : ''}
          ${card.company ? `<br><span style="color: #666; font-size: 14px;">${card.company}</span>` : ''}
        </div>
        
        <div style="margin-bottom: 15px;">
          ${card.phone ? `<div style="margin: 5px 0;">📱 ${card.phone}</div>` : ''}
          ${card.email ? `<div style="margin: 5px 0;">📧 <a href="mailto:${card.email}" style="color: #007bff; text-decoration: none;">${card.email}</a></div>` : ''}
          ${card.website ? `<div style="margin: 5px 0;">🌐 <a href="${card.website}" style="color: #007bff; text-decoration: none;">${card.website}</a></div>` : ''}
        </div>
        
        ${socialLinks.length > 0 ? `
          <div style="margin-bottom: 15px;">
            ${socialLinks.map((link: any) => `
              <a href="${link.url}" style="display: inline-block; margin-right: 10px; color: #007bff; text-decoration: none;" target="_blank">
                ${socialIcons[link.platform as keyof typeof socialIcons] || '🔗'} ${link.platform}
              </a>
            `).join('')}
          </div>
        ` : ''}
        
        ${card.bio ? `<div style="font-style: italic; color: #666; font-size: 14px; margin-top: 15px;">${card.bio}</div>` : ''}
      </div>
    `;
  } else if (template === 'minimal') {
    html = `
      <div style="font-family: Arial, sans-serif; margin: 0; padding: 10px 0; border-top: 1px solid #ddd;">
        <div>
          <strong>${card.name}</strong>
          ${card.position ? ` | ${card.position}` : ''}
          ${card.company ? ` | ${card.company}` : ''}
        </div>
        <div style="font-size: 12px; color: #666; margin-top: 5px;">
          ${card.phone ? `${card.phone} | ` : ''}
          ${card.email ? `<a href="mailto:${card.email}" style="color: #666;">${card.email}</a> | ` : ''}
          ${card.website ? `<a href="${card.website}" style="color: #666;">${card.website}</a>` : ''}
        </div>
      </div>
    `;
  } else if (template === 'professional') {
    html = `
      <div style="font-family: 'Times New Roman', serif; max-width: 500px; margin: 0; padding: 15px; border: 1px solid #ccc; background-color: #ffffff;">
        <div style="margin-bottom: 12px;">
          <strong style="font-size: 16px; color: #000;">${card.name}</strong>
          ${card.position ? `<br><span style="color: #333; font-size: 13px;">${card.position}</span>` : ''}
          ${card.company ? `<br><span style="color: #333; font-size: 13px; font-weight: bold;">${card.company}</span>` : ''}
        </div>
        
        <div style="margin-bottom: 12px; font-size: 12px; line-height: 1.4;">
          ${card.phone ? `<div>📞 ${card.phone}</div>` : ''}
          ${card.email ? `<div>📧 <a href="mailto:${card.email}" style="color: #0066cc; text-decoration: none;">${card.email}</a></div>` : ''}
          ${card.website ? `<div>🌐 <a href="${card.website}" style="color: #0066cc; text-decoration: none;">${card.website}</a></div>` : ''}
        </div>
        
        ${socialLinks.length > 0 ? `
          <div style="margin-bottom: 10px; font-size: 11px;">
            ${socialLinks.map((link: any) => `
              <a href="${link.url}" style="display: inline-block; margin-right: 8px; color: #0066cc; text-decoration: none; font-size: 10px;" target="_blank">
                ${socialIcons[link.platform as keyof typeof socialIcons] || '🔗'}
              </a>
            `).join('')}
          </div>
        ` : ''}
        
        ${card.bio ? `<div style="font-style: italic; color: #666; font-size: 11px; margin-top: 10px; border-top: 1px solid #eee; padding-top: 8px;">${card.bio}</div>` : ''}
      </div>
    `;
  } else if (template === 'corporate') {
    html = `
      <div style="font-family: Arial, Helvetica, sans-serif; max-width: 600px; margin: 0; padding: 0; background-color: #ffffff; color: #333333;">
        <table cellpadding="0" cellspacing="0" border="0" style="width: 100%; border-collapse: collapse;">
          <tr>
            <td style="padding: 20px; border: 2px solid #2c3e50; background: linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%);">
              <div style="margin-bottom: 15px;">
                <h2 style="margin: 0; padding: 0; font-size: 18px; font-weight: bold; color: #2c3e50;">${card.name}</h2>
                ${card.position ? `<p style="margin: 4px 0 0 0; padding: 0; font-size: 14px; color: #34495e; font-weight: 600;">${card.position}</p>` : ''}
                ${card.company ? `<p style="margin: 4px 0 0 0; padding: 0; font-size: 13px; color: #7f8c8d;">${card.company}</p>` : ''}
              </div>
              
              <div style="margin-bottom: 15px; border-top: 1px solid #bdc3c7; padding-top: 12px;">
                ${card.phone ? `<div style="margin: 6px 0; font-size: 12px;"><strong style="color: #2c3e50;">Phone:</strong> <a href="tel:${card.phone}" style="color: #3498db; text-decoration: none;">${card.phone}</a></div>` : ''}
                ${card.email ? `<div style="margin: 6px 0; font-size: 12px;"><strong style="color: #2c3e50;">Email:</strong> <a href="mailto:${card.email}" style="color: #3498db; text-decoration: none;">${card.email}</a></div>` : ''}
                ${card.website ? `<div style="margin: 6px 0; font-size: 12px;"><strong style="color: #2c3e50;">Web:</strong> <a href="${card.website}" style="color: #3498db; text-decoration: none;">${card.website}</a></div>` : ''}
              </div>
              
              ${socialLinks.length > 0 ? `
                <div style="margin-bottom: 12px; border-top: 1px solid #bdc3c7; padding-top: 12px;">
                  <div style="font-size: 11px; color: #7f8c8d; margin-bottom: 6px;"><strong>Connect with me:</strong></div>
                  <div style="font-size: 11px;">
                    ${socialLinks.map((link: any) => `
                      <a href="${link.url}" style="display: inline-block; margin-right: 12px; color: #3498db; text-decoration: none; font-weight: 500;" target="_blank">
                        ${socialIcons[link.platform as keyof typeof socialIcons] || '🔗'} ${link.platform}
                      </a>
                    `).join('')}
                  </div>
                </div>
              ` : ''}
              
              ${card.bio ? `<div style="font-style: italic; color: #7f8c8d; font-size: 11px; margin-top: 12px; border-top: 1px solid #bdc3c7; padding-top: 10px;">${card.bio}</div>` : ''}
            </td>
          </tr>
        </table>
      </div>
    `;
  }

  return html;
}

function generatePlainTextSignature(card: any) {
  let signature = '';
  
  signature += `${card.name}\n`;
  if (card.position) signature += `${card.position}\n`;
  if (card.company) signature += `${card.company}\n`;
  signature += '\n';
  
  if (card.phone) signature += `📱 ${card.phone}\n`;
  if (card.email) signature += `📧 ${card.email}\n`;
  if (card.website) signature += `🌐 ${card.website}\n`;
  
  const socialLinks = card.socialLinks || [];
  if (socialLinks.length > 0) {
    signature += '\n';
    socialLinks.forEach((link: any) => {
      signature += `${link.platform}: ${link.url}\n`;
    });
  }
  
  if (card.bio) {
    signature += '\n' + card.bio + '\n';
  }
  
  return signature;
}