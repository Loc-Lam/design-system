import React, { useState } from 'react';
import { X, ZoomIn, ZoomOut, RotateCw, Download, Edit3 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { Modal } from '@/components/common/modal';
import type { ExpenseData } from './ExpenseTableRow';

// Receipt Preview Modal Component
// Displays receipt image with viewing and editing controls

interface ReceiptPreviewModalProps {
  expense: ExpenseData | null;
  isOpen: boolean;
  onClose: () => void;
  onEdit?: (expense: ExpenseData) => void;
}

export function ReceiptPreviewModal({
  expense,
  isOpen,
  onClose,
  onEdit,
}: ReceiptPreviewModalProps) {
  const [imageZoom, setImageZoom] = useState(100);
  const [imageRotation, setImageRotation] = useState(0);

  // Reset state when modal opens/closes
  React.useEffect(() => {
    if (isOpen) {
      setImageZoom(100);
      setImageRotation(0);
    }
  }, [isOpen]);

  if (!expense || !expense.receipt?.url) {
    return null;
  }

  const handleZoomIn = () => setImageZoom(prev => Math.min(prev + 25, 300));
  const handleZoomOut = () => setImageZoom(prev => Math.max(prev - 25, 25));
  const handleRotate = () => setImageRotation(prev => (prev + 90) % 360);

  const handleDownload = () => {
    if (expense.receipt?.url) {
      const link = document.createElement('a');
      link.href = expense.receipt.url;
      link.download = `receipt-${expense.merchant}-${expense.date}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const handleEdit = () => {
    if (expense && onEdit) {
      onEdit(expense);
      onClose();
    }
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Receipt Preview"
      size="full"
    >
      <div className="flex flex-col h-full">
        {/* Header with Controls */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex flex-col">
            <h3 className="text-lg font-semibold text-gray-900">
              {expense.merchant} - {expense.date}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              ${expense.amount.toFixed(2)} • {expense.category}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomOut}
              className="flex items-center gap-2"
            >
              <ZoomOut className="w-4 h-4" />
              Zoom Out
            </Button>

            <span className="text-sm text-gray-600 px-3 py-1 bg-gray-100 rounded-md min-w-[4rem] text-center">
              {imageZoom}%
            </span>

            <Button
              variant="outline"
              size="sm"
              onClick={handleZoomIn}
              className="flex items-center gap-2"
            >
              <ZoomIn className="w-4 h-4" />
              Zoom In
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleRotate}
              className="flex items-center gap-2"
            >
              <RotateCw className="w-4 h-4" />
              Rotate
            </Button>

            <Button
              variant="outline"
              size="sm"
              onClick={handleDownload}
              className="flex items-center gap-2"
            >
              <Download className="w-4 h-4" />
              Download
            </Button>

            {onEdit && (
              <Button
                onClick={handleEdit}
                className="flex items-center gap-2"
              >
                <Edit3 className="w-4 h-4" />
                Edit Expense
              </Button>
            )}

            <Button
              variant="outline"
              onClick={onClose}
              className="flex items-center gap-2"
            >
              <X className="w-4 h-4" />
              Close
            </Button>
          </div>
        </div>

        {/* Image Display Area */}
        <div className="flex-1 flex items-center justify-center overflow-auto bg-gray-50 p-6">
          <div className="max-w-full max-h-full">
            <img
              src={expense.receipt.url}
              alt={`Receipt from ${expense.merchant}`}
              className="max-w-full max-h-full object-contain rounded-lg shadow-lg transition-transform duration-200"
              style={{
                transform: `scale(${imageZoom / 100}) rotate(${imageRotation}deg)`,
                transformOrigin: 'center'
              }}
            />
          </div>
        </div>

        {/* Footer with Expense Details */}
        <div className="border-t border-gray-200 bg-white p-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div>
              <span className="text-sm text-gray-500">Status</span>
              <p className="font-medium">
                <span className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                  expense.status === 'Processing' && 'bg-blue-100 text-blue-700',
                  expense.status === 'Approved' && 'bg-blue-50 text-blue-600',
                  expense.status === 'Pending' && 'bg-blue-50 text-blue-600 border border-blue-200',
                  expense.status === 'Rejected' && 'bg-blue-100 text-blue-700'
                )}>
                  {expense.status}
                </span>
              </p>
            </div>

            <div>
              <span className="text-sm text-gray-500">Workspace</span>
              <p className="font-medium truncate">{expense.workspace}</p>
            </div>

            {expense.tag && (
              <div>
                <span className="text-sm text-gray-500">Tag</span>
                <p className="font-medium">{expense.tag}</p>
              </div>
            )}

            {expense.submittedBy && (
              <div>
                <span className="text-sm text-gray-500">Submitted By</span>
                <p className="font-medium">{expense.submittedBy.name}</p>
              </div>
            )}
          </div>

          {expense.description && (
            <div className="mt-4">
              <span className="text-sm text-gray-500">Description</span>
              <p className="font-medium mt-1">{expense.description}</p>
            </div>
          )}
        </div>
      </div>
    </Modal>
  );
}

export default ReceiptPreviewModal;