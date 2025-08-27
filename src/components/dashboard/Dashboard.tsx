'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  User, 
  Plus, 
  Eye, 
  Share2, 
  Download, 
  Mail, 
  TrendingUp,
  Calendar,
  Briefcase,
  Users,
  LogOut,
  Settings,
  QrCode,
  RefreshCw,
  Smartphone,
  Upload,
  Edit,
  GraduationCap,
  Award,
  Bookmark,
  FileText,
  Save,
  Paperclip,
  Users2,
  Target,
  BarChart3,
  Funnel
} from 'lucide-react';

import BusinessCardForm from '@/components/cards/BusinessCardForm';
import BusinessCardDisplay from '@/components/cards/BusinessCardDisplay';
import EmailSignatureGenerator from '@/components/signature/EmailSignatureGenerator';
import UserProfileSettings from '@/components/settings/UserProfileSettings';
import LanguageSelector from '@/components/LanguageSelector';
import AppointmentManagement from '@/components/appointments/AppointmentManagement';
import BookingManagement from '@/components/appointments/BookingManagement';
import ExperienceModal from '@/components/job-profile-page/ExperienceModal';
import EducationModal from '@/components/job-profile-page/EducationModal';
import CertificationModal from '@/components/job-profile-page/CertificationModal';
import SkillModal from '@/components/job-profile-page/SkillModal';
import LeadManagement from '@/components/leads/LeadManagement';
import LeadManagementPhase2 from '@/components/leads/LeadManagementPhase2';
import { useLanguage } from '@/contexts/LanguageContext';
import { toast } from '@/hooks/use-toast';

interface DashboardProps {
  user: any;
  autoCreate?: boolean;
  selectedTemplate?: string;
}

export default function Dashboard({ user, autoCreate, selectedTemplate }: DashboardProps) {
  // Helper function to determine if a skill is a language
  const isLanguageSkill = (skillName: string): boolean => {
    const commonLanguages = [
      'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 
      'Italian', 'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Dutch', 'Swedish',
      'Norwegian', 'Danish', 'Finnish', 'Polish', 'Turkish', 'Greek', 'Hebrew'
    ];
    return commonLanguages.includes(skillName);
  };

  const [cards, setCards] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedCard, setSelectedCard] = useState<any>(null);
  const [editingCard, setEditingCard] = useState<any>(null);
  const [creatingCard, setCreatingCard] = useState(false);
  const [currentUser, setCurrentUser] = useState(user);
  const { language, setLanguage, t } = useLanguage();

  // Job Profile state
  const [jobProfile, setJobProfile] = useState<any>(null);
  const [jobProfileLoading, setJobProfileLoading] = useState(true);
  const [jobProfileActiveTab, setJobProfileActiveTab] = useState('overview');
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
  const [isLanguageModalOpen, setIsLanguageModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<any>(null);
  const [editingEducation, setEditingEducation] = useState<any>(null);
  const [editingCertification, setEditingCertification] = useState<any>(null);
  const [editingLanguage, setEditingLanguage] = useState<any>(null);
  const [editingSkill, setEditingSkill] = useState<any>(null);
  const [resumeFile, setResumeFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);

  useEffect(() => {
    fetchCards();
    fetchJobProfile();
    
    // If autoCreate is enabled, switch to my-cards tab and start creating card
    if (autoCreate && selectedTemplate) {
      setActiveTab('my-cards');
      setCreatingCard(true);
      // Set the template in the form (this will be handled by the BusinessCardForm)
    }
  }, [autoCreate, selectedTemplate]);

  // Debug education data
  useEffect(() => {
    if (jobProfile) {
      console.log('Education Debug - Job Profile:', jobProfile);
      console.log('Education Debug - Education Data:', jobProfile.education);
      console.log('Education Debug - Education Length:', jobProfile.education?.length);
      console.log('Education Debug - Is Array:', Array.isArray(jobProfile.education));
    }
  }, [jobProfile]);

  const fetchCards = async () => {
    setLoading(true);
    try {
      const response = await fetch('/api/cards');
      const data = await response.json();
      
      if (response.ok) {
        setCards(data.cards);
      }
    } catch (error) {
      console.error('Failed to fetch cards:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchJobProfile = async () => {
    setJobProfileLoading(true);
    try {
      const response = await fetch('/api/user/job-profile');
      if (response.ok) {
        const data = await response.json();
        console.log('Job Profile Data:', data.jobProfile); // Debug log
        console.log('Career History:', data.jobProfile?.careerHistory); // Debug log
        console.log('Education:', data.jobProfile?.education); // Debug log
        console.log('Full job profile object:', JSON.stringify(data.jobProfile, null, 2)); // Debug log
        setJobProfile(data.jobProfile);
      } else {
        // If profile doesn't exist, create one
        const createResponse = await fetch('/api/user/job-profile', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            summary: '',
            resumeUrl: '',
          }),
        });
        if (createResponse.ok) {
          const data = await createResponse.json();
          console.log('Created Job Profile Data:', data.jobProfile); // Debug log
          setJobProfile(data.jobProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching job profile:', error);
    } finally {
      setJobProfileLoading(false);
    }
  };

  const updateJobProfile = async (data: { summary?: string; resumeUrl?: string }) => {
    try {
      const response = await fetch('/api/user/job-profile/update', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        const updatedProfile = await response.json();
        setJobProfile(updatedProfile.jobProfile);
      }
    } catch (error) {
      console.error('Error updating job profile:', error);
    }
  };

  // Experience functions
  const handleSaveExperience = async (experience: any) => {
    try {
      const url = editingExperience 
        ? `/api/user/job-profile/career-history/${editingExperience.id}`
        : '/api/user/job-profile/career-history';
      
      const method = editingExperience ? 'PUT' : 'POST';
      
      console.log('Saving Experience:', experience); // Debug log
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experience),
      });

      if (response.ok) {
        console.log('Experience saved successfully, fetching updated profile...');
        await fetchJobProfile();
        setIsExperienceModalOpen(false);
        setEditingExperience(null);
      } else {
        console.error('Failed to save experience:', response.status, response.statusText);
      }
    } catch (error) {
      console.error('Error saving experience:', error);
    }
  };

  const handleDeleteExperience = async () => {
    if (!editingExperience) return;
    
    try {
      const response = await fetch(`/api/user/job-profile/career-history/${editingExperience.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobProfile();
        setIsExperienceModalOpen(false);
        setEditingExperience(null);
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
    }
  };

  const openAddExperienceModal = () => {
    setEditingExperience(null);
    setIsExperienceModalOpen(true);
  };

  const openEditExperienceModal = (experience: any) => {
    setEditingExperience(experience);
    setIsExperienceModalOpen(true);
  };

  // Education functions
  const handleSaveEducation = async (education: any) => {
    try {
      const url = editingEducation 
        ? `/api/user/job-profile/education/${editingEducation.id}`
        : '/api/user/job-profile/education';
      
      const method = editingEducation ? 'PUT' : 'POST';
      
      console.log('Saving Education:', education); // Debug log
      console.log('Education data type:', typeof education);
      console.log('Education keys:', Object.keys(education));
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(education),
      });

      if (response.ok) {
        console.log('Education saved successfully, fetching updated profile...');
        await fetchJobProfile();
        setIsEducationModalOpen(false);
        setEditingEducation(null);
      } else {
        console.error('Failed to save education:', response.status, response.statusText);
        const errorData = await response.json();
        console.error('Error response:', errorData);
      }
    } catch (error) {
      console.error('Error saving education:', error);
    }
  };

  const handleDeleteEducation = async () => {
    if (!editingEducation) return;
    
    try {
      const response = await fetch(`/api/user/job-profile/education/${editingEducation.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobProfile();
        setIsEducationModalOpen(false);
        setEditingEducation(null);
      }
    } catch (error) {
      console.error('Error deleting education:', error);
    }
  };

  const openAddEducationModal = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };

  const openEditEducationModal = (education: any) => {
    setEditingEducation(education);
    setIsEducationModalOpen(true);
  };

  // Certification functions
  const handleSaveCertification = async (certification: any) => {
    try {
      const url = editingCertification 
        ? `/api/user/job-profile/certifications/${editingCertification.id}`
        : '/api/user/job-profile/certifications';
      
      const method = editingCertification ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(certification),
      });

      if (response.ok) {
        await fetchJobProfile();
        setIsCertificationModalOpen(false);
        setEditingCertification(null);
      }
    } catch (error) {
      console.error('Error saving certification:', error);
    }
  };

  const handleDeleteCertification = async () => {
    if (!editingCertification) return;
    
    try {
      const response = await fetch(`/api/user/job-profile/certifications/${editingCertification.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobProfile();
        setIsCertificationModalOpen(false);
        setEditingCertification(null);
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
    }
  };

  const openAddCertificationModal = () => {
    setEditingCertification(null);
    setIsCertificationModalOpen(true);
  };

  const openEditCertificationModal = (certification: any) => {
    setEditingCertification(certification);
    setIsCertificationModalOpen(true);
  };

  // Language functions
  const handleSaveLanguage = async (language: any) => {
    try {
      const url = editingLanguage 
        ? `/api/user/job-profile/skills/${editingLanguage.id}`
        : '/api/user/job-profile/skills';
      
      const method = editingLanguage ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(language),
      });

      if (response.ok) {
        await fetchJobProfile();
        setIsLanguageModalOpen(false);
        setEditingLanguage(null);
      }
    } catch (error) {
      console.error('Error saving language:', error);
    }
  };

  const handleDeleteLanguage = async () => {
    if (!editingLanguage) return;
    
    try {
      const response = await fetch(`/api/user/job-profile/skills/${editingLanguage.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobProfile();
        setIsLanguageModalOpen(false);
        setEditingLanguage(null);
      }
    } catch (error) {
      console.error('Error deleting language:', error);
    }
  };

  const openAddLanguageModal = () => {
    setEditingLanguage(null);
    setIsLanguageModalOpen(true);
  };

  const openEditLanguageModal = (language: any) => {
    setEditingLanguage(language);
    setIsLanguageModalOpen(true);
  };

  // Skill functions
  const handleSaveSkill = async (skill: any) => {
    try {
      const url = editingSkill 
        ? `/api/user/job-profile/skills/${editingSkill.id}`
        : '/api/user/job-profile/skills';
      
      const method = editingSkill ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(skill),
      });

      if (response.ok) {
        await fetchJobProfile();
        setIsSkillModalOpen(false);
        setEditingSkill(null);
      }
    } catch (error) {
      console.error('Error saving skill:', error);
    }
  };

  const handleDeleteSkill = async () => {
    if (!editingSkill) return;
    
    try {
      const response = await fetch(`/api/user/job-profile/skills/${editingSkill.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobProfile();
        setIsSkillModalOpen(false);
        setEditingSkill(null);
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
    }
  };

  const openAddSkillModal = () => {
    setEditingSkill(null);
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: any) => {
    setEditingSkill(skill);
    setIsSkillModalOpen(true);
  };

  // Resume upload handler
  const handleResumeUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    const allowedTypes = ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'];
    if (!allowedTypes.includes(file.type)) {
      toast({
        title: t('settings.invalidFileType'),
        description: t('settings.uploadPdfOrWord'),
        variant: "destructive"
      });
      return;
    }

    // Validate file size (5MB limit)
    if (file.size > 5 * 1024 * 1024) {
      toast({
        title: t('settings.fileTooLarge'),
        description: t('settings.uploadSmallerFile'),
        variant: "destructive"
      });
      return;
    }

    setResumeFile(file);
    await uploadResume(file);
  };

  const uploadResume = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      if (response.ok) {
        const data = await response.json();
        // Update the job profile with the new resume URL
        await updateJobProfile({ resumeUrl: data.url });
        toast({
          title: t('settings.resumeUploadSuccess'),
          description: t('settings.resumeUploadSuccessDesc'),
        });
      } else {
        throw new Error('Upload failed');
      }
    } catch (error) {
      console.error('Error uploading resume:', error);
      toast({
        title: t('settings.uploadFailed'),
        description: t('settings.uploadFailedDesc'),
        variant: "destructive"
      });
    } finally {
      setIsUploading(false);
    }
  };

  const handleCardSave = (card: any) => {
    setEditingCard(null);
    setCreatingCard(false);
    fetchCards();
  };

  const handleCardEdit = (card: any) => {
    setEditingCard(card);
    setActiveTab('my-cards');
  };

  const handleCardDelete = async (cardId: string) => {
    if (confirm(t('dashboard.deleteCardConfirm'))) {
      try {
        const response = await fetch(`/api/cards/${cardId}`, {
          method: 'DELETE'
        });
        
        if (response.ok) {
          fetchCards();
        }
      } catch (error) {
        console.error('Failed to delete card:', error);
      }
    }
  };

  const canCreateCard = () => {
    const plan = currentUser.subscriptionPlan || 'free';
    const maxCards = plan === 'free' ? 1 : plan === 'professional' ? 3 : 999;
    return cards.length < maxCards;
  };

  const getMaxCardsForPlan = () => {
    const plan = currentUser.subscriptionPlan || 'free';
    return plan === 'free' ? 1 : plan === 'professional' ? 3 : 999;
  };

  const getPlanName = () => {
    const plan = currentUser.subscriptionPlan || 'free';
    return plan === 'free' ? t('dashboard.freePlan') : plan === 'professional' ? t('dashboard.professionalPlan') : t('dashboard.enterprisePlan');
  };

  const handleLogout = async () => {
    try {
      await fetch('/api/auth/logout', { method: 'POST' });
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleUserUpdate = (updatedUser: any) => {
    setCurrentUser(updatedUser);
  };

  const handleAddSection = (sectionType: string) => {
    // Navigate to the main page (job profile) for adding sections
    window.location.href = '/';
  };

  const totalViews = cards.reduce((sum, card) => sum + (card.viewCount || 0), 0);
  const publicCards = cards.filter(card => card.isPublic).length;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">APEXCARD</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <LanguageSelector 
                currentLanguage={language} 
                onLanguageChange={setLanguage} 
              />
              <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                {currentUser.avatar ? (
                  <img 
                    src={currentUser.avatar} 
                    alt={currentUser.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <User className="w-4 h-4 text-gray-600" />
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{currentUser.name}</span>
              </Link>
              
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="w-4 h-4 mr-2" />
                {t('dashboard.logout')}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList key={`tabs-${language}`} className="grid w-full grid-cols-8">
            <TabsTrigger value="overview">{t('dashboard.overview')}</TabsTrigger>
            <TabsTrigger value="my-cards">{t('dashboard.myCardsAndCreate')}</TabsTrigger>
            <TabsTrigger value="bookings">{t('dashboard.bookings')}</TabsTrigger>
            <TabsTrigger value="leads">{t('leads.title')}</TabsTrigger>
            <TabsTrigger value="job-profile">{t('dashboard.jobProfile')}</TabsTrigger>
            <TabsTrigger value="signature">{t('dashboard.signature')}</TabsTrigger>
            <TabsTrigger value="sync">{t('dashboard.sync')}</TabsTrigger>
            <TabsTrigger value="settings">{t('dashboard.settings')}</TabsTrigger>
          </TabsList>

          {/* Overview */}
          <TabsContent value="overview" className="space-y-6">
            <div className="grid md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Briefcase className="w-8 h-8 text-blue-600" />
                    <div>
                      <p className="text-2xl font-bold">{cards.length}</p>
                      <p className="text-sm text-gray-600">{t('dashboard.totalCards')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Eye className="w-8 h-8 text-green-600" />
                    <div>
                      <p className="text-2xl font-bold">{totalViews}</p>
                      <p className="text-sm text-gray-600">{t('dashboard.totalViews')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Users className="w-8 h-8 text-purple-600" />
                    <div>
                      <p className="text-2xl font-bold">{publicCards}</p>
                      <p className="text-sm text-gray-600">{t('dashboard.publicCards')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center space-x-2">
                    <Calendar className="w-8 h-8 text-orange-600" />
                    <div>
                      <p className="text-2xl font-bold">
                        {new Date().toLocaleDateString(language === 'zh-TW' ? 'zh-TW' : language === 'zh-CN' ? 'zh-CN' : 'en-US', { month: 'long' })}
                      </p>
                      <p className="text-sm text-gray-600">{t('dashboard.currentMonth')}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Recent Cards */}
            <Card>
              <CardHeader>
                <CardTitle>{t('dashboard.recentCards')}</CardTitle>
                <CardDescription>{t('dashboard.recentCardsDesc')}</CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <div className="space-y-4">
                    {[...Array(3)].map((_, i) => (
                      <div key={i} className="h-20 bg-gray-200 rounded-lg animate-pulse"></div>
                    ))}
                  </div>
                ) : cards.length > 0 ? (
                  <div className="space-y-4">
                    {cards.slice(0, 5).map((card) => (
                      <div key={card.id} className="flex items-center justify-between p-4 border rounded-lg">
                        <div className="flex items-center space-x-4">
                          {card.avatar ? (
                            <img 
                              src={card.avatar} 
                              alt={card.name}
                              className="w-12 h-12 rounded-full"
                            />
                          ) : (
                            <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                              <User className="w-6 h-6 text-gray-500" />
                            </div>
                          )}
                          <div>
                            <h3 className="font-semibold">{card.name}</h3>
                            <p className="text-sm text-gray-600">{card.company || t('dashboard.noCompany')}</p>
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge variant={card.isPublic ? "default" : "secondary"}>
                            {card.isPublic ? t('dashboard.public') : t('dashboard.private')}
                          </Badge>
                          <div className="flex items-center space-x-1 text-sm text-gray-500">
                            <Eye className="w-4 h-4" />
                            <span>{card.viewCount || 0}</span>
                          </div>
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleCardEdit(card)}
                          >
                            {t('dashboard.edit')}
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.noCards')}</h3>
                    <p className="text-gray-600 mb-4">{t('dashboard.createFirstCard')}</p>
                    <Button onClick={() => setActiveTab('my-cards')}>
                      <Plus className="w-4 h-4 mr-2" />
                      {t('dashboard.newCard')}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          {/* My Cards (Combined with Create) */}
          <TabsContent value="my-cards" className="space-y-6">
            {creatingCard || editingCard ? (
              <BusinessCardForm 
                card={editingCard}
                onSave={handleCardSave}
                onCancel={() => {
                  setCreatingCard(false);
                  setEditingCard(null);
                }}
                defaultTemplate={selectedTemplate}
                subscriptionPlan={currentUser.subscriptionPlan || 'free'}
              />
            ) : (
              <>
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{t('dashboard.myCards')}</h2>
                    <p className="text-sm text-gray-600 mt-1">
                      {getPlanName()}{t('dashboard.planUsageText')} {cards.length}/{getMaxCardsForPlan()} {t('dashboard.of')}
                    </p>
                  </div>
                  <Button 
                    onClick={() => setCreatingCard(true)}
                    disabled={!canCreateCard()}
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    {t('dashboard.newCard')}
                  </Button>
                </div>

                {!canCreateCard() && (
                  <Alert>
                    <AlertDescription>
                      {t('dashboard.planLimitReached')}{getPlanName()}{t('dashboard.planLimitReachedText')}（{getMaxCardsForPlan()}{t('dashboard.of')}）。
                      {currentUser.subscriptionPlan === 'free' && (
                        <span> 
                          {t('dashboard.upgradePlanText')}<a href="/pricing" className="text-blue-600 hover:underline">{t('dashboard.professionalPlan')}</a>{t('dashboard.upgradePlanBenefit')}。
                        </span>
                      )}
                    </AlertDescription>
                  </Alert>
                )}

                {loading ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                      <Card key={i} className="animate-pulse">
                        <CardContent className="p-6">
                          <div className="h-32 bg-gray-200 rounded-lg mb-4"></div>
                          <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                          <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : cards.length > 0 ? (
                  <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {cards.map((card) => (
                      <Card key={card.id} className="hover:shadow-lg transition-shadow">
                        <CardContent className="p-6">
                          <div className="flex items-center justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              {card.avatar ? (
                                <img 
                                  src={card.avatar} 
                                  alt={card.name}
                                  className="w-12 h-12 rounded-full"
                                />
                              ) : (
                                <div className="w-12 h-12 rounded-full bg-gray-200 flex items-center justify-center">
                                  <User className="w-6 h-6 text-gray-500" />
                                </div>
                              )}
                              <div>
                                <h3 className="font-semibold">{card.name}</h3>
                                <p className="text-sm text-gray-600">{card.company || t('dashboard.noCompany')}</p>
                              </div>
                            </div>
                            <Badge variant={card.isPublic ? "default" : "secondary"}>
                              {card.isPublic ? t('dashboard.public') : t('dashboard.private')}
                            </Badge>
                          </div>
                          
                          <div className="space-y-2 mb-4">
                            {card.position && (
                              <p className="text-sm text-gray-600">{card.position}</p>
                            )}
                            <div className="flex items-center space-x-1 text-sm text-gray-500">
                              <Eye className="w-4 h-4" />
                              <span>{card.viewCount || 0} {t('dashboard.views')}</span>
                            </div>
                          </div>
                          
                          <div className="flex space-x-2">
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="flex-1"
                              onClick={() => setSelectedCard(card)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              {t('dashboard.view')}
                            </Button>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => handleCardEdit(card)}
                            >
                              {t('dashboard.edit')}
                            </Button>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-12">
                    {canCreateCard() ? (
                      <>
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.noCards')}</h3>
                        <p className="text-gray-600 mb-4">{t('dashboard.createFirstCard')}</p>
                        <Button onClick={() => setCreatingCard(true)}>
                          <Plus className="w-4 h-4 mr-2" />
                          {t('dashboard.newCard')}
                        </Button>
                      </>
                    ) : (
                      <>
                        <Briefcase className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">{t('dashboard.maxCardsReachedTitle')}</h3>
                        <p className="text-gray-600 mb-4">
                          {t('dashboard.maxCardsReached')}{getPlanName()}{t('dashboard.maxCardsReachedText')}{getMaxCardsForPlan()}{t('dashboard.maxCardsReachedText2')}。
                          {currentUser.subscriptionPlan === 'free' && (
                            <span>{t('dashboard.upgradeProfessionalText')}。</span>
                          )}
                        </p>
                        {currentUser.subscriptionPlan === 'free' && (
                          <Link href="/pricing">
                            <Button>
                              <TrendingUp className="w-4 h-4 mr-2" />
                              {t('dashboard.upgradePlan')}
                            </Button>
                          </Link>
                        )}
                      </>
                    )}
                  </div>
                )}
              </>
            )}
          </TabsContent>

          {/* Bookings */}
          <TabsContent value="bookings">
            <BookingManagement userId={user.id} />
          </TabsContent>

          {/* Leads - Combined Phase 1 and Phase 2 */}
          <TabsContent value="leads" className="space-y-6">
            <LeadManagement userId={user.id} />
            <LeadManagementPhase2 userId={user.id} />
          </TabsContent>

          {/* Job Profile */}
          <TabsContent value="job-profile">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('jobProfile.title')}</h2>
              </div>
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                {/* Left Navigation */}
                <div className="lg:col-span-1">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg">Navigation</CardTitle>
                    </CardHeader>
                    <CardContent className="p-0">
                      <nav className="space-y-2">
                        <Button
                          variant={jobProfileActiveTab === 'overview' ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setJobProfileActiveTab('overview')}
                        >
                          <User className="h-4 w-4 mr-2" />
                          {t('dashboard.personalSummary')}
                        </Button>
                        <Button
                          variant={jobProfileActiveTab === 'resume' ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setJobProfileActiveTab('resume')}
                        >
                          <FileText className="h-4 w-4 mr-2" />
                          {t('dashboard.resume')}
                        </Button>
                        <Button
                          variant={jobProfileActiveTab === 'career' ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setJobProfileActiveTab('career')}
                        >
                          <Briefcase className="h-4 w-4 mr-2" />
                          {t('dashboard.careerHistory')}
                        </Button>
                        <Button
                          variant={jobProfileActiveTab === 'education' ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setJobProfileActiveTab('education')}
                        >
                          <GraduationCap className="h-4 w-4 mr-2" />
                          {t('jobProfile.education')}
                        </Button>
                        <Button
                          variant={jobProfileActiveTab === 'certifications' ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setJobProfileActiveTab('certifications')}
                        >
                          <Award className="h-4 w-4 mr-2" />
                          {t('jobProfile.certifications')}
                        </Button>
                        <Button
                          variant={jobProfileActiveTab === 'skills' ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setJobProfileActiveTab('skills')}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          {t('jobProfile.skillsAndLanguages')}
                        </Button>
                        <Button
                          variant={jobProfileActiveTab === 'saved-searches' ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setJobProfileActiveTab('saved-searches')}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {t('jobProfile.savedSearches')}
                        </Button>
                        <Button
                          variant={jobProfileActiveTab === 'saved-jobs' ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setJobProfileActiveTab('saved-jobs')}
                        >
                          <Bookmark className="h-4 w-4 mr-2" />
                          {t('jobProfile.savedJobs')}
                        </Button>
                        <Button
                          variant={jobProfileActiveTab === 'applications' ? 'default' : 'ghost'}
                          className="w-full justify-start"
                          onClick={() => setJobProfileActiveTab('applications')}
                        >
                          <Save className="h-4 w-4 mr-2" />
                          {t('jobProfile.applications')}
                        </Button>
                      </nav>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Content */}
                <div className="lg:col-span-3">
                  {jobProfileLoading ? (
                    <div className="flex items-center justify-center h-64">
                      <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      {/* Overview Tab */}
                      {jobProfileActiveTab === 'overview' && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>{t('dashboard.personalSummary')}</CardTitle>
                              <Button onClick={() => updateJobProfile({ summary: jobProfile?.summary })} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                {t('modal.save')}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="summary">Summary</Label>
                                <Textarea
                                  id="summary"
                                  placeholder={t('jobProfile.summaryPlaceholder')}
                                  value={jobProfile?.summary || ''}
                                  onChange={(e) => {
                                    setJobProfile({ ...jobProfile, summary: e.target.value });
                                  }}
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Resume Tab */}
                      {jobProfileActiveTab === 'resume' && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>Resume</CardTitle>
                              <Button onClick={() => updateJobProfile({ resumeUrl: jobProfile?.resumeUrl })} size="sm">
                                <Save className="h-4 w-4 mr-2" />
                                Save
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor="resumeUrl">Resume URL</Label>
                                <Input
                                  id="resumeUrl"
                                  placeholder="https://example.com/resume.pdf"
                                  value={jobProfile?.resumeUrl || ''}
                                  onChange={(e) => {
                                    setJobProfile({ ...jobProfile, resumeUrl: e.target.value });
                                  }}
                                />
                                <p className="text-sm text-muted-foreground mt-2">
                                  Enter the URL to your resume or upload a file to get a shareable link.
                                </p>
                              </div>
                              <div>
                                <Label>Upload Resume</Label>
                                <div className="mt-2">
                                  <input
                                    type="file"
                                    id="resume-upload"
                                    accept=".pdf,.doc,.docx"
                                    onChange={handleResumeUpload}
                                    className="hidden"
                                    disabled={isUploading}
                                  />
                                  <Button 
                                    variant="outline" 
                                    className="w-full"
                                    onClick={() => document.getElementById('resume-upload')?.click()}
                                    disabled={isUploading}
                                  >
                                    {isUploading ? (
                                      <>
                                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary mr-2"></div>
                                        Uploading...
                                      </>
                                    ) : (
                                      <>
                                        <Paperclip className="h-4 w-4 mr-2" />
                                        Choose File
                                      </>
                                    )}
                                  </Button>
                                  <p className="text-xs text-muted-foreground mt-1">
                                    PDF, DOC, DOCX (Max 5MB)
                                  </p>
                                </div>
                              </div>
                              {jobProfile?.resumeUrl && (
                                <div>
                                  <Label>{t('dashboard.currentResume')}</Label>
                                  <div className="mt-2 p-3 border rounded-lg">
                                    <a 
                                      href={jobProfile.resumeUrl} 
                                      target="_blank" 
                                      rel="noopener noreferrer"
                                      className="text-blue-600 hover:underline flex items-center gap-2"
                                    >
                                      <FileText className="h-4 w-4" />
                                      View Resume
                                    </a>
                                  </div>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Career History Tab */}
                      {jobProfileActiveTab === 'career' && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>{t('jobProfile.careerHistory')}</CardTitle>
                              <Button onClick={openAddExperienceModal} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                {t('jobProfile.addExperience')}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {console.log('Career History Data:', jobProfile?.careerHistory)}
                              {jobProfile?.careerHistory?.map((history: any) => (
                                <div 
                                  key={history.id} 
                                  className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => openEditExperienceModal(history)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{history.title}</h3>
                                    <Badge variant={history.isCurrent ? 'default' : 'secondary'}>
                                      {history.isCurrent ? t('dashboard.current') : t('dashboard.past')}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{history.company}</p>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {new Date(history.startDate).toLocaleDateString()} -{' '}
                                    {history.endDate ? new Date(history.endDate).toLocaleDateString() : t('dashboard.present')}
                                  </p>
                                  {history.description && (
                                    <p className="text-sm text-muted-foreground">{history.description}</p>
                                  )}
                                </div>
                              ))}
                              {(!jobProfile?.careerHistory || jobProfile.careerHistory.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>{t('jobProfile.noCareerHistory')}</p>
                                  <p className="text-sm">{t('jobProfile.clickAddExperience')}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Education Tab */}
                      {jobProfileActiveTab === 'education' && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>{t('jobProfile.education')}</CardTitle>
                              <Button onClick={openAddEducationModal} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                {t('dashboard.addEducation')}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {jobProfile?.education?.map((edu: any) => (
                                <div 
                                  key={edu.id} 
                                  className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => openEditEducationModal(edu)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{edu.degree}</h3>
                                    <Badge variant={edu.isCurrent ? 'default' : 'secondary'}>
                                      {edu.isCurrent ? t('dashboard.current') : t('dashboard.completed')}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">{edu.institution}</p>
                                  {edu.field && (
                                    <p className="text-sm text-muted-foreground mb-2">{edu.field}</p>
                                  )}
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {new Date(edu.startDate).toLocaleDateString()} -{' '}
                                    {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : t('dashboard.present')}
                                  </p>
                                  {edu.description && (
                                    <p className="text-sm text-muted-foreground">{edu.description}</p>
                                  )}
                                </div>
                              ))}
                              {(!jobProfile?.education || jobProfile.education.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>{t('jobProfile.noEducation')}</p>
                                  <p className="text-sm">{t('jobProfile.clickAddEducation')}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Certifications Tab */}
                      {jobProfileActiveTab === 'certifications' && (
                        <Card>
                          <CardHeader>
                            <div className="flex items-center justify-between">
                              <CardTitle>{t('jobProfile.certifications')}</CardTitle>
                              <Button onClick={openAddCertificationModal} size="sm">
                                <Plus className="h-4 w-4 mr-2" />
                                {t('dashboard.addCertification')}
                              </Button>
                            </div>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {jobProfile?.certifications?.map((cert: any) => (
                                <div 
                                  key={cert.id} 
                                  className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                  onClick={() => openEditCertificationModal(cert)}
                                >
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{cert.name}</h3>
                                    <Badge variant="secondary">
                                      {cert.issuer}
                                    </Badge>
                                  </div>
                                  {cert.issueDate && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Issued: {new Date(cert.issueDate).toLocaleDateString()}
                                    </p>
                                  )}
                                  {cert.expiryDate && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Expires: {new Date(cert.expiryDate).toLocaleDateString()}
                                    </p>
                                  )}
                                  {cert.credentialNumber && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      Credential #: {cert.credentialNumber}
                                    </p>
                                  )}
                                  {cert.description && (
                                    <p className="text-sm text-muted-foreground">{cert.description}</p>
                                  )}
                                </div>
                              ))}
                              {(!jobProfile?.certifications || jobProfile.certifications.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>{t('jobProfile.noCertifications')}</p>
                                  <p className="text-sm">{t('jobProfile.clickAddCertification')}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Skills and Languages Tab */}
                      {jobProfileActiveTab === 'skills' && (
                        <div className="space-y-6">
                          {/* Skills Section */}
                          <Card>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle>{t('jobProfile.skills')}</CardTitle>
                                <Button onClick={openAddSkillModal} size="sm">
                                  <Plus className="h-4 w-4 mr-2" />
                                  {t('dashboard.addSkill')}
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {jobProfile?.skills?.filter((skill: any) => !isLanguageSkill(skill.name)).map((skill: any) => (
                                  <div 
                                    key={skill.id} 
                                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => openEditSkillModal(skill)}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <h3 className="font-semibold">{skill.name}</h3>
                                      <Badge variant="secondary">
                                        {skill.level}
                                      </Badge>
                                    </div>
                                    {skill.yearsExperience && (
                                      <p className="text-sm text-muted-foreground mb-2">
                                        {t('dashboard.yearsOfExperience')}: {skill.yearsExperience}
                                      </p>
                                    )}
                                    <p className="text-sm text-muted-foreground">
                                      {t('dashboard.clickToEditSkill')}
                                    </p>
                                  </div>
                                ))}
                                {(!jobProfile?.skills || !jobProfile.skills.some((skill: any) => !isLanguageSkill(skill.name))) && (
                                  <div className="text-center py-8 text-muted-foreground">
                                    <p>{t('jobProfile.noSkills')}</p>
                                    <p className="text-sm">{t('jobProfile.clickAddSkill')}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>

                          {/* Languages Section */}
                          <Card>
                            <CardHeader>
                              <div className="flex items-center justify-between">
                                <CardTitle>{t('jobProfile.languages')}</CardTitle>
                                <Button onClick={openAddLanguageModal} size="sm">
                                  <Plus className="h-4 w-4 mr-2" />
                                  {t('dashboard.addLanguage')}
                                </Button>
                              </div>
                            </CardHeader>
                            <CardContent>
                              <div className="space-y-4">
                                {jobProfile?.skills?.filter((skill: any) => isLanguageSkill(skill.name)).map((skill: any) => (
                                  <div 
                                    key={skill.id} 
                                    className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                                    onClick={() => openEditLanguageModal(skill)}
                                  >
                                    <div className="flex items-center justify-between mb-2">
                                      <h3 className="font-semibold">{skill.name}</h3>
                                      <Badge variant="secondary">
                                        {skill.level}
                                      </Badge>
                                    </div>
                                    <p className="text-sm text-muted-foreground">
                                      {t('dashboard.clickToEditLanguage')}
                                    </p>
                                  </div>
                                ))}
                                {(!jobProfile?.skills || !jobProfile.skills.some((skill: any) => isLanguageSkill(skill.name))) && (
                                  <div className="text-center py-8 text-muted-foreground">
                                    <p>{t('jobProfile.noLanguages')}</p>
                                    <p className="text-sm">{t('jobProfile.clickAddLanguage')}</p>
                                  </div>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        </div>
                      )}

                      {/* Saved Searches Tab */}
                      {jobProfileActiveTab === 'saved-searches' && (
                        <Card>
                          <CardHeader>
                            <CardTitle>{t('jobProfile.savedSearches')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {jobProfile?.savedSearches?.map((search: any) => (
                                <div key={search.id} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{search.name}</h3>
                                    <Badge variant="secondary">
                                      {new Date(search.createdAt).toLocaleDateString()}
                                    </Badge>
                                  </div>
                                  {search.keywords && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {t('dashboard.keywords')}: {search.keywords}
                                    </p>
                                  )}
                                  {search.industry && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {t('dashboard.industry')}: {search.industry}
                                    </p>
                                  )}
                                  {search.location && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {t('dashboard.location')}: {search.location}
                                    </p>
                                  )}
                                  {search.jobType && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {t('dashboard.jobType')}: {search.jobType}
                                    </p>
                                  )}
                                  {search.remoteOption && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {t('dashboard.remoteOption')}: {search.remoteOption}
                                    </p>
                                  )}
                                  {search.salaryRange && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {t('dashboard.salaryRange')}: {search.salaryRange}
                                    </p>
                                  )}
                                </div>
                              ))}
                              {(!jobProfile?.savedSearches || jobProfile.savedSearches.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>{t('dashboard.noSavedSearchesYet')}</p>
                                  <p className="text-sm">{t('dashboard.savedSearchesWillAppear')}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Saved Jobs Tab */}
                      {jobProfileActiveTab === 'saved-jobs' && (
                        <Card>
                          <CardHeader>
                            <CardTitle>{t('jobProfile.savedJobs')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {jobProfile?.savedJobs?.map((job: any) => (
                                <div key={job.id} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{job.jobId}</h3>
                                    <Badge variant="secondary">
                                      {new Date(job.createdAt).toLocaleDateString()}
                                    </Badge>
                                  </div>
                                  {job.notes && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {t('dashboard.notes')}: {job.notes}
                                    </p>
                                  )}
                                </div>
                              ))}
                              {(!jobProfile?.savedJobs || jobProfile.savedJobs.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>{t('dashboard.noSavedJobsYet')}</p>
                                  <p className="text-sm">{t('dashboard.savedJobsWillAppear')}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}

                      {/* Applications Tab */}
                      {jobProfileActiveTab === 'applications' && (
                        <Card>
                          <CardHeader>
                            <CardTitle>{t('jobProfile.applications')}</CardTitle>
                          </CardHeader>
                          <CardContent>
                            <div className="space-y-4">
                              {jobProfile?.applications?.map((app: any) => (
                                <div key={app.id} className="border rounded-lg p-4">
                                  <div className="flex items-center justify-between mb-2">
                                    <h3 className="font-semibold">{app.jobId}</h3>
                                    <Badge variant="secondary">
                                      {new Date(app.appliedAt).toLocaleDateString()}
                                    </Badge>
                                  </div>
                                  <p className="text-sm text-muted-foreground mb-2">
                                    {t('jobProfile.status')}: {app.status}
                                  </p>
                                  {app.notes && (
                                    <p className="text-sm text-muted-foreground mb-2">
                                      {t('dashboard.notes')}: {app.notes}
                                    </p>
                                  )}
                                </div>
                              ))}
                              {(!jobProfile?.applications || jobProfile.applications.length === 0) && (
                                <div className="text-center py-8 text-muted-foreground">
                                  <p>{t('dashboard.noApplicationsYet')}</p>
                                  <p className="text-sm">{t('dashboard.applicationsWillAppear')}</p>
                                </div>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      )}


                    </div>
                  )}
                </div>
              </div>
            </div>
          </TabsContent>

          {/* Email Signature */}
          <TabsContent value="signature">
            <EmailSignatureGenerator cards={cards} />
          </TabsContent>

          {/* Contact Sync */}
          <TabsContent value="sync">
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold">{t('sync.contactSync')}</h2>
                <Link href="/sync">
                  <Button className="flex items-center gap-2">
                    <RefreshCw className="w-4 h-4" />
                    {t('sync.advancedSettings')}
                  </Button>
                </Link>
              </div>
              
              <div className="grid md:grid-cols-2 gap-6">
                {/* Quick Sync Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <RefreshCw className="w-5 h-5" />
                      {t('sync.syncStatus')}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('sync.iphoneSync')}</span>
                        <Badge variant="outline">{t('sync.notSetup')}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('sync.googleContacts')}</span>
                        <Badge variant="outline">{t('sync.notConnected')}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('sync.outlook')}</span>
                        <Badge variant="outline">{t('sync.notConnected')}</Badge>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-sm text-gray-600">{t('sync.salesforce')}</span>
                        <Badge variant="outline">{t('sync.notConnected')}</Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>{t('sync.quickActions')}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <Link href="/sync">
                        <Button className="w-full justify-start" variant="outline">
                          <RefreshCw className="w-4 h-4 mr-2" />
                          {t('sync.setupIphoneSync')}
                        </Button>
                      </Link>
                      <Button className="w-full justify-start" variant="outline">
                        <Download className="w-4 h-4 mr-2" />
                        {t('sync.exportVcard')}
                      </Button>
                      <Button className="w-full justify-start" variant="outline">
                        <Upload className="w-4 h-4 mr-2" />
                        {t('sync.importVcard')}
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </div>

              {/* Sync Benefits */}
              <Card>
                <CardHeader>
                  <CardTitle>{t('sync.syncAdvantages')}</CardTitle>
                  <CardDescription>
                    {t('sync.syncAdvantagesDesc')}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="text-center">
                      <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Smartphone className="w-6 h-6 text-blue-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{t('sync.iphoneNativeSupport')}</h3>
                      <p className="text-sm text-gray-600">
                        {t('sync.iphoneNativeSupportDesc')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Users className="w-6 h-6 text-green-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{t('sync.multiPlatformSync')}</h3>
                      <p className="text-sm text-gray-600">
                        {t('sync.multiPlatformSyncDesc')}
                      </p>
                    </div>
                    <div className="text-center">
                      <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-3">
                        <Settings className="w-6 h-6 text-purple-600" />
                      </div>
                      <h3 className="font-semibold mb-2">{t('sync.flexibleConfig')}</h3>
                      <p className="text-sm text-gray-600">
                        {t('sync.flexibleConfigDesc')}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Settings */}
          <TabsContent value="settings">
            <div className="space-y-6">
              <UserProfileSettings 
                user={currentUser} 
                onUpdate={handleUserUpdate}
              />

              <Card>
                <CardHeader>
                  <CardTitle>{t('sync.accountSettings')}</CardTitle>
                  <CardDescription>{t('sync.accountSettingsDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-4">
                      {currentUser.avatar ? (
                        <img 
                          src={currentUser.avatar} 
                          alt={currentUser.name}
                          className="w-16 h-16 rounded-full"
                        />
                      ) : (
                        <div className="w-16 h-16 rounded-full bg-gray-300 flex items-center justify-center">
                          <User className="w-8 h-8 text-gray-600" />
                        </div>
                      )}
                      <div>
                        <h3 className="font-semibold">{currentUser.name}</h3>
                        <p className="text-sm text-gray-600">{currentUser.email}</p>
                        {currentUser.location && (
                          <p className="text-sm text-gray-500">📍 {currentUser.location}</p>
                        )}
                      </div>
                    </div>
                    
                    <div className="pt-4 border-t">
                      <h4 className="font-medium mb-2">{t('sync.quickActions')}</h4>
                      <div className="flex space-x-2">
                        <Button variant="outline" onClick={handleLogout}>
                          <LogOut className="w-4 h-4 mr-2" />
                          {t('dashboard.logout')}
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>{t('sync.aboutApexcard')}</CardTitle>
                  <CardDescription>{t('sync.aboutApexcardDesc')}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <p className="text-sm text-gray-600">
                      {t('sync.aboutApexcardText')}
                    </p>
                    <div className="flex items-center space-x-4 text-sm text-gray-500">
                      <span>{t('sync.version')}</span>
                      <span>•</span>
                      <span>© 2024 APEXCARD</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </main>

      {/* Card View Modal */}
      {selectedCard && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-bold">{t('sync.cardDetails')}</h2>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={() => setSelectedCard(null)}
                >
                  {t('sync.close')}
                </Button>
              </div>
              <BusinessCardDisplay 
                card={selectedCard}
                isOwner={selectedCard.userId === currentUser.id}
                onEdit={() => {
                  setSelectedCard(null);
                  handleCardEdit(selectedCard);
                }}
              />
            </div>
          </div>
        </div>
      )}

      {/* Job Profile Modals */}
      <ExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onSave={handleSaveExperience}
        onDelete={handleDeleteExperience}
        experience={editingExperience ? {
          title: editingExperience.title,
          company: editingExperience.company,
          startDate: editingExperience.startDate ? new Date(editingExperience.startDate).toISOString().slice(0, 7) : '',
          endDate: editingExperience.endDate ? new Date(editingExperience.endDate).toISOString().slice(0, 7) : '',
          isCurrent: editingExperience.isCurrent,
          description: editingExperience.description
        } : undefined}
      />

      <EducationModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        onSave={handleSaveEducation}
        onDelete={handleDeleteEducation}
        education={editingEducation ? {
          institution: editingEducation.institution,
          degree: editingEducation.degree,
          field: editingEducation.field,
          startDate: editingEducation.startDate ? new Date(editingEducation.startDate).toISOString().slice(0, 7) : '',
          endDate: editingEducation.endDate ? new Date(editingEducation.endDate).toISOString().slice(0, 7) : '',
          isCurrent: editingEducation.isCurrent,
          // Temporarily exclude GPA to test
          // gpa: editingEducation.gpa,
          description: editingEducation.description
        } : undefined}
      />

      <CertificationModal
        isOpen={isCertificationModalOpen}
        onClose={() => setIsCertificationModalOpen(false)}
        onSave={handleSaveCertification}
        onDelete={handleDeleteCertification}
        certification={editingCertification ? {
          name: editingCertification.name,
          issuer: editingCertification.issuer,
          issueDate: editingCertification.issueDate ? new Date(editingCertification.issueDate).toISOString().slice(0, 7) : '',
          expiryDate: editingCertification.expiryDate ? new Date(editingCertification.expiryDate).toISOString().slice(0, 7) : '',
          credentialNumber: editingCertification.credentialNumber,
          description: editingCertification.description
        } : undefined}
      />

      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSave={handleSaveSkill}
        onDelete={handleDeleteSkill}
        skill={editingSkill ? {
          name: editingSkill.name,
          level: editingSkill.level,
          yearsExperience: editingSkill.yearsExperience
        } : undefined}
        isLanguage={false}
      />

      <SkillModal
        isOpen={isLanguageModalOpen}
        onClose={() => setIsLanguageModalOpen(false)}
        onSave={handleSaveLanguage}
        onDelete={handleDeleteLanguage}
        skill={editingLanguage ? {
          name: editingLanguage.name,
          level: editingLanguage.level
        } : undefined}
        isLanguage={true}
      />
    </div>
  );
}