import React, { useState } from 'react';
import { X, Info } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Feature Components Level: Business logic components with specific functionality
// Following component hierarchy: Base → Layout → Composite → Feature

interface ReportRejectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  onReject: (data: RejectFormData) => void;
  reportTitle?: string;
  submitterEmail?: string;
  className?: string;
}

export interface RejectFormData {
  howFarBack: string;
  rejectTo: string;
  memo: string;
}

const rejectionOptions = [
  { value: 'this-report', label: 'This report only' },
  { value: 'this-and-future', label: 'This report and all future reports' },
  { value: 'all-reports', label: 'All reports from this user' },
  { value: 'custom', label: 'Custom date range...' },
];

export function ReportRejectionModal({
  isOpen,
  onClose,
  onReject,
  reportTitle = 'Report',
  submitterEmail = 'user@example.com',
  className,
}: ReportRejectionModalProps) {
  const [formData, setFormData] = useState<RejectFormData>({
    howFarBack: '',
    rejectTo: submitterEmail,
    memo: '',
  });

  const handleInputChange = (field: keyof RejectFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleReject = () => {
    onReject(formData);
    onClose();
    // Reset form
    setFormData({
      howFarBack: '',
      rejectTo: submitterEmail,
      memo: '',
    });
  };

  const handleCancel = () => {
    onClose();
    // Reset form
    setFormData({
      howFarBack: '',
      rejectTo: submitterEmail,
      memo: '',
    });
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          'bg-white rounded-lg shadow-2xl w-full max-w-md overflow-hidden',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">
            Reject {reportTitle}
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-4">
          {/* Info Message */}
          <div className="flex items-start gap-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
            <p className="text-sm text-blue-800">
              Feel free to edit the report instead of rejecting and we'll notify the submitter for you.
            </p>
          </div>

          {/* How far back to reject */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              How far back to reject?
            </label>
            <Select
              value={formData.howFarBack}
              onValueChange={(value) => handleInputChange('howFarBack', value)}
              placeholder="Select an option..."
            >
              <SelectContent>
                {rejectionOptions.map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Reject to */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Reject to
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.rejectTo}
                onChange={(e) => handleInputChange('rejectTo', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 pr-20"
                placeholder="Enter email address"
              />
              <button className="absolute right-2 top-1/2 transform -translate-y-1/2 text-xs text-blue-600 hover:text-blue-700">
                ({submitterEmail})
              </button>
            </div>
          </div>

          {/* Memo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Memo
            </label>
            <textarea
              value={formData.memo}
              onChange={(e) => handleInputChange('memo', e.target.value)}
              rows={4}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 resize-none"
              placeholder="Add a reason for rejection (optional)..."
            />
            <p className="text-xs text-gray-500 mt-1">
              This memo will be included in the rejection notification.
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200 bg-gray-50">
          <Button
            onClick={handleCancel}
            variant="outline"
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleReject}
            disabled={!formData.howFarBack}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white disabled:bg-gray-300 disabled:cursor-not-allowed"
          >
            Reject
          </Button>
        </div>
      </div>
    </div>
  );
}

export default ReportRejectionModal;