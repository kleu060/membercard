'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { 
  Mail, 
  Copy, 
  Download, 
  Eye, 
  FileText, 
  Code,
  CheckCircle,
  ExternalLink
} from 'lucide-react';
import { useLanguage } from '@/contexts/LanguageContext';

interface EmailSignatureGeneratorProps {
  cards: any[];
  onGenerate?: (signature: any) => void;
}

export default function EmailSignatureGenerator({ cards, onGenerate }: EmailSignatureGeneratorProps) {
  const { t } = useLanguage();
  const [selectedCard, setSelectedCard] = useState('');
  const [selectedTemplate, setSelectedTemplate] = useState('modern');
  const [htmlSignature, setHtmlSignature] = useState('');
  const [plainTextSignature, setPlainTextSignature] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState('');

  const templates = [
    {
      id: 'modern',
      name: t('signature.modernStyle'),
      description: t('signature.modernStyleDesc'),
      preview: 'modern'
    },
    {
      id: 'minimal',
      name: t('signature.minimalStyle'),
      description: t('signature.minimalStyleDesc'),
      preview: 'minimal'
    },
    {
      id: 'professional',
      name: t('signature.professionalStyle'),
      description: t('signature.professionalStyleDesc'),
      preview: 'professional'
    },
    {
      id: 'corporate',
      name: t('signature.corporateStyle'),
      description: t('signature.corporateStyleDesc'),
      preview: 'corporate'
    }
  ];

  const handleGenerate = async () => {
    if (!selectedCard) {
      setError(t('signature.selectCardError'));
      return;
    }

    setIsGenerating(true);
    setError('');

    try {
      const response = await fetch('/api/signature', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          cardId: selectedCard,
          template: selectedTemplate
        })
      });

      const data = await response.json();

      if (response.ok) {
        setHtmlSignature(data.htmlSignature);
        setPlainTextSignature(data.plainTextSignature);
        onGenerate?.(data);
      } else {
        setError(data.error || t('signature.generateError'));
      }
    } catch (error) {
      setError(t('signature.networkError'));
    } finally {
      setIsGenerating(false);
    }
  };

  const copyToClipboard = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (error) {
      console.error(t('signature.copyError'));
    }
  };

  const downloadHTML = () => {
    const blob = new Blob([htmlSignature], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-signature.html';
    a.click();
    URL.revokeObjectURL(url);
  };

  const downloadText = () => {
    const blob = new Blob([plainTextSignature], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'email-signature.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const emailClients = [
    {
      name: 'Gmail',
      instructions: [
        t('signature.gmailStep1'),
        t('signature.gmailStep2'),
        t('signature.gmailStep3'),
        t('signature.gmailStep4'),
        t('signature.gmailStep5')
      ]
    },
    {
      name: 'Outlook',
      instructions: [
        t('signature.outlookStep1'),
        t('signature.outlookStep2'),
        t('signature.outlookStep3'),
        t('signature.outlookStep4'),
        t('signature.outlookStep5')
      ]
    },
    {
      name: 'Apple Mail',
      instructions: [
        t('signature.appleMailStep1'),
        t('signature.appleMailStep2'),
        t('signature.appleMailStep3'),
        t('signature.appleMailStep4'),
        t('signature.appleMailStep5')
      ]
    },
    {
      name: 'Yahoo Mail',
      instructions: [
        t('signature.yahooMailStep1'),
        t('signature.yahooMailStep2'),
        t('signature.yahooMailStep3'),
        t('signature.yahooMailStep4'),
        t('signature.yahooMailStep5')
      ]
    },
    {
      name: 'Thunderbird',
      instructions: [
        t('signature.thunderbirdStep1'),
        t('signature.thunderbirdStep2'),
        t('signature.thunderbirdStep3'),
        t('signature.thunderbirdStep4'),
        t('signature.thunderbirdStep5')
      ]
    }
  ];

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Mail className="w-5 h-5" />
            {t('signature.title')}
          </CardTitle>
          <CardDescription>
            {t('signature.description')}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Selection */}
            <div className="grid md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">{t('signature.selectCard')}</label>
                <Select value={selectedCard} onValueChange={setSelectedCard}>
                  <SelectTrigger>
                    <SelectValue placeholder={t('signature.selectCardPlaceholder')} />
                  </SelectTrigger>
                  <SelectContent>
                    {cards.map((card) => (
                      <SelectItem key={card.id} value={card.id}>
                        {card.name} - {card.company || t('dashboard.noCompany')}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">{t('signature.selectTemplate')}</label>
                <Select value={selectedTemplate} onValueChange={setSelectedTemplate}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {templates.map((template) => (
                      <SelectItem key={template.id} value={template.id}>
                        {template.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {error && (
              <Alert variant="destructive">
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            )}

            <Button onClick={handleGenerate} disabled={isGenerating || !selectedCard}>
              {isGenerating ? t('signature.generating') : t('signature.generate')}
            </Button>

            {/* Preview */}
            {(htmlSignature || plainTextSignature) && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold">{t('signature.preview')}</h3>
                
                <Tabs defaultValue="html" className="w-full">
                  <TabsList className="grid w-full grid-cols-2">
                    <TabsTrigger value="html">{t('signature.htmlSignature')}</TabsTrigger>
                    <TabsTrigger value="text">{t('signature.textSignature')}</TabsTrigger>
                  </TabsList>

                  <TabsContent value="html" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-white">
                      <div 
                        dangerouslySetInnerHTML={{ __html: htmlSignature }}
                        className="signature-preview"
                      />
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => copyToClipboard(htmlSignature)}
                        className="flex items-center gap-2"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? t('signature.copied') : t('signature.copyHtml')}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={downloadHTML}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {t('signature.downloadHtml')}
                      </Button>
                    </div>

                    <div className="mt-4">
                      <h4 className="font-medium mb-2 flex items-center gap-2">
                        <Code className="w-4 h-4" />
                        {t('signature.htmlCode')}
                      </h4>
                      <div className="bg-gray-100 p-4 rounded-lg overflow-x-auto">
                        <pre className="text-sm text-gray-800 whitespace-pre-wrap">
                          {htmlSignature}
                        </pre>
                      </div>
                    </div>
                  </TabsContent>

                  <TabsContent value="text" className="space-y-4">
                    <div className="border rounded-lg p-4 bg-gray-50">
                      <pre className="text-sm text-gray-800 whitespace-pre-wrap font-sans">
                        {plainTextSignature}
                      </pre>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button 
                        variant="outline" 
                        onClick={() => copyToClipboard(plainTextSignature)}
                        className="flex items-center gap-2"
                      >
                        {copied ? <CheckCircle className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        {copied ? t('signature.copied') : t('signature.copyText')}
                      </Button>
                      <Button 
                        variant="outline" 
                        onClick={downloadText}
                        className="flex items-center gap-2"
                      >
                        <Download className="w-4 h-4" />
                        {t('signature.downloadText')}
                      </Button>
                    </div>
                  </TabsContent>
                </Tabs>
              </div>
            )}

            {/* Email Client Instructions */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">{t('signature.emailClientGuide')}</h3>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
                {emailClients.map((client, index) => (
                  <Card key={index}>
                    <CardHeader>
                      <CardTitle className="text-lg">{client.name}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ol className="space-y-2 text-sm">
                        {client.instructions.map((instruction, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <Badge variant="outline" className="mt-0.5 text-xs">
                              {i + 1}
                            </Badge>
                            <span>{instruction}</span>
                          </li>
                        ))}
                      </ol>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}