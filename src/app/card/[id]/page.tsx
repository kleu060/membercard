'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import BusinessCardDisplay from '@/components/cards/BusinessCardDisplay';
import ProContactFeatures from '@/components/ui/pro-contact-features';
import { 
  ArrowLeft, 
  Share2, 
  Download, 
  QrCode, 
  Eye,
  Calendar,
  MapPin,
  Building2,
  Briefcase
} from 'lucide-react';
import QRCodeComponent from '@/components/ui/qr-code';

export default function PublicCardPage() {
  const params = useParams();
  const cardId = params.id as string;
  
  const [card, setCard] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showQRCode, setShowQRCode] = useState(false);
  const [user, setUser] = useState<any>(null);
  const [isSaved, setIsSaved] = useState(false);
  const [savedCardData, setSavedCardData] = useState<any>(null);
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    checkAuth();
    fetchCard();
  }, [cardId]);

  useEffect(() => {
    if (user) {
      checkIfSaved();
    }
  }, [user]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      // User not authenticated
    } finally {
      setAuthLoading(false);
    }
  };

  const fetchCard = async () => {
    setLoading(true);
    setError('');

    try {
      // Get the auth token from localStorage if available
      let headers: Record<string, string> = {};
      const token = localStorage.getItem('auth-token');
      if (token) {
        headers['Authorization'] = `Bearer ${token}`;
      }

      const response = await fetch(`/api/cards/${cardId}`, { headers });
      const data = await response.json();

      if (response.ok) {
        setCard(data.card);
      } else {
        setError(data.error || '名片不存在');
      }
    } catch (error) {
      setError('网络错误');
    } finally {
      setLoading(false);
    }
  };

  const checkIfSaved = async () => {
    if (!user) return;
    
    try {
      const response = await fetch(`/api/saved-cards/${cardId}?userId=${user.id}`);
      if (response.ok) {
        const savedData = await response.json();
        setIsSaved(true);
        setSavedCardData(savedData);
      }
    } catch (error) {
      // Card not saved
      setIsSaved(false);
    }
  };

  const getPublicCardUrl = () => {
    return window.location.href;
  };

  const handleShare = async (event?: React.MouseEvent) => {
    const shareUrl = getPublicCardUrl();
    const shareText = `${card.name} - ${card.position || ''} at ${card.company || ''}`;
    const shareTitle = `${card.name} 的数字名片`;

    if (navigator.share) {
      try {
        await navigator.share({
          title: shareTitle,
          text: shareText,
          url: shareUrl
        });
        console.log('分享成功');
      } catch (error) {
        if ((error as Error).name !== 'AbortError') {
          console.log('分享被取消或失败:', error);
          // Fallback to clipboard
          await copyToClipboard(shareUrl, event);
        }
      }
    } else {
      // Fallback: copy to clipboard
      await copyToClipboard(shareUrl, event);
    }
  };

  const copyToClipboard = async (text: string, event?: React.MouseEvent) => {
    try {
      await navigator.clipboard.writeText(text);
      // Show success message
      const button = event?.currentTarget as HTMLElement;
      const originalText = button?.querySelector('span')?.textContent || button?.textContent;
      if (button) {
        const span = button.querySelector('span') || button;
        span.textContent = '已复制!';
        button.classList.add('bg-green-100', 'text-green-800');
        
        setTimeout(() => {
          span.textContent = originalText;
          button.classList.remove('bg-green-100', 'text-green-800');
        }, 2000);
      } else {
        alert('链接已复制到剪贴板');
      }
    } catch (error) {
      console.error('复制到剪贴板失败:', error);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      try {
        document.execCommand('copy');
        alert('链接已复制到剪贴板');
      } catch (fallbackError) {
        console.error('复制失败:', fallbackError);
        alert('请手动复制链接: ' + text);
      }
      document.body.removeChild(textArea);
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

  const handleSaveCard = async () => {
    if (!user) return;

    try {
      const response = await fetch('/api/contacts', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          cardId: card.id,
          userId: user.id,
        }),
      });

      if (response.ok) {
        setIsSaved(true);
        checkIfSaved(); // Refresh saved card data
      }
    } catch (error) {
      console.error('Error saving card:', error);
    }
  };

  const handleUnsaveCard = async () => {
    if (!user) return;

    try {
      const response = await fetch(`/api/saved-cards/${card.id}?userId=${user.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        setIsSaved(false);
        setSavedCardData(null);
      }
    } catch (error) {
      console.error('Error unsaving card:', error);
    }
  };

  const handleUpdateFeatures = () => {
    if (user) {
      checkIfSaved();
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">加载中...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md w-full">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-semibold text-gray-900 mb-2">名片不存在</h2>
            <p className="text-gray-600 mb-4">您访问的名片可能已被删除或不存在</p>
            <Button onClick={() => window.history.back()}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              返回
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button 
                variant="ghost" 
                onClick={() => window.history.back()}
                className="flex items-center space-x-2"
              >
                <ArrowLeft className="w-4 h-4" />
                <span>返回</span>
              </Button>
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Briefcase className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-bold text-gray-900">APEXCARD</h1>
            </div>
            
            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm" onClick={(e) => handleShare(e)}>
                <Share2 className="w-4 h-4 mr-2" />
                分享
              </Button>
              <Button variant="outline" size="sm" onClick={downloadVCard}>
                <Download className="w-4 h-4 mr-2" />
                保存
              </Button>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => setShowQRCode(true)}
              >
                <QrCode className="w-4 h-4 mr-2" />
                二维码
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Card Display */}
          <div className="lg:col-span-2">
            <BusinessCardDisplay 
              card={card} 
              isOwner={user && card.userId === user.id} 
            />
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Quick Stats - Only show to card owner */}
            {user && card.userId === user.id && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">名片统计</h3>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Eye className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">浏览次数</span>
                      </div>
                      <span className="font-semibold">{card.viewCount || 0}</span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Calendar className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">创建时间</span>
                      </div>
                      <span className="text-sm text-gray-600">
                        {new Date(card.createdAt).toLocaleDateString('zh-CN')}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Briefcase className="w-4 h-4 text-gray-500" />
                        <span className="text-sm">状态</span>
                      </div>
                      <Badge variant={card.isPublic ? "default" : "secondary"}>
                        {card.isPublic ? "公开" : "私有"}
                      </Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Quick Actions */}
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">快速操作</h3>
                <div className="space-y-2">
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={(e) => handleShare(e)}
                  >
                    <Share2 className="w-4 h-4 mr-2" />
                    分享名片
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={downloadVCard}
                  >
                    <Download className="w-4 h-4 mr-2" />
                    下载 vCard
                  </Button>
                  
                  <Button 
                    variant="outline" 
                    className="w-full justify-start"
                    onClick={() => setShowQRCode(true)}
                  >
                    <QrCode className="w-4 h-4 mr-2" />
                    显示二维码
                  </Button>
                </div>
              </CardContent>
            </Card>

            {/* Location Info */}
            {card.address && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <MapPin className="w-4 h-4" />
                    位置信息
                  </h3>
                  <p className="text-sm text-gray-600">{card.address}</p>
                </CardContent>
              </Card>
            )}

            {/* Company Info */}
            {card.company && (
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4 flex items-center gap-2">
                    <Building2 className="w-4 h-4" />
                    公司信息
                  </h3>
                  <div className="space-y-2">
                    <p className="font-medium">{card.company}</p>
                    {card.position && (
                      <p className="text-sm text-gray-600">{card.position}</p>
                    )}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>

        {/* Professional Features Section */}
        {user && (
          <div className="mt-8">
            <ProContactFeatures
              card={card}
              currentUserId={user.id}
              isSaved={isSaved}
              isProUser={true} // For demo purposes, assume pro user
              initialNotes={savedCardData?.notes || ''}
              initialTags={savedCardData?.tags || []}
              onSaveCard={handleSaveCard}
              onUnsaveCard={handleUnsaveCard}
              onUpdate={handleUpdateFeatures}
            />
          </div>
        )}
      </main>

      {/* QR Code Modal */}
      {showQRCode && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full">
            <div className="text-center">
              <h3 className="text-lg font-semibold mb-4">扫描二维码</h3>
              <div className="bg-gray-100 p-4 rounded-lg mb-4">
                <QRCodeComponent 
                  value={getPublicCardUrl()} 
                  size={192}
                  className="mx-auto"
                />
              </div>
              <p className="text-sm text-gray-600 mb-2">
                扫描二维码快速保存联系方式
              </p>
              <p className="text-xs text-gray-500 mb-4 break-all">
                {getPublicCardUrl()}
              </p>
              <div className="space-y-2">
                <Button onClick={() => setShowQRCode(false)} className="w-full">
                  关闭
                </Button>
                <Button 
                  variant="outline" 
                  onClick={(e) => copyToClipboard(getPublicCardUrl(), e)}
                  className="w-full"
                >
                  复制链接
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}