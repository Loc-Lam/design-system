import { useState } from 'react';
import { ChevronDown, ChevronUp, Eye, Edit, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

export interface ExpenseItem {
  id: string;
  date: string;
  merchant: string;
  amount: number;
  currency: string;
  workspace: string;
  category: string;
  tag?: string;
  description: string;
  status: 'open' | 'processing' | 'approved' | 'reimbursed' | 'rejected';
  receiptImage?: string;
  receiptType?: 'smartscan' | 'manual' | 'missing';
  assignee?: {
    name: string;
    avatar: string;
    initials: string;
  };
}

export interface ExpenseTableProps {
  expenses: ExpenseItem[];
  onExpenseClick?: (expense: ExpenseItem) => void;
  onExpenseEdit?: (expense: ExpenseItem) => void;
  className?: string;
}

interface SortConfig {
  key: keyof ExpenseItem | null;
  direction: 'asc' | 'desc';
}

const statusColors = {
  open: 'bg-blue-100 text-blue-700 border-blue-200',
  processing: 'bg-blue-50 text-blue-600 border-blue-200',
  approved: 'bg-blue-100 text-blue-700 border-blue-300',
  reimbursed: 'bg-blue-100 text-blue-700 border-blue-500',
  rejected: 'bg-red-50 text-red-600 border-red-200',
};

const statusLabels = {
  open: 'Open',
  processing: 'Processing',
  approved: 'Approved',
  reimbursed: 'Reimbursed',
  rejected: 'Rejected',
};

export function ExpenseTable({
  expenses,
  onExpenseClick,
  onExpenseEdit,
  className,
}: ExpenseTableProps) {
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: 'asc' });
  const [selectedRows, setSelectedRows] = useState<Set<string>>(new Set());

  const handleSort = (key: keyof ExpenseItem) => {
    let direction: 'asc' | 'desc' = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const sortedExpenses = [...expenses].sort((a, b) => {
    if (!sortConfig.key) return 0;

    const aValue = a[sortConfig.key];
    const bValue = b[sortConfig.key];

    if (aValue < bValue) {
      return sortConfig.direction === 'asc' ? -1 : 1;
    }
    if (aValue > bValue) {
      return sortConfig.direction === 'asc' ? 1 : -1;
    }
    return 0;
  });

  const toggleRowSelection = (expenseId: string) => {
    const newSelected = new Set(selectedRows);
    if (newSelected.has(expenseId)) {
      newSelected.delete(expenseId);
    } else {
      newSelected.add(expenseId);
    }
    setSelectedRows(newSelected);
  };

  const toggleAllSelection = () => {
    if (selectedRows.size === expenses.length) {
      setSelectedRows(new Set());
    } else {
      setSelectedRows(new Set(expenses.map(e => e.id)));
    }
  };

  const formatAmount = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const getSortIcon = (key: keyof ExpenseItem) => {
    if (sortConfig.key !== key) {
      return <ChevronDown className="w-4 h-4 text-gray-400" />;
    }
    return sortConfig.direction === 'asc' ? (
      <ChevronUp className="w-4 h-4 text-blue-600" />
    ) : (
      <ChevronDown className="w-4 h-4 text-blue-600" />
    );
  };

  return (
    <div className={cn('bg-white rounded-lg border border-gray-200 shadow-sm', className)}>
      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-left">
                <input
                  type="checkbox"
                  checked={selectedRows.size === expenses.length && expenses.length > 0}
                  onChange={toggleAllSelection}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
              </th>

              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('date')}
              >
                <div className="flex items-center space-x-1">
                  <span>Date</span>
                  {getSortIcon('date')}
                </div>
              </th>

              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('merchant')}
              >
                <div className="flex items-center space-x-1">
                  <span>Merchant</span>
                  {getSortIcon('merchant')}
                </div>
              </th>

              <th
                className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('amount')}
              >
                <div className="flex items-center space-x-1">
                  <span>Amount</span>
                  {getSortIcon('amount')}
                </div>
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Workspace
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Category
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tag
              </th>

              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Description
              </th>

              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedExpenses.map((expense) => (
              <tr
                key={expense.id}
                className={cn(
                  'hover:bg-gray-50 cursor-pointer transition-colors',
                  selectedRows.has(expense.id) ? 'bg-blue-50' : ''
                )}
                onClick={() => onExpenseClick?.(expense)}
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <input
                    type="checkbox"
                    checked={selectedRows.has(expense.id)}
                    onChange={(e) => {
                      e.stopPropagation();
                      toggleRowSelection(expense.id);
                    }}
                    className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                  />
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex flex-col">
                    <span className="text-sm text-gray-900">{formatDate(expense.date)}</span>
                    <span
                      className={cn(
                        'inline-flex px-2 py-1 text-xs font-medium rounded-full border',
                        statusColors[expense.status]
                      )}
                    >
                      {statusLabels[expense.status]}
                    </span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-3">
                    {expense.receiptImage ? (
                      <div className="w-12 h-12 rounded-lg border border-gray-200 overflow-hidden flex-shrink-0">
                        <img
                          src={expense.receiptImage}
                          alt="Receipt"
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ) : (
                      <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                        <span className="text-gray-400 text-xs">No receipt</span>
                      </div>
                    )}
                    <div>
                      <div className="text-sm font-medium text-gray-900">{expense.merchant}</div>
                      {expense.receiptType === 'smartscan' && (
                        <div className="text-xs text-blue-600">SmartScanning</div>
                      )}
                    </div>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {formatAmount(expense.amount, expense.currency)}
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="flex items-center space-x-2">
                    {expense.assignee && (
                      <div className="w-6 h-6 rounded-full bg-purple-500 flex items-center justify-center">
                        <span className="text-xs text-white font-medium">
                          {expense.assignee.initials}
                        </span>
                      </div>
                    )}
                    <span className="text-sm text-gray-900">{expense.workspace}</span>
                  </div>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-900">{expense.category}</span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap">
                  <span className="text-sm text-gray-500">{expense.tag || '-'}</span>
                </td>

                <td className="px-6 py-4">
                  <span className="text-sm text-gray-900 max-w-xs truncate block">
                    {expense.description}
                  </span>
                </td>

                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                  <div className="flex items-center justify-end space-x-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExpenseClick?.(expense);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        onExpenseEdit?.(expense);
                      }}
                      className="h-8 w-8 p-0"
                    >
                      <Edit className="w-4 h-4" />
                    </Button>

                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-8 w-8 p-0"
                    >
                      <MoreHorizontal className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default ExpenseTable;