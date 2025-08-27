'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Briefcase, 
  Plus, 
  Edit, 
  GraduationCap, 
  Award,
  Settings,
  Upload
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface JobProfileProps {
  user: any;
}

export default function JobProfile({ user }: JobProfileProps) {
  const [jobProfile, setJobProfile] = useState<any>(null);
  const { t } = useLanguage();

  useEffect(() => {
    fetchJobProfile();
  }, []);

  const fetchJobProfile = async () => {
    try {
      const response = await fetch('/api/user/job-profile');
      const data = await response.json();
      
      if (response.ok) {
        setJobProfile(data.jobProfile);
      }
    } catch (error) {
      console.error('Failed to fetch job profile:', error);
    }
  };

  const handleAddSection = (sectionType: string) => {
    // Navigate to the full job profile page for adding sections
    window.location.href = '/job-profile';
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <a href="/" className="flex items-center space-x-4 hover:opacity-80 transition-opacity">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <Briefcase className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-bold text-gray-900">APEXCARD</h1>
              </a>
            </div>
            
            <div className="flex items-center space-x-4">
              <a href="/dashboard" className="text-sm text-gray-600 hover:text-gray-900">
                {t('dashboard.backToDashboard')}
              </a>
              <div className="flex items-center space-x-2">
                {user.avatar ? (
                  <img 
                    src={user.avatar} 
                    alt={user.name}
                    className="w-8 h-8 rounded-full"
                  />
                ) : (
                  <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                )}
                <span className="text-sm font-medium text-gray-700">{user.name}</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">{t('jobProfile.title')}</h2>
          </div>
          
          {/* Personal Summary */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {t('jobProfile.personalSummary')}
                </span>
                <Button variant="ghost" size="sm">
                  <Edit className="h-4 w-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                placeholder={t('jobProfile.summaryPlaceholder')}
                className="min-h-[100px]"
                value={jobProfile?.summary || ''}
                onChange={(e) => {
                  if (jobProfile) {
                    setJobProfile({ ...jobProfile, summary: e.target.value });
                  }
                }}
              />
            </CardContent>
          </Card>
          
          {/* Career History */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Briefcase className="w-5 h-5" />
                  {t('jobProfile.careerHistory')}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleAddSection('career history')}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('jobProfile.addExperience')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobProfile?.careerHistory?.slice(0, 2).map((history: any) => (
                  <div key={history.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{history.title}</h3>
                      <Badge variant={history.isCurrent ? "default" : "secondary"}>
                        {history.isCurrent ? t('jobProfile.current') : t('jobProfile.past')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{history.company}</p>
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(history.startDate).toLocaleDateString()} - {history.endDate ? new Date(history.endDate).toLocaleDateString() : t('jobProfile.present')}
                    </p>
                    {history.description && (
                      <p className="text-sm text-muted-foreground">{history.description}</p>
                    )}
                  </div>
                ))}
                {(!jobProfile?.careerHistory || jobProfile.careerHistory.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    {t('jobProfile.noCareerHistory')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Education */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <GraduationCap className="w-5 h-5" />
                  {t('jobProfile.education')}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleAddSection('education')}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('jobProfile.addEducation')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobProfile?.education?.slice(0, 1).map((edu: any) => (
                  <div key={edu.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{edu.degree}</h3>
                      <Badge variant={edu.isCurrent ? "default" : "secondary"}>
                        {edu.isCurrent ? t('jobProfile.current') : t('jobProfile.completed')}
                      </Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">{edu.institution}</p>
                    {edu.field && (
                      <p className="text-sm text-muted-foreground mb-2">{edu.field}</p>
                    )}
                    <p className="text-sm text-muted-foreground mb-2">
                      {new Date(edu.startDate).toLocaleDateString()} - {edu.endDate ? new Date(edu.endDate).toLocaleDateString() : t('jobProfile.present')}
                    </p>
                    {edu.gpa && (
                      <p className="text-sm text-muted-foreground">GPA: {edu.gpa}</p>
                    )}
                    {edu.description && (
                      <p className="text-sm text-muted-foreground">{edu.description}</p>
                    )}
                  </div>
                ))}
                {(!jobProfile?.education || jobProfile.education.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    {t('jobProfile.noEducation')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Certifications */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Award className="w-5 h-5" />
                  {t('jobProfile.certifications')}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleAddSection('certification')}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('jobProfile.addCertification')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobProfile?.certifications?.slice(0, 1).map((cert: any) => (
                  <div key={cert.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{cert.name}</h3>
                      <Badge variant="secondary">
                        {cert.issuer}
                      </Badge>
                    </div>
                    {cert.issueDate && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('jobProfile.issued')}: {new Date(cert.issueDate).toLocaleDateString()}
                      </p>
                    )}
                    {cert.expiryDate && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('jobProfile.expires')}: {new Date(cert.expiryDate).toLocaleDateString()}
                      </p>
                    )}
                    {cert.credentialNumber && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('jobProfile.credentialNumber')}: {cert.credentialNumber}
                      </p>
                    )}
                    {cert.description && (
                      <p className="text-sm text-muted-foreground">{cert.description}</p>
                    )}
                  </div>
                ))}
                {(!jobProfile?.certifications || jobProfile.certifications.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    {t('jobProfile.noCertifications')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Skills */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span className="flex items-center gap-2">
                  <Settings className="w-5 h-5" />
                  {t('jobProfile.skills')}
                </span>
                <Button variant="outline" size="sm" onClick={() => handleAddSection('skills')}>
                  <Plus className="h-4 w-4 mr-2" />
                  {t('jobProfile.addSkills')}
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {jobProfile?.skills?.slice(0, 3).map((skill: any) => (
                  <div key={skill.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="font-semibold">{skill.name}</h3>
                      <Badge variant="secondary">
                        {skill.level || t('jobProfile.intermediate')}
                      </Badge>
                    </div>
                    {skill.yearsExperience && (
                      <p className="text-sm text-muted-foreground mb-2">
                        {t('jobProfile.experience')}: {skill.yearsExperience} {t('jobProfile.years')}
                      </p>
                    )}
                  </div>
                ))}
                {(!jobProfile?.skills || jobProfile.skills.length === 0) && (
                  <p className="text-muted-foreground text-center py-4">
                    {t('jobProfile.noSkills')}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}