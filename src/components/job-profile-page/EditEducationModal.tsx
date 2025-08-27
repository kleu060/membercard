'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { GraduationCap, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Education {
  id?: string;
  institution: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  isCurrent: boolean;
  gpa: number;
  description: string;
}

interface EditEducationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (education: Education) => void;
  onDelete?: () => void;
  education?: Education;
  isEditing?: boolean;
}

export default function EditEducationModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  education,
  isEditing = false
}: EditEducationModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Education>({
    institution: education?.institution || '',
    degree: education?.degree || '',
    field: education?.field || '',
    startDate: education?.startDate || '',
    endDate: education?.endDate || '',
    isCurrent: education?.isCurrent || false,
    gpa: education?.gpa || 0,
    description: education?.description || ''
  });

  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      await onSave(formData);
      toast.success(isEditing ? t('modal.experienceUpdated') : t('modal.experienceAdded'));
      onClose();
    } catch (error) {
      console.error('Error saving education:', error);
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
        console.error('Error deleting education:', error);
        toast.error(t('modal.failedToDelete'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-lg max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            {isEditing ? t('modal.editEducation') : t('modal.addEducation')}
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
              <Label htmlFor="isCurrent">{t('modal.currentlyStudying')}</Label>
            </div>

            <div>
              <Label htmlFor="gpa">{t('jobProfile.gpa')} (optional)</Label>
              <Input
                id="gpa"
                type="number"
                step="0.01"
                min="0"
                max="4"
                value={formData.gpa}
                onChange={(e) => setFormData({ ...formData, gpa: parseFloat(e.target.value) || 0 })}
                placeholder="e.g. 3.8"
              />
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

