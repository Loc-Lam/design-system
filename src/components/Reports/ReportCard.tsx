import React from 'react';
import { X, Receipt, Calendar, User } from 'lucide-react';
import { cn } from '@/lib/utils';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

export interface ExpenseItem {
  id: string;
  date: string;
  merchant: string;
  tag: string;
  total: number;
  status: 'approved' | 'rejected' | 'pending';
  category?: string;
}

export interface ExpenseCategory {
  id: string;
  name: string;
  total: number;
  expenses: ExpenseItem[];
}

export interface ReportData {
  id: string;
  title: string;
  submittedBy: {
    name: string;
    email: string;
    initial: string;
  };
  approver: {
    name: string;
    email: string;
    initial: string;
  };
  submittedDate: string;
  totalAmount: number;
  status: 'pending' | 'processing' | 'approved' | 'rejected';
  categories: ExpenseCategory[];
  nextStep: string;
  stepDescription: string;
}

interface ReportCardProps {
  report: ReportData;
  onExpenseStatusChange?: (expenseId: string, status: ExpenseItem['status']) => void;
  className?: string;
}

export function ReportCard({
  report,
  onExpenseStatusChange,
  className,
}: ReportCardProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'processing':
        return 'bg-blue-100 text-blue-700';
      case 'approved':
        return 'bg-blue-50 text-blue-600';
      case 'rejected':
        return 'bg-blue-100 text-blue-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getExpenseStatusIcon = (status: ExpenseItem['status']) => {
    switch (status) {
      case 'rejected':
        return <X className="w-4 h-4 text-blue-500" />;
      case 'approved':
        return <div className="w-4 h-4 rounded-full bg-blue-500" />;
      case 'pending':
        return <div className="w-4 h-4 rounded-full bg-blue-400" />;
      default:
        return null;
    }
  };

  const getTagColor = (tag: string) => {
    if (tag.toLowerCase().includes('meal')) {
      return 'bg-blue-100 text-blue-700 border-blue-200';
    }
    return 'bg-gray-100 text-gray-700 border-gray-200';
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
    <div className={cn('bg-white rounded-lg border border-gray-200 overflow-hidden', className)}>
      {/* Next Step Header */}
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm font-medium text-gray-900 mb-1">Next Step:</p>
            <p className="text-sm text-gray-600">
              {report.stepDescription} <button className="text-blue-600 hover:text-blue-700">Undo Submit</button>
            </p>
          </div>
          <div className="flex items-center gap-4">
            <span className={cn('px-2 py-1 rounded-full text-xs font-medium', getStatusColor(report.status))}>
              {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
            </span>
            <p className="text-sm text-gray-500">
              See the future! View this report in the newly designed app
              <button className="ml-2 px-3 py-1 bg-blue-600 text-white text-xs rounded-full hover:bg-blue-700">
                Take me there
              </button>
            </p>
          </div>
        </div>
      </div>

      {/* Report Header */}
      <div className="px-6 py-4">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center gap-3">
            <h2 className="text-xl font-semibold text-gray-900">{report.title}</h2>
            <Receipt className="w-5 h-5 text-gray-400" />
          </div>
          <div className="text-right">
            <p className="text-2xl font-bold text-gray-900">{formatAmount(report.totalAmount)}</p>
          </div>
        </div>

        {/* Submitter and Approver Info */}
        <div className="flex items-center gap-6 mb-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">From:</span>
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">{report.submittedBy.initial}</span>
            </div>
            <span className="text-sm text-gray-700">{report.submittedBy.email}</span>
          </div>

          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-500">To:</span>
            <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white text-xs font-medium">{report.approver.initial}</span>
            </div>
            <span className="text-sm text-gray-700">{report.approver.email}</span>
          </div>
        </div>

        {/* Submission Date */}
        <div className="flex items-center gap-2 mb-6">
          <Calendar className="w-4 h-4 text-gray-400" />
          <span className="text-sm text-gray-600">{report.submittedDate}</span>
        </div>

        {/* Expense Categories */}
        {report.categories.map((category) => (
          <div key={category.id} className="mb-6">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-lg font-medium text-gray-900">
                {category.name} - {formatAmount(category.total)}
              </h3>
            </div>

            {/* Expense Table Header */}
            <div className="grid grid-cols-12 gap-4 px-4 py-2 bg-gray-50 text-xs font-medium text-gray-500 uppercase tracking-wider">
              <div className="col-span-2">DATE</div>
              <div className="col-span-3">MERCHANT</div>
              <div className="col-span-3">TAG</div>
              <div className="col-span-2">TOTAL</div>
              <div className="col-span-2"></div>
            </div>

            {/* Expense Items */}
            <div className="border-t border-gray-200">
              {category.expenses.map((expense) => (
                <div key={expense.id} className="grid grid-cols-12 gap-4 px-4 py-3 border-b border-gray-100 hover:bg-gray-50">
                  <div className="col-span-2 flex items-center gap-2">
                    {getExpenseStatusIcon(expense.status)}
                    <span className="text-sm text-gray-600">{formatDate(expense.date)}</span>
                  </div>

                  <div className="col-span-3 flex items-center">
                    <span className="text-sm text-gray-900">{expense.merchant}</span>
                  </div>

                  <div className="col-span-3 flex items-center">
                    {expense.tag && (
                      <span className={cn(
                        'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border',
                        getTagColor(expense.tag)
                      )}>
                        <div className="w-2 h-2 rounded-full bg-current mr-1 opacity-60" />
                        {expense.tag}
                      </span>
                    )}
                  </div>

                  <div className="col-span-2 flex items-center">
                    <span className="text-sm font-medium text-gray-900">{formatAmount(expense.total)}</span>
                  </div>

                  <div className="col-span-2 flex items-center justify-end">
                    <Receipt className="w-4 h-4 text-gray-400" />
                  </div>
                </div>
              ))}
            </div>

            {/* Category Total */}
            <div className="px-4 py-3 bg-gray-50 border-t-2 border-gray-200">
              <div className="flex items-center justify-end">
                <span className="text-sm font-semibold text-gray-900">
                  {formatAmount(category.total)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ReportCard;