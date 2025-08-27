'use client';

import { useEffect, useRef } from 'react';
import QRCode from 'qrcode';
import { Badge } from '@/components/ui/badge';

interface QRCodeProps {
  value: string;
  companyName?: string;
  companyLogo?: string;
  size?: number;
  className?: string;
  showProBadge?: boolean;
}

export default function QRCodeComponent({ 
  value, 
  companyName, 
  companyLogo, 
  size = 200, 
  className = "",
  showProBadge = false 
}: QRCodeProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const generateQR = async () => {
      if (canvasRef.current) {
        try {
          await QRCode.toCanvas(canvasRef.current, value, {
            width: size,
            margin: 2,
            color: {
              dark: '#000000',
              light: '#FFFFFF'
            }
          });
        } catch (error) {
          console.error('Error generating QR code:', error);
        }
      }
    };

    generateQR();
  }, [value, size]);

  return (
    <div className={`relative inline-block ${className}`}>
      <canvas ref={canvasRef} className="border rounded-lg" />
      
      {/* Company Logo Overlay */}
      {companyLogo && (
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="bg-white p-1 rounded">
            <img 
              src={companyLogo} 
              alt={companyName || 'Company Logo'}
              className="w-8 h-8 object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>
        </div>
      )}
      
      {/* Company Name */}
      {companyName && (
        <div className="mt-2 text-center">
          <p className="text-sm font-medium text-gray-700 truncate max-w-[200px]">
            {companyName}
          </p>
        </div>
      )}
      
      {/* Pro Badge */}
      {showProBadge && (
        <div className="absolute -top-2 -right-2">
          <Badge className="bg-gradient-to-r from-purple-600 to-blue-600 text-white text-xs">
            PRO
          </Badge>
        </div>
      )}
    </div>
  );
}