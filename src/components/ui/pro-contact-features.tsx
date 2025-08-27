'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import QRCodeComponent from '@/components/ui/qr-code';
import ContactNotesTags from '@/components/ui/contact-notes-tags';
import { 
  Download, 
  Share2, 
  QrCode, 
  Star,
  User,
  Building,
  MapPin,
  Phone,
  Mail,
  Globe
} from 'lucide-react';

interface BusinessCard {
  id: string;
  name: string;
  position: string;
  company: string;
  location?: string;
  avatar?: string;
  phone?: string;
  email?: string;
  website?: string;
  isPublic: boolean;
  viewCount: number;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
}

interface ContactTag {
  id: string;
  tag: string;
  color: string;
  createdAt: string;
}

interface ProContactFeaturesProps {
  card: BusinessCard;
  currentUserId?: string;
  isSaved?: boolean;
  isProUser?: boolean;
  initialNotes?: string;
  initialTags?: ContactTag[];
  onSaveCard?: () => void;
  onUnsaveCard?: () => void;
  onUpdate?: () => void;
}

export default function ProContactFeatures({
  card,
  currentUserId,
  isSaved = false,
  isProUser = false,
  initialNotes = '',
  initialTags = [],
  onSaveCard,
  onUnsaveCard,
  onUpdate
}: ProContactFeaturesProps) {
  const [activeTab, setActiveTab] = useState<'qr' | 'notes'>('qr');
  const [isDownloading, setIsDownloading] = useState(false);

  const generateQRValue = () => {
    // Create a vCard format for the QR code
    return `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
ORG:${card.company}
TITLE:${card.position}
TEL:${card.phone || ''}
EMAIL:${card.email || ''}
URL:${card.website || ''}
END:VCARD`;
  };

  const downloadQRCode = async () => {
    setIsDownloading(true);
    try {
      const canvas = document.querySelector('canvas') as HTMLCanvasElement;
      if (canvas) {
        const link = document.createElement('a');
        link.download = `${card.name.replace(/\s+/g, '_')}_QR_Code.png`;
        link.href = canvas.toDataURL();
        link.click();
      }
    } catch (error) {
      console.error('Error downloading QR code:', error);
    } finally {
      setIsDownloading(false);
    }
  };

  const shareContact = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.name} - ${card.position}`,
          text: `Check out ${card.name}'s contact information`,
          url: window.location.href
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback: copy to clipboard
      const contactInfo = `${card.name}\n${card.position}\n${card.company}\n\nPhone: ${card.phone || ''}\nEmail: ${card.email || ''}\nWebsite: ${card.website || ''}`;
      navigator.clipboard.writeText(contactInfo).then(() => {
        alert('Contact information copied to clipboard!');
      });
    }
  };

  if (!isProUser) {
    return (
      <Card className="mt-6">
        <CardContent className="p-6">
          <div className="text-center py-8">
            <div className="w-16 h-16 bg-gradient-to-r from-purple-100 to-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Star className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">
              Professional Features
            </h3>
            <p className="text-gray-600 mb-6">
              Unlock advanced features including QR codes, contact notes, and tags
            </p>
            <div className="space-y-3 text-left max-w-md mx-auto mb-6">
              <div className="flex items-center gap-3">
                <QrCode className="w-5 h-5 text-purple-600" />
                <span className="text-sm">Generate QR codes with company branding</span>
              </div>
              <div className="flex items-center gap-3">
                <Star className="w-5 h-5 text-purple-600" />
                <span className="text-sm">Add notes and tags to contacts</span>
              </div>
              <div className="flex items-center gap-3">
                <Download className="w-5 h-5 text-purple-600" />
                <span className="text-sm">Download and share contact information</span>
              </div>
            </div>
            <Button className="bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700">
              Upgrade to Professional Plan
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-6">
      {/* Professional Features Header */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <Star className="w-5 h-5 text-purple-600" />
              Professional Features
            </CardTitle>
            <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
              PRO
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="flex gap-2 mb-4">
            <Button
              variant={activeTab === 'qr' ? 'default' : 'outline'}
              onClick={() => setActiveTab('qr')}
              className="flex-1"
            >
              <QrCode className="w-4 h-4 mr-2" />
              QR Code
            </Button>
            <Button
              variant={activeTab === 'notes' ? 'default' : 'outline'}
              onClick={() => setActiveTab('notes')}
              className="flex-1"
            >
              <Star className="w-4 h-4 mr-2" />
              Notes & Tags
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* QR Code Section */}
      {activeTab === 'qr' && (
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Contact QR Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col items-center space-y-4">
              <QRCodeComponent
                value={generateQRValue()}
                companyName={card.company}
                companyLogo={card.avatar}
                size={200}
                showProBadge={true}
              />
              
              <div className="flex gap-2">
                <Button
                  onClick={downloadQRCode}
                  disabled={isDownloading}
                  variant="outline"
                >
                  {isDownloading ? (
                    <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
                  ) : (
                    <>
                      <Download className="w-4 h-4 mr-2" />
                      Download
                    </>
                  )}
                </Button>
                <Button onClick={shareContact} variant="outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share
                </Button>
              </div>

              {/* Contact Summary */}
              <div className="w-full space-y-2 text-sm">
                <div className="flex items-center gap-2">
                  <User className="w-4 h-4 text-gray-500" />
                  <span className="font-medium">{card.name}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-4 h-4 text-gray-500" />
                  <span>{card.company}</span>
                </div>
                <div className="flex items-center gap-2">
                  <MapPin className="w-4 h-4 text-gray-500" />
                  <span>{card.position}</span>
                </div>
                {card.location && (
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-500" />
                    <span>{card.location}</span>
                  </div>
                )}
                {card.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-500" />
                    <span>{card.phone}</span>
                  </div>
                )}
                {card.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-500" />
                    <span>{card.email}</span>
                  </div>
                )}
                {card.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-500" />
                    <span className="text-blue-600 hover:underline">{card.website}</span>
                  </div>
                )}
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Notes & Tags Section */}
      {activeTab === 'notes' && currentUserId && (
        <ContactNotesTags
          cardId={card.id}
          userId={currentUserId}
          initialNotes={initialNotes}
          initialTags={initialTags}
          isProUser={isProUser}
          onUpdate={onUpdate}
        />
      )}
    </div>
  );
}