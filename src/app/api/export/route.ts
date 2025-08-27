import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { getServerSession } from 'next-auth';
import { auth } from '@/lib/auth';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(auth);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { format, cardIds } = await request.json();

    if (!format || !['excel', 'vcf'].includes(format)) {
      return NextResponse.json({ error: 'Invalid format' }, { status: 400 });
    }

    // Get cards to export
    const where = {
      userId: session.user.id,
      ...(cardIds && cardIds.length > 0 && { id: { in: cardIds } })
    };

    const cards = await db.scannedCard.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    });

    if (cards.length === 0) {
      return NextResponse.json({ error: 'No cards to export' }, { status: 404 });
    }

    let content: string;
    let contentType: string;
    let filename: string;

    if (format === 'vcf') {
      content = generateVCFContent(cards);
      contentType = 'text/vcard';
      filename = `apexcard_contacts_${new Date().toISOString().split('T')[0]}.vcf`;
    } else {
      content = generateExcelContent(cards);
      contentType = 'text/csv';
      filename = `apexcard_contacts_${new Date().toISOString().split('T')[0]}.csv`;
    }

    return new NextResponse(content, {
      headers: {
        'Content-Type': contentType,
        'Content-Disposition': `attachment; filename="${filename}"`,
        'Content-Length': content.length.toString()
      }
    });

  } catch (error) {
    console.error('Error exporting cards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

function generateVCFContent(cards: any[]): string {
  let vcfContent = '';

  cards.forEach((card, index) => {
    vcfContent += `BEGIN:VCARD
VERSION:3.0
FN:${card.name || ''}
ORG:${card.company || ''}
TITLE:${card.title || ''}
TEL:${card.phone || ''}
EMAIL:${card.email || ''}
URL:${card.website || ''}
ADR:;;${card.address || ''};;;;
NOTE:${card.notes || ''}
CATEGORIES:${card.tags || ''}
REV:${card.updatedAt || card.createdAt}
END:VCARD
`;
  });

  return vcfContent;
}

function generateExcelContent(cards: any[]): string {
  // Generate CSV content (can be opened in Excel)
  const headers = [
    'Name',
    'Company',
    'Title',
    'Email',
    'Phone',
    'Address',
    'Website',
    'Notes',
    'Tags',
    'Created Date'
  ];

  const csvRows = [headers.join(',')];

  cards.forEach(card => {
    const row = [
      `"${(card.name || '').replace(/"/g, '""')}"`,
      `"${(card.company || '').replace(/"/g, '""')}"`,
      `"${(card.title || '').replace(/"/g, '""')}"`,
      `"${(card.email || '').replace(/"/g, '""')}"`,
      `"${(card.phone || '').replace(/"/g, '""')}"`,
      `"${(card.address || '').replace(/"/g, '""')}"`,
      `"${(card.website || '').replace(/"/g, '""')}"`,
      `"${(card.notes || '').replace(/"/g, '""')}"`,
      `"${(card.tags || '').replace(/"/g, '""')}"`,
      `"${new Date(card.createdAt).toLocaleDateString()}"`
    ];
    csvRows.push(row.join(','));
  });

  return csvRows.join('\n');
}