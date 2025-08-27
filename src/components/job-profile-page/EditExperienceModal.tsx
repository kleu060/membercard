'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Experience {
  id?: string;
  title: string;
  company: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  description: string;
}

interface EditExperienceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (experience: Experience) => void;
  onDelete?: () => void;
  experience?: Experience;
  isEditing?: boolean;
}

export default function EditExperienceModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  experience,
  isEditing = false
}: EditExperienceModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Experience>({
    title: '',
    company: '',
    startDate: '',
    endDate: '',
    isCurrent: false,
    description: ''
  });

  const [isLoading, setIsLoading] = useState(false);

  // Set initial form data when modal opens
  useEffect(() => {
    if (isOpen && experience) {
      setFormData({
        title: experience.title || '',
        company: experience.company || '',
        startDate: experience.startDate ? experience.startDate.substring(0, 7) : '',
        endDate: experience.endDate ? experience.endDate.substring(0, 7) : '',
        isCurrent: experience.isCurrent || false,
        description: experience.description || ''
      });
    } else if (isOpen && !experience) {
      setFormData({
        title: '',
        company: '',
        startDate: '',
        endDate: '',
        isCurrent: false,
        description: ''
      });
    }
  }, [isOpen, experience]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      toast.success(isEditing ? t('modal.experienceUpdated') : t('modal.experienceAdded'));
      onClose();
    } catch (error) {
      console.error('Error saving experience:', error);
      toast.error(t('modal.failedToSave'));
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (onDelete) {
      setIsLoading(true);
      try {
        await onDelete();
        toast.success(t('modal.experienceDeleted'));
        onClose();
      } catch (error) {
        console.error('Error deleting experience:', error);
        toast.error(t('modal.failedToDelete'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            {isEditing ? t('modal.editExperience') : t('modal.addExperience')}
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
              <Checkbox
                id="isCurrent"
                checked={formData.isCurrent}
                onCheckedChange={(checked) => {
                  setFormData({ 
                    ...formData, 
                    isCurrent: checked as boolean,
                    endDate: checked as boolean ? '' : formData.endDate
                  });
                }}
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
                rows={4}
              />
            </div>

            <div className="flex justify-between pt-4">
              <div className="flex gap-2">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isLoading}
                >
                  <X className="h-4 w-4 mr-2" />
                  {t('modal.cancel')}
                </Button>
                {isEditing && onDelete && (
                  <Button
                    type="button"
                    variant="destructive"
                    onClick={handleDelete}
                    disabled={isLoading}
                  >
                    <Trash2 className="h-4 w-4 mr-2" />
                    {t('modal.delete')}
                  </Button>
                )}
              </div>
              <Button
                type="submit"
                disabled={isLoading}
              >
                <Save className="h-4 w-4 mr-2" />
                {isLoading ? t('modal.saving') : t('modal.save')}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}

