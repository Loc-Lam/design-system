import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';

interface SheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  children: React.ReactNode;
}

interface SheetContentProps {
  children: React.ReactNode;
  className?: string;
  side?: 'left' | 'right' | 'top' | 'bottom';
}

interface SheetHeaderProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetTitleProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetDescriptionProps {
  children: React.ReactNode;
  className?: string;
}

interface SheetFooterProps {
  children: React.ReactNode;
  className?: string;
}

export function Sheet({ open, onOpenChange, children }: SheetProps) {
  React.useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onOpenChange(false);
      }
    };

    if (open) {
      document.addEventListener('keydown', handleEscape);
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleEscape);
      document.body.style.overflow = '';
    };
  }, [open, onOpenChange]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-sm"
        onClick={() => onOpenChange(false)}
      />
      {children}
    </div>
  );
}

export function SheetContent({
  children,
  className,
  side = 'right'
}: SheetContentProps) {
  const sideStyles = {
    right: 'right-0 h-full w-full max-w-md translate-x-0',
    left: 'left-0 h-full w-full max-w-md translate-x-0',
    top: 'top-0 w-full max-h-96 translate-y-0',
    bottom: 'bottom-0 w-full max-h-96 translate-y-0'
  };

  return (
    <div
      className={cn(
        'fixed z-50 bg-white shadow-xl transition-all duration-300',
        'border border-gray-200',
        'data-[state=open]:animate-in data-[state=closed]:animate-out',
        sideStyles[side],
        className
      )}
      onClick={(e) => e.stopPropagation()}
    >
      {children}
    </div>
  );
}

export function SheetHeader({ children, className }: SheetHeaderProps) {
  return (
    <div className={cn('px-6 py-4 border-b border-gray-200', className)}>
      {children}
    </div>
  );
}

export function SheetTitle({ children, className }: SheetTitleProps) {
  return (
    <h2 className={cn('text-lg font-semibold text-gray-900', className)}>
      {children}
    </h2>
  );
}

export function SheetDescription({ children, className }: SheetDescriptionProps) {
  return (
    <p className={cn('text-sm text-gray-600 mt-1', className)}>
      {children}
    </p>
  );
}

export function SheetFooter({ children, className }: SheetFooterProps) {
  return (
    <div className={cn('px-6 py-4 border-t border-gray-200 bg-gray-50', className)}>
      {children}
    </div>
  );
}

interface SheetTriggerProps {
  children: React.ReactNode;
  asChild?: boolean;
}

export function SheetTrigger({ children }: SheetTriggerProps) {
  return <>{children}</>;
}

interface SheetCloseProps {
  className?: string;
  onClick?: () => void;
}

export function SheetClose({ className, onClick }: SheetCloseProps) {
  return (
    <button
      type="button"
      className={cn(
        'absolute right-4 top-4 p-2 rounded-lg text-gray-500 hover:text-gray-700 hover:bg-gray-100',
        'transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500',
        className
      )}
      onClick={onClick}
    >
      <X className="w-4 h-4" />
      <span className="sr-only">Close</span>
    </button>
  );
}