'use client';

import { useEffect } from "react";

interface ToastProps {
  message: string;
  visible: boolean;
  duration?: number;
  onDismiss: () => void;
}

export function Toast({ message, visible, duration = 2000, onDismiss }: ToastProps) {
  useEffect(() => {
    if (!visible) return;
    const timer = setTimeout(onDismiss, duration);
    return () => clearTimeout(timer);
  }, [visible, duration, onDismiss]);

  if (!visible) return null;

  return (
    <div className="fixed left-1/2 top-4 z-50 -translate-x-1/2 toast-slide">
      <div className="rounded-xl bg-[var(--bleu-marine)] px-4 py-2 text-sm font-medium text-white shadow-lg">
        {message}
      </div>
    </div>
  );
}
