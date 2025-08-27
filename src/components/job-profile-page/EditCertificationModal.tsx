'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Award, Save, X, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { useLanguage } from '@/contexts/LanguageContext';

interface Certification {
  id?: string;
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialNumber: string;
  description: string;
}

interface EditCertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (certification: Certification) => void;
  onDelete?: () => void;
  certification?: Certification;
  isEditing?: boolean;
}

export default function EditCertificationModal({
  isOpen,
  onClose,
  onSave,
  onDelete,
  certification,
  isEditing = false
}: EditCertificationModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<Certification>({
    name: certification?.name || '',
    issuer: certification?.issuer || '',
    issueDate: certification?.issueDate || '',
    expiryDate: certification?.expiryDate || '',
    credentialNumber: certification?.credentialNumber || '',
    description: certification?.description || ''
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
      console.error('Error saving certification:', error);
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
        console.error('Error deleting certification:', error);
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
            <Award className="h-5 w-5" />
            {isEditing ? t('modal.editCertification') : t('modal.addCertification')}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <Label htmlFor="name">{t('modal.certificationName')}</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder={t('modal.certificationNamePlaceholder')}
                required
              />
            </div>

            <div>
              <Label htmlFor="issuer">{t('modal.issuingOrganization')}</Label>
              <Input
                id="issuer"
                value={formData.issuer}
                onChange={(e) => setFormData({ ...formData, issuer: e.target.value })}
                placeholder={t('modal.issuerPlaceholder')}
                required
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="issueDate">{t('modal.issueDate')}</Label>
                <Input
                  id="issueDate"
                  type="month"
                  value={formData.issueDate}
                  onChange={(e) => setFormData({ ...formData, issueDate: e.target.value })}
                  required
                />
              </div>
              <div>
                <Label htmlFor="expiryDate">{t('modal.expiryDate')}</Label>
                <Input
                  id="expiryDate"
                  type="month"
                  value={formData.expiryDate}
                  onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="credentialNumber">{t('modal.credentialNumber')}</Label>
              <Input
                id="credentialNumber"
                value={formData.credentialNumber}
                onChange={(e) => setFormData({ ...formData, credentialNumber: e.target.value })}
                placeholder={t('modal.credentialNumberPlaceholder')}
              />
            </div>

            <div>
              <Label htmlFor="description">{t('modal.description')}</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder={t('modal.certificationPlaceholder')}
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