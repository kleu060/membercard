'use client';

import { Button } from '@/components/ui/button';
import { Phone, MessageCircle, Mail, Globe, MapPin } from 'lucide-react';

interface CardTemplateProps {
  name: string;
  position: string;
  company: string;
  companyTagline: string;
  description: string;
  theme?: 'tech' | 'finance' | 'healthcare';
  phone?: string;
  email?: string;
  website?: string;
  location?: string;
  onCall?: () => void;
  onMessage?: () => void;
  onEmail?: () => void;
  onVisitWebsite?: () => void;
}

export default function CardTemplate({
  name,
  position,
  company,
  companyTagline,
  description,
  theme = 'tech',
  phone,
  email,
  website,
  location,
  onCall,
  onMessage,
  onEmail,
  onVisitWebsite
}: CardTemplateProps) {
  const getThemeClasses = () => {
    switch (theme) {
      case 'finance':
        return 'bg-blue-50 border-blue-200';
      case 'healthcare':
        return 'bg-gray-50 border-gray-200';
      case 'tech':
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getThemeAccent = () => {
    switch (theme) {
      case 'finance':
        return 'bg-blue-600';
      case 'healthcare':
        return 'bg-gray-600';
      case 'tech':
      default:
        return 'bg-blue-600';
    }
  };

  const getButtonClasses = (isPrimary: boolean) => {
    if (isPrimary) {
      return 'bg-blue-600 hover:bg-blue-700 text-white';
    }
    return 'bg-gray-200 hover:bg-gray-300 text-gray-700';
  };

  return (
    <div className={`max-w-sm mx-auto rounded-lg shadow-md border ${getThemeClasses()} overflow-hidden transition-transform duration-200 hover:shadow-lg hover:scale-105`}>
      {/* Header with accent */}
      <div className={`h-2 ${getThemeAccent()}`}></div>
      
      <div className="p-5">
        {/* Name and Position */}
        <div className="mb-3">
          <h2 className="text-2xl font-bold text-gray-900 mb-1">{name}</h2>
          <p className="text-gray-600 text-sm">{position}</p>
        </div>

        {/* Company */}
        <div className="mb-3">
          <h3 className="text-lg font-semibold text-gray-800">{company}</h3>
          <p className="text-gray-600 text-sm leading-relaxed">{companyTagline}</p>
        </div>

        {/* Contact Information */}
        {(phone || email || website || location) && (
          <div className="mb-4 space-y-2">
            {phone && (
              <div className="flex items-center text-sm text-gray-600">
                <Phone className="w-4 h-4 mr-2 text-blue-600" />
                <span>{phone}</span>
              </div>
            )}
            {email && (
              <div className="flex items-center text-sm text-gray-600">
                <Mail className="w-4 h-4 mr-2 text-blue-600" />
                <span>{email}</span>
              </div>
            )}
            {website && (
              <div className="flex items-center text-sm text-gray-600">
                <Globe className="w-4 h-4 mr-2 text-blue-600" />
                <span className="truncate">{website}</span>
              </div>
            )}
            {location && (
              <div className="flex items-center text-sm text-gray-600">
                <MapPin className="w-4 h-4 mr-2 text-blue-600" />
                <span>{location}</span>
              </div>
            )}
          </div>
        )}

        {/* Description */}
        <div className="mb-6">
          <p className="text-gray-700 text-sm leading-relaxed">
            {description}
          </p>
        </div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <div className="flex gap-2">
            {onCall && (
              <Button 
                onClick={onCall}
                className={`flex-1 ${getButtonClasses(true)} transition-colors duration-200`}
                size="sm"
              >
                <Phone className="w-4 h-4 mr-2" />
                撥打電話
              </Button>
            )}
            {onMessage && (
              <Button 
                onClick={onMessage}
                className={`flex-1 ${getButtonClasses(false)} transition-colors duration-200`}
                size="sm"
              >
                <MessageCircle className="w-4 h-4 mr-2" />
                傳送訊息
              </Button>
            )}
          </div>
          
          <div className="flex gap-2">
            {onEmail && (
              <Button 
                onClick={onEmail}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <Mail className="w-4 h-4 mr-2" />
                寫郵件
              </Button>
            )}
            {onVisitWebsite && (
              <Button 
                onClick={onVisitWebsite}
                variant="outline"
                className="flex-1"
                size="sm"
              >
                <Globe className="w-4 h-4 mr-2" />
                訪問網站
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}