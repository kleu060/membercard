'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';

interface SpiderCardTemplateProps {
  name: string;
  tagline: string;
  company: string;
  phone: string;
  email: string;
  backgroundImage?: string;
  profileImage?: string;
  showAppDownload?: boolean;
  isVerified?: boolean;
  onSave?: () => void;
  onBook?: () => void;
  onSocialClick?: (platform: string) => void;
}

export default function SpiderCardTemplate({
  name,
  tagline,
  company,
  phone,
  email,
  backgroundImage = '/placeholder-background.jpg',
  profileImage = '/placeholder-avatar.jpg',
  showAppDownload = true,
  isVerified = true,
  onSave,
  onBook,
  onSocialClick
}: SpiderCardTemplateProps) {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const handleSave = () => {
    if (onSave) {
      onSave();
    } else {
      // Default action
      alert('儲存聯絡人功能將在這裡實現');
    }
  };

  const handleBook = () => {
    if (onBook) {
      onBook();
    } else {
      // Default action
      alert('線上預約功能將在這裡實現');
    }
  };

  const handleSocialClick = (platform: string) => {
    if (onSocialClick) {
      onSocialClick(platform);
    } else {
      // Default action
      alert(`${platform} 連結將在這裡實現`);
    }
  };

  // Prevent hydration mismatch by not rendering images until mounted
  if (!mounted) {
    return (
      <div className="card max-w-[400px] mx-auto bg-white rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden font-['Noto_Sans_TC']">
        {/* Header Section */}
        <div className="header relative">
          <div className="background w-full h-[180px] bg-gray-200 relative" />
          {showAppDownload && (
            <div className="app-download absolute top-[10px] right-[10px] bg-black/60 text-white px-[10px] py-[6px] rounded-[6px] text-[14px]">
              下載APP ⬇️
            </div>
          )}
        </div>

        {/* Profile Section */}
        <div className="profile text-center px-[20px] py-[20px] relative">
          <div className="avatar w-[80px] h-[80px] rounded-full object-cover mx-auto relative bg-gray-300" />
          {isVerified && (
            <div className="verified absolute top-[90px] left-[calc(50%+30px)] bg-[#007bff] text-white rounded-full p-[4px] text-[12px]">
              ✔️
            </div>
          )}
          <h1 className="mt-[10px] mb-[5px] text-[22px] font-bold">{name}</h1>
          <p className="tagline text-[#007bff] mb-0">{tagline}</p>
          <p className="company text-[14px] text-[#666]">{company}</p>
        </div>

        {/* Contact Section */}
        <div className="contact px-[20px] py-[10px] text-[14px] text-[#333]">
          <p className="mb-1">📞 {phone}</p>
          <p>📧 {email}</p>
        </div>

        {/* Social Section */}
        <div className="social flex justify-center gap-[20px] py-[10px]">
          <button 
            onClick={() => handleSocialClick('Instagram')}
            className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
          >
            <span className="text-xs">📷</span>
          </button>
          <button 
            onClick={() => handleSocialClick('Facebook')}
            className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
          >
            <span className="text-xs">📘</span>
          </button>
          <button 
            onClick={() => handleSocialClick('App')}
            className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
          >
            <span className="text-xs">📱</span>
          </button>
        </div>

        {/* Actions Section */}
        <div className="actions flex justify-around px-[20px] py-[20px]">
          <button 
            onClick={handleSave}
            className="save px-[20px] py-[10px] border-none rounded-[6px] text-[14px] cursor-pointer bg-[#007bff] text-white hover:bg-[#0056b3] transition-colors"
          >
            儲存聯絡人
          </button>
          <button 
            onClick={handleBook}
            className="book px-[20px] py-[10px] border-none rounded-[6px] text-[14px] cursor-pointer bg-[#e0e0e0] text-[#333] hover:bg-[#d0d0d0] transition-colors"
          >
            線上預約
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="card max-w-[400px] mx-auto bg-white rounded-[12px] shadow-[0_4px_12px_rgba(0,0,0,0.1)] overflow-hidden font-['Noto_Sans_TC']">
      {/* Header Section */}
      <div className="header relative">
        <div className="background w-full h-[180px] bg-gray-200 relative">
          {backgroundImage && backgroundImage !== '/placeholder-background.jpg' && (
            <img 
              src={backgroundImage} 
              alt="Modern Building" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
        {showAppDownload && (
          <div className="app-download absolute top-[10px] right-[10px] bg-black/60 text-white px-[10px] py-[6px] rounded-[6px] text-[14px]">
            下載APP ⬇️
          </div>
        )}
      </div>

      {/* Profile Section */}
      <div className="profile text-center px-[20px] py-[20px] relative">
        <div className="avatar w-[80px] h-[80px] rounded-full object-cover mx-auto relative bg-gray-300 overflow-hidden">
          {profileImage && profileImage !== '/placeholder-avatar.jpg' && (
            <img 
              src={profileImage} 
              alt="Profile" 
              className="w-full h-full object-cover"
              onError={(e) => {
                e.currentTarget.style.display = 'none';
              }}
            />
          )}
        </div>
        {isVerified && (
          <div className="verified absolute top-[90px] left-[calc(50%+30px)] bg-[#007bff] text-white rounded-full p-[4px] text-[12px]">
            ✔️
          </div>
        )}
        <h1 className="mt-[10px] mb-[5px] text-[22px] font-bold">{name}</h1>
        <p className="tagline text-[#007bff] mb-0">{tagline}</p>
        <p className="company text-[14px] text-[#666]">{company}</p>
      </div>

      {/* Contact Section */}
      <div className="contact px-[20px] py-[10px] text-[14px] text-[#333]">
        <p className="mb-1">📞 {phone}</p>
        <p>📧 {email}</p>
      </div>

      {/* Social Section */}
      <div className="social flex justify-center gap-[20px] py-[10px]">
        <button 
          onClick={() => handleSocialClick('Instagram')}
          className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
        >
          <span className="text-xs">📷</span>
        </button>
        <button 
          onClick={() => handleSocialClick('Facebook')}
          className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
        >
          <span className="text-xs">📘</span>
        </button>
        <button 
          onClick={() => handleSocialClick('App')}
          className="w-[30px] h-[30px] bg-gray-300 rounded-full flex items-center justify-center hover:bg-gray-400 transition-colors"
        >
          <span className="text-xs">📱</span>
        </button>
      </div>

      {/* Actions Section */}
      <div className="actions flex justify-around px-[20px] py-[20px]">
        <button 
          onClick={handleSave}
          className="save px-[20px] py-[10px] border-none rounded-[6px] text-[14px] cursor-pointer bg-[#007bff] text-white hover:bg-[#0056b3] transition-colors"
        >
          儲存聯絡人
        </button>
        <button 
          onClick={handleBook}
          className="book px-[20px] py-[10px] border-none rounded-[6px] text-[14px] cursor-pointer bg-[#e0e0e0] text-[#333] hover:bg-[#d0d0d0] transition-colors"
        >
          線上預約
        </button>
      </div>
    </div>
  );
}