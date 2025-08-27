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
  TrendingUp,
  Shield
} from 'lucide-react';
import QRCodeComponent from '@/components/ui/qr-code';

interface WealthManagementCardProps {
  card: any;
  isOwner?: boolean;
  onEdit?: () => void;
  onShare?: () => void;
  onSave?: () => void;
  onBookAppointment?: () => void;
}

export default function WealthManagementCard({ 
  card, 
  isOwner = false, 
  onEdit, 
  onShare, 
  onSave,
  onBookAppointment
}: WealthManagementCardProps) {
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

  return (
    <div className="max-w-2xl mx-auto">
      <Card className="overflow-hidden shadow-lg">
        {/* Header with Wealth Management Theme */}
        <div className="bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 p-6 text-white relative">
          {/* Background Pattern */}
          <div className="absolute inset-0 opacity-10">
            <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-transparent via-white/20 to-transparent"></div>
            <div className="absolute top-4 right-4 w-24 h-24 bg-white/5 rounded-full blur-xl"></div>
            <div className="absolute bottom-4 left-4 w-16 h-16 bg-white/5 rounded-full blur-lg"></div>
          </div>
          
          <div className="relative z-10">
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
                  <div className="flex items-center space-x-1">
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    <Star className="w-4 h-4 text-yellow-400 fill-current" />
                  </div>
                </div>
                
                {card.position && (
                  <p className="text-lg text-blue-100 font-medium mb-1">{card.position}</p>
                )}
                
                {card.company && (
                  <p className="text-blue-200 text-sm mb-3">{card.company}</p>
                )}
                
                {/* Service Highlights */}
                <div className="flex flex-wrap justify-center sm:justify-start gap-2 mb-4">
                  <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    <TrendingUp className="w-3 h-3 text-green-300" />
                    <span className="text-xs text-green-100">資產增值</span>
                  </div>
                  <div className="flex items-center space-x-1 bg-white/10 backdrop-blur-sm rounded-full px-3 py-1">
                    <Shield className="w-3 h-3 text-blue-300" />
                    <span className="text-xs text-blue-100">風險管理</span>
                  </div>
                </div>
                
                {/* Quick Actions */}
                <div className="flex flex-col sm:flex-row gap-2">
                  <Button 
                    onClick={onSave || downloadVCard}
                    className="bg-white text-blue-900 hover:bg-blue-50 text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                  >
                    儲存聯絡人
                  </Button>
                  <Button 
                    onClick={onBookAppointment}
                    className="bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium px-4 py-2 rounded-lg transition-all duration-200 shadow-md"
                  >
                    線上預約
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>

        <CardContent className="p-6">
          {/* Contact Information */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <MessageCircle className="w-5 h-5 text-blue-600" />
              联系方式
            </h2>
            
            <div className="grid gap-3">
              {card.phone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{card.phone}</span>
                </div>
              )}
              
              {card.officePhone && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Phone className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{card.officePhone} <span className="text-gray-500">(办公)</span></span>
                </div>
              )}
              
              {card.email && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <a 
                    href={`mailto:${card.email}`} 
                    className="text-blue-600 hover:underline font-medium"
                  >
                    {card.email}
                  </a>
                </div>
              )}
              
              {card.website && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <Globe className="w-4 h-4 text-blue-600" />
                  <a 
                    href={card.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline flex items-center gap-1 font-medium"
                  >
                    {card.website}
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              )}
              
              {card.address && (
                <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                  <MapPin className="w-4 h-4 text-blue-600" />
                  <span className="font-medium">{card.address}</span>
                </div>
              )}
            </div>
          </div>

          {/* Professional Services */}
          <div className="space-y-4 mb-6">
            <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
              <Briefcase className="w-5 h-5 text-blue-600" />
              专业服务
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div className="p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <h3 className="font-medium text-blue-900 mb-1">投资组合管理</h3>
                <p className="text-sm text-blue-700">个性化投资方案，资产优化配置</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-100">
                <h3 className="font-medium text-green-900 mb-1">风险评估</h3>
                <p className="text-sm text-green-700">全面风险分析，稳健投资策略</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg border border-purple-100">
                <h3 className="font-medium text-purple-900 mb-1">财富规划</h3>
                <p className="text-sm text-purple-700">长期财富增值，传承规划</p>
              </div>
              <div className="p-3 bg-gradient-to-r from-orange-50 to-amber-50 rounded-lg border border-orange-100">
                <h3 className="font-medium text-orange-900 mb-1">税务优化</h3>
                <p className="text-sm text-orange-700">合法税务筹划，优化收益</p>
              </div>
            </div>
          </div>

          {/* Social Links */}
          {card.socialLinks && card.socialLinks.length > 0 && (
            <div className="space-y-4 mb-6">
              <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-800">
                <Share2 className="w-5 h-5 text-blue-600" />
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
                <User className="w-5 h-5 text-blue-600" />
                专业简介
              </h2>
              <div className="p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-100">
                <p className="text-gray-700 leading-relaxed">{card.bio}</p>
              </div>
            </div>
          )}

          {/* Actions */}
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