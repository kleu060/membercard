'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar, Save, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface ExperienceData {
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

interface ExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExperienceData) => void;
  onDelete?: () => void;
  experience?: ExperienceData;
}

export default function ExperienceModal({ isOpen, onClose, onSave, onDelete, experience }: ExperienceModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<ExperienceData>({
    title: experience?.title || '',
    company: experience?.company || '',
    startDate: experience?.startDate || '',
    endDate: experience?.endDate || '',
    isCurrent: experience?.isCurrent || false,
    description: experience?.description || ''
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
            <Calendar className="h-5 w-5" />
            {experience ? t('modal.editExperience') : t('modal.addExperience')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="title">{t('modal.jobTitle')}</Label>
              <Input
                id="title"
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder={t('modal.jobTitlePlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="company">{t('modal.companyName')}</Label>
              <Input
                id="company"
                value={formData.company}
                onChange={(e) => setFormData({ ...formData, company: e.target.value })}
                placeholder={t('modal.companyNamePlaceholder')}
                required
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
              <Label htmlFor="isCurrent">{t('modal.stillInRole')}</Label>
            </div>

            <div>
              <Label htmlFor="description">{t('modal.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('modal.descriptionPlaceholder')}
                rows={3}
              />
            </div>

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                {t('modal.cancel')}
              </Button>
              {experience && onDelete && (
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