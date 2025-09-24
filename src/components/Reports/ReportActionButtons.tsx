import React, { useState } from 'react';
import { Eye, Check, X, Plus, FileText, ChevronDown } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { cn } from '@/lib/utils';

// Layout Components Level: Grid, container, and structural patterns
// Following component hierarchy: Base → Layout

interface ReportActionButtonsProps {
  onReview?: () => void;
  onApprove?: () => void;
  onReject?: () => void;
  onAddExpenses?: () => void;
  onDetails?: () => void;
  pendingCount?: number;
  className?: string;
}

export function ReportActionButtons({
  onReview,
  onApprove,
  onReject,
  onAddExpenses,
  onDetails,
  pendingCount = 0,
  className,
}: ReportActionButtonsProps) {
  const [showRejectDropdown, setShowRejectDropdown] = useState(false);
  const [rejectScope, setRejectScope] = useState('');
  const [rejectTo, setRejectTo] = useState('janasmith.mobbin@gmail.com');

  const handleRejectClick = () => {
    setShowRejectDropdown(!showRejectDropdown);
  };

  const handleRejectContinue = () => {
    if (rejectScope) {
      onReject?.();
      setShowRejectDropdown(false);
      // Reset form
      setRejectScope('');
    }
  };

  return (
    <div className={cn('flex items-center gap-3', className)}>
      {/* Review Button with Count */}
      <div className="relative">
        <Button
          onClick={onReview}
          variant="outline"
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
        >
          <Eye className="w-4 h-4" />
          <span>Review</span>
          {pendingCount > 0 && (
            <span className="ml-1 px-2 py-1 bg-gray-500 text-white text-xs rounded-full">
              {pendingCount}
            </span>
          )}
        </Button>
      </div>

      {/* Approve Button */}
      <Button
        onClick={onApprove}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
      >
        <Check className="w-4 h-4" />
        <span>Approve</span>
      </Button>

      {/* Reject Button with Dropdown */}
      <div className="relative">
        <Button
          onClick={handleRejectClick}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
        >
          <X className="w-4 h-4" />
          <span>Reject</span>
          <ChevronDown className="w-4 h-4" />
        </Button>

        {/* Reject Dropdown */}
        {showRejectDropdown && (
          <div className="absolute top-full left-0 mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
            <div className="p-3">
              <div className="space-y-3">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    How far back to reject?
                  </label>
                  <Select
                    value={rejectScope}
                    onValueChange={setRejectScope}
                    placeholder="Select option..."
                  >
                    <SelectContent>
                      <SelectItem value="this-report">This report only</SelectItem>
                      <SelectItem value="this-and-future">This report and all future</SelectItem>
                      <SelectItem value="all-reports">All reports from this user</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Reject to
                  </label>
                  <Select
                    value={rejectTo}
                    onValueChange={setRejectTo}
                  >
                    <SelectContent>
                      <SelectItem value="janasmith.mobbin@gmail.com">janasmith.mobbin@gmail.com</SelectItem>
                      <SelectItem value="other">Other recipient...</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <Button
                    onClick={handleRejectContinue}
                    disabled={!rejectScope}
                    className="px-4 py-2 bg-blue-600 text-white text-sm hover:bg-blue-700 disabled:bg-gray-300 disabled:cursor-not-allowed"
                  >
                    Continue
                  </Button>
                  <Button
                    onClick={() => setShowRejectDropdown(false)}
                    variant="outline"
                    className="px-4 py-2 text-sm"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Add Expenses Button */}
      <Button
        onClick={onAddExpenses}
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium bg-blue-600 text-white hover:bg-blue-700"
      >
        <Plus className="w-4 h-4" />
        <span>Add Expenses</span>
      </Button>

      {/* Details Button */}
      <Button
        onClick={onDetails}
        variant="outline"
        className="flex items-center gap-2 px-4 py-2 text-sm font-medium border-gray-300 text-gray-700 hover:bg-gray-50"
      >
        <FileText className="w-4 h-4" />
        <span>Details</span>
      </Button>
    </div>
  );
}

export default ReportActionButtons;