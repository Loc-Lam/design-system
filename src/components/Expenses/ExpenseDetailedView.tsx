import { Edit, Eye, Calendar, DollarSign, Building, Tag, FileText } from 'lucide-react';
import { ReceiptImage } from '@/components/common/receipt-image';
import type { ExpenseData } from './ExpenseTableRow';
import { cn } from '@/lib/utils';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite
// Using blue color system compliance throughout

interface ExpenseDetailedViewProps {
  expenses: ExpenseData[];
  onExpenseClick?: (expense: ExpenseData) => void;
  onExpenseEdit?: (expense: ExpenseData) => void;
  onReceiptView?: (expense: ExpenseData) => void;
  className?: string;
}

export function ExpenseDetailedView({
  expenses,
  onExpenseClick,
  onExpenseEdit,
  onReceiptView,
  className,
}: ExpenseDetailedViewProps) {
  const formatAmount = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch {
      return dateString;
    }
  };

  const getStatusColor = (status: ExpenseData['status']) => {
    switch (status) {
      case 'Processing':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      case 'Approved':
        return 'bg-blue-50 text-blue-600 border-blue-100';
      case 'Pending':
        return 'bg-blue-50 text-blue-600 border-blue-200';
      case 'Rejected':
        return 'bg-blue-100 text-blue-700 border-blue-200';
      default:
        return 'bg-blue-100 text-blue-700 border-blue-200';
    }
  };

  if (expenses.length === 0) {
    return (
      <div className={cn('text-center py-12', className)}>
        <div className="bg-white rounded-lg shadow-sm p-8">
          <p className="text-lg font-medium text-gray-900">No expenses found</p>
          <p className="text-gray-600 mt-2">Add your first expense to get started.</p>
        </div>
      </div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200"
        >
          {/* Header */}
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <ReceiptImage
                    receiptUrl={expense.receipt?.url}
                    receiptType={expense.receipt?.type}
                    merchantName={expense.merchant}
                    amount={expense.amount}
                    size="small"
                    showPreview={false}
                  />
                </div>
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">
                    {expense.merchant}
                  </h2>
                  <div className="flex items-center gap-4 mt-1">
                    <span
                      className={cn(
                        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border',
                        getStatusColor(expense.status)
                      )}
                    >
                      {expense.status}
                    </span>
                    <span className="text-2xl font-bold text-blue-600">
                      {formatAmount(expense.amount)}
                    </span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2">
                {onReceiptView && (
                  <button
                    onClick={() => onReceiptView(expense)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-blue-600 bg-white border border-blue-200 rounded-md hover:bg-blue-50 hover:border-blue-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    View Receipt
                  </button>
                )}
                {onExpenseEdit && (
                  <button
                    onClick={() => onExpenseEdit(expense)}
                    className="inline-flex items-center gap-2 px-3 py-2 text-sm font-medium text-white bg-blue-500 border border-transparent rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
                  >
                    <Edit className="w-4 h-4" />
                    Edit
                  </button>
                )}
              </div>
            </div>
          </div>

          {/* Detailed Information Grid */}
          <div className="p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {/* Date */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Calendar className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Date
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {formatDate(expense.date)}
                  </p>
                </div>
              </div>

              {/* Amount */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <DollarSign className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Amount
                  </p>
                  <p className="text-sm text-gray-900 mt-1 font-semibold">
                    {formatAmount(expense.amount)}
                  </p>
                </div>
              </div>

              {/* Category */}
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Category
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {expense.category}
                  </p>
                </div>
              </div>

              {/* Tag */}
              {expense.tag && (
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Tag className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Tag
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      {expense.tag}
                    </p>
                  </div>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mt-6">
              <div className="flex items-start gap-3">
                <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                  <FileText className="w-4 h-4 text-blue-600" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                    Description
                  </p>
                  <p className="text-sm text-gray-900 mt-1">
                    {expense.description}
                  </p>
                </div>
              </div>
            </div>

            {/* Workspace and Submitter */}
            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Workspace */}
                <div className="flex items-start gap-3">
                  <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                    <Building className="w-4 h-4 text-blue-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                      Workspace
                    </p>
                    <p className="text-sm text-gray-900 mt-1">
                      {expense.workspace}
                    </p>
                  </div>
                </div>

                {/* Submitted By */}
                {expense.submittedBy && (
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <span className="text-white text-sm font-medium">
                        {expense.submittedBy.initial}
                      </span>
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">
                        Submitted By
                      </p>
                      <p className="text-sm text-gray-900 mt-1">
                        {expense.submittedBy.name}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Footer Actions */}
          <div className="bg-gray-50 px-6 py-3 border-t border-gray-200">
            <div className="flex items-center justify-between">
              <button
                onClick={() => onExpenseClick?.(expense)}
                className="text-sm text-blue-600 hover:text-blue-700 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
              >
                View Details
              </button>
              <div className="text-xs text-gray-500">
                ID: {expense.id}
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseDetailedView;