'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Settings, Save, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface SkillData {
  name: string;
  level: string;
  yearsExperience?: number;
}

interface SkillModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: SkillData) => void;
  onDelete?: () => void;
  skill?: SkillData;
  isLanguage?: boolean;
}

export default function SkillModal({ isOpen, onClose, onSave, onDelete, skill, isLanguage = false }: SkillModalProps) {
  const { t } = useLanguage();
  
  const skillLevels = [
    { value: 'Beginner', label: t('modal.beginner') },
    { value: 'Intermediate', label: t('modal.intermediate') },
    { value: 'Advanced', label: t('modal.advanced') },
    { value: 'Expert', label: t('modal.expert') }
  ];

  const languageLevels = [
    { value: 'Beginner', label: t('modal.beginnerLang') },
    { value: 'Intermediate', label: t('modal.intermediateLang') },
    { value: 'Advanced', label: t('modal.advancedLang') },
    { value: 'Expert', label: t('modal.expertLang') }
  ];

  const commonLanguages = [
    'English', 'Spanish', 'French', 'German', 'Chinese', 'Japanese', 'Korean', 
    'Italian', 'Portuguese', 'Russian', 'Arabic', 'Hindi', 'Dutch', 'Swedish',
    'Norwegian', 'Danish', 'Finnish', 'Polish', 'Turkish', 'Greek', 'Hebrew'
  ];
  
  const [formData, setFormData] = useState<SkillData>({
    name: skill?.name || '',
    level: skill?.level || 'Intermediate',
    yearsExperience: skill?.yearsExperience || (isLanguage ? undefined : 0)
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  const levels = isLanguage ? languageLevels : skillLevels;
  const title = isLanguage ? (skill ? t('modal.editLanguage') : t('modal.addLanguage')) : (skill ? t('modal.editSkill') : t('modal.addSkill'));
  const namePlaceholder = isLanguage ? t('modal.orTypeLanguage') : t('modal.skillNamePlaceholder');
  const nameLabel = isLanguage ? t('modal.language') : t('modal.skillName');

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{nameLabel}</Label>
              {isLanguage ? (
                <>
                  <Select value={formData.name} onValueChange={(value) => setFormData({ ...formData, name: value })}>
                    <SelectTrigger>
                      <SelectValue placeholder={t('modal.selectLanguage')} />
                    </SelectTrigger>
                    <SelectContent>
                      {commonLanguages.map((language) => (
                        <SelectItem key={language} value={language}>
                          {language}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder={t('modal.orTypeLanguage')}
                    className="mt-2"
                    required
                  />
                </>
              ) : (
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder={namePlaceholder}
                  required
                />
              )}
            </div>

            <div>
              <Label htmlFor="level">{t('modal.proficiencyLevel')}</Label>
              <Select value={formData.level} onValueChange={(value) => setFormData({ ...formData, level: value })}>
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

            {!isLanguage && (
              <div>
                <Label htmlFor="yearsExperience">{t('modal.yearsOfExperience')}</Label>
                <Input
                  id="yearsExperience"
                  type="number"
                  min="0"
                  max="50"
                  value={formData.yearsExperience || ''}
                  onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value ? parseInt(e.target.value) : undefined })}
                  placeholder={t('modal.yearsPlaceholder')}
                />
              </div>
            )}

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                {t('modal.cancel')}
              </Button>
              {skill && onDelete && (
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