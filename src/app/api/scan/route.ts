import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { requireAuth } from '@/lib/jwt';
import ZAI from 'z-ai-web-dev-sdk';

// Language mapping for OCR
const LANGUAGE_MAPPING = {
  'en': 'English',
  'zh-TW': 'Traditional Chinese',
  'zh-CN': 'Simplified Chinese',
  'es': 'Spanish',
  'fr': 'French',
  'it': 'Italian',
  'ja': 'Japanese',
  'ko': 'Korean',
  'de': 'German',
  'ru': 'Russian',
  'pt': 'Portuguese',
  'ar': 'Arabic',
  'hi': 'Hindi',
  'th': 'Thai',
  'vi': 'Vietnamese',
  'nl': 'Dutch',
  'sv': 'Swedish',
  'da': 'Danish',
  'no': 'Norwegian',
  'fi': 'Finnish',
  'pl': 'Polish',
  'cs': 'Czech',
  'hu': 'Hungarian',
  'tr': 'Turkish',
  'el': 'Greek',
  'he': 'Hebrew',
  'id': 'Indonesian',
  'ms': 'Malay',
  'tl': 'Filipino',
  'uk': 'Ukrainian',
  'bg': 'Bulgarian',
  'hr': 'Croatian',
  'sk': 'Slovak',
  'sl': 'Slovenian',
  'et': 'Estonian',
  'lv': 'Latvian',
  'lt': 'Lithuanian',
  'mt': 'Maltese',
  'ga': 'Irish',
  'cy': 'Welsh',
  'eu': 'Basque',
  'ca': 'Catalan',
  'gl': 'Galician',
  'is': 'Icelandic',
  'mk': 'Macedonian',
  'sq': 'Albanian',
  'sr': 'Serbian',
  'bs': 'Bosnian',
  'me': 'Montenegrin',
  'si': 'Sinhala',
  'am': 'Amharic',
  'sw': 'Swahili',
  'zu': 'Zulu',
  'af': 'Afrikaans',
  'fa': 'Persian',
  'ur': 'Urdu',
  'bn': 'Bengali',
  'ta': 'Tamil',
  'te': 'Telugu',
  'ml': 'Malayalam',
  'kn': 'Kannada',
  'gu': 'Gujarati',
  'mr': 'Marathi',
  'ne': 'Nepali',
  'my': 'Burmese',
  'km': 'Khmer',
  'lo': 'Lao',
  'ka': 'Georgian',
  'hy': 'Armenian',
  'az': 'Azerbaijani',
  'kk': 'Kazakh',
  'ky': 'Kyrgyz',
  'uz': 'Uzbek',
  'tg': 'Tajik',
  'mn': 'Mongolian',
  'ps': 'Pashto'
};

interface OCRResult {
  name?: string;
  company?: string;
  title?: string;
  email?: string;
  phone?: string;
  address?: string;
  website?: string;
  notes?: string;
  confidence?: number;
  detectedLanguage?: string;
  rawText?: string;
}

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth(request);

    const formData = await request.formData();
    const image = formData.get('image') as File;
    const cardData = formData.get('cardData') as string;
    const targetLanguage = formData.get('language') as string || 'en';
    const autoDetect = formData.get('autoDetect') === 'true';
    const useAdvancedOCR = formData.get('advancedOCR') === 'true';

    if (!image) {
      return NextResponse.json({ error: 'Missing image file' }, { status: 400 });
    }

    // Convert image to buffer
    const imageBuffer = Buffer.from(await image.arrayBuffer());
    const imageBase64 = imageBuffer.toString('base64');
    const imageUrl = `data:${image.type};base64,${imageBase64}`;

    let ocrResult: OCRResult;

    if (useAdvancedOCR) {
      // Validate target language for advanced OCR
      if (!autoDetect && !LANGUAGE_MAPPING[targetLanguage as keyof typeof LANGUAGE_MAPPING]) {
        return NextResponse.json({ 
          error: 'Unsupported language',
          supportedLanguages: Object.keys(LANGUAGE_MAPPING)
        }, { status: 400 });
      }

      // Initialize ZAI SDK for advanced OCR
      const zai = await ZAI.create();

      // Create OCR prompt based on language settings
      let ocrPrompt = '';
      if (autoDetect) {
        ocrPrompt = `Please perform OCR on this business card image and extract the following information:
- Name
- Company
- Title/Position
- Email
- Phone number(s)
- Address
- Website
- Any additional notes

Please detect the language automatically and provide the extracted information in both the original language and English translation. 
Also provide the detected language and confidence score.

Respond in JSON format with the following structure:
{
  "name": "extracted name",
  "company": "extracted company", 
  "title": "extracted title",
  "email": "extracted email",
  "phone": "extracted phone",
  "address": "extracted address", 
  "website": "extracted website",
  "notes": "additional notes",
  "confidence": 0.95,
  "detectedLanguage": "language code",
  "rawText": "full extracted text"
}`;
      } else {
        const targetLanguageName = LANGUAGE_MAPPING[targetLanguage as keyof typeof LANGUAGE_MAPPING];
        ocrPrompt = `Please perform OCR on this business card image and extract the following information in ${targetLanguageName}:
- Name
- Company  
- Title/Position
- Email
- Phone number(s)
- Address
- Website
- Any additional notes

If the text is in a different language, please translate it to ${targetLanguageName}.
Provide the extracted information primarily in ${targetLanguageName}, with the original text in notes if different.

Respond in JSON format with the following structure:
{
  "name": "extracted name",
  "company": "extracted company",
  "title": "extracted title", 
  "email": "extracted email",
  "phone": "extracted phone",
  "address": "extracted address",
  "website": "extracted website", 
  "notes": "additional notes",
  "confidence": 0.95,
  "detectedLanguage": "${targetLanguage}",
  "rawText": "full extracted text"
}`;
      }

      try {
        // Call AI for OCR processing
        const ocrResponse = await zai.chat.completions.create({
          messages: [
            {
              role: 'system',
              content: 'You are an expert OCR (Optical Character Recognition) assistant specializing in business card text extraction. You can recognize text in multiple languages including English, Chinese (Traditional and Simplified), Spanish, French, Italian, Japanese, Korean, and many others. Provide accurate text extraction and proper formatting.'
            },
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: ocrPrompt
                },
                {
                  type: 'image_url',
                  image_url: {
                    url: imageUrl
                  }
                }
              ]
            }
          ],
          max_tokens: 1000,
          temperature: 0.1
        });

        // Parse the OCR response
        const responseContent = ocrResponse.choices[0]?.message?.content;
        if (!responseContent) {
          throw new Error('No response from OCR service');
        }

        // Extract JSON from the response
        const jsonMatch = responseContent.match(/\{[\s\S]*\}/);
        if (!jsonMatch) {
          throw new Error('Invalid OCR response format');
        }

        ocrResult = JSON.parse(jsonMatch[0]);
        
        // Validate and clean the result
        ocrResult = {
          name: ocrResult.name || '',
          company: ocrResult.company || '',
          title: ocrResult.title || '',
          email: ocrResult.email || '',
          phone: ocrResult.phone || '',
          address: ocrResult.address || '',
          website: ocrResult.website || '',
          notes: ocrResult.notes || '',
          confidence: Math.min(Math.max(ocrResult.confidence || 0.8, 0), 1),
          detectedLanguage: ocrResult.detectedLanguage || (autoDetect ? 'unknown' : targetLanguage),
          rawText: ocrResult.rawText || ''
        };

      } catch (ocrError) {
        console.error('Advanced OCR failed, falling back to basic:', ocrError);
        
        // Fallback to basic OCR if AI service fails
        if (cardData) {
          try {
            const parsedCardData = JSON.parse(cardData);
            ocrResult = {
              name: parsedCardData.name || '',
              company: parsedCardData.company || '',
              title: parsedCardData.title || '',
              email: parsedCardData.email || '',
              phone: parsedCardData.phone || '',
              address: parsedCardData.address || '',
              website: parsedCardData.website || '',
              notes: parsedCardData.notes || '',
              confidence: 0.5,
              detectedLanguage: 'unknown',
              rawText: JSON.stringify(parsedCardData)
            };
          } catch (parseError) {
            throw new Error('Both advanced OCR and fallback parsing failed');
          }
        } else {
          throw new Error('Advanced OCR failed and no fallback data provided');
        }
      }
    } else {
      // Use basic OCR with provided card data
      if (!cardData) {
        return NextResponse.json({ error: 'Card data required for basic OCR' }, { status: 400 });
      }

      try {
        const parsedCardData = JSON.parse(cardData);
        ocrResult = {
          name: parsedCardData.name || '',
          company: parsedCardData.company || '',
          title: parsedCardData.title || '',
          email: parsedCardData.email || '',
          phone: parsedCardData.phone || '',
          address: parsedCardData.address || '',
          website: parsedCardData.website || '',
          notes: parsedCardData.notes || '',
          confidence: 0.7,
          detectedLanguage: 'unknown',
          rawText: JSON.stringify(parsedCardData)
        };
      } catch (error) {
        return NextResponse.json({ error: 'Invalid card data format' }, { status: 400 });
      }
    }

    // Save to database
    const scannedCard = await db.scannedCard.create({
      data: {
        userId: user.id,
        imageUrl: imageUrl,
        name: ocrResult.name,
        company: ocrResult.company,
        title: ocrResult.title,
        email: ocrResult.email,
        phone: ocrResult.phone,
        address: ocrResult.address,
        website: ocrResult.website,
        notes: ocrResult.notes,
        ocrData: {
          ...ocrResult,
          processingLanguage: targetLanguage,
          autoDetect,
          useAdvancedOCR,
          timestamp: new Date().toISOString()
        },
        tags: [
          'ocr',
          ...(autoDetect && ocrResult.detectedLanguage ? [ocrResult.detectedLanguage] : []),
          ...(useAdvancedOCR ? ['advanced'] : ['basic'])
        ]
      }
    });

    return NextResponse.json({
      success: true,
      card: scannedCard,
      ocrResult: ocrResult,
      supportedLanguages: Object.keys(LANGUAGE_MAPPING),
      message: `Card scanned successfully using ${useAdvancedOCR ? 'advanced multilingual' : 'basic'} OCR`
    });

  } catch (error) {
    console.error('Error in OCR processing:', error);
    
    // Final fallback - create minimal card entry
    try {
      const user = await requireAuth(request);

      const formData = await request.formData();
      const image = formData.get('image') as File;
      const imageBuffer = Buffer.from(await image.arrayBuffer());
      const imageBase64 = imageBuffer.toString('base64');
      const imageUrl = `data:${image.type};base64,${imageBase64}`;

      const fallbackResult: OCRResult = {
        name: '',
        company: '',
        title: '',
        email: '',
        phone: '',
        address: '',
        website: '',
        notes: 'OCR processing failed. Please try again or use manual entry.',
        confidence: 0.1,
        detectedLanguage: 'error',
        rawText: ''
      };

      const scannedCard = await db.scannedCard.create({
        data: {
          userId: user.id,
          imageUrl: imageUrl,
          name: fallbackResult.name,
          company: fallbackResult.company,
          title: fallbackResult.title,
          email: fallbackResult.email,
          phone: fallbackResult.phone,
          address: fallbackResult.address,
          website: fallbackResult.website,
          notes: fallbackResult.notes,
          ocrData: {
            ...fallbackResult,
            error: error.message,
            fallback: true,
            timestamp: new Date().toISOString()
          },
          tags: ['error', 'ocr']
        }
      });

      return NextResponse.json({
        success: false,
        card: scannedCard,
        ocrResult: fallbackResult,
        error: 'OCR processing failed completely',
        message: 'Card saved but OCR processing failed'
      });

    } catch (fallbackError) {
      if (fallbackError instanceof Error && fallbackError.message === 'Unauthorized') {
        return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
      }
      console.error('Final fallback also failed:', fallbackError);
      return NextResponse.json({ 
        error: 'OCR processing failed completely',
        details: error.message 
      }, { status: 500 });
    }
  }
}

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const user = await requireAuth(request);

    const { searchParams } = new URL(request.url);
    const page = parseInt(searchParams.get('page') || '1');
    const limit = parseInt(searchParams.get('limit') || '10');
    const search = searchParams.get('search') || '';
    const language = searchParams.get('language') || '';
    const ocrType = searchParams.get('ocrType') || ''; // 'advanced' or 'basic'

    const skip = (page - 1) * limit;

    // Build where clause
    const where: any = {
      userId: user.id
    };

    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { title: { contains: search, mode: 'insensitive' } },
        { address: { contains: search, mode: 'insensitive' } }
      ];
    }

    if (language) {
      where.tags = {
        has: language
      };
    }

    if (ocrType) {
      where.tags = {
        ...(where.tags || {}),
        has: ocrType
      };
    }

    const [cards, total] = await Promise.all([
      db.scannedCard.findMany({
        where,
        orderBy: { createdAt: 'desc' },
        skip,
        take: limit
      }),
      db.scannedCard.count({ where })
    ]);

    return NextResponse.json({
      success: true,
      cards,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      },
      supportedLanguages: Object.keys(LANGUAGE_MAPPING),
      currentFilters: {
        search,
        language,
        ocrType
      },
      languageMapping: LANGUAGE_MAPPING
    });

  } catch (error) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    console.error('Error fetching scanned cards:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}