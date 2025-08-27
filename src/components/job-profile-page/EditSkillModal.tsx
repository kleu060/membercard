'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Settings, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Skill {
  id?: string;
  name: string;
  level: string;
  yearsExperience: number;
}

interface EditSkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (skill: Skill) => void;
  onDelete?: () => void;
  skill?: Skill;
  isEditing?: boolean;
}

const skillLevels = [
  { value: 'Beginner', label: 'Beginner' },
  { value: 'Intermediate', label: 'Intermediate' },
  { value: 'Advanced', label: 'Advanced' },
  { value: 'Expert', label: 'Expert' }
];

export default function EditSkillModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  skill,
  isEditing = false
}: EditSkillModalProps) {
  const { t } = useLanguage();
  
  const levels = [
    { value: 'Beginner', label: t('modal.beginner') },
    { value: 'Intermediate', label: t('modal.intermediate') },
    { value: 'Advanced', label: t('modal.advanced') },
    { value: 'Expert', label: t('modal.expert') }
  ];
  
  const [formData, setFormData] = useState<Skill>({
    name: skill?.name || '',
    level: skill?.level || 'Intermediate',
    yearsExperience: skill?.yearsExperience || 0
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
      console.error('Error saving skill:', error);
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
        console.error('Error deleting skill:', error);
        toast.error(t('modal.failedToDelete'));
      } finally {
        setIsLoading(false);
      }
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {isEditing ? t('modal.editSkill') : t('modal.addSkill')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('modal.skillName')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('modal.skillNamePlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="level">{t('modal.proficiencyLevel')}</Label>
              <Select
                value={formData.level}
                onValueChange={(value) => setFormData({ ...formData, level: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder={t('modal.selectProficiency')} />
                </SelectTrigger>
                <SelectContent>
                  {levels.map((level) => (
                    <SelectItem key={level.value} value={level.value}>
                      {level.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="yearsExperience">{t('modal.yearsOfExperience')}</Label>
              <Input
                id="yearsExperience"
                type="number"
                min="0"
                max="50"
                value={formData.yearsExperience}
                onChange={(e) => setFormData({ ...formData, yearsExperience: parseInt(e.target.value) || 0 })}
                placeholder={t('modal.yearsPlaceholder')}
                required
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