'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  Search, 
  Filter, 
  User, 
  Building2, 
  Eye, 
  Calendar,
  MapPin,
  Briefcase,
  TrendingUp,
  Users
} from 'lucide-react';
import { 
  INDUSTRY_OPTIONS, 
  getIndustryName 
} from '@/constants/industries';

const industryOptions = [
  "全部名片 (All Industries)",
  "房地產業務 (Real Estate)",
  "汽車銷售 (Automotive Sales)",
  "金融保險 (Finance & Insurance)",
  "醫療健康 (Healthcare)",
  "家居維修 (Residential Maintenance)",
  "物流倉儲 (Logistics & Warehousing)",
  "教育與輔導 (Education and Tutoring)",
  "美容護理 (Beauty & Haircare)",
  "旅遊導覽 (Tourism Services)",
  "餐飲與住宿 (Dining and Accommodation)",
  "製造業 (Manufacturing)",
  "批發與零售 (Wholesale & Retail)",
  "資訊技術 (Information Technology)",
  "媒體製作 (Media Production)",
  "行銷與內容 (Marketing & Content)",
  "娛樂產業 (Entertainment)",
  "創意設計 (Creative Design)",
  "法律與會計 (Legal & Accounting)",
  "建築工程 (Construction)",
  "農業與畜牧 (Agriculture & Livestock)",
  "其他服務業 (Other Services)"
];

interface MarketplaceProps {
  onCardClick?: (card: any) => void;
}

export default function Marketplace({ onCardClick }: MarketplaceProps) {
  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedIndustry, setSelectedIndustry] = useState('');
  const [selectedLocation, setSelectedLocation] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [industryStats, setIndustryStats] = useState<any[]>([]);

  const locationOptions = [
    "北京", "上海", "广州", "深圳", "杭州", "南京", "武汉", "成都", "西安", "重庆",
    "巴黎", "倫敦"
  ];

  useEffect(() => {
    fetchCards();
  }, [currentPage, selectedIndustry, searchTerm, selectedLocation]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage.toString(),
        limit: '12'
      });

      if (selectedIndustry) params.append('industry', selectedIndustry);
      if (searchTerm) params.append('search', searchTerm);
      if (selectedLocation) params.append('city', selectedLocation);

      const response = await fetch(`/api/marketplace?${params}`);
      const data = await response.json();

      if (response.ok) {
        setCards(data.cards);
        setTotalPages(data.pagination.totalPages);
        setIndustryStats(data.industryStats || []);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setCurrentPage(1);
    fetchCards();
  };

  const handleCardClick = (card: any) => {
    onCardClick?.(card);
  };

  const getIndustryName = (tag: string) => {
    // If the tag contains both Chinese and English, show only Chinese
    if (tag.includes(' (') && tag.includes(')')) {
      return tag.split(' (')[0];
    }
    return tag;
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">名片市场</h1>
        <p className="text-gray-600">发现和连接专业人士</p>
      </div>

      {/* Search and Filters */}
      <Card className="mb-8">
        <CardContent className="p-6">
          <form onSubmit={handleSearch} className="space-y-4">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="搜索姓名、公司、职位..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              
              <Select value={selectedIndustry} onValueChange={(value) => {
                // Handle "All Industries" case ("all" value)
                if (value === "all") {
                  setSelectedIndustry("");
                  return;
                }
                // Extract only the Chinese part for filtering
                const chinesePart = value.includes(' (') ? value.split(' (')[0] : value;
                setSelectedIndustry(chinesePart);
              }}>
                <SelectTrigger className="w-full md:w-48">
                  <SelectValue placeholder="选择行业" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有行业</SelectItem>
                  {INDUSTRY_OPTIONS.map(industry => (
                    <SelectItem key={industry} value={industry}>
                      {getIndustryName(industry)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Select value={selectedLocation} onValueChange={(value) => {
                // Handle "All Cities" case ("all" value)
                if (value === "all") {
                  setSelectedLocation("");
                  return;
                }
                setSelectedLocation(value);
              }}>
                <SelectTrigger className="w-full md:w-32">
                  <SelectValue placeholder="城市" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">所有城市</SelectItem>
                  {locationOptions.map(location => (
                    <SelectItem key={location} value={location}>
                      {location}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              
              <Button type="submit" className="whitespace-nowrap">
                <Filter className="w-4 h-4 mr-2" />
                筛选
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>

      {/* Industry Statistics */}
      {industryStats.length > 0 && (
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="w-5 h-5" />
              热门行业
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {industryStats.map((stat, index) => (
                <Badge 
                  key={stat.tag} 
                  variant={selectedIndustry === getIndustryName(stat.tag) ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setSelectedIndustry(selectedIndustry === getIndustryName(stat.tag) ? '' : getIndustryName(stat.tag))}
                >
                  {getIndustryName(stat.tag)} ({stat._count.tag})
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Cards Grid */}
      {loading ? (
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(6)].map((_, index) => (
            <Card key={index} className="animate-pulse">
              <CardContent className="p-6">
                <div className="flex items-center space-x-4 mb-4">
                  <div className="w-12 h-12 bg-gray-300 rounded-full"></div>
                  <div className="flex-1">
                    <div className="h-4 bg-gray-300 rounded w-3/4 mb-2"></div>
                    <div className="h-3 bg-gray-300 rounded w-1/2"></div>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-300 rounded"></div>
                  <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            {cards.map((card) => (
              <Card 
                key={card.id} 
                className="hover:shadow-lg transition-shadow cursor-pointer"
                onClick={() => handleCardClick(card)}
              >
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      {card.user.avatar ? (
                        <img 
                          src={card.user.avatar} 
                          alt={card.name}
                          className="w-12 h-12 rounded-full"
                        />
                      ) : (
                        <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                          <User className="w-6 h-6 text-gray-500" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold text-lg">{card.name}</h3>
                        {card.position && (
                          <p className="text-sm text-gray-600">{card.position}</p>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center space-x-1 text-sm text-gray-500">
                      <Eye className="w-4 h-4" />
                      <span>{card.viewCount || 0}</span>
                    </div>
                  </div>

                  {card.company && (
                    <div className="flex items-center space-x-2 mb-3">
                      <Building2 className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{card.company}</span>
                    </div>
                  )}

                  {card.location && (
                    <div className="flex items-center space-x-2 mb-3">
                      <MapPin className="w-4 h-4 text-gray-500" />
                      <span className="text-sm text-gray-700">{card.location}</span>
                    </div>
                  )}

                  {card.industryTags && card.industryTags.length > 0 && (
                    <div className="mb-3">
                      <div className="flex flex-wrap gap-1">
                        {card.industryTags.slice(0, 2).map((tag: any, index: number) => (
                          <Badge key={index} variant="secondary" className="text-xs">
                            {getIndustryName(tag.tag)}
                          </Badge>
                        ))}
                        {card.industryTags.length > 2 && (
                          <Badge variant="outline" className="text-xs">
                            +{card.industryTags.length - 2}
                          </Badge>
                        )}
                      </div>
                    </div>
                  )}

                  {card.bio && (
                    <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                      {card.bio}
                    </p>
                  )}

                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-3 h-3" />
                      <span>{new Date(card.createdAt).toLocaleDateString('zh-CN')}</span>
                    </div>
                    <Button variant="ghost" size="sm" className="h-6 text-xs">
                      查看详情
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center space-x-2">
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
              >
                上一页
              </Button>
              
              <div className="flex items-center space-x-1">
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  const page = i + 1;
                  return (
                    <Button
                      key={page}
                      variant={currentPage === page ? "default" : "outline"}
                      size="sm"
                      onClick={() => setCurrentPage(page)}
                    >
                      {page}
                    </Button>
                  );
                })}
              </div>
              
              <Button
                variant="outline"
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
              >
                下一页
              </Button>
            </div>
          )}

          {cards.length === 0 && (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">暂无名片</h3>
              <p className="text-gray-600">没有找到符合条件的名片，请尝试其他搜索条件</p>
            </div>
          )}
        </>
      )}
    </div>
  );
}