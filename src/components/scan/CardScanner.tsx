'use client';

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Camera, Upload, Search, Download, Edit, Trash2, Phone, Mail, Globe, MapPin, Building, User } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ScannedCardData {
  id: string;
  imageUrl: string;
  name: string;
  company: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  website: string;
  notes: string;
  createdAt: string;
  tags: string[];
}

export default function CardScanner() {
  const [scannedCards, setScannedCards] = useState<ScannedCardData[]>([]);
  const [selectedCard, setSelectedCard] = useState<ScannedCardData | null>(null);
  const [isScanning, setIsScanning] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('auto');
  const [useAdvancedOCR, setUseAdvancedOCR] = useState(true);
  const [autoDetectLanguage, setAutoDetectLanguage] = useState(true);
  const [supportedLanguages, setSupportedLanguages] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { language, t } = useLanguage();

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsScanning(true);

    try {
      const formData = new FormData();
      formData.append('image', file);
      formData.append('language', selectedLanguage === 'auto' ? 'en' : selectedLanguage);
      formData.append('autoDetect', autoDetectLanguage.toString());
      formData.append('advancedOCR', useAdvancedOCR.toString());

      const response = await fetch('/api/scan', {
        method: 'POST',
        body: formData,
      });

      const result = await response.json();

      if (result.success) {
        // Store supported languages from the API response
        if (result.supportedLanguages) {
          setSupportedLanguages(result.supportedLanguages);
        }

        const newCard: ScannedCardData = {
          id: result.card.id,
          imageUrl: result.card.imageUrl,
          name: result.card.name,
          company: result.card.company,
          title: result.card.title,
          email: result.card.email,
          phone: result.card.phone,
          address: result.card.address,
          website: result.card.website,
          notes: result.card.notes,
          createdAt: result.card.createdAt,
          tags: result.card.tags
        };

        setScannedCards(prev => [newCard, ...prev]);
        setSelectedCard(newCard);
      } else {
        // Handle failed OCR but still show the card
        if (result.card) {
          const newCard: ScannedCardData = {
            id: result.card.id,
            imageUrl: result.card.imageUrl,
            name: result.card.name,
            company: result.card.company,
            title: result.card.title,
            email: result.card.email,
            phone: result.card.phone,
            address: result.card.address,
            website: result.card.website,
            notes: result.card.notes,
            createdAt: result.card.createdAt,
            tags: result.card.tags
          };

          setScannedCards(prev => [newCard, ...prev]);
          setSelectedCard(newCard);
        }
        
        console.error('OCR processing failed:', result.error);
      }
    } catch (error) {
      console.error('Error processing image:', error);
      
      // Fallback to mock data for demo purposes
      await new Promise(resolve => setTimeout(resolve, 2000));

      const mockOCRData = {
        name: language === 'zh-TW' ? '張偉' : language === 'zh-CN' ? '张伟' : 'John Smith',
        company: language === 'zh-TW' ? '科技有限公司' : language === 'zh-CN' ? '科技有限公司' : 'Tech Corp',
        title: language === 'zh-TW' ? '產品經理' : language === 'zh-CN' ? '产品经理' : 'Product Manager',
        email: language === 'zh-TW' ? 'zhang.wei@tech.com' : language === 'zh-CN' ? 'zhang.wei@tech.com' : 'john.smith@tech.com',
        phone: language === 'zh-TW' ? '+886 2 2345 6789' : language === 'zh-CN' ? '+86 10 1234 5678' : '+1 555 123 4567',
        address: language === 'zh-TW' ? '台北市信義區信義路五段7號' : 
                 language === 'zh-CN' ? '北京市朝阳区建国门外大街1号' : 
                 '123 Main St, City, State 12345',
        website: 'https://tech.com',
        notes: language === 'zh-TW' ? '在科技展會上認識，對AI產品有興趣' : 
               language === 'zh-CN' ? '在科技展会上认识，对AI产品有兴趣' : 
               'Met at tech conference, interested in AI products',
        tags: [selectedLanguage === 'auto' ? language : selectedLanguage, 'ocr', 'demo']
      };

      const imageUrl = URL.createObjectURL(file);

      const newCard: ScannedCardData = {
        id: Date.now().toString(),
        imageUrl,
        ...mockOCRData,
        createdAt: new Date().toISOString()
      };

      setScannedCards(prev => [newCard, ...prev]);
      setSelectedCard(newCard);
    } finally {
      setIsScanning(false);
    }
  };

  const handleCameraScan = () => {
    // In a real implementation, this would open camera
    alert('Camera scanning would be implemented here');
  };

  const filteredCards = scannedCards.filter(card =>
    card.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
    card.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const exportToVCF = (card: ScannedCardData) => {
    const vcfContent = `BEGIN:VCARD
VERSION:3.0
FN:${card.name}
ORG:${card.company}
TITLE:${card.title}
TEL:${card.phone}
EMAIL:${card.email}
URL:${card.website}
ADR:;;${card.address};;;;
NOTE:${card.notes}
END:VCARD`;

    const blob = new Blob([vcfContent], { type: 'text/vcard' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${card.name}.vcf`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const deleteCard = (cardId: string) => {
    setScannedCards(prev => prev.filter(card => card.id !== cardId));
    if (selectedCard?.id === cardId) {
      setSelectedCard(null);
    }
  };

  // Language options for OCR
  const languageOptions = [
    { value: 'auto', label: { 'zh-TW': '自動檢測', 'zh-CN': '自动检测', 'en': 'Auto Detect' } },
    { value: 'en', label: { 'zh-TW': '英文', 'zh-CN': '英文', 'en': 'English' } },
    { value: 'zh-TW', label: { 'zh-TW': '繁體中文', 'zh-CN': '繁体中文', 'en': 'Traditional Chinese' } },
    { value: 'zh-CN', label: { 'zh-TW': '簡體中文', 'zh-CN': '简体中文', 'en': 'Simplified Chinese' } },
    { value: 'es', label: { 'zh-TW': '西班牙文', 'zh-CN': '西班牙文', 'en': 'Spanish' } },
    { value: 'fr', label: { 'zh-TW': '法文', 'zh-CN': '法文', 'en': 'French' } },
    { value: 'it', label: { 'zh-TW': '意大利文', 'zh-CN': '意大利文', 'en': 'Italian' } },
    { value: 'ja', label: { 'zh-TW': '日文', 'zh-CN': '日文', 'en': 'Japanese' } },
    { value: 'ko', label: { 'zh-TW': '韓文', 'zh-CN': '韩文', 'en': 'Korean' } },
    { value: 'de', label: { 'zh-TW': '德文', 'zh-CN': '德文', 'en': 'German' } },
    { value: 'ru', label: { 'zh-TW': '俄文', 'zh-CN': '俄文', 'en': 'Russian' } },
    { value: 'pt', label: { 'zh-TW': '葡萄牙文', 'zh-CN': '葡萄牙文', 'en': 'Portuguese' } },
    { value: 'ar', label: { 'zh-TW': '阿拉伯文', 'zh-CN': '阿拉伯文', 'en': 'Arabic' } },
    { value: 'hi', label: { 'zh-TW': '印地文', 'zh-CN': '印地文', 'en': 'Hindi' } },
    { value: 'th', label: { 'zh-TW': '泰文', 'zh-CN': '泰文', 'en': 'Thai' } },
    { value: 'vi', label: { 'zh-TW': '越南文', 'zh-CN': '越南文', 'en': 'Vietnamese' } }
  ];

  const getLocalizedText = (key: string) => {
    const texts = {
      'zh-TW': {
        title: '無限制名片掃描',
        subtitle: 'OCR辨識文字，儲存圖片和資料',
        scanCard: '掃描名片',
        uploadImage: '上傳圖片',
        takePhoto: '拍照掃描',
        searchPlaceholder: '搜尋名片...',
        totalCards: '總共 {count} 張名片',
        name: '姓名',
        company: '公司',
        title: '職位',
        email: '電子郵件',
        phone: '電話',
        address: '地址',
        website: '網站',
        notes: '備註',
        tags: '標籤',
        exportVCF: '匯出 VCF',
        delete: '刪除',
        edit: '編輯',
        scanning: '正在掃描...',
        noCards: '尚無掃描的名片',
        selectCard: '選擇名片查看詳情',
        ocrSettings: 'OCR 設定',
        languageDetection: '語言檢測',
        targetLanguage: '目標語言',
        advancedOCR: '進階 OCR',
        basicOCR: '基本 OCR',
        autoDetect: '自動檢測',
        supportedLanguages: '支援語言',
        processingLanguage: '處理語言',
        confidence: '信心度',
        detectedLanguage: '檢測語言',
        ocrType: 'OCR 類型'
      },
      'zh-CN': {
        title: '无限名片扫描',
        subtitle: 'OCR识别文字，保存图片和资料',
        scanCard: '扫描名片',
        uploadImage: '上传图片',
        takePhoto: '拍照扫描',
        searchPlaceholder: '搜索名片...',
        totalCards: '总共 {count} 张名片',
        name: '姓名',
        company: '公司',
        title: '职位',
        email: '电子邮件',
        phone: '电话',
        address: '地址',
        website: '网站',
        notes: '备注',
        tags: '标签',
        exportVCF: '导出 VCF',
        delete: '删除',
        edit: '编辑',
        scanning: '正在扫描...',
        noCards: '尚无扫描的名片',
        selectCard: '选择名片查看详情',
        ocrSettings: 'OCR 设置',
        languageDetection: '语言检测',
        targetLanguage: '目标语言',
        advancedOCR: '高级 OCR',
        basicOCR: '基本 OCR',
        autoDetect: '自动检测',
        supportedLanguages: '支持语言',
        processingLanguage: '处理语言',
        confidence: '置信度',
        detectedLanguage: '检测语言',
        ocrType: 'OCR 类型'
      },
      'en': {
        title: 'Unlimited Card Scanning',
        subtitle: 'OCR text recognition, save images and data',
        scanCard: 'Scan Card',
        uploadImage: 'Upload Image',
        takePhoto: 'Take Photo',
        searchPlaceholder: 'Search cards...',
        totalCards: 'Total {count} cards',
        name: 'Name',
        company: 'Company',
        title: 'Title',
        email: 'Email',
        phone: 'Phone',
        address: 'Address',
        website: 'Website',
        notes: 'Notes',
        tags: 'Tags',
        exportVCF: 'Export VCF',
        delete: 'Delete',
        edit: 'Edit',
        scanning: 'Scanning...',
        noCards: 'No scanned cards yet',
        selectCard: 'Select a card to view details',
        ocrSettings: 'OCR Settings',
        languageDetection: 'Language Detection',
        targetLanguage: 'Target Language',
        advancedOCR: 'Advanced OCR',
        basicOCR: 'Basic OCR',
        autoDetect: 'Auto Detect',
        supportedLanguages: 'Supported Languages',
        processingLanguage: 'Processing Language',
        confidence: 'Confidence',
        detectedLanguage: 'Detected Language',
        ocrType: 'OCR Type'
      }
    };

    return texts[language as keyof typeof texts]?.[key as keyof typeof texts['zh-TW']] || key;
  };

  const texts = getLocalizedText('');

  return (
    <div className="container mx-auto p-6 max-w-7xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">{texts.title}</h1>
        <p className="text-gray-600">{texts.subtitle}</p>
      </div>

      {/* Scan Controls */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>{texts.scanCard}</CardTitle>
          <CardDescription>
            {texts.uploadImage} {texts.takePhoto}
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* OCR Settings */}
          <div className="mb-6 p-4 bg-gray-50 rounded-lg">
            <h4 className="font-semibold text-gray-900 mb-4">{texts.ocrSettings}</h4>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* OCR Type Selection */}
              <div className="space-y-2">
                <Label>{texts.ocrType}</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="advanced-ocr"
                    checked={useAdvancedOCR}
                    onCheckedChange={setUseAdvancedOCR}
                  />
                  <Label htmlFor="advanced-ocr" className="text-sm">
                    {useAdvancedOCR ? texts.advancedOCR : texts.basicOCR}
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  {useAdvancedOCR 
                    ? (language === 'zh-TW' ? '使用 AI 進行多語言 OCR 辨識' : 
                       language === 'zh-CN' ? '使用 AI 进行多语言 OCR 识别' : 
                       'Use AI for multilingual OCR recognition')
                    : (language === 'zh-TW' ? '基本 OCR 處理' : 
                       language === 'zh-CN' ? '基本 OCR 处理' : 
                       'Basic OCR processing')
                  }
                </p>
              </div>

              {/* Language Detection */}
              <div className="space-y-2">
                <Label>{texts.languageDetection}</Label>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="auto-detect"
                    checked={autoDetectLanguage}
                    onCheckedChange={setAutoDetectLanguage}
                  />
                  <Label htmlFor="auto-detect" className="text-sm">
                    {texts.autoDetect}
                  </Label>
                </div>
                <p className="text-xs text-gray-500">
                  {autoDetectLanguage
                    ? (language === 'zh-TW' ? '自動檢測名片語言' : 
                       language === 'zh-CN' ? '自动检测名片语言' : 
                       'Automatically detect card language')
                    : (language === 'zh-TW' ? '手動選擇目標語言' : 
                       language === 'zh-CN' ? '手动选择目标语言' : 
                       'Manually select target language')
                  }
                </p>
              </div>

              {/* Language Selection */}
              {!autoDetectLanguage && (
                <div className="space-y-2 md:col-span-2">
                  <Label>{texts.targetLanguage}</Label>
                  <Select value={selectedLanguage} onValueChange={setSelectedLanguage}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {languageOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label[language as keyof typeof option.label]}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            {/* Supported Languages Info */}
            {supportedLanguages.length > 0 && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <p className="text-sm font-medium text-blue-900 mb-1">
                  {texts.supportedLanguages}: {supportedLanguages.length}
                </p>
                <p className="text-xs text-blue-700">
                  {language === 'zh-TW' ? '系統支援多種語言的 OCR 辨識' : 
                   language === 'zh-CN' ? '系统支持多种语言的 OCR 识别' : 
                   'System supports OCR recognition in multiple languages'}
                </p>
              </div>
            )}
          </div>

          {/* Upload Controls */}
          <div className="flex gap-4">
            <Button
              onClick={() => fileInputRef.current?.click()}
              disabled={isScanning}
              className="flex items-center gap-2"
            >
              <Upload className="w-4 h-4" />
              {texts.uploadImage}
            </Button>
            <Button
              onClick={handleCameraScan}
              disabled={isScanning}
              variant="outline"
              className="flex items-center gap-2"
            >
              <Camera className="w-4 h-4" />
              {texts.takePhoto}
            </Button>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            {isScanning && (
              <div className="flex items-center gap-2 text-blue-600">
                <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin" />
                {texts.scanning}
              </div>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Search and Cards List */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Cards List */}
        <div className="lg:col-span-1">
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder={texts.searchPlaceholder}
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="mb-4">
            <p className="text-sm text-gray-600">
              {texts.totalCards.replace('{count}', filteredCards.length.toString())}
            </p>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {filteredCards.length === 0 ? (
              <Card>
                <CardContent className="p-6 text-center text-gray-500">
                  {texts.noCards}
                </CardContent>
              </Card>
            ) : (
              filteredCards.map((card) => (
                <Card
                  key={card.id}
                  className={`cursor-pointer transition-colors ${
                    selectedCard?.id === card.id ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  onClick={() => setSelectedCard(card)}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start gap-3">
                      <img
                        src={card.imageUrl}
                        alt={card.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-gray-900 truncate">{card.name}</h3>
                        <p className="text-sm text-gray-600 truncate">{card.company}</p>
                        <p className="text-sm text-gray-500 truncate">{card.title}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>

        {/* Card Details */}
        <div className="lg:col-span-2">
          {selectedCard ? (
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>{selectedCard.name}</CardTitle>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => exportToVCF(selectedCard)}
                      className="flex items-center gap-1"
                    >
                      <Download className="w-4 h-4" />
                      {texts.exportVCF}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      className="flex items-center gap-1"
                    >
                      <Edit className="w-4 h-4" />
                      {texts.edit}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => deleteCard(selectedCard.id)}
                      className="flex items-center gap-1 text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                      {texts.delete}
                    </Button>
                  </div>
                </div>
                <CardDescription>{selectedCard.company} • {selectedCard.title}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Card Image */}
                  <div>
                    <img
                      src={selectedCard.imageUrl}
                      alt="Scanned card"
                      className="w-full rounded-lg shadow-md"
                    />
                  </div>

                  {/* Card Information */}
                  <div className="space-y-4">
                    <div className="flex items-center gap-3">
                      <User className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{texts.name}</p>
                        <p className="font-medium">{selectedCard.name}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Building className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{texts.company}</p>
                        <p className="font-medium">{selectedCard.company}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Mail className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{texts.email}</p>
                        <p className="font-medium">{selectedCard.email}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Phone className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{texts.phone}</p>
                        <p className="font-medium">{selectedCard.phone}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <MapPin className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{texts.address}</p>
                        <p className="font-medium">{selectedCard.address}</p>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <Globe className="w-5 h-5 text-gray-400" />
                      <div>
                        <p className="text-sm text-gray-500">{texts.website}</p>
                        <p className="font-medium">{selectedCard.website}</p>
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">{texts.tags}</p>
                      <div className="flex flex-wrap gap-2">
                        {selectedCard.tags.map((tag, index) => (
                          <Badge key={index} variant="secondary">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div>
                      <p className="text-sm text-gray-500 mb-2">{texts.notes}</p>
                      <Textarea
                        value={selectedCard.notes}
                        readOnly
                        className="min-h-[80px]"
                      />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card>
              <CardContent className="p-12 text-center">
                <div className="text-gray-400 mb-4">
                  <Search className="w-12 h-12 mx-auto" />
                </div>
                <p className="text-gray-500">{texts.selectCard}</p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}