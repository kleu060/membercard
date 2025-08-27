'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  User, 
  Building2, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Share2,
  Download,
  QrCode,
  Eye,
  Calendar,
  MessageCircle,
  ExternalLink,
  Star,
  Home,
  Building,
  DollarSign,
  Heart
} from 'lucide-react';
import QRCodeComponent from '@/components/ui/qr-code';

interface RealEstateCardProps {
  card: any;
  isOwner?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onBookAppointment?: () => void;
}

export default function RealEstateCard({ 
  card, 
  isOwner = false, 
  onEdit, 
  onShare, 
  onSave,
  onBookAppointment
}: RealEstateCardProps) {
  const [showQRCode, setShowQRCode] = useState(false);

  const getSocialIcon = (platform: string) => {
    const icons: { [key: string]: string } = {
      linkedin: '🔗',
      facebook: '📘',
      instagram: '📷',
      twitter: '🐦',
      wechat: '💬',
      line: '🟢',
      website: '🌐',
      other: '🔗'
    };
    return icons[platform] || '🔗';
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${card.name} 的数字名片`,
          text: `${card.name} - ${card.position} at ${card.company}`,
          url: window.location.href
        });
      } catch (error) {
        console.log('分享失败');
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(window.location.href);
      alert('链接已复制到剪贴板');
    }
  };

  const downloadVCard = () => {
    const vCard = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
ORG:${card.company || ''}
TITLE:${card.position || ''}
TEL:${card.phone || ''}
TEL;TYPE=WORK:${card.officePhone || ''}
EMAIL:${card.email || ''}
URL:${card.website || ''}
ADR:;;${card.address || ''};;;;
NOTE:${card.bio || ''}
END:VCARD`;

    const blob = new Blob([vCard], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.name}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  // Sample property listings for demonstration
  const sampleProperties = [
    {
      title: '針剳區精品櫥房',
      price: '1,989萬元',
      type: '精品公寓',
      location: '台北市信義區',
      features: ['精裝修', '交通便利', '投資自住兩相宜']
    },
    {
      title: '信義區名邸大器3房單位',
      price: '2,748萬元',
      type: '豪宅',
      location: '台北市信義區',
      features: ['大坪數', '景觀佳', '稀有釋出']
    }
  ];

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="overflow-hidden shadow-lg">
        {/* Header with Real Estate Theme */}
        <div className="bg-gradient-to-br from-emerald-700 via-green-700 to-teal-800 p-6 text-white relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
            <div className="absolute top-4 right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
          </div>
          
          <div className="relative z-10">
            {/* Company Header */}
            <div className="text-center mb-4">
              <h2 className="text-lg font-bold text-white/90 mb-1">事多得房屋股份有限公司</h2>
              <div className="flex items-center justify-center space-x-2">
                <Badge className="bg-white/20 text-white text-xs">
                  下載APP
                </Badge>
              </div>
            </div>
            
            <div className="flex flex-col sm:flex-row items-center sm:items-start space-y-4 sm:space-y-0 sm:space-x-6">
              {/* Profile Photo */}
              <div className="flex-shrink-0">
                {card.avatar ? (
                  <img 
                    src={card.avatar} 
                    alt={card.name}
                    className="w-20 h-20 rounded-full border-3 border-white/30 shadow-lg"
                  />
                ) : (
                  <div className="w-20 h-20 rounded-full bg-white/20 flex items-center justify-center backdrop-blur-sm border-2 border-white/30">
                    <User className="w-10 h-10 text-white" />
                  </div>
                )}
              </div>
              
              {/* Main Info */}
              <div className="flex-1 text-center sm:text-left">
                <div className="flex items-center justify-center sm:justify-start space-x-2 mb-2">
                  <h1 className="text-2xl font-bold text-white">{card.name}</h1>
                </div>
                
                {card.position && (
                  <p className="text-lg text-green-100 font-medium mb-1">{card.position}</p>
                )}
                
                {card.company && (
                  <p className="text-green-200 text-sm mb-3">{card.company}</p>
                )}
                
                {/* Service Button */}
                <div className="flex justify-center sm:justify-start mb-4">
                  <Button 
                    onClick={onBookAppointment}
                    className="bg-white text-green-800 hover:bg-green-50 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                  >
                    服務連線
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Featured Properties Section */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Building className="w-5 h-5 text-green-600" />
              台北市信義區精選物件
            </h2>
            
            <div className="space-y-3">
              {sampleProperties.map((property, index) => (
                <div key={index} className="border rounded-lg p-4 bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-green-900">{property.title}</h3>
                    <div className="flex items-center space-x-1">
                      <DollarSign className="w-4 h-4 text-green-600" />
                      <span className="font-bold text-green-800">{property.price}</span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-4 text-sm text-gray-600 mb-2">
                    <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs">
                      {property.type}
                    </span>
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{property.location}</span>
                    </div>
                  </div>
                  <div className="flex flex-wrap gap-1">
                    {property.features.map((feature, featIndex) => (
                      <Badge key={featIndex} variant="secondary" className="text-xs">
                        {feature}
                      </Badge>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <MessageCircle className="w-5 h-5 text-green-600" />
              联系方式
            </h2>
            
            <div className="grid gap-3">
              {card.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{card.phone}</span>
                </div>
              )}
              
              {card.officePhone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{card.officePhone} <span className="text-gray-500">(办公)</span></span>
                </div>
              )}
              
              {card.email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-green-600" />
                  <a 
                    href={`mailto:${card.email}`} 
                    className="text-green-600 hover:underline font-medium"
                  >
                    {card.email}
                  </a>
                </div>
              )}
              
              {card.website && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-4 h-4 text-green-600" />
                  <a 
                    href={card.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-green-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    {card.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              
              {card.address && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-green-600" />
                  <span className="font-medium">{card.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Services */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Home className="w-5 h-5 text-green-600" />
              专业服务
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-900 mb-1">房屋买卖</h3>
                <p className="text-sm text-green-700">专业房产交易服务</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-900 mb-1">租赁服务</h3>
                <p className="text-sm text-blue-700">优质房源租赁管理</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-900 mb-1">投资咨询</h3>
                <p className="text-sm text-purple-700">房产投资专业建议</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <h3 className="font-medium text-orange-900 mb-1">估价服务</h3>
                <p className="text-sm text-orange-700">精准房产价值评估</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {card.socialLinks && card.socialLinks.length > 0 && (
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <Share2 className="w-5 h-5 text-green-600" />
                社交媒体
              </h2>
              <div className="flex flex-wrap gap-2">
                {card.socialLinks.map((link: any, index: number) => (
                  <a
                    key={index}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-2 px-3 py-2 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    <span>{getSocialIcon(link.platform)}</span>
                    <span className="text-sm font-medium">{link.platform}</span>
                  </a>
                ))}
              </div>
            </div>
          )}

          {/* Bio */}
          {card.bio && (
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <User className="w-5 h-5 text-green-600" />
                个人简介
              </h2>
              <div className="p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <p className="text-gray-700 leading-relaxed">{card.bio}</p>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 mb-6">
            <Button 
              onClick={onSave || downloadVCard}
              className="flex-1 bg-green-600 hover:bg-green-700 text-white"
            >
              <Download className="w-4 h-4 mr-2" />
              儲存聯絡人
            </Button>
            <Button 
              onClick={onBookAppointment}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Calendar className="w-4 h-4 mr-2" />
              線上預約
            </Button>
          </div>

          {/* Additional Actions */}
          <div className="flex flex-wrap gap-3 pt-4 border-t">
            <Button onClick={handleShare} variant="outline" className="flex-1 sm:flex-none">
              <Share2 className="w-4 h-4 mr-2" />
              分享名片
            </Button>
            
            <Button onClick={downloadVCard} variant="outline" className="flex-1 sm:flex-none">
              <Download className="w-4 h-4 mr-2" />
              保存到通讯录
            </Button>
            
            <Button 
              onClick={() => setShowQRCode(!showQRCode)} 
              variant="outline"
              className="flex-1 sm:flex-none"
            >
              <QrCode className="w-4 h-4 mr-2" />
              二维码
            </Button>
            
            {isOwner && onEdit && (
              <Button onClick={onEdit} variant="outline" className="flex-1 sm:flex-none">
                编辑名片
              </Button>
            )}
          </div>

          {/* QR Code Modal */}
          {showQRCode && (
            <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
              <div className="bg-white rounded-lg p-6 max-w-sm w-full">
                <div className="text-center">
                  <h3 className="text-lg font-semibold mb-4">扫描二维码</h3>
                  <div className="bg-gray-100 p-4 rounded-lg mb-4">
                    <QRCodeComponent 
                      value={window.location.href} 
                      size={192}
                      className="mx-auto"
                    />
                  </div>
                  <p className="text-sm text-gray-600 mb-4">
                    扫描二维码快速保存联系方式
                  </p>
                  <Button onClick={() => setShowQRCode(false)}>
                    关闭
                  </Button>
                </div>
              </div>
            </div>
          )}

          {/* Stats */}
          <div className="flex items-center justify-between pt-4 text-sm text-gray-500">
            <div className="flex items-center space-x-4">
              {card.viewCount !== undefined && (
                <div className="flex items-center space-x-1">
                  <Eye className="w-4 h-4" />
                  <span>浏览 {card.viewCount}</span>
                </div>
              )}
              {card.createdAt && (
                <div className="flex items-center space-x-1">
                  <Calendar className="w-4 h-4" />
                  <span>创建于 {new Date(card.createdAt).toLocaleDateString('zh-CN')}</span>
                </div>
              )}
            </div>
            
            <div className="flex items-center space-x-1">
              <Building2 className="w-4 h-4" />
              <span>专业认证</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}