'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { Calendar, MapPin, Mail, Phone, Briefcase, GraduationCap, Award, Settings, Save, X, Plus, User as UserIcon, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { User } from '@/types/user';
import { toast } from 'sonner';
import EditExperienceModal from '@/components/job-profile-page/EditExperienceModal';
import EducationModal from '@/components/job-profile-page/EducationModal';
import CertificationModal from '@/components/job-profile-page/CertificationModal';
import SkillModal from '@/components/job-profile-page/SkillModal';

interface JobProfile {
  id: string;
  userId: string;
  summary: string;
  resumeUrl: string;
  createdAt: string;
  updatedAt: string;
  careerHistory: CareerHistory[];
  education: Education[];
  certifications: Certification[];
  skills: Skill[];
  savedSearches: SavedSearch[];
  savedJobs: SavedJob[];
  applications: Application[];
}

interface CareerHistory {
  id: string;
  profileId: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Education {
  id: string;
  profileId: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa: number;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Certification {
  id: string;
  profileId: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialNumber: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

interface Skill {
  id: string;
  profileId: string;
  name: string;
  level: string;
  yearsExperience: number;
  createdAt: string;
  updatedAt: string;
}

interface SavedSearch {
  id: string;
  profileId: string;
  name: string;
  keywords: string;
  industry: string;
  location: string;
  jobType: string;
  remoteOption: string;
  salaryRange: string;
  createdAt: string;
  updatedAt: string;
}

interface SavedJob {
  id: string;
  profileId: string;
  jobId: string;
  notes: string;
  createdAt: string;
  updatedAt: string;
}

interface Application {
  id: string;
  profileId: string;
  jobId: string;
  status: string;
  notes: string;
  appliedAt: string;
  updatedAt: string;
}

export default function JobProfilePage() {
  const { user, loading: authLoading, error } = useAuth();
  const [jobProfile, setJobProfile] = useState<JobProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');

  // Modal states
  const [isExperienceModalOpen, setIsExperienceModalOpen] = useState(false);
  const [isEducationModalOpen, setIsEducationModalOpen] = useState(false);
  const [isCertificationModalOpen, setIsCertificationModalOpen] = useState(false);
  const [isSkillModalOpen, setIsSkillModalOpen] = useState(false);
  const [editingExperience, setEditingExperience] = useState<CareerHistory | null>(null);
  const [editingEducation, setEditingEducation] = useState<Education | null>(null);
  const [editingCertification, setEditingCertification] = useState<Certification | null>(null);
  const [editingSkill, setEditingSkill] = useState<Skill | null>(null);

  useEffect(() => {
    if (user && !authLoading) {
      fetchJobProfile();
    } else if (!authLoading) {
      setLoading(false);
    }
  }, [user, authLoading]);

  const fetchJobProfile = async () => {
    try {
      const response = await fetch('/api/user/job-profile');
      if (response.ok) {
        const data = await response.json();
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
          setJobProfile(data.jobProfile);
        }
      }
    } catch (error) {
      console.error('Error fetching job profile:', error);
      toast.error('Failed to load job profile');
    } finally {
      setLoading(false);
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
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error('Error updating job profile:', error);
      toast.error('Failed to update profile');
    }
  };

  // Experience functions
  const handleSaveExperience = async (experience: any) => {
    try {
      const url = editingExperience 
        ? `/api/user/job-profile/career-history/${editingExperience.id}`
        : '/api/user/job-profile/career-history';
      
      const method = editingExperience ? 'PUT' : 'POST';
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(experience),
      });

      if (response.ok) {
        await fetchJobProfile(); // Refresh the data
        setIsExperienceModalOpen(false);
        setEditingExperience(null);
      } else {
        throw new Error('Failed to save experience');
      }
    } catch (error) {
      console.error('Error saving experience:', error);
      throw error;
    }
  };

  const handleDeleteExperience = async () => {
    if (!editingExperience) return;
    
    try {
      const response = await fetch(`/api/user/job-profile/career-history/${editingExperience.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobProfile(); // Refresh the data
        setIsExperienceModalOpen(false);
        setEditingExperience(null);
      } else {
        throw new Error('Failed to delete experience');
      }
    } catch (error) {
      console.error('Error deleting experience:', error);
      throw error;
    }
  };

  const openAddExperienceModal = () => {
    setEditingExperience(null);
    setIsExperienceModalOpen(true);
  };

  const openEditExperienceModal = (experience: CareerHistory) => {
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
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(education),
      });

      if (response.ok) {
        await fetchJobProfile(); // Refresh the data
        setIsEducationModalOpen(false);
        setEditingEducation(null);
      } else {
        throw new Error('Failed to save education');
      }
    } catch (error) {
      console.error('Error saving education:', error);
      throw error;
    }
  };

  const handleDeleteEducation = async () => {
    if (!editingEducation) return;
    
    try {
      const response = await fetch(`/api/user/job-profile/education/${editingEducation.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobProfile(); // Refresh the data
        setIsEducationModalOpen(false);
        setEditingEducation(null);
      } else {
        throw new Error('Failed to delete education');
      }
    } catch (error) {
      console.error('Error deleting education:', error);
      throw error;
    }
  };

  const openAddEducationModal = () => {
    setEditingEducation(null);
    setIsEducationModalOpen(true);
  };

  const openEditEducationModal = (education: Education) => {
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
        await fetchJobProfile(); // Refresh the data
        setIsCertificationModalOpen(false);
        setEditingCertification(null);
      } else {
        throw new Error('Failed to save certification');
      }
    } catch (error) {
      console.error('Error saving certification:', error);
      throw error;
    }
  };

  const handleDeleteCertification = async () => {
    if (!editingCertification) return;
    
    try {
      const response = await fetch(`/api/user/job-profile/certifications/${editingCertification.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobProfile(); // Refresh the data
        setIsCertificationModalOpen(false);
        setEditingCertification(null);
      } else {
        throw new Error('Failed to delete certification');
      }
    } catch (error) {
      console.error('Error deleting certification:', error);
      throw error;
    }
  };

  const openAddCertificationModal = () => {
    setEditingCertification(null);
    setIsCertificationModalOpen(true);
  };

  const openEditCertificationModal = (certification: Certification) => {
    setEditingCertification(certification);
    setIsCertificationModalOpen(true);
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
        await fetchJobProfile(); // Refresh the data
        setIsSkillModalOpen(false);
        setEditingSkill(null);
      } else {
        throw new Error('Failed to save skill');
      }
    } catch (error) {
      console.error('Error saving skill:', error);
      throw error;
    }
  };

  const handleDeleteSkill = async () => {
    if (!editingSkill) return;
    
    try {
      const response = await fetch(`/api/user/job-profile/skills/${editingSkill.id}`, {
        method: 'DELETE',
      });

      if (response.ok) {
        await fetchJobProfile(); // Refresh the data
        setIsSkillModalOpen(false);
        setEditingSkill(null);
      } else {
        throw new Error('Failed to delete skill');
      }
    } catch (error) {
      console.error('Error deleting skill:', error);
      throw error;
    }
  };

  const openAddSkillModal = () => {
    setEditingSkill(null);
    setIsSkillModalOpen(true);
  };

  const openEditSkillModal = (skill: Skill) => {
    setEditingSkill(skill);
    setIsSkillModalOpen(true);
  };

  if (authLoading || loading) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
        </div>
      </div>
    );
  }

  if (!user || error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">需要身份验证</h2>
            <p className="text-muted-foreground mb-4">请登录以访问您的求职档案</p>
            <Button onClick={() => window.location.href = '/auth/signin'}>登录</Button>
          </div>
        </div>
      </div>
    );
  }

  if (!jobProfile) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <h2 className="text-2xl font-bold mb-4">档案未找到</h2>
            <p className="text-muted-foreground mb-4">请创建求职档案以开始使用</p>
            <Button onClick={() => window.location.reload()}>刷新</Button>
          </div>
        </div>
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
              <Link href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">APEXCARD</h1>
              </Link>
            </div>
            
            <div className="flex items-center space-x-4">
              <Link href="/profile" className="flex items-center space-x-2 hover:opacity-80 transition-opacity">
                <UserIcon className="w-4 h-4 text-gray-600" />
                <span className="text-sm text-gray-600">个人资料</span>
              </Link>
              <Button 
                variant="outline" 
                size="sm"
                onClick={() => {
                  // Clear auth state and redirect to home
                  fetch('/api/auth/logout', { method: 'POST' })
                    .then(() => {
                      window.location.href = '/';
                    })
                    .catch(() => {
                      window.location.href = '/';
                    });
                }}
              >
                <LogOut className="w-4 h-4 mr-2" />
                退出登录
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                求职档案
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center gap-2">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">{user?.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span className="text-sm">
                    创建时间: {new Date(jobProfile.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Navigation */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>导航</CardTitle>
            </CardHeader>
            <CardContent>
              <nav className="space-y-2">
                <Button
                  variant={activeTab === 'overview' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('overview')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  概览
                </Button>
                <Button
                  variant={activeTab === 'career' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('career')}
                >
                  <Briefcase className="h-4 w-4 mr-2" />
                  职业历史
                </Button>
                <Button
                  variant={activeTab === 'education' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('education')}
                >
                  <GraduationCap className="h-4 w-4 mr-2" />
                  教育背景
                </Button>
                <Button
                  variant={activeTab === 'certifications' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('certifications')}
                >
                  <Award className="h-4 w-4 mr-2" />
                  证书认证
                </Button>
                <Button
                  variant={activeTab === 'skills' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('skills')}
                >
                  <Settings className="h-4 w-4 mr-2" />
                  技能
                </Button>
                <Button
                  variant={activeTab === 'saved-searches' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('saved-searches')}
                >
                  <Save className="h-4 w-4 mr-2" />
                  保存的搜索
                </Button>
                <Button
                  variant={activeTab === 'saved-jobs' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('saved-jobs')}
                >
                  <Save className="h-4 w-4 mr-2" />
                  保存的职位
                </Button>
                <Button
                  variant={activeTab === 'applications' ? 'default' : 'ghost'}
                  className="w-full justify-start"
                  onClick={() => setActiveTab('applications')}
                >
                  <Save className="h-4 w-4 mr-2" />
                  申请记录
                </Button>
              </nav>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-8">
              <TabsTrigger value="overview">概览</TabsTrigger>
              <TabsTrigger value="career">职业</TabsTrigger>
              <TabsTrigger value="education">教育</TabsTrigger>
              <TabsTrigger value="certifications">证书</TabsTrigger>
              <TabsTrigger value="skills">技能</TabsTrigger>
              <TabsTrigger value="saved-searches">搜索</TabsTrigger>
              <TabsTrigger value="saved-jobs">职位</TabsTrigger>
              <TabsTrigger value="applications">申请</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>个人简介</CardTitle>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div>
                      <Label htmlFor="summary">简介</Label>
                      <Textarea
                        id="summary"
                        placeholder="请简要介绍自己..."
                        value={jobProfile.summary || ''}
                        onChange={(e) => {
                          setJobProfile({ ...jobProfile, summary: e.target.value });
                        }}
                        onBlur={() => updateJobProfile({ summary: jobProfile.summary })}
                      />
                    </div>
                    <div>
                      <Label htmlFor="resumeUrl">简历链接</Label>
                      <Input
                        id="resumeUrl"
                        placeholder="https://example.com/resume.pdf"
                        value={jobProfile.resumeUrl || ''}
                        onChange={(e) => {
                          setJobProfile({ ...jobProfile, resumeUrl: e.target.value });
                        }}
                        onBlur={() => updateJobProfile({ resumeUrl: jobProfile.resumeUrl })}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="career" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>职业历史</CardTitle>
                    <Button onClick={openAddExperienceModal} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      添加经历
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobProfile.careerHistory.map((history) => (
                      <div 
                        key={history.id} 
                        className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => openEditExperienceModal(history)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{history.title}</h3>
                          <Badge variant={history.isCurrent ? 'default' : 'secondary'}>
                            {history.isCurrent ? '当前' : '过往'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{history.company}</p>
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(history.startDate).toLocaleDateString()} -{' '}
                          {history.endDate ? new Date(history.endDate).toLocaleDateString() : '至今'}
                        </p>
                        {history.description && (
                          <p className="text-sm text-muted-foreground">{history.description}</p>
                        )}
                      </div>
                    ))}
                    {jobProfile.careerHistory.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>暂无工作经历</p>
                        <p className="text-sm">点击"添加经历"开始</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="education" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>教育背景</CardTitle>
                    <Button onClick={openAddEducationModal} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      添加教育
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobProfile.education.map((edu) => (
                      <div 
                        key={edu.id} 
                        className="border rounded-lg p-4 cursor-pointer hover:bg-muted/50 transition-colors"
                        onClick={() => openEditEducationModal(edu)}
                      >
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{edu.degree}</h3>
                          <Badge variant={edu.isCurrent ? 'default' : 'secondary'}>
                            {edu.isCurrent ? '在读' : '已完成'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">{edu.institution}</p>
                        {edu.field && (
                          <p className="text-sm text-muted-foreground mb-2">{edu.field}</p>
                        )}
                        <p className="text-sm text-muted-foreground mb-2">
                          {new Date(edu.startDate).toLocaleDateString()} -{' '}
                          {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : '至今'}
                        </p>
                        {edu.gpa && (
                          <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                        )}
                        {edu.description && (
                          <p className="text-sm text-muted-foreground">{edu.description}</p>
                        )}
                      </div>
                    ))}
                    {jobProfile.education.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>暂无教育背景</p>
                        <p className="text-sm">点击"添加教育"开始</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="certifications" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>证书认证</CardTitle>
                    <Button onClick={openAddCertificationModal} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      添加证书
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobProfile.certifications.map((cert) => (
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
                            颁发日期: {new Date(cert.issueDate).toLocaleDateString()}
                          </p>
                        )}
                        {cert.expiryDate && (
                          <p className="text-sm text-muted-foreground mb-2">
                            过期日期: {new Date(cert.expiryDate).toLocaleDateString()}
                          </p>
                        )}
                        {cert.credentialNumber && (
                          <p className="text-sm text-muted-foreground mb-2">
                            证书编号: {cert.credentialNumber}
                          </p>
                        )}
                        {cert.description && (
                          <p className="text-sm text-muted-foreground">{cert.description}</p>
                        )}
                      </div>
                    ))}
                    {jobProfile.certifications.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>暂无证书认证</p>
                        <p className="text-sm">点击"添加证书"开始</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="skills" className="space-y-6">
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <CardTitle>技能</CardTitle>
                    <Button onClick={openAddSkillModal} size="sm">
                      <Plus className="h-4 w-4 mr-2" />
                      添加技能
                    </Button>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobProfile.skills.map((skill) => (
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
                            工作年限: {skill.yearsExperience}
                          </p>
                        )}
                      </div>
                    ))}
                    {jobProfile.skills.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <p>暂无技能</p>
                        <p className="text-sm">点击"添加技能"开始</p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved-searches" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>保存的搜索</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobProfile.savedSearches.map((search) => (
                      <div key={search.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{search.name}</h3>
                          <Badge variant="secondary">
                            {new Date(search.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                        {search.keywords && (
                          <p className="text-sm text-muted-foreground mb-2">
                            关键词: {search.keywords}
                          </p>
                        )}
                        {search.industry && (
                          <p className="text-sm text-muted-foreground mb-2">
                            行业: {search.industry}
                          </p>
                        )}
                        {search.location && (
                          <p className="text-sm text-muted-foreground mb-2">
                            地点: {search.location}
                          </p>
                        )}
                        {search.jobType && (
                          <p className="text-sm text-muted-foreground mb-2">
                            工作类型: {search.jobType}
                          </p>
                        )}
                        {search.remoteOption && (
                          <p className="text-sm text-muted-foreground mb-2">
                            远程选项: {search.remoteOption}
                          </p>
                        )}
                        {search.salaryRange && (
                          <p className="text-sm text-muted-foreground mb-2">
                            薪资范围: {search.salaryRange}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="saved-jobs" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>保存的职位</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobProfile.savedJobs.map((job) => (
                      <div key={job.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{job.jobId}</h3>
                          <Badge variant="secondary">
                            {new Date(job.createdAt).toLocaleDateString()}
                          </Badge>
                        </div>
                        {job.notes && (
                          <p className="text-sm text-muted-foreground mb-2">
                            备注: {job.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="applications" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>申请记录</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {jobProfile.applications.map((app) => (
                      <div key={app.id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between mb-2">
                          <h3 className="font-semibold">{app.jobId}</h3>
                          <Badge variant="secondary">
                            {new Date(app.appliedAt).toLocaleDateString()}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground mb-2">
                          状态: {app.status}
                        </p>
                        {app.notes && (
                          <p className="text-sm text-muted-foreground mb-2">
                            备注: {app.notes}
                          </p>
                        )}
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>

      {/* Experience Modal */}
      <EditExperienceModal
        isOpen={isExperienceModalOpen}
        onClose={() => setIsExperienceModalOpen(false)}
        onSave={handleSaveExperience}
        onDelete={editingExperience ? handleDeleteExperience : undefined}
        experience={editingExperience ? {
          title: editingExperience.title,
          company: editingExperience.company,
          startDate: editingExperience.startDate,
          endDate: editingExperience.endDate,
          isCurrent: editingExperience.isCurrent,
          description: editingExperience.description
        } : undefined}
        isEditing={!!editingExperience}
      />

      {/* Education Modal */}
      <EducationModal
        isOpen={isEducationModalOpen}
        onClose={() => setIsEducationModalOpen(false)}
        onSave={handleSaveEducation}
        education={editingEducation ? {
          institution: editingEducation.institution,
          degree: editingEducation.degree,
          field: editingEducation.field,
          startDate: editingEducation.startDate,
          endDate: editingEducation.endDate,
          isCurrent: editingEducation.isCurrent,
          gpa: editingEducation.gpa,
          description: editingEducation.description
        } : undefined}
      />

      {/* Certification Modal */}
      <CertificationModal
        isOpen={isCertificationModalOpen}
        onClose={() => setIsCertificationModalOpen(false)}
        onSave={handleSaveCertification}
        certification={editingCertification ? {
          name: editingCertification.name,
          issuer: editingCertification.issuer,
          issueDate: editingCertification.issueDate,
          expiryDate: editingCertification.expiryDate,
          credentialNumber: editingCertification.credentialNumber,
          description: editingCertification.description
        } : undefined}
      />

      {/* Skill Modal */}
      <SkillModal
        isOpen={isSkillModalOpen}
        onClose={() => setIsSkillModalOpen(false)}
        onSave={handleSaveSkill}
        skill={editingSkill ? {
          name: editingSkill.name,
          level: editingSkill.level,
          yearsExperience: editingSkill.yearsExperience
        } : undefined}
      />
      </div>
    </div>
  );
}