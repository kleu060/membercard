'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Award, Save, X } from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface CertificationData {
  name: string;
  issuer: string;
  issueDate: string;
  expiryDate: string;
  credentialNumber: string;
  description: string;
}

interface CertificationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: CertificationData) => void;
  onDelete?: () => void;
  certification?: CertificationData;
}

export default function CertificationModal({ isOpen, onClose, onSave, onDelete, certification }: CertificationModalProps) {
  const { t } = useLanguage();
  const [formData, setFormData] = useState<CertificationData>({
    name: certification?.name || '',
    issuer: certification?.issuer || '',
    issueDate: certification?.issueDate || '',
    expiryDate: certification?.expiryDate || '',
    credentialNumber: certification?.credentialNumber || '',
    description: certification?.description || ''
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
            <Award className="h-5 w-5" />
            {certification ? t('modal.editCertification') : t('modal.addCertification')}
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

            <div className="flex justify-end gap-2 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                <X className="h-4 w-4 mr-2" />
                {t('modal.cancel')}
              </Button>
              {certification && onDelete && (
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