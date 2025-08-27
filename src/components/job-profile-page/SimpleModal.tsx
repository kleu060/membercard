'use client';

import { Button } from '@/components/ui/button';

interface SimpleModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
}

export default function SimpleModal({ isOpen, onClose, title, children }: SimpleModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">{title}</h2>
          <Button variant="outline" size="sm" onClick={onClose}>
            ×
          </Button>
        </div>
        <div className="mb-4">
          {children}
        </div>
        <div className="flex justify-end">
          <Button onClick={onClose}>
            Close
          </Button>
        </div>
      </div>
    </div>
  );
}