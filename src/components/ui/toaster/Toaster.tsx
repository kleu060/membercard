'use client';

import { useToast } from '@/hooks/use-toast';
import {
  Toast,
  ToastClose,
  ToastDescription,
  ToastHeader,
  ToastTitle,
} from '@/components/ui/toast';
import {
  ToastAction,
} from '@/components/ui/toast-action';
import { useToast } from '@/hooks/use-toast';

export function Toaster() {
  const { toasts } = useToast();

  return (
    <div className="fixed top-0 right-0 z-50">
      {toasts.map(function ({ id, title, description, action }) {
        return (
          <Toast key={id}>
            <ToastHeader>
              {title && <ToastTitle>{title}</ToastTitle>}
            </ToastHeader>
            {description && <ToastDescription>{description}</ToastDescription>}
            {action && <ToastAction alt="Action">{action}</ToastAction>}
          </Toast>
        );
      })}
    </div>
  );
}