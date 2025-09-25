import { Edit, Eye } from 'lucide-react';
import { ReceiptImage } from '@/components/common/receipt-image';
import type { ExpenseData } from './ExpenseTableRow';
import { cn } from '@/lib/utils';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite
// Using blue color system compliance throughout

interface ExpenseGridViewProps {
  expenses: ExpenseData[];
  onExpenseClick?: (expense: ExpenseData) => void;
  onExpenseEdit?: (expense: ExpenseData) => void;
  onReceiptView?: (expense: ExpenseData) => void;
  className?: string;
}

export function ExpenseGridView({
  expenses,
  onExpenseClick,
  onExpenseEdit,
  onReceiptView,
  className,
}: ExpenseGridViewProps) {
  const formatAmount = (amount: number) => {
    return `$${Math.abs(amount).toFixed(2)}`;
  };

  const formatDate = (dateString: string) => {
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
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
    <div className={cn('grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6', className)}>
      {expenses.map((expense) => (
        <div
          key={expense.id}
          className="bg-white rounded-lg border border-gray-200 overflow-hidden hover:border-blue-300 hover:shadow-md transition-all duration-200 cursor-pointer"
          onClick={() => onExpenseClick?.(expense)}
        >
          {/* Receipt Image Header */}
          <div className="relative h-32 bg-gray-50 flex items-center justify-center">
            <ReceiptImage
              receiptUrl={expense.receipt?.url}
              receiptType={expense.receipt?.type}
              merchantName={expense.merchant}
              amount={expense.amount}
              size="medium"
              showPreview={false}
              className="max-h-28"
            />

            {/* Action Buttons */}
            <div className="absolute top-2 right-2 flex gap-1">
              {onReceiptView && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onReceiptView(expense);
                  }}
                  className="p-1.5 bg-white rounded-md shadow-sm border border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  title="View receipt"
                >
                  <Eye className="w-3 h-3" />
                </button>
              )}
              {onExpenseEdit && (
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onExpenseEdit(expense);
                  }}
                  className="p-1.5 bg-white rounded-md shadow-sm border border-gray-200 text-blue-600 hover:text-blue-700 hover:bg-blue-50 transition-colors"
                  title="Edit expense"
                >
                  <Edit className="w-3 h-3" />
                </button>
              )}
            </div>
          </div>

          {/* Card Content */}
          <div className="p-4">
            {/* Header: Merchant and Amount */}
            <div className="flex items-start justify-between mb-2">
              <div className="min-w-0 flex-1">
                <h3 className="text-sm font-semibold text-gray-900 truncate">
                  {expense.merchant}
                </h3>
                <p className="text-xs text-gray-600">{formatDate(expense.date)}</p>
              </div>
              <div className="text-right ml-2">
                <p className="text-lg font-bold text-gray-900">
                  {formatAmount(expense.amount)}
                </p>
              </div>
            </div>

            {/* Status Badge */}
            <div className="mb-3">
              <span
                className={cn(
                  'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
                  getStatusColor(expense.status)
                )}
              >
                {expense.status}
              </span>
            </div>

            {/* Category and Tag */}
            <div className="space-y-2 mb-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-gray-500">Category:</span>
                <span className="text-gray-900 font-medium">{expense.category}</span>
              </div>
              {expense.tag && (
                <div className="flex items-center justify-between text-xs">
                  <span className="text-gray-500">Tag:</span>
                  <span className="text-gray-900 font-medium">{expense.tag}</span>
                </div>
              )}
            </div>

            {/* Description */}
            <div className="mb-3">
              <p className="text-xs text-gray-600 line-clamp-2">
                {expense.description}
              </p>
            </div>

            {/* Workspace with Submitter */}
            <div className="flex items-center justify-between pt-2 border-t border-gray-100">
              <div className="flex items-center gap-2 min-w-0 flex-1">
                {expense.submittedBy && (
                  <div className="w-5 h-5 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                    <span className="text-white text-xs font-medium">
                      {expense.submittedBy.initial}
                    </span>
                  </div>
                )}
                <span className="text-xs text-gray-600 truncate">
                  {expense.workspace}
                </span>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

export default ExpenseGridView;