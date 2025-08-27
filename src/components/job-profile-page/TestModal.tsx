'use client';

import { Button } from '@/components/ui/button';

interface TestModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function TestModal({ isOpen, onClose }: TestModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white p-6 rounded-lg">
        <h2 className="text-xl font-bold mb-4">Test Modal</h2>
        <p>This is a test modal to check if the modal functionality works.</p>
        <Button onClick={onClose} className="mt-4">
          Close
        </Button>
      </div>
    </div>
  );
}