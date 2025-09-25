import React, { useState } from 'react';
import { ChevronUp, ChevronDown } from 'lucide-react';
import { ExpenseTableRow, type ExpenseData } from './ExpenseTableRow';
import { ReceiptPreviewModal } from './ReceiptPreviewModal';
import { cn } from '@/lib/utils';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

export interface ExpenseTableColumn {
  key: keyof ExpenseData | 'select';
  label: string;
  sortable?: boolean;
  width?: string;
}

interface ExpenseTableProps {
  expenses: ExpenseData[];
  onRowClick?: (expense: ExpenseData) => void;
  onRowEdit?: (expense: ExpenseData) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  columns?: ExpenseTableColumn[];
  className?: string;
}

const defaultColumns: ExpenseTableColumn[] = [
  { key: 'select', label: '', width: 'w-16' },
  { key: 'date', label: 'DATE', sortable: true, width: 'w-24' },
  { key: 'merchant', label: 'MERCHANT', sortable: true, width: 'w-64' },
  { key: 'amount', label: 'AMOUNT', sortable: true, width: 'w-28' },
  { key: 'workspace', label: 'WORKSPACE', sortable: true, width: 'w-48' },
  { key: 'category', label: 'CATEGORY', sortable: true, width: 'w-32' },
  { key: 'tag', label: 'TAG', sortable: true, width: 'w-24' },
  { key: 'description', label: 'DESCRIPTION', width: 'flex-1' },
];

type SortDirection = 'asc' | 'desc' | null;

interface SortConfig {
  key: keyof ExpenseData | null;
  direction: SortDirection;
}

export function ExpenseTable({
  expenses,
  onRowClick,
  onRowEdit,
  onSelectionChange,
  columns = defaultColumns,
  className,
}: ExpenseTableProps) {
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [sortConfig, setSortConfig] = useState<SortConfig>({ key: null, direction: null });
  const [previewExpense, setPreviewExpense] = useState<ExpenseData | null>(null);
  const [isPreviewModalOpen, setIsPreviewModalOpen] = useState(false);

  // Handle individual row selection

  // Handle select all
  const handleSelectAll = (isSelected: boolean) => {
    const newSelectedIds = isSelected ? expenses.map(expense => expense.id) : [];
    setSelectedIds(newSelectedIds);
    onSelectionChange?.(newSelectedIds);
  };

  // Handle sorting
  const handleSort = (key: keyof ExpenseData) => {
    let direction: SortDirection = 'asc';

    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }

    setSortConfig({ key, direction });
  };

  // Sort expenses based on current sort config
  const sortedExpenses = [...expenses].sort((a, b) => {
    if (!sortConfig.key || !sortConfig.direction) return 0;

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

  const isAllSelected = expenses.length > 0 && selectedIds.length === expenses.length;
  const isPartiallySelected = selectedIds.length > 0 && selectedIds.length < expenses.length;

  const getSortIcon = (columnKey: keyof ExpenseData) => {
    if (sortConfig.key !== columnKey) {
      return <ChevronUp className="w-4 h-4 text-gray-400" />;
    }

    return sortConfig.direction === 'asc'
      ? <ChevronUp className="w-4 h-4 text-blue-600" />
      : <ChevronDown className="w-4 h-4 text-blue-600" />;
  };

  // Handle receipt viewing
  const handleReceiptView = (expense: ExpenseData) => {
    setPreviewExpense(expense);
    setIsPreviewModalOpen(true);
  };

  const handleClosePreview = () => {
    setIsPreviewModalOpen(false);
    setPreviewExpense(null);
  };

  return (
    <div className={cn('bg-white overflow-hidden', className)}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gray-50 border-b border-gray-200">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className={cn(
                    'text-left text-xs font-semibold text-gray-600 uppercase tracking-wider py-3',
                    column.width || 'w-auto',
                    column.key === 'select' ? 'pl-6 pr-3' : 'px-3',
                    column.key === 'description' && 'pr-6'
                  )}
                >
                  {column.key === 'select' ? (
                    <input
                      type="checkbox"
                      checked={isAllSelected}
                      ref={(input) => {
                        if (input) input.indeterminate = isPartiallySelected;
                      }}
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                  ) : column.sortable ? (
                    <button
                      onClick={() => handleSort(column.key as keyof ExpenseData)}
                      className="flex items-center gap-1 hover:text-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-1 py-1"
                    >
                      <span>{column.label}</span>
                      {getSortIcon(column.key as keyof ExpenseData)}
                    </button>
                  ) : (
                    column.label
                  )}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="bg-white">
            {sortedExpenses.length === 0 ? (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-gray-500"
                >
                  <div className="flex flex-col items-center">
                    <p className="text-lg font-medium">No expenses found</p>
                    <p className="text-sm">Add your first expense to get started.</p>
                  </div>
                </td>
              </tr>
            ) : (
              sortedExpenses.map((expense) => (
                <ExpenseTableRow
                  key={expense.id}
                  expense={expense}
                  onRowClick={onRowClick}
                  onRowEdit={onRowEdit}
                  onReceiptView={handleReceiptView}
                />
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* Table Footer with Selection Info */}
      {selectedIds.length > 0 && (
        <div className="border-t border-gray-200 bg-blue-50 px-6 py-3">
          <div className="flex items-center justify-between">
            <p className="text-sm text-blue-700">
              {selectedIds.length} of {expenses.length} expenses selected
            </p>
            <button
              onClick={() => handleSelectAll(false)}
              className="text-sm text-blue-600 hover:text-blue-800 font-medium focus:outline-none focus:ring-2 focus:ring-blue-500 rounded px-2 py-1"
            >
              Clear selection
            </button>
          </div>
        </div>
      )}

      {/* Receipt Preview Modal */}
      <ReceiptPreviewModal
        expense={previewExpense}
        isOpen={isPreviewModalOpen}
        onClose={handleClosePreview}
        onEdit={onRowEdit}
      />
    </div>
  );
}

export default ExpenseTable;