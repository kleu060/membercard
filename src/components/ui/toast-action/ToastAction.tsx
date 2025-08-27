'use client';

import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

interface ToastActionProps {
  alt: string;
  children: React.ReactNode;
  className?: string;
}

export function ToastAction({ alt, children, className }: ToastActionProps) {
  return (
    <Button
      variant="ghost"
      size="sm"
      className={cn(
        "rounded-sm p-1 font-normal text-muted-foreground hover:text-foreground",
        className
      )}
    >
      {children}
    </Button>
  );
}