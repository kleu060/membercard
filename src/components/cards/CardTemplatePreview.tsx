'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Eye, User, Building2, Phone, Mail, Globe, MapPin, MessageCircle, ExternalLink } from 'lucide-react';

interface CardTemplatePreviewProps {
  formData: {
    name: string;
    position: string;
    company: string;
    phone: string;
    email: string;
    website: string;
    avatar: string;
    coverPhoto: string;
    profilePhoto: string;
    logo: string;
    template: string;
    socialLinks: Array<{platform: string, url: string}>;
    products: Array<{
      name: string;
      description: string;
      image: string;
      photos: string[];
      links: Array<{title: string, url: string}>;
    }>;
    bio: string;
    address: string;
    location: string;
  };
}

export default function CardTemplatePreview({ formData }: CardTemplatePreviewProps) {
  const getSocialIcon = (platform: string) => {
    switch (platform) {
      case 'linkedin':
        return <Globe className="w-4 h-4" />;
      case 'facebook':
        return <MessageCircle className="w-4 h-4" />;
      case 'instagram':
        return <MessageCircle className="w-4 h-4" />;
      case 'twitter':
        return <MessageCircle className="w-4 h-4" />;
      case 'whatsapp':
        return <MessageCircle className="w-4 h-4" />;
      case 'wechat':
        return <MessageCircle className="w-4 h-4" />;
      case 'line':
        return <MessageCircle className="w-4 h-4" />;
      case 'website':
        return <Globe className="w-4 h-4" />;
      default:
        return <ExternalLink className="w-4 h-4" />;
    }
  };

  const getSocialUrl = (platform: string, url: string) => {
    if (!url) return '#';
    
    // Handle specific platforms
    switch (platform) {
      case 'linkedin':
        return url.includes('linkedin.com') ? url : `https://linkedin.com/in/${url}`;
      case 'facebook':
        return url.includes('facebook.com') ? url : `https://facebook.com/${url}`;
      case 'instagram':
        return url.includes('instagram.com') ? url : `https://instagram.com/${url}`;
      case 'twitter':
        return url.includes('twitter.com') ? url : `https://twitter.com/${url}`;
      case 'whatsapp':
        // For WhatsApp, create a clickable link
        if (!url.startsWith('https://wa.me/') && !url.startsWith('http')) {
          // If it's just a phone number, create WhatsApp link
          const cleanNumber = url.replace(/[^\d+]/g, '');
          return `https://wa.me/${cleanNumber}`;
        }
        return url;
      default:
        // Add https if not present for other platforms
        if (!url.startsWith('http://') && !url.startsWith('https://')) {
          return 'https://' + url;
        }
        return url;
    }
  };

  const getTemplateStyles = () => {
    switch (formData.template) {
      case 'modern-blue':
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textColor: 'text-white',
          cardBg: 'bg-white/10',
          border: 'border-white/20'
        };
      case 'classic-black':
        return {
          background: 'linear-gradient(135deg, #2c3e50 0%, #34495e 100%)',
          textColor: 'text-white',
          cardBg: 'bg-white/10',
          border: 'border-white/20'
        };
      case 'minimal-white':
        return {
          background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)',
          textColor: 'text-gray-800',
          cardBg: 'bg-white/80',
          border: 'border-gray-300'
        };
      case 'creative-gradient':
        return {
          background: 'linear-gradient(135deg, #ff9a9e 0%, #fecfef 50%, #fecfef 100%)',
          textColor: 'text-white',
          cardBg: 'bg-white/10',
          border: 'border-white/20'
        };
      case 'professional-gray':
        return {
          background: 'linear-gradient(135deg, #bdc3c7 0%, #2c3e50 100%)',
          textColor: 'text-white',
          cardBg: 'bg-white/10',
          border: 'border-white/20'
        };
      case 'wealth-management':
        return {
          background: 'linear-gradient(135deg, #11998e 0%, #38ef7d 100%)',
          textColor: 'text-white',
          cardBg: 'bg-white/10',
          border: 'border-white/20'
        };
      case 'real-estate':
        return {
          background: 'linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)',
          textColor: 'text-gray-800',
          cardBg: 'bg-white/80',
          border: 'border-orange-200'
        };
      case 'elegant-teal':
        return {
          background: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
          textColor: 'text-white',
          cardBg: 'bg-white/10',
          border: 'border-white/20'
        };
      default:
        return {
          background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
          textColor: 'text-white',
          cardBg: 'bg-white/10',
          border: 'border-white/20'
        };
    }
  };

  const styles = getTemplateStyles();

  return (
    <Card className="sticky top-4">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Eye className="w-5 h-5" />
          实时预览
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Card Preview */}
          <div className="w-full max-w-sm mx-auto rounded-lg overflow-hidden shadow-lg bg-white border border-gray-200">
            {/* Cover Photo */}
            {formData.coverPhoto && (
              <div className="h-32 bg-cover bg-center" style={{ backgroundImage: `url(${formData.coverPhoto})` }} />
            )}
            
            {/* White Content Section */}
            <div className="p-4 bg-white">
              {/* Header with Logo */}
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  {formData.profilePhoto ? (
                    <img 
                      src={formData.profilePhoto} 
                      alt="Profile" 
                      className="w-16 h-16 rounded-full object-cover border-2 border-gray-200 shadow-lg"
                    />
                  ) : (
                    <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center">
                      <User className="w-8 h-8 text-gray-400" />
                    </div>
                  )}
                  <div>
                    <h3 className="text-lg font-bold text-gray-900">
                      {formData.name || '您的姓名'}
                    </h3>
                    <p className="text-sm text-gray-600">
                      {formData.position || '您的职位'}
                    </p>
                  </div>
                </div>
                {formData.logo && (
                  <img 
                    src={formData.logo} 
                    alt="Logo" 
                    className="w-12 h-12 object-contain"
                  />
                )}
              </div>

              {/* Company */}
              {formData.company && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-4 h-4 text-gray-600" />
                    <span className="text-sm font-medium text-gray-900">
                      {formData.company}
                    </span>
                  </div>
                </div>
              )}

              {/* Bio */}
              {formData.bio && (
                <div className="mb-4">
                  <p className="text-sm text-gray-700 leading-relaxed">
                    {formData.bio}
                  </p>
                </div>
              )}

              {/* Location */}
              {(formData.address || formData.location) && (
                <div className="mb-4">
                  <div className="flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {formData.address || formData.location}
                    </span>
                  </div>
                </div>
              )}

              {/* Contact Information */}
              <div className="space-y-2 mb-4">
                {formData.phone && (
                  <div className="flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-600" />
                    <span className="text-sm text-gray-700">
                      {formData.phone}
                    </span>
                  </div>
                )}
                {formData.email && (
                  <div className="flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-600" />
                    <a 
                      href={`mailto:${formData.email}`}
                      className="text-sm text-blue-600 hover:text-blue-800 underline"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formData.email}
                    </a>
                  </div>
                )}
                {formData.website && (
                  <div className="flex items-center gap-2">
                    <Globe className="w-4 h-4 text-gray-600" />
                    <a 
                      href={formData.website.startsWith('http') ? formData.website : `https://${formData.website}`}
                      className="text-sm text-blue-600 hover:text-blue-800 underline truncate"
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      {formData.website}
                    </a>
                  </div>
                )}
              </div>

              {/* Social Media Links */}
              {formData.socialLinks && formData.socialLinks.length > 0 && (
                <div className="border-t pt-4">
                  <div className="flex flex-wrap gap-2">
                    {formData.socialLinks.map((link, index) => (
                      <a
                        key={index}
                        href={getSocialUrl(link.platform, link.url)}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 hover:bg-gray-200 rounded-md text-xs text-gray-700 hover:text-gray-900 transition-colors"
                        title={link.platform}
                      >
                        {getSocialIcon(link.platform)}
                        <span className="capitalize">{link.platform}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    ))}
                  </div>
                </div>
              )}

              {/* Products/Services */}
              {formData.products && formData.products.length > 0 && (
                <div className="border-t pt-4">
                  <h4 className="text-sm font-semibold text-gray-900 mb-2">产品/服务</h4>
                  <div className="space-y-3">
                    {formData.products.map((product, index) => (
                      <div key={index} className="border-l-2 border-blue-200 pl-3">
                        <h5 className="text-sm font-medium text-gray-900">{product.name}</h5>
                        {product.description && (
                          <p className="text-xs text-gray-600 mt-1">{product.description}</p>
                        )}
                        {product.image && (
                          <img 
                            src={product.image} 
                            alt={product.name}
                            className="w-full h-20 object-cover rounded mt-2"
                          />
                        )}
                        {/* Product Photos Gallery */}
                        {product.photos && product.photos.length > 0 && (
                          <div className="mt-2">
                            <div className="grid grid-cols-2 gap-1">
                              {product.photos.map((photo, photoIndex) => (
                                <img 
                                  key={photoIndex}
                                  src={photo} 
                                  alt={`${product.name} photo ${photoIndex + 1}`}
                                  className="w-full h-16 object-cover rounded border border-gray-200"
                                />
                              ))}
                            </div>
                          </div>
                        )}
                        {product.links && product.links.length > 0 && (
                          <div className="mt-2">
                            <div className="flex flex-wrap gap-1">
                              {product.links.map((link, linkIndex) => (
                                <a
                                  key={linkIndex}
                                  href={link.url.startsWith('http') ? link.url : `https://${link.url}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-1 px-2 py-1 bg-blue-50 hover:bg-blue-100 rounded text-xs text-blue-700 hover:text-blue-900 transition-colors"
                                >
                                  <ExternalLink className="w-3 h-3" />
                                  {link.title}
                                </a>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Template Info */}
          <div className="text-sm text-gray-600 text-center">
            <p>当前模板: {formData.template}</p>
            <p className="text-xs mt-1">更改模板或信息可立即看到效果</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}