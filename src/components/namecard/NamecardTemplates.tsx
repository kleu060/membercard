'use client';

import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Check } from 'lucide-react';
import SpiderCardTemplate from '@/components/cards/SpiderCardTemplate';
import BusinessCardTemplate from '@/components/cards/BusinessCardTemplate';
import { useLanguage } from '@/contexts/LanguageContext';

interface Template {
  id: string;
  name: string;
  nameZh: string;
  description: string;
  descriptionZh: string;
  category: string;
  categoryZh: string;
  type: 'spider' | 'business';
  cardVariant?: 10;
  preview: {
    name: string;
    position?: string;
    company: string;
    companyTagline?: string;
    description?: string;
    tagline?: string;
    phone?: string;
    email?: string;
    website?: string;
  };
}

export default function NamecardTemplates() {
  const [selectedTemplate, setSelectedTemplate] = useState<string>('');
  const { language } = useLanguage();

  const templates: Template[] = [
    {
      id: 'spider-card',
      name: 'SpiderCard',
      nameZh: '蜘蛛名片',
      description: 'Modern digital card with header image and social media integration',
      descriptionZh: '現代數位名片，包含頭部圖片和社交媒體整合',
      category: 'Digital',
      categoryZh: '數位',
      type: 'spider',
      preview: {
        name: 'SPIDERCARD',
        company: 'Spider Web Group Limited',
        tagline: '專屬於你的電子名片',
        phone: '+886 23780357',
        email: 'support@spidercard.com'
      }
    },
    {
      id: 'business-gradient',
      name: 'Business Gradient',
      nameZh: '商務漸變',
      description: 'Modern business card with blue-yellow gradient and logo',
      descriptionZh: '現代商務名片，藍黃漸變和標誌設計',
      category: 'Business',
      categoryZh: '商務',
      type: 'business',
      cardVariant: 10,
      preview: {
        name: 'Ming Chen',
        position: 'Marketing Manager',
        company: 'Weblify',
        phone: '(123) 456-7830',
        email: 'ming.chen@weblify.com',
        website: 'www.weblify.com'
      }
    }
  ];

  const handleSelectTemplate = (templateId: string) => {
    setSelectedTemplate(templateId);
  };

  const handleUseTemplate = () => {
    if (selectedTemplate) {
      const template = templates.find(t => t.id === selectedTemplate);
      if (template) {
        const templateName = language === 'zh-TW' || language === 'zh-CN' ? template.nameZh : template.name;
        alert(`${language === 'zh-TW' ? '模板已選擇' : language === 'zh-CN' ? '模板已选择' : 'Template selected'}: "${templateName}"\n\n${language === 'zh-TW' ? '您現在可以使用此模板創建您的名片。' : language === 'zh-CN' ? '您现在可以使用此模板创建您的名片。' : 'You can now create your card using this template.'}`);
        
        // Navigate to dashboard and trigger card creation with the selected template
        window.location.href = `/?create=true&template=${selectedTemplate}`;
      }
    }
  };

  const renderTemplatePreview = (template: Template) => {
    const isSelected = selectedTemplate === template.id;
    
    if (template.type === 'spider') {
      return (
        <Card 
          key={template.id}
          className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
            isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
          }`}
          onClick={() => handleSelectTemplate(template.id)}
        >
          <CardContent className="p-0">
            {/* Template Preview */}
            <div className="h-96 relative overflow-hidden bg-gray-50 flex items-center justify-center p-4">
              <div className="scale-60 transform origin-center">
                <SpiderCardTemplate
                  name={template.preview.name}
                  tagline={template.preview.tagline || ''}
                  company={template.preview.company}
                  phone={template.preview.phone || ''}
                  email={template.preview.email || ''}
                  onSave={() => {}}
                  onBook={() => {}}
                  onSocialClick={() => {}}
                />
              </div>
              
              {/* Selected indicator */}
              {isSelected && (
                <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                  <Check className="w-4 h-4 text-white" />
                </div>
              )}
            </div>
            
            {/* Template Info */}
            <div className="p-4">
              <div className="flex items-center justify-between mb-2">
                <h4 className="font-semibold text-gray-900">
                  {language === 'zh-TW' || language === 'zh-CN' ? template.nameZh : template.name}
                </h4>
                <Badge variant="secondary" className="text-xs">
                  {language === 'zh-TW' || language === 'zh-CN' ? template.categoryZh : template.category}
                </Badge>
              </div>
              <p className="text-sm text-gray-600">
                {language === 'zh-TW' || language === 'zh-CN' ? template.descriptionZh : template.description}
              </p>
            </div>
          </CardContent>
        </Card>
      );
    }

    // Business card rendering
    return (
      <Card 
        key={template.id}
        className={`relative cursor-pointer transition-all duration-200 hover:shadow-lg ${
          isSelected ? 'ring-2 ring-blue-500 shadow-lg' : ''
        }`}
        onClick={() => handleSelectTemplate(template.id)}
      >
        <CardContent className="p-0">
          {/* Template Preview */}
          <div className="h-80 relative overflow-hidden bg-gray-50 flex items-center justify-center p-4">
            <div className="scale-75 transform origin-center">
              <BusinessCardTemplate
                name={template.preview.name}
                position={template.preview.position || ''}
                company={template.preview.company}
                phone={template.preview.phone || ''}
                email={template.preview.email || ''}
                website={template.preview.website || ''}
                cardVariant={template.cardVariant || 1}
                onCall={() => {}}
                onEmail={() => {}}
                onVisitWebsite={() => {}}
              />
            </div>
            
            {/* Selected indicator */}
            {isSelected && (
              <div className="absolute top-2 right-2 bg-blue-500 rounded-full p-1">
                <Check className="w-4 h-4 text-white" />
              </div>
            )}
          </div>
          
          {/* Template Info */}
          <div className="p-4">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-gray-900">
                {language === 'zh-TW' || language === 'zh-CN' ? template.nameZh : template.name}
              </h4>
              <Badge variant="secondary" className="text-xs">
                {language === 'zh-TW' || language === 'zh-CN' ? template.categoryZh : template.category}
              </Badge>
            </div>
            <p className="text-sm text-gray-600">
              {language === 'zh-TW' || language === 'zh-CN' ? template.descriptionZh : template.description}
            </p>
          </div>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              {language === 'zh-TW' ? '選擇名片模板' : language === 'zh-CN' ? '选择名片模板' : 'Choose Card Template'}
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              {language === 'zh-TW' 
                ? '從我們精心設計的模板中選擇，快速創建您的專業名片。每個模板都經過優化，確保在各種設備上都能完美顯示。'
                : language === 'zh-CN'
                ? '从我们精心设计的模板中选择，快速创建您的专业名片。每个模板都经过优化，确保在各种设备上都能完美显示。'
                : 'Choose from our carefully designed templates to quickly create your professional card. Each template is optimized to display perfectly on all devices.'
              }
            </p>
          </div>
        </div>
      </div>

      {/* Templates Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6">
          {templates.map(renderTemplatePreview)}
        </div>

        {/* Action Button */}
        {selectedTemplate && (
          <div className="mt-8 text-center">
            <Button 
              onClick={handleUseTemplate}
              size="lg"
              className="px-8"
            >
              {language === 'zh-TW' ? '使用此模板' : language === 'zh-CN' ? '使用此模板' : 'Use This Template'}
            </Button>
          </div>
        )}

        {/* Template Info */}
        <div className="mt-12 bg-white rounded-lg shadow-sm p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">
            {language === 'zh-TW' ? '模板特色' : language === 'zh-CN' ? '模板特色' : 'Template Features'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '專業設計' : language === 'zh-CN' ? '专业设计' : 'Professional Design'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'zh-TW' 
                  ? '每個模板都由專業設計師精心打造，確保視覺效果和可用性的完美平衡。'
                  : language === 'zh-CN'
                  ? '每个模板都由专业设计师精心打造，确保视觉效果和可用性的完美平衡。'
                  : 'Each template is carefully crafted by professional designers to ensure perfect balance of visual appeal and usability.'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '響應式設計' : language === 'zh-CN' ? '响应式设计' : 'Responsive Design'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'zh-TW' 
                  ? '模板完全響應式，在手機、平板和桌面設備上都能完美顯示。'
                  : language === 'zh-CN'
                  ? '模板完全响应式，在手机、平板和桌面设备上都能完美显示。'
                  : 'Templates are fully responsive and display perfectly on mobile, tablet, and desktop devices.'
                }
              </p>
            </div>
            
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900 mb-2">
                {language === 'zh-TW' ? '可自訂化' : language === 'zh-CN' ? '可自定义' : 'Customizable'}
              </h3>
              <p className="text-sm text-gray-600">
                {language === 'zh-TW' 
                  ? '輕鬆自訂顏色、字體和佈局，創建獨一無二的個人名片。'
                  : language === 'zh-CN'
                  ? '轻松自定义颜色、字体和布局，创建独一无二的个人名片。'
                  : 'Easily customize colors, fonts, and layout to create your unique personal card.'
                }
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}