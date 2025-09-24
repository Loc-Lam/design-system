import React from 'react';
import { cn } from '@/lib/utils';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

export interface ExpenseData {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  workspace: string;
  category: string;
  tag?: string;
  description: string;
  status: 'Processing' | 'Approved' | 'Pending' | 'Rejected';
  receipt?: {
    url?: string;
    type?: string;
  };
  submittedBy?: {
    name: string;
    initial: string;
  };
}

interface ExpenseTableRowProps {
  expense: ExpenseData;
  onRowClick?: (expense: ExpenseData) => void;
  className?: string;
}

export function ExpenseTableRow({
  expense,
  onRowClick,
  className,
}: ExpenseTableRowProps) {
  const handleRowClick = () => {
    onRowClick?.(expense);
  };

  const getStatusBadge = (status: ExpenseData['status']) => {
    const baseClasses = 'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium';

    switch (status) {
      case 'Processing':
        return cn(baseClasses, 'bg-blue-100 text-blue-700');
      case 'Approved':
        return cn(baseClasses, 'bg-blue-50 text-blue-600');
      case 'Pending':
        return cn(baseClasses, 'bg-blue-50 text-blue-600 border border-blue-200');
      case 'Rejected':
        return cn(baseClasses, 'bg-blue-100 text-blue-700');
      default:
        return cn(baseClasses, 'bg-blue-100 text-blue-700');
    }
  };

  const formatAmount = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  return (
    <tr
      onClick={handleRowClick}
      className={cn(
        'hover:bg-blue-50 cursor-pointer transition-colors duration-200 border-b border-gray-200',
        className
      )}
    >
      {/* Selection Checkbox */}
      <td className="pl-6 pr-3 py-4 w-4">
        <input
          type="checkbox"
          className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
          onClick={(e) => e.stopPropagation()}
        />
      </td>

      {/* Date */}
      <td className="px-3 py-4 text-sm">
        <div className="flex flex-col">
          <span className="text-gray-900 font-medium">
            {formatDate(expense.date)}
          </span>
        </div>
      </td>

      {/* Merchant with Receipt Icon */}
      <td className="px-3 py-4 text-sm">
        <div className="flex items-center gap-2">
          {expense.receipt && (
            <div className="w-8 h-8 bg-gray-100 rounded border flex items-center justify-center">
              <div className="w-4 h-4 bg-gray-400 rounded-sm" />
            </div>
          )}
          <div className="flex flex-col">
            <span className="text-gray-900 font-medium">{expense.merchant}</span>
            <div className="flex items-center gap-2 mt-1">
              <span className={getStatusBadge(expense.status)}>
                {expense.status}
              </span>
              {expense.tag && (
                <span className="text-xs text-gray-500 uppercase tracking-wide">
                  {expense.tag}
                </span>
              )}
            </div>
          </div>
        </div>
      </td>

      {/* Amount */}
      <td className="px-3 py-4 text-sm text-right">
        <span className="text-gray-900 font-medium">
          {formatAmount(expense.amount)}
        </span>
      </td>

      {/* Workspace with User Avatar */}
      <td className="px-3 py-4 text-sm">
        <div className="flex items-center gap-2">
          {expense.submittedBy && (
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">
                {expense.submittedBy.initial}
              </span>
            </div>
          )}
          <span className="text-gray-900">{expense.workspace}</span>
        </div>
      </td>

      {/* Category */}
      <td className="px-3 py-4 text-sm">
        <span className="text-gray-900">{expense.category}</span>
      </td>

      {/* Tag */}
      <td className="px-3 py-4 text-sm">
        {expense.tag && (
          <span className="text-gray-900">{expense.tag}</span>
        )}
      </td>

      {/* Description */}
      <td className="px-3 py-4 text-sm pr-6">
        <span className="text-gray-900">{expense.description}</span>
      </td>
    </tr>
  );
}

export default ExpenseTableRow;