'use client';

import { useState, useEffect } from 'react';
import { useLanguage } from '@/contexts/LanguageContext';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  User, 
  Building2, 
  Briefcase, 
  Phone, 
  Mail, 
  MapPin, 
  Globe, 
  Plus, 
  X,
  Image as ImageIcon,
  Save,
  Eye,
  EyeOff,
  Upload,
  Link as LinkIcon,
  Trash
} from 'lucide-react';
import { 
  INDUSTRY_OPTIONS, 
  getIndustryName 
} from '@/constants/industries';
import CardTemplatePreview from './CardTemplatePreview';

interface BusinessCardFormProps {
  card?: any;
  onSave?: (card: any) => void;
  onCancel?: () => void;
  defaultTemplate?: string;
  subscriptionPlan?: 'free' | 'professional' | 'enterprise';
}

const socialPlatforms = [
  { value: 'linkedin', label: 'LinkedIn' },
  { value: 'facebook', label: 'Facebook' },
  { value: 'instagram', label: 'Instagram' },
  { value: 'twitter', label: 'Twitter' },
  { value: 'whatsapp', label: 'WhatsApp' },
  { value: 'wechat', label: '微信' },
  { value: 'line', label: 'LINE' },
  { value: 'website', label: '个人网站' },
  { value: 'other', label: '其他' }
];

const templateOptions = [
  { value: 'modern-blue', label: 'Modern Blue (现代蓝色)' },
  { value: 'classic-black', label: 'Classic Black (经典黑色)' },
  { value: 'minimal-white', label: 'Minimal White (极简白色)' },
  { value: 'creative-gradient', label: 'Creative Gradient (创意渐变)' },
  { value: 'professional-gray', label: 'Professional Gray (专业灰色)' },
  { value: 'wealth-management', label: 'Wealth Management (财富管理)' },
  { value: 'real-estate', label: 'Real Estate (房地产)' },
  { value: 'elegant-teal', label: 'Elegant Teal (优雅青色)' }
];

const defaultCoverColors = [
  { name: 'Yellow', value: '#FDE871', code: '#F8D800' },
  { name: 'Blue', value: '#ABDCFF', code: '#0396FF' },
  { name: 'Red', value: '#FFB6B9', code: '#FF4757' },
  { name: 'Purple', value: '#D3B7E8', code: '#8B5CF6' },
  { name: 'Cyan', value: '#A8E6CF', code: '#00D9FF' },
  { name: 'Light Pink', value: '#FFB3D9', code: '#FF6B9D' },
  { name: 'Sunset Yellow', value: '#FFD26F', code: '#3677FF' },
  { name: 'Pink Purple', value: '#F97794', code: '#623AA2' },
  { name: 'Ocean Blue', value: '#43CBFF', code: '#9708CC' },
  { name: 'Sky Deep', value: '#52E5E7', code: '#130CB7' },
  { name: 'Aqua Pink', value: '#81FFFF', code: '#F067B4' },
  { name: 'Peach Orange', value: '#FFA6A1', code: '#FFA6A1' }
];

export default function BusinessCardForm({ card, onSave, onCancel, defaultTemplate, subscriptionPlan = 'free' }: BusinessCardFormProps) {
  const { t } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    name: card?.name || '',
    company: card?.company || '',
    position: card?.position || '',
    phone: card?.phone || '',
    officePhone: card?.officePhone || '',
    email: card?.email || '',
    address: card?.address || '',
    website: card?.website || '',
    bio: card?.bio || '',
    avatar: card?.avatar || '',
    coverPhoto: card?.coverPhoto || card?.avatar || '', // Fallback to avatar for compatibility
    profilePhoto: card?.profilePhoto || card?.avatar || '', // Fallback to avatar for compatibility
    logo: card?.logo || '',
    location: card?.location || '',
    isPublic: card?.isPublic ?? true,
    template: card?.template || defaultTemplate || 'modern-blue',
    socialLinks: card?.socialLinks || [],
    products: (card?.products || []).map(product => ({
      ...product,
      links: product.links || [],
      photos: product.photos || []
    })),
    industryTags: card?.industryTags?.map((tag: any) => tag.tag) || []
  });

  const [newSocialLink, setNewSocialLink] = useState({ platform: '', url: '', username: '' });
  const [newProduct, setNewProduct] = useState({ 
    name: '', 
    description: '', 
    image: '',
    links: [],
    photos: []
  });
  const [newProductLinks, setNewProductLinks] = useState<{[key: number]: { title: string, url: string }}>({});
  const [uploadingPhotos, setUploadingPhotos] = useState<{[key: number]: boolean}>({});
  const [uploadingCoverPhoto, setUploadingCoverPhoto] = useState(false);
  const [uploadingProfilePhoto, setUploadingProfilePhoto] = useState(false);
  const [uploadingLogo, setUploadingLogo] = useState(false);

  // Initialize uploadingPhotos state for all products
  useEffect(() => {
    // Initialize for existing products from card
    const initialUploadingPhotos: {[key: number]: boolean} = {};
    const products = card?.products || formData.products;
    products.forEach((_, index) => {
      initialUploadingPhotos[index] = false;
    });
    setUploadingPhotos(initialUploadingPhotos);
  }, [card?.products]);
  
  // Update uploadingPhotos state when formData.products changes
  useEffect(() => {
    const currentUploadingPhotos: {[key: number]: boolean} = {};
    formData.products.forEach((_, index) => {
      currentUploadingPhotos[index] = uploadingPhotos[index] ?? false;
    });
    setUploadingPhotos(currentUploadingPhotos);
  }, [formData.products.length]);

  // Get maximum products allowed based on subscription plan
  const getMaxProducts = () => {
    switch (subscriptionPlan) {
      case 'professional':
        return 3;
      case 'enterprise':
        return 5;
      default:
        return 1; // free plan
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    console.log('handleInputChange called:', { field, value: value?.toString?.().substring(0, 50) });
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const addSocialLink = () => {
    console.log('Adding social link:', newSocialLink);
    console.log('Current social links:', formData.socialLinks);
    if (newSocialLink.platform && newSocialLink.url) {
      // Validate URL format
      let processedUrl = newSocialLink.url;
      
      // Special handling for WhatsApp
      if (newSocialLink.platform === 'whatsapp') {
        if (!processedUrl.startsWith('https://wa.me/') && !processedUrl.startsWith('http')) {
          const cleanNumber = processedUrl.replace(/[^\d+]/g, '');
          processedUrl = `https://wa.me/${cleanNumber}`;
        }
      }
      // Add http:// prefix for other platforms if missing
      else if (!processedUrl.startsWith('http://') && !processedUrl.startsWith('https://')) {
        processedUrl = `https://${processedUrl}`;
      }
      
      const socialLinkToAdd = {
        platform: newSocialLink.platform,
        url: processedUrl,
        username: newSocialLink.username || ''
      };
      
      setFormData(prev => ({
        ...prev,
        socialLinks: [...prev.socialLinks, socialLinkToAdd]
      }));
      setNewSocialLink({ platform: '', url: '', username: '' });
      console.log('Social link added successfully:', socialLinkToAdd);
    }
  };

  const removeSocialLink = (index: number) => {
    setFormData(prev => ({
      ...prev,
      socialLinks: prev.socialLinks.filter((_, i) => i !== index)
    }));
  };

  const addProduct = () => {
    console.log('Adding product:', newProduct);
    console.log('Current products:', formData.products);
    if (newProduct.name) {
      const newProductIndex = formData.products.length;
      setFormData(prev => ({
        ...prev,
        products: [...prev.products, { 
          ...newProduct, 
          links: [], 
          photos: [] // Ensure photos array is always initialized
        }]
      }));
      
      // Initialize uploading state for the new product
      setUploadingPhotos(prev => ({ ...prev, [newProductIndex]: false }));
      
      setNewProduct({ name: '', description: '', image: '', links: [], photos: [] });
      console.log('Product added successfully');
    }
  };

  const removeProduct = (index: number) => {
    setFormData(prev => ({
      ...prev,
      products: prev.products.filter((_, i) => i !== index)
    }));
    
    // Clean up uploadingPhotos state
    setUploadingPhotos(prev => {
      const newState = { ...prev };
      delete newState[index];
      return newState;
    });
  };

  const handleProductPhotoUpload = async (productIndex: number, file: File) => {
    try {
      const uploadFormData = new FormData();
      uploadFormData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: uploadFormData
      });
      
      if (response.ok) {
        const data = await response.json();
        const newProducts = [...formData.products];
        
        // Ensure the photos array exists
        if (!newProducts[productIndex].photos) {
          newProducts[productIndex].photos = [];
        }
        
        newProducts[productIndex].photos.push(data.url);
        setFormData(prev => ({ ...prev, products: newProducts }));
        console.log('Product photo uploaded successfully:', data.url);
      } else {
        console.error('Product photo upload failed:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Product photo upload error:', error);
    }
  };

  const handleCoverPhotoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('Cover photo uploaded successfully:', data.url);
        handleInputChange('coverPhoto', data.url);
      } else {
        console.error('Cover photo upload failed:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Cover photo upload error:', error);
    }
  };

  const handleCoverColorSelect = (color: string) => {
    try {
      // Create a simple colored image as data URL
      const canvas = document.createElement('canvas');
      canvas.width = 400;
      canvas.height = 200;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        // Create gradient
        const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
        const selectedColor = defaultCoverColors.find(c => c.code === color);
        if (selectedColor) {
          gradient.addColorStop(0, selectedColor.value);
          gradient.addColorStop(1, selectedColor.code);
        } else {
          gradient.addColorStop(0, color);
          gradient.addColorStop(1, color);
        }
        
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        
        // Convert to data URL
        const dataUrl = canvas.toDataURL('image/jpeg', 0.9);
        console.log('Generated cover color data URL:', dataUrl.substring(0, 50) + '...');
        handleInputChange('coverPhoto', dataUrl);
      } else {
        console.error('Failed to get canvas context');
      }
    } catch (error) {
      console.error('Error generating cover color:', error);
    }
  };

  const handleProfilePhotoUpload = async (file: File) => {
    try {
      const formData = new FormData();
      formData.append('file', file);
      
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        handleInputChange('profilePhoto', data.url);
      }
    } catch (error) {
      console.error('Profile photo upload failed:', error);
    }
  };

  const handleLogoUpload = async (file: File) => {
    const formData = new FormData();
    formData.append('file', file);
    
    try {
      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData
      });
      
      if (response.ok) {
        const data = await response.json();
        handleInputChange('logo', data.url);
      } else {
        console.error('Logo upload failed:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error details:', errorData);
      }
    } catch (error) {
      console.error('Logo upload error:', error);
    }
  };

  const addProductLink = (productIndex: number, link: { title: string, url: string }) => {
    const newProducts = [...formData.products];
    if (!newProducts[productIndex].links) {
      newProducts[productIndex].links = [];
    }
    newProducts[productIndex].links.push(link);
    setFormData(prev => ({ ...prev, products: newProducts }));
  };

  const removeProductLink = (productIndex: number, linkIndex: number) => {
    const newProducts = [...formData.products];
    newProducts[productIndex].links.splice(linkIndex, 1);
    setFormData(prev => ({ ...prev, products: newProducts }));
  };

  const removeProductPhoto = (productIndex: number, photoIndex: number) => {
    const newProducts = [...formData.products];
    
    // Ensure the photos array exists
    if (!newProducts[productIndex].photos) {
      newProducts[productIndex].photos = [];
    }
    
    newProducts[productIndex].photos.splice(photoIndex, 1);
    setFormData(prev => ({ ...prev, products: newProducts }));
  };

  const toggleIndustryTag = (tag: string) => {
    // Don't allow selecting "全部名片" (All Industries) as it's just for filtering
    if (tag.includes("全部名片") || tag.includes("All Industries")) {
      return;
    }
    
    setFormData(prev => ({
      ...prev,
      industryTags: prev.industryTags.includes(tag)
        ? prev.industryTags.filter(t => t !== tag)
        : [...prev.industryTags, tag].slice(0, 3) // Limit to 3 tags
    }));
  };

  const handleDeleteCard = async () => {
    if (!card || !confirm(t('cardForm.confirmDelete'))) {
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await fetch(`/api/cards/${card.id}`, {
        method: 'DELETE'
      });

      const data = await response.json();

      if (response.ok) {
        // Call onSave with null to indicate card was deleted
        onSave?.(null);
      } else {
        setError(data.error || t('cardForm.deleteFailed'));
      }
    } catch (error) {
      console.error('Delete card error:', error);
      setError(t('cardForm.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    // Basic validation
    if (!formData.name.trim()) {
      setError(t('validation.nameRequired'));
      setIsLoading(false);
      return;
    }

    // Email validation if provided
    if (formData.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      setError(t('validation.emailInvalid'));
      setIsLoading(false);
      return;
    }

    // Website URL validation if provided
    if (formData.website && !formData.website.startsWith('http')) {
      setError(t('validation.websiteUrlRequired'));
      setIsLoading(false);
      return;
    }

    try {
      // Prepare data for API - remove id and cardId fields from nested objects
      const apiData: any = {
        ...formData,
        // Map profilePhoto to avatar for API compatibility
        avatar: formData.profilePhoto,
        // Remove undefined fields
      };
      
      // Remove undefined fields
      Object.keys(apiData).forEach(key => {
        if (apiData[key] === undefined) {
          delete apiData[key];
        }
      });
      
      // Process social links and products
      apiData.socialLinks = formData.socialLinks.map((link: any) => {
        // Safely destructure - check if link exists first
        if (!link) return null;
        const { id, cardId, ...rest } = link;
        return rest;
      }).filter(link => link && link.platform && link.url); // Filter out invalid links
      
      apiData.products = formData.products.map((product: any) => {
        const { id, cardId, ...rest } = product;
        return {
          ...rest,
          // Include photos and links for proper API handling
          photos: (product.photos || []).filter(photo => photo),
          links: (product.links || []).filter(link => link.title && link.url)
        };
      }).filter(product => product.name); // Filter out invalid products

      // Debug logging
      console.log('Submitting form with data:', {
        socialLinks: apiData.socialLinks,
        products: apiData.products,
        socialLinksCount: apiData.socialLinks.length,
        productsCount: apiData.products.length,
        rawSocialLinks: formData.socialLinks
      });

      const url = card ? `/api/cards/${card.id}` : '/api/cards';
      const method = card ? 'PUT' : 'POST';

      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(apiData)
      });

      const data = await response.json();
      
      // Debug logging
      console.log('API response:', data);
      console.log('Response status:', response.status);

      if (response.ok) {
        onSave?.(data.card);
      } else {
        if (response.status === 403) {
          // Card limit reached error
          setError(data.message || t('cardForm.cardLimitReached'));
        } else if (response.status === 500) {
          // Internal server error - provide more detailed error
          console.error('Server error details:', data);
          setError(data.error || data.message || t('cardForm.saveFailed'));
        } else {
          setError(data.error || data.message || t('cardForm.saveFailed'));
        }
      }
    } catch (error) {
      console.error('Save card error:', error);
      setError(t('cardForm.networkError'));
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Main Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="w-5 h-5" />
                {card ? t('edit') : t('dashboard.createCard')}
              </CardTitle>
              <CardDescription>
                {t('dashboard.createNewCardDesc')}
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                {error && (
                  <Alert variant="destructive">
                    <AlertDescription>{error}</AlertDescription>
                  </Alert>
                )}

                {/* Basic Information */}
                <div className="space-y-4">
                  <h3 className="text-lg font-semibold">{t('dashboard.myCards')}</h3>
                  
                  {/* Template Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="template">{t('cardForm.selectTemplate')}</Label>
                    <Select value={formData.template} onValueChange={(value) => handleInputChange('template', value)}>
                      <SelectTrigger>
                        <SelectValue placeholder={t('cardForm.selectTemplatePlaceholder')} />
                      </SelectTrigger>
                      <SelectContent>
                        {templateOptions.map(template => (
                          <SelectItem key={template.value} value={template.value}>
                            {template.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <p className="text-sm text-gray-500">
                      {t('cardForm.templateDescription')}
                    </p>
                  </div>

              {/* Photo Upload Section */}
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">{t('cardForm.photoUpload')}</h3>
                <div className="grid md:grid-cols-3 gap-4">
                  {/* Cover Photo Upload */}
                  <div className="space-y-2">
                    <Label>{t('cardForm.coverPhoto')}</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {formData.coverPhoto ? (
                        <div className="relative">
                          <img 
                            src={formData.coverPhoto} 
                            alt={t('cardForm.coverPhoto')} 
                            className="w-24 h-24 object-cover rounded mb-2 mx-auto"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('coverPhoto', '')}
                            className="absolute top-1 right-1 bg-red-500 text-white border-red-500 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded mb-2 mx-auto flex items-center justify-center">
                          <ImageIcon className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingCoverPhoto(true);
                            handleCoverPhotoUpload(file).finally(() => {
                              setUploadingCoverPhoto(false);
                            });
                          }
                        }}
                        className="hidden"
                        id="cover-photo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('cover-photo-upload')?.click()}
                        disabled={uploadingCoverPhoto}
                        className="w-full mb-2"
                      >
                        {uploadingCoverPhoto ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {t('cardForm.uploadCoverPhoto')}
                      </Button>
                      
                      {/* Default Color Options */}
                      <div className="mt-3">
                        <p className="text-xs text-gray-600 mb-2">Or choose a default color:</p>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-2">
                          {defaultCoverColors.map((color) => (
                            <button
                              key={color.code}
                              type="button"
                              onClick={() => handleCoverColorSelect(color.code)}
                              className="w-full h-10 rounded border-2 border-gray-200 hover:border-gray-400 hover:scale-105 transition-all duration-200 relative group shadow-sm"
                              style={{ background: `linear-gradient(135deg, ${color.value}, ${color.code})` }}
                              title={color.name}
                            >
                              <span className="sr-only">{color.name}</span>
                              <div className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-10 rounded transition-all duration-200"></div>
                            </button>
                          ))}
                        </div>
                        <div className="mt-2 text-xs text-gray-500">
                          Click on any color to apply as cover background
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Profile Photo Upload */}
                  <div className="space-y-2">
                    <Label>{t('cardForm.profilePhoto')}</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {formData.profilePhoto ? (
                        <div className="relative">
                          <img 
                            src={formData.profilePhoto} 
                            alt={t('cardForm.profilePhoto')} 
                            className="w-24 h-24 object-cover rounded-full mb-2 mx-auto"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('profilePhoto', '')}
                            className="absolute top-1 right-1 bg-red-500 text-white border-red-500 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded-full mb-2 mx-auto flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingProfilePhoto(true);
                            handleProfilePhotoUpload(file).finally(() => {
                              setUploadingProfilePhoto(false);
                            });
                          }
                        }}
                        className="hidden"
                        id="profile-photo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('profile-photo-upload')?.click()}
                        disabled={uploadingProfilePhoto}
                        className="w-full"
                      >
                        {uploadingProfilePhoto ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {t('cardForm.uploadProfilePhoto')}
                      </Button>
                    </div>
                  </div>

                  {/* Logo Upload */}
                  <div className="space-y-2">
                    <Label>{t('cardForm.companyLogo')}</Label>
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 text-center">
                      {formData.logo ? (
                        <div className="relative">
                          <img 
                            src={formData.logo} 
                            alt={t('cardForm.companyLogo')} 
                            className="w-24 h-24 object-contain rounded mb-2 mx-auto"
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => handleInputChange('logo', '')}
                            className="absolute top-1 right-1 bg-red-500 text-white border-red-500 hover:bg-red-600"
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      ) : (
                        <div className="w-24 h-24 bg-gray-100 rounded mb-2 mx-auto flex items-center justify-center">
                          <Building2 className="w-8 h-8 text-gray-400" />
                        </div>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingLogo(true);
                            handleLogoUpload(file).finally(() => {
                              setUploadingLogo(false);
                            });
                          }
                        }}
                        className="hidden"
                        id="logo-upload"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="sm"
                        onClick={() => document.getElementById('logo-upload')?.click()}
                        disabled={uploadingLogo}
                        className="w-full"
                      >
                        {uploadingLogo ? (
                          <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin mr-2" />
                        ) : (
                          <Upload className="w-4 h-4 mr-2" />
                        )}
                        {t('cardForm.uploadCompanyLogo')}
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="name">{t('auth.name')} *</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="name"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      className="pl-10"
                      required
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="company">{t('modal.companyName')}</Label>
                  <div className="relative">
                    <Building2 className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="company"
                      value={formData.company}
                      onChange={(e) => handleInputChange('company', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="position">{t('modal.jobTitle')}</Label>
                  <div className="relative">
                    <Briefcase className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="position"
                      value={formData.position}
                      onChange={(e) => handleInputChange('position', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">{t('cardForm.phone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => handleInputChange('phone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="officePhone">{t('cardForm.officePhone')}</Label>
                  <div className="relative">
                    <Phone className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="officePhone"
                      value={formData.officePhone}
                      onChange={(e) => handleInputChange('officePhone', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">{t('auth.email')}</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      value={formData.email}
                      onChange={(e) => handleInputChange('email', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="website">{t('cardForm.website')}</Label>
                  <div className="relative">
                    <Globe className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="website"
                      value={formData.website}
                      onChange={(e) => handleInputChange('website', e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="avatar">{t('cardForm.avatar')}</Label>
                  <div className="relative">
                    <ImageIcon className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      id="avatar"
                      value={formData.avatar}
                      onChange={(e) => handleInputChange('avatar', e.target.value)}
                      className="pl-10"
                      placeholder={t('cardForm.avatarPlaceholder')}
                    />
                  </div>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="address">{t('settings.location')}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="address"
                    value={formData.address}
                    onChange={(e) => handleInputChange('address', e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="bio">{t('bio')}</Label>
                <Textarea
                  id="bio"
                  value={formData.bio}
                  onChange={(e) => handleInputChange('bio', e.target.value)}
                  placeholder={t('cardForm.bioPlaceholder')}
                  rows={3}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="location">{t('settings.location')}</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder={t('settings.locationPlaceholder')}
                    className="pl-10"
                  />
                </div>
                <p className="text-sm text-gray-500">
                  您的所在地将用于在名片市场中进行地域筛选，帮助其他人更容易找到您
                </p>
              </div>
            </div>

            {/* Social Links */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('cardForm.socialLinks')}</h3>
              <div className="space-y-3">
                {formData.socialLinks.map((link: any, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Select value={link.platform} onValueChange={(value) => {
                      const newLinks = [...formData.socialLinks];
                      newLinks[index].platform = value;
                      setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                    }}>
                      <SelectTrigger className="w-40">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {socialPlatforms.map(platform => (
                          <SelectItem key={platform.value} value={platform.value}>
                            {platform.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <Input
                      value={link.url}
                      onChange={(e) => {
                        const newLinks = [...formData.socialLinks];
                        newLinks[index].url = e.target.value;
                        setFormData(prev => ({ ...prev, socialLinks: newLinks }));
                      }}
                      placeholder={t('cardForm.linkUrl')}
                      className="flex-1"
                    />
                    <Button
                      type="button"
                      variant="outline"
                      size="icon"
                      onClick={() => removeSocialLink(index)}
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                
                <div className="flex items-center gap-2">
                  <Select value={newSocialLink.platform} onValueChange={(value) => setNewSocialLink({ ...newSocialLink, platform: value })}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder={t('cardForm.selectPlatform')} />
                    </SelectTrigger>
                    <SelectContent>
                      {socialPlatforms.map(platform => (
                        <SelectItem key={platform.value} value={platform.value}>
                          {platform.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    value={newSocialLink.url}
                    onChange={(e) => setNewSocialLink({ ...newSocialLink, url: e.target.value })}
                    placeholder={t('cardForm.linkUrl')}
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    variant="outline"
                    size="icon"
                    onClick={addSocialLink}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            </div>

            {/* Products */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('cardForm.productsServices')}</h3>
              <div className="space-y-3">
                {formData.products.map((product: any, index: number) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <Input
                        value={product.name}
                        onChange={(e) => {
                          const newProducts = [...formData.products];
                          newProducts[index].name = e.target.value;
                          setFormData(prev => ({ ...prev, products: newProducts }));
                        }}
                        placeholder={t('cardForm.productName')}
                        className="font-semibold"
                      />
                      <Button
                        type="button"
                        variant="outline"
                        size="icon"
                        onClick={() => removeProduct(index)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                    <Textarea
                      value={product.description}
                      onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].description = e.target.value;
                        setFormData(prev => ({ ...prev, products: newProducts }));
                      }}
                      placeholder={t('cardForm.productDescription')}
                      rows={2}
                    />
                    <Input
                      value={product.image}
                      onChange={(e) => {
                        const newProducts = [...formData.products];
                        newProducts[index].image = e.target.value;
                        setFormData(prev => ({ ...prev, products: newProducts }));
                      }}
                      placeholder={t('cardForm.productImageLink')}
                      className="mt-2"
                    />
                    
                    {/* Upload Photos Button */}
                    <div className="mt-3">
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            setUploadingPhotos(prev => ({ ...prev, [index]: true }));
                            handleProductPhotoUpload(index, file).finally(() => {
                              setUploadingPhotos(prev => ({ ...prev, [index]: false }));
                            });
                          }
                        }}
                        className="hidden"
                        id={`photo-upload-${index}`}
                      />
                      <Button
                        type="button"
                        variant="default"
                        onClick={() => document.getElementById(`photo-upload-${index}`)?.click()}
                        className="w-full bg-green-600 text-white hover:bg-green-700 py-3"
                      >
                        <Upload className="w-5 h-5 mr-2" />
                        UPLOAD PRODUCT PHOTOS
                      </Button>
                    </div>

                    {/* Photo Display */}
                    <div className="mt-3">
                      <div className="flex flex-wrap gap-2">
                        {(product.photos || []).map((photo: string, photoIndex: number) => (
                          <div key={photoIndex} className="relative">
                            <img 
                              src={photo} 
                              alt={`Product Photo ${photoIndex + 1}`}
                              className="w-16 h-16 object-cover rounded border"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              className="absolute -top-2 -right-2 w-6 h-6 bg-red-500 text-white border-red-500 hover:bg-red-600"
                              onClick={() => removeProductPhoto(index, photoIndex)}
                            >
                              <X className="w-3 h-3" />
                            </Button>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Links Section */}
                    <div className="mt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <LinkIcon className="w-4 h-4" />
                        <span className="text-sm font-medium">{t('cardForm.relatedLinks')}</span>
                      </div>
                      <div className="space-y-2 mb-2">
                        {product.links?.map((link: any, linkIndex: number) => (
                          <div key={linkIndex} className="flex items-center gap-2">
                            <Input
                              value={link.title}
                              onChange={(e) => {
                                const newProducts = [...formData.products];
                                newProducts[index].links[linkIndex].title = e.target.value;
                                setFormData(prev => ({ ...prev, products: newProducts }));
                              }}
                              placeholder={t('cardForm.linkTitle')}
                              className="flex-1"
                            />
                            <Input
                              value={link.url}
                              onChange={(e) => {
                                const newProducts = [...formData.products];
                                newProducts[index].links[linkIndex].url = e.target.value;
                                setFormData(prev => ({ ...prev, products: newProducts }));
                              }}
                              placeholder={t('cardForm.linkUrl')}
                              className="flex-1"
                            />
                            <Button
                              type="button"
                              variant="outline"
                              size="icon"
                              onClick={() => removeProductLink(index, linkIndex)}
                            >
                              <X className="w-4 h-4" />
                            </Button>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-2">
                        <Input
                          value={newProductLinks[index]?.title || ''}
                          onChange={(e) => setNewProductLinks(prev => ({ 
                            ...prev, 
                            [index]: { ...prev[index], title: e.target.value } 
                          }))}
                          placeholder="链接标题"
                          className="flex-1"
                        />
                        <Input
                          value={newProductLinks[index]?.url || ''}
                          onChange={(e) => setNewProductLinks(prev => ({ 
                            ...prev, 
                            [index]: { ...prev[index], url: e.target.value } 
                          }))}
                          placeholder={t('cardForm.linkUrl')}
                          className="flex-1"
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            if (newProductLinks[index]?.title && newProductLinks[index]?.url) {
                              addProductLink(index, newProductLinks[index]);
                              setNewProductLinks(prev => ({ ...prev, [index]: { title: '', url: '' } }));
                            }
                          }}
                        >
                          <Plus className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
                
                {/* Add New Product Form */}
                {formData.products.length < getMaxProducts() && (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 space-y-3">
                    <div className="space-y-2">
                      <Label htmlFor="newProductName">{t('cardForm.productServiceName')} *</Label>
                      <Input
                        id="newProductName"
                        value={newProduct.name}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, name: e.target.value }))}
                        placeholder={t('cardForm.enterProductServiceName')}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newProductDescription">{t('cardForm.productServiceDescription')}</Label>
                      <Textarea
                        id="newProductDescription"
                        value={newProduct.description}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, description: e.target.value }))}
                        placeholder={t('cardForm.describeProductService')}
                        rows={2}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="newProductImage">产品图片链接</Label>
                      <Input
                        id="newProductImage"
                        value={newProduct.image}
                        onChange={(e) => setNewProduct(prev => ({ ...prev, image: e.target.value }))}
                        placeholder="https://example.com/product-image.jpg"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addProduct}
                      className="w-full"
                      disabled={!newProduct.name.trim()}
                    >
                      <Plus className="w-4 h-4 mr-2" />
                      {t('cardForm.addProductService')}
                    </Button>
                    <p className="text-sm text-gray-500 text-center">
                      {getMaxProducts() - formData.products.length} {getMaxProducts() - formData.products.length === 1 ? 'product' : 'products'} remaining
                    </p>
                  </div>
                )}
                {formData.products.length >= getMaxProducts() && (
                  <div className="text-center p-4 border border-gray-200 rounded-lg">
                    <p className="text-sm text-gray-500">
                      You've reached the maximum number of products ({getMaxProducts()}) for your {subscriptionPlan} plan.
                    </p>
                  </div>
                )}
              </div>
            </div>

            {/* Industry Tags */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-semibold">{t('cardForm.industryTags')}</h3>
                <span className="text-sm text-gray-500">
                  {t('cardForm.selectedTags', { count: formData.industryTags.length })}
                </span>
              </div>
              <p className="text-sm text-gray-600">{t('cardForm.industryTagsDescription')}</p>
              <div className="flex flex-wrap gap-2">
                {INDUSTRY_OPTIONS.map((industry) => {
                  const isAllIndustries = industry.includes("全部名片") || industry.includes("All Industries");
                  const isSelected = formData.industryTags.includes(industry);
                  const isDisabled = isAllIndustries || (!isSelected && formData.industryTags.length >= 3);
                  
                  return (
                    <Badge
                      key={industry}
                      variant={isSelected ? "default" : "outline"}
                      className={`cursor-pointer transition-all ${
                        isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-gray-100'
                      }`}
                      onClick={() => !isDisabled && toggleIndustryTag(industry)}
                    >
                      {industry.split(' ')[0]}
                    </Badge>
                  );
                })}
              </div>
              {formData.industryTags.length >= 3 && (
                <p className="text-sm text-blue-600">
                  {t('cardForm.maxTagsReached')}
                </p>
              )}
            </div>

            {/* Privacy Settings */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('cardForm.privacySettings')}</h3>
              <div className="flex items-center space-x-2">
                <Switch
                  id="isPublic"
                  checked={formData.isPublic}
                  onCheckedChange={(checked) => handleInputChange('isPublic', checked)}
                />
                <Label htmlFor="isPublic" className="flex items-center gap-2">
                  {formData.isPublic ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
                  {t('cardForm.publicCard')} ({t('cardForm.publicCardDescription')})
                </Label>
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-between space-x-4 pt-6 border-t">
              <div className="flex space-x-2">
                {card && (
                  <Button 
                    type="button" 
                    variant="destructive" 
                    onClick={handleDeleteCard}
                    disabled={isLoading}
                  >
                    <Trash className="w-4 h-4 mr-2" />
                    {t('cardForm.deleteCard')}
                  </Button>
                )}
              </div>
              <div className="flex space-x-2">
                {onCancel && (
                  <Button type="button" variant="outline" onClick={onCancel}>
                    取消
                  </Button>
                )}
                <Button type="submit" disabled={isLoading}>
                  <Save className="w-4 h-4 mr-2" />
                  {isLoading ? t('cardForm.saving') : t('cardForm.saveCard')}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
        </div>

        {/* Preview Section */}
        <div className="lg:col-span-1">
          <CardTemplatePreview formData={formData} />
        </div>
      </div>
    </div>
  );
}