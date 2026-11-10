import React, { createContext, useCallback, useContext, useState } from 'react';
import { CheckCircle2, AlertTriangle, XCircle, Info, X } from 'lucide-react';

export type ToastVariant = 'success' | 'warning' | 'error' | 'info';

export interface ToastItem {
  id: string;
  title: string;
  description?: string;
  variant: ToastVariant;
}

interface ToastContextValue {
  notify: (toast: Omit<ToastItem, 'id'>) => void;
  dismiss: (id: string) => void;
}

const ToastContext = createContext<ToastContextValue | undefined>(undefined);

export const ToastProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [toasts, setToasts] = useState<ToastItem[]>([]);

  const dismiss = useCallback((id: string) => {
    setToasts((prev) => prev.filter((item) => item.id !== id));
  }, []);

  const notify = useCallback(
    (toast: Omit<ToastItem, 'id'>) => {
      const id = `${Date.now()}-${Math.random().toString(36).slice(2, 7)}`;
      setToasts((prev) => [...prev, { ...toast, id }]);
      window.setTimeout(() => {
        dismiss(id);
      }, 4500);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ notify, dismiss }}>
      {children}
      <div
        aria-live="polite"
        aria-atomic="false"
        className="fixed bottom-5 right-5 z-50 flex flex-col gap-2.5 max-w-sm w-full pointer-events-none px-4 sm:px-0"
      >
        {toasts.map((toast) => {
          const icons: Record<ToastVariant, React.ReactNode> = {
            success: <CheckCircle2 className="w-5 h-5 text-emerald-500 shrink-0" />,
            warning: <AlertTriangle className="w-5 h-5 text-amber-500 shrink-0" />,
            error: <XCircle className="w-5 h-5 text-red-500 shrink-0" />,
            info: <Info className="w-5 h-5 text-blue-500 shrink-0" />,
          };

          return (
            <div
              key={toast.id}
              role="status"
              className="pointer-events-auto flex items-start gap-3 rounded-2xl bmac-card px-4 py-3.5 shadow-xl transition-all duration-200"
            >
              <div className="mt-0.5">{icons[toast.variant]}</div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold bmac-text">{toast.title}</p>
                {toast.description && (
                  <p className="mt-0.5 text-xs bmac-subtext leading-relaxed break-words">
                    {toast.description}
                  </p>
                )}
              </div>
              <button
                type="button"
                onClick={() => dismiss(toast.id)}
                aria-label="Dismiss notification"
                className="bmac-muted hover:bmac-text p-1 rounded-full transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          );
        })}
      </div>
    </ToastContext.Provider>
  );
};

export function useToast(): ToastContextValue {
  const ctx = useContext(ToastContext);
  if (!ctx) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return ctx;
}
