import { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Base Components Level: Foundational UI primitives
// Following component hierarchy: Design Tokens → Base Components
// Blue color system compliance: Using blue variants with appropriate accent colors

export type ToastType = 'success' | 'error' | 'info' | 'warning';

export interface NotificationToastProps {
  id?: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  autoClose?: boolean;
  onClose?: () => void;
  className?: string;
}

const toastConfig = {
  success: {
    icon: CheckCircle,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
    progressColor: 'bg-blue-500',
  },
  error: {
    icon: AlertCircle,
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200',
    textColor: 'text-red-800',
    iconColor: 'text-red-500',
    progressColor: 'bg-red-500',
  },
  info: {
    icon: Info,
    bgColor: 'bg-blue-50',
    borderColor: 'border-blue-200',
    textColor: 'text-blue-800',
    iconColor: 'text-blue-500',
    progressColor: 'bg-blue-500',
  },
  warning: {
    icon: AlertTriangle,
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-800',
    iconColor: 'text-yellow-500',
    progressColor: 'bg-yellow-500',
  },
};

export function NotificationToast({
  id,
  type,
  title,
  message,
  duration = 5000,
  autoClose = true,
  onClose,
  className,
}: NotificationToastProps) {
  const [isVisible, setIsVisible] = useState(true);
  const [progress, setProgress] = useState(100);

  const config = toastConfig[type];
  const IconComponent = config.icon;

  useEffect(() => {
    if (!autoClose) return;

    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev <= 0) {
          clearInterval(progressInterval);
          return 0;
        }
        return prev - (100 / (duration / 100));
      });
    }, 100);

    const closeTimeout = setTimeout(() => {
      handleClose();
    }, duration);

    return () => {
      clearInterval(progressInterval);
      clearTimeout(closeTimeout);
    };
  }, [duration, autoClose]);

  const handleClose = () => {
    setIsVisible(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Allow for exit animation
  };

  if (!isVisible) return null;

  return (
    <div
      className={cn(
        'fixed bottom-4 right-4 w-96 max-w-sm z-50',
        'transform transition-all duration-300 ease-in-out',
        'animate-in slide-in-from-right-full',
        className
      )}
    >
      <div
        className={cn(
          'rounded-lg shadow-lg border p-4 relative overflow-hidden',
          config.bgColor,
          config.borderColor
        )}
      >
        {/* Progress bar */}
        {autoClose && (
          <div className="absolute bottom-0 left-0 right-0 h-1 bg-gray-200">
            <div
              className={cn('h-full transition-all duration-100 ease-linear', config.progressColor)}
              style={{ width: `${progress}%` }}
            />
          </div>
        )}

        {/* Content */}
        <div className="flex items-start space-x-3">
          <IconComponent className={cn('w-5 h-5 mt-0.5 flex-shrink-0', config.iconColor)} />

          <div className="flex-1 min-w-0">
            <h4 className={cn('text-sm font-medium', config.textColor)}>
              {title}
            </h4>
            {message && (
              <p className={cn('text-sm mt-1 opacity-90', config.textColor)}>
                {message}
              </p>
            )}
          </div>

          <button
            onClick={handleClose}
            className={cn(
              'flex-shrink-0 p-1 rounded-full hover:bg-white/50 transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
              config.textColor
            )}
          >
            <X className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}

// Toast container component for managing multiple toasts
export interface Toast extends NotificationToastProps {
  id: string;
}

interface ToastContainerProps {
  toasts: Toast[];
  onRemoveToast: (id: string) => void;
}

export function ToastContainer({ toasts, onRemoveToast }: ToastContainerProps) {
  return (
    <div className="fixed bottom-4 right-4 z-50 space-y-2">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          {...toast}
          onClose={() => onRemoveToast(toast.id)}
        />
      ))}
    </div>
  );
}

// Hook for managing toasts
export function useToast() {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const addToast = (toast: Omit<Toast, 'id'>) => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { ...toast, id }]);
  };

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  };

  const clearToasts = () => {
    setToasts([]);
  };

  return {
    toasts,
    addToast,
    removeToast,
    clearToasts,
  };
}

export default NotificationToast;