import React, { useState, useEffect } from 'react';
import { createPortal } from 'react-dom';
import { Image, Eye, Download, ZoomIn, ZoomOut, X } from 'lucide-react';
import { Button } from '@/components/common/button';
import { cn } from '@/lib/utils';

// Base Components Level: Foundational UI primitives
// Following component hierarchy: Design Tokens → Base

export interface ReceiptImageProps {
  receiptUrl?: string;
  receiptType?: string;
  merchantName?: string;
  amount?: number;
  className?: string;
  showPreview?: boolean;
  size?: 'small' | 'medium' | 'large';
}

interface ReceiptPreviewModalProps {
  isOpen: boolean;
  receiptUrl: string;
  merchantName?: string;
  amount?: number;
  onClose: () => void;
}

const ReceiptPreviewModal: React.FC<ReceiptPreviewModalProps> = ({
  isOpen,
  receiptUrl,
  merchantName,
  amount,
  onClose,
}) => {
  const [zoom, setZoom] = useState(100);

  // Handle keyboard events
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Prevent body scroll
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = '';
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const handleZoomIn = () => setZoom((prev) => Math.min(prev + 25, 200));
  const handleZoomOut = () => setZoom((prev) => Math.max(prev - 25, 50));
  const handleDownload = () => {
    const link = document.createElement('a');
    link.href = receiptUrl;
    link.download = `receipt-${merchantName || 'expense'}.png`;
    link.click();
  };

  const modalContent = (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center bg-black bg-opacity-75" onClick={onClose}>
      <div className="relative max-w-4xl max-h-[90vh] bg-white rounded-lg shadow-xl overflow-hidden" onClick={(e) => e.stopPropagation()}>
        {/* Modal Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200 bg-white">
          <div className="flex items-center gap-3">
            <Image className="w-5 h-5 text-blue-600" />
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Receipt Preview
              </h3>
              {merchantName && (
                <p className="text-sm text-gray-600">
                  {merchantName} {amount && `• $${amount.toFixed(2)}`}
                </p>
              )}
            </div>
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              disabled={zoom <= 50}
              className="p-2"
            >
              <ZoomOut className="w-4 h-4" />
            </Button>

            <span className="text-sm font-medium text-gray-600 min-w-[4rem] text-center">
              {zoom}%
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              disabled={zoom >= 200}
              className="p-2"
            >
              <ZoomIn className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="p-2 ml-2"
            >
              <Download className="w-4 h-4" />
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={onClose}
              className="p-2 ml-2 text-gray-600 hover:text-gray-900"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {/* Modal Content */}
        <div className="p-4 bg-gray-50 overflow-auto max-h-[calc(90vh-8rem)]">
          <div className="flex justify-center">
            <img
              src={receiptUrl}
              alt={`Receipt from ${merchantName || 'merchant'}`}
              className="max-w-full h-auto border border-gray-300 rounded-lg shadow-lg bg-white"
              style={{
                transform: `scale(${zoom / 100})`,
                transformOrigin: 'top center',
              }}
            />
          </div>
        </div>
      </div>
    </div>
  );

  return typeof document !== 'undefined' ? createPortal(modalContent, document.body) : null;
};

export function ReceiptImage({
  receiptUrl,
  receiptType = 'image',
  merchantName,
  amount,
  className,
  showPreview = true,
  size = 'medium',
}: ReceiptImageProps) {
  const [showModal, setShowModal] = useState(false);
  const [imageError, setImageError] = useState(false);

  // If no receipt URL provided, show placeholder
  if (!receiptUrl) {
    return (
      <div
        className={cn(
          'flex items-center justify-center rounded-lg border-2 border-dashed border-gray-300 bg-gray-50',
          size === 'small' && 'w-12 h-12',
          size === 'medium' && 'w-16 h-16',
          size === 'large' && 'w-24 h-24',
          className
        )}
      >
        <Image
          className={cn(
            'text-gray-400',
            size === 'small' && 'w-4 h-4',
            size === 'medium' && 'w-6 h-6',
            size === 'large' && 'w-8 h-8'
          )}
        />
      </div>
    );
  }

  // Handle image loading error
  if (imageError) {
    return (
      <div
        className={cn(
          'flex flex-col items-center justify-center rounded-lg border border-red-200 bg-red-50 text-red-600',
          size === 'small' && 'w-12 h-12',
          size === 'medium' && 'w-16 h-16',
          size === 'large' && 'w-24 h-24',
          className
        )}
      >
        <Image
          className={cn(
            size === 'small' && 'w-3 h-3',
            size === 'medium' && 'w-4 h-4',
            size === 'large' && 'w-5 h-5'
          )}
        />
        {size !== 'small' && <span className="text-xs mt-1">Error</span>}
      </div>
    );
  }

  return (
    <>
      <div className={cn('relative group', className)}>
        <div
          className={cn(
            'relative overflow-hidden rounded-lg border border-gray-200 cursor-pointer transition-all duration-200',
            'hover:border-blue-300 hover:shadow-md',
            size === 'small' && 'w-12 h-12',
            size === 'medium' && 'w-16 h-16',
            size === 'large' && 'w-24 h-24'
          )}
        >
          <img
            src={receiptUrl}
            alt={`Receipt from ${merchantName || 'merchant'}`}
            className="w-full h-full object-cover"
            onError={() => setImageError(true)}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              console.log('Receipt image clicked, showPreview:', showPreview);
              if (showPreview) {
                console.log('Opening modal...');
                setShowModal(true);
              }
            }}
          />

          {/* Hover Overlay */}
          {showPreview && (
            <div
              className="absolute inset-0 bg-black bg-opacity-0 group-hover:bg-opacity-50 transition-all duration-200 flex items-center justify-center cursor-pointer"
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowModal(true);
              }}
            >
              <Eye className="w-4 h-4 text-white opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
            </div>
          )}
        </div>

        {/* Receipt Type Badge */}
        {receiptType && size !== 'small' && (
          <div className="absolute -top-1 -right-1 bg-blue-100 text-blue-700 text-xs px-1.5 py-0.5 rounded-full border border-blue-300">
            {receiptType.toUpperCase()}
          </div>
        )}
      </div>

      {/* Preview Modal */}
      {showPreview && (
        <ReceiptPreviewModal
          isOpen={showModal}
          receiptUrl={receiptUrl}
          merchantName={merchantName}
          amount={amount}
          onClose={() => setShowModal(false)}
        />
      )}
    </>
  );
}

// Receipt Gallery Component for showing multiple receipts
export interface ReceiptGalleryProps {
  receipts: Array<{
    id: string;
    url: string;
    type?: string;
    merchantName?: string;
    amount?: number;
    date?: string;
  }>;
  className?: string;
  maxDisplayed?: number;
}

export function ReceiptGallery({
  receipts,
  className,
  maxDisplayed = 3,
}: ReceiptGalleryProps) {
  const [showAll, setShowAll] = useState(false);

  const displayedReceipts = showAll
    ? receipts
    : receipts.slice(0, maxDisplayed);
  const remainingCount = receipts.length - maxDisplayed;

  if (receipts.length === 0) {
    return (
      <div className={cn('flex items-center gap-2 text-gray-500', className)}>
        <Image className="w-4 h-4" />
        <span className="text-sm">No receipts</span>
      </div>
    );
  }

  return (
    <div className={cn('flex items-center gap-2', className)}>
      {displayedReceipts.map((receipt) => (
        <ReceiptImage
          key={receipt.id}
          receiptUrl={receipt.url}
          receiptType={receipt.type}
          merchantName={receipt.merchantName}
          amount={receipt.amount}
          size="small"
        />
      ))}

      {remainingCount > 0 && !showAll && (
        <button
          onClick={() => setShowAll(true)}
          className="flex items-center justify-center w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 bg-gray-50 hover:bg-gray-100 transition-colors duration-200"
        >
          <span className="text-xs font-medium text-gray-600">
            +{remainingCount}
          </span>
        </button>
      )}
    </div>
  );
}

export default ReceiptImage;
