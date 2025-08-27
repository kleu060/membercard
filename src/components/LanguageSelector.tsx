'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Globe } from 'lucide-react';

type Language = 'zh-TW' | 'zh-CN' | 'en';

interface LanguageSelectorProps {
  onLanguageChange: (lang: Language) => void;
  currentLanguage: Language;
}

export default function LanguageSelector({ 
  onLanguageChange, 
  currentLanguage 
}: LanguageSelectorProps) {
  const languages = [
    { code: 'zh-TW' as Language, name: '繁體中文', flag: '🇹🇼' },
    { code: 'zh-CN' as Language, name: '简體中文', flag: '🇨🇳' },
    { code: 'en' as Language, name: 'English', flag: '🇺🇸' },
  ];

  const currentLang = languages.find(lang => lang.code === currentLanguage);

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="h-9 px-2">
          <Globe className="h-4 w-4 mr-1" />
          <span className="text-sm">
            {currentLang?.flag} {currentLang?.name}
          </span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {languages.map((language) => (
          <DropdownMenuItem
            key={language.code}
            onClick={() => onLanguageChange(language.code)}
            className={currentLanguage === language.code ? 'bg-blue-50' : ''}
          >
            <span className="mr-2">{language.flag}</span>
            {language.name}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}