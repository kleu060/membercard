'use client';

import { Button } from '@/components/ui/button';

interface SimpleCardTemplateProps {
  name: string;
  position: string;
  company: string;
  companyTagline: string;
  description: string;
  theme?: 'tech' | 'finance' | 'healthcare';
  onCall?: () => void;
  onMessage?: () => void;
}

export default function SimpleCardTemplate({
  name,
  position,
  company,
  companyTagline,
  description,
  theme = 'tech',
  onCall,
  onMessage
}: SimpleCardTemplateProps) {
  const getThemeBackground = () => {
    switch (theme) {
      case 'finance':
        return 'bg-[#f0f8ff]';
      case 'healthcare':
        return 'bg-[#f9f9f9]';
      case 'tech':
      default:
        return 'bg-[#e6f7ff]';
    }
  };

  return (
    <div 
      className={`card ${theme} max-w-[350px] p-5 mx-auto my-5 rounded-[10px] font-['Segoe_UI'] shadow-[0_4px_8px_rgba(0,0,0,0.1)] text-[#333] ${getThemeBackground()}`}
    >
      <h2 className="mb-1 text-[24px]">{name}</h2>
      <p className="text-[14px]">{position}</p>
      <h3 className="mt-[10px] text-[18px] text-[#555]">{company}</h3>
      <p className="text-[14px]">{companyTagline}</p>
      <p className="text-[14px] leading-[1.6]">{description}</p>
      
      <div className="flex flex-wrap gap-2 mt-[10px]">
        {onCall && (
          <button
            onClick={onCall}
            className="m-[10px_5px_0_0] p-[8px_12px] border-none rounded-[5px] cursor-pointer bg-[#0078d4] text-white hover:bg-[#005a9e] transition-colors"
          >
            撥打電話
          </button>
        )}
        {onMessage && (
          <button
            onClick={onMessage}
            className="m-[10px_5px_0_0] p-[8px_12px] border-none rounded-[5px] cursor-pointer bg-[#e0e0e0] text-[#333] hover:bg-[#d0d0d0] transition-colors"
          >
            傳送訊息
          </button>
        )}
      </div>
    </div>
  );
}