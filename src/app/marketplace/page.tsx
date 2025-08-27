'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import LocationAutocomplete from '@/components/ui/location-autocomplete';
import Header from '@/components/header/Header';
import { 
  Search, 
  Filter, 
  MapPin, 
  Building2, 
  Users, 
  Eye,
  Star,
  Briefcase,
  Phone,
  Mail,
  Globe,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface IndustryTag {
  tag: string;
  _count: {
    tag: number;
  };
}

interface BusinessCard {
  id: string;
  name: string;
  position: string;
  company: string;
  location?: string;
  avatar?: string;
  bio?: string;
  phone?: string;
  email?: string;
  website?: string;
  address?: string;
  viewCount: number;
  createdAt: string;
  user: {
    id: string;
    name: string;
    avatar?: string;
  };
  socialLinks: Array<{
    platform: string;
    url: string;
  }>;
  products: Array<{
    name: string;
    description?: string;
    image?: string;
  }>;
  industryTags: Array<{
    id: string;
    tag: string;
  }>;
}

export default function MarketplacePage() {
  const { t, language } = useLanguage();
  const [user, setUser] = useState<any>(null);
  const [cards, setCards] = useState<BusinessCard[]>([]);
  const [industryStats, setIndustryStats] = useState<IndustryTag[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [locationFilter, setLocationFilter] = useState('');
  const [currentPage, setCurrentPage] = useState(1);

  useEffect(() => {
    checkAuth();
    fetchMarketplaceData();
  }, []);

  useEffect(() => {
    fetchMarketplaceData();
  }, [currentPage, selectedIndustry, searchTerm, locationFilter, language]);

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/auth/me');
      if (response.ok) {
        const data = await response.json();
        setUser(data.user);
      }
    } catch (error) {
      // User not authenticated
    }
  };

  // Industry tags mapping
  const industryTags = {
    'zh-TW': [
      '全部名片',
      '房地產業務',
      '汽車銷售',
      '金融保險',
      '醫療健康',
      '家居維修',
      '物流倉儲',
      '教育與輔導',
      '美容護理',
      '旅遊導覽',
      '餐飲與住宿',
      '製造業',
      '批發與零售',
      '資訊技術',
      '媒體製作',
      '行銷與內容',
      '娛樂產業',
      '創意設計',
      '法律與會計',
      '建築工程',
      '農業與畜牧',
      '其他服務業'
    ],
    'zh-CN': [
      '全部名片',
      '房地产业务',
      '汽车销售',
      '金融保险',
      '医疗健康',
      '家居维修',
      '物流仓储',
      '教育与辅导',
      '美容护理',
      '旅游导览',
      '餐饮与住宿',
      '制造业',
      '批发与零售',
      '信息技术',
      '媒体制作',
      '行销与内容',
      '娱乐产业',
      '创意设计',
      '法律与会计',
      '建筑工程',
      '农业与畜牧',
      '其他服务业'
    ],
    'en': [
      'All Industries',
      'Real Estate',
      'Automotive Sales',
      'Finance & Insurance',
      'Healthcare',
      'Residential Maintenance',
      'Logistics & Warehousing',
      'Education and Tutoring',
      'Beauty & Haircare',
      'Tourism Services',
      'Dining and Accommodation',
      'Manufacturing',
      'Wholesale & Retail',
      'Information Technology',
      'Media Production',
      'Marketing & Content',
      'Entertainment',
      'Creative Design',
      'Legal & Accounting',
      'Construction',
      'Agriculture & Livestock',
      'Other Services'
    ]
  };

  useEffect(() => {
    fetchMarketplaceData();
  }, [currentPage, selectedIndustry, searchTerm, locationFilter, language]);

  const fetchMarketplaceData = async () => {
    try {
      setLoading(true);
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12',
      });

      if (selectedIndustry) {
        params.append('industry', selectedIndustry);
      }

      if (searchTerm) {
        params.append('search', searchTerm);
      }

      if (locationFilter) {
        params.append('city', locationFilter);
      }

      const response = await fetch(`/api/marketplace?${params}`);
      if (response.ok) {
        const data = await response.json();
        setCards(data.cards || []);
        setIndustryStats(data.industryStats || []);
      }
    } catch (error) {
      console.error('Error fetching marketplace data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleIndustryFilter = (industry: string) => {
    setSelectedIndustry(industry === selectedIndustry ? '' : industry);
    setCurrentPage(1);
  };

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

  const getIndustryTagColor = (tag: string) => {
    const colors = [
      'bg-blue-100 text-blue-800',
      'bg-green-100 text-green-800',
      'bg-purple-100 text-purple-800',
      'bg-orange-100 text-orange-800',
      'bg-pink-100 text-pink-800',
      'bg-indigo-100 text-indigo-800',
      'bg-yellow-100 text-yellow-800',
      'bg-red-100 text-red-800',
      'bg-teal-100 text-teal-800',
      'bg-cyan-100 text-cyan-800'
    ];
    const index = industryTags[language].indexOf(tag);
    return colors[index % colors.length] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header user={user} />
      
      {/* Page Title and Search Section */}
      <div className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                {t('marketplace.title')}
              </h1>
              <p className="text-gray-600">
                {t('marketplace.subtitle')}
              </p>
            </div>
            <div className="flex items-center space-x-2 text-sm text-gray-500">
              <Users className="w-4 h-4" />
              <span>{cards.length} {t('marketplace.cards')}</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder={t('marketplace.searchPlaceholder')}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex-1 relative">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <LocationAutocomplete
                value={locationFilter}
                onChange={setLocationFilter}
                placeholder={t('marketplace.locationPlaceholder')}
                className="pl-10 w-full"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="flex gap-8">
          {/* Sidebar - Industry Filter */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-6 sticky top-8">
              <div className="flex items-center gap-2 mb-4">
                <Filter className="w-4 h-4" />
                <h3 className="font-semibold text-gray-900">
                  {t('marketplace.industryFilter')}
                </h3>
              </div>
              
              <div className="space-y-2">
                {industryTags[language].map((industry) => {
                  const count = industryStats.find(stat => stat.tag === industry)?._count.tag || 0;
                  return (
                    <button
                      key={industry}
                      onClick={() => handleIndustryFilter(industry)}
                      className={`w-full flex items-center justify-between px-3 py-2 text-left rounded-lg transition-colors ${
                        selectedIndustry === industry
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'hover:bg-gray-50 text-gray-700'
                      }`}
                    >
                      <span className="text-sm font-medium">{industry}</span>
                      {count > 0 && (
                        <Badge variant="secondary" className="text-xs">
                          {count}
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>

              {(selectedIndustry) && (
                <div className="mt-6 pt-6 border-t">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => {
                      setSelectedIndustry('');
                    }}
                    className="w-full"
                  >
                    {t('marketplace.clearFilters')}
                  </Button>
                </div>
              )}
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, index) => (
                  <div key={index} className="bg-white rounded-lg shadow-sm p-6 animate-pulse">
                    <div className="flex items-center space-x-4 mb-4">
                      <div className="w-12 h-12 bg-gray-200 rounded-full"></div>
                      <div className="flex-1">
                        <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                        <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                      </div>
                    </div>
                    <div className="space-y-2">
                      <div className="h-3 bg-gray-200 rounded"></div>
                      <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <>
                {cards.length === 0 ? (
                  <div className="text-center py-12">
                    <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <Briefcase className="w-8 h-8 text-gray-400" />
                    </div>
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      {t('marketplace.noCardsFound')}
                    </h3>
                    <p className="text-gray-500">
                      {t('marketplace.noCardsFoundDesc')}
                    </p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                      <Card key={card.id} className="bg-white shadow-sm hover:shadow-md transition-shadow">
                        <CardContent className="p-6">
                          {/* Header */}
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {card.avatar ? (
                                <img 
                                  src={card.avatar} 
                                  alt={card.name}
                                  className="w-12 h-12 rounded-full object-cover"
                                />
                              ) : (
                                <div className="w-12 h-12 bg-gray-100 rounded-full flex items-center justify-center">
                                  <Users className="w-6 h-6 text-gray-400" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold text-gray-900">{card.name}</h3>
                                <p className="text-sm text-gray-600">{card.position}</p>
                                <p className="text-sm text-blue-600">{card.company}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-1 text-xs text-gray-500">
                              <Eye className="w-3 h-3" />
                              <span>{card.viewCount}</span>
                            </div>
                          </div>

                          {/* Location */}
                          {card.location && (
                            <div className="flex items-center space-x-1 text-sm text-gray-600 mb-3">
                              <MapPin className="w-4 h-4" />
                              <span>{card.location}</span>
                            </div>
                          )}

                          {/* Industry Tags */}
                          {card.industryTags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mb-3">
                              {card.industryTags.slice(0, 2).map((tag) => (
                                <Badge 
                                  key={tag.id} 
                                  variant="secondary" 
                                  className={`text-xs ${getIndustryTagColor(tag.tag)}`}
                                >
                                  {tag.tag}
                                </Badge>
                              ))}
                              {card.industryTags.length > 2 && (
                                <Badge variant="outline" className="text-xs">
                                  +{card.industryTags.length - 2}
                                </Badge>
                              )}
                            </div>
                          )}

                          {/* Bio */}
                          {card.bio && (
                            <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                              {card.bio}
                            </p>
                          )}

                          {/* Quick Contact */}
                          <div className="space-y-2 mb-4">
                            {card.email && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Mail className="w-3 h-3" />
                                <span className="truncate">{card.email}</span>
                              </div>
                            )}
                            {card.phone && (
                              <div className="flex items-center space-x-2 text-sm text-gray-600">
                                <Phone className="w-3 h-3" />
                                <span>{card.phone}</span>
                              </div>
                            )}
                            {card.website && (
                              <div className="flex items-center space-x-2 text-sm text-blue-600">
                                <Globe className="w-3 h-3" />
                                <a 
                                  href={card.website} 
                                  target="_blank" 
                                  rel="noopener noreferrer"
                                  className="truncate hover:underline flex items-center"
                                >
                                  {card.website}
                                  <ExternalLink className="w-3 h-3 ml-1" />
                                </a>
                              </div>
                            )}
                          </div>

                          {/* View Button */}
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="w-full"
                            onClick={() => window.open(`/card/${card.id}`, '_blank')}
                          >
                            {t('common.viewCard')}
                          </Button>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}