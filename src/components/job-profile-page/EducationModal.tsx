'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { GraduationCap, Save, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EducationData {
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  // Temporarily exclude GPA to test
  // gpa: number | null;
  description: string;
}

interface EducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: EducationData) => void;
  onDelete?: () => void;
  education?: EducationData;
}

export default function EducationModal({ isOpen, onClose, onSave, onDelete, education }: EducationModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<EducationData>({
    institution: education?.institution || '',
    degree: education?.degree || '',
    field: education?.field || '',
    startDate: education?.startDate || '',
    endDate: education?.endDate || '',
    isCurrent: education?.isCurrent || false,
    // Temporarily exclude GPA to test
    // gpa: education?.gpa || null,
    description: education?.description || ''
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {education ? t('modal.editEducation') : t('modal.addEducation')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="institution">{t('modal.institution')}</Label>
              <Input
                id="institution"
                value={formData.institution}
                onChange={(e) => setFormData({ ...formData, institution: e.target.value })}
                placeholder={t('modal.institutionPlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="degree">{t('modal.degree')}</Label>
              <Input
                id="degree"
                value={formData.degree}
                onChange={(e) => setFormData({ ...formData, degree: e.target.value })}
                placeholder={t('modal.degreePlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="field">{t('modal.fieldOfStudy')}</Label>
              <Input
                id="field"
                value={formData.field}
                onChange={(e) => setFormData({ ...formData, field: e.target.value })}
                placeholder={t('modal.fieldPlaceholder')}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="startDate">{t('modal.startDate')}</Label>
                <Input
                  id="startDate"
                  type="month"
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="endDate">{t('modal.endDate')}</Label>
                <Input
                  id="endDate"
                  type="month"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  disabled={formData.isCurrent}
                />
              </div>
            </div>

            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="isCurrent"
                checked={formData.isCurrent}
                onChange={(e) => setFormData({ 
                  ...formData, 
                  isCurrent: e.target.checked,
                  endDate: e.target.checked ? '' : formData.endDate
                })}
                className="rounded"
              />
              <Label htmlFor="isCurrent">{t('modal.currentlyStudying')}</Label>
            </div>

            <div>
              <Label htmlFor="description">{t('modal.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('modal.educationPlaceholder')}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                {t('modal.cancel')}
              </Button>
              {education && onDelete && (
                <Button type="button" variant="destructive" onClick={onDelete}>
                  {t('modal.delete')}
                </Button>
              )}
              <Button type="submit">
                <Save className="h-4 w-4 mr-2" />
                {t('modal.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}