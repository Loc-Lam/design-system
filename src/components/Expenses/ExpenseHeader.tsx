import React, { useState } from 'react';
import { Filter, Plus, Grid3X3, MoreHorizontal, List, ChevronDown } from 'lucide-react';
import { Button } from '@/components/common/button';
import { NewExpenseDropdown, type ExpenseOption } from './NewExpenseDropdown';
import { NewExpenseModal, type ExpenseFormData } from './NewExpenseModal';
import { ExpenseFilterDrawer, type ExpenseFilterData } from './ExpenseFilterDrawer';
import { cn } from '@/lib/utils';

// Layout Components Level: Grid, container, and structural patterns
// Following component hierarchy: Base → Layout

interface ExpenseHeaderProps {
  onNewExpense?: (data: ExpenseFormData) => void;
  onShowFilters?: () => void;
  onViewChange?: (view: 'list' | 'grid' | 'detailed') => void;
  onApplyFilters?: (filters: ExpenseFilterData) => void;
  onClearFilters?: () => void;
  showFilters?: boolean;
  currentView?: 'list' | 'grid' | 'detailed';
  activeFilters?: ExpenseFilterData;
  className?: string;
}

export function ExpenseHeader({
  onNewExpense,
  onShowFilters,
  onViewChange,
  onApplyFilters,
  onClearFilters,
  showFilters = false,
  currentView = 'list',
  activeFilters = {},
  className,
}: ExpenseHeaderProps) {
  const [filtersVisible, setFiltersVisible] = useState(showFilters);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<'expense' | 'distance' | 'multiple'>('expense');

  const handleShowFilters = () => {
    setShowFilterDrawer(true);
    onShowFilters?.();
  };

  const handleApplyFilters = (filters: ExpenseFilterData) => {
    onApplyFilters?.(filters);
  };

  const handleClearFilters = () => {
    onClearFilters?.();
  };

  const hasActiveFilters = () => {
    return (
      activeFilters.categories?.length > 0 ||
      activeFilters.tags?.length > 0 ||
      activeFilters.dateFrom ||
      activeFilters.dateTo ||
      activeFilters.amountMin !== undefined ||
      activeFilters.amountMax !== undefined ||
      activeFilters.description ||
      activeFilters.merchant ||
      activeFilters.status
    );
  };

  const handleViewChange = (view: 'list' | 'grid' | 'detailed') => {
    onViewChange?.(view);
  };

  const handleNewExpenseClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownOptionSelect = (option: ExpenseOption) => {
    console.log('Selected expense option:', option);

    // Determine expense type based on option
    if (option.category === 'distance') {
      setSelectedExpenseType('distance');
    } else if (option.id === 'create-multiple') {
      setSelectedExpenseType('multiple');
    } else {
      setSelectedExpenseType('expense');
    }

    setShowModal(true);
    setShowDropdown(false);
  };

  const handleModalSave = (data: ExpenseFormData) => {
    console.log('Saving expense data:', data);
    onNewExpense?.(data);
    setShowModal(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  return (
    <div className={cn('bg-white border-b border-gray-200 px-6 py-4', className)}>
      <div className="flex items-center justify-between">
        {/* Left side - Title and Filters */}
        <div className="flex items-center gap-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Expenses</h1>
          </div>

          {/* Show Filters Button */}
          <button
            onClick={handleShowFilters}
            className={cn(
              'flex items-center gap-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
              'hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500',
              hasActiveFilters()
                ? 'bg-blue-100 text-blue-700 border border-blue-300'
                : 'text-blue-600 hover:text-blue-700 border border-transparent'
            )}
          >
            <Filter className="w-4 h-4" />
            <span>Filters</span>
            {hasActiveFilters() && (
              <span className="ml-1 px-2 py-1 bg-blue-600 text-white text-xs rounded-full">
                {[
                  activeFilters.categories?.length || 0,
                  activeFilters.tags?.length || 0,
                  activeFilters.dateFrom ? 1 : 0,
                  activeFilters.dateTo ? 1 : 0,
                  activeFilters.amountMin !== undefined ? 1 : 0,
                  activeFilters.amountMax !== undefined ? 1 : 0,
                  activeFilters.description ? 1 : 0,
                  activeFilters.merchant ? 1 : 0,
                  activeFilters.status ? 1 : 0,
                ].reduce((sum, count) => sum + count, 0)}
              </span>
            )}
          </button>
        </div>

        {/* Right side - View toggles and New Expense button */}
        <div className="flex items-center gap-3">
          {/* View Toggle Buttons */}
          <div className="flex items-center border border-gray-300 rounded-lg">
            <button
              onClick={() => handleViewChange('list')}
              className={cn(
                'p-2 rounded-l-lg transition-colors duration-200',
                'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentView === 'list'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleViewChange('grid')}
              className={cn(
                'p-2 transition-colors duration-200',
                'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentView === 'grid'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              title="Grid View"
            >
              <Grid3X3 className="w-4 h-4" />
            </button>

            <button
              onClick={() => handleViewChange('detailed')}
              className={cn(
                'p-2 rounded-r-lg transition-colors duration-200',
                'hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500',
                currentView === 'detailed'
                  ? 'bg-gray-900 text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
              title="Detailed View"
            >
              <MoreHorizontal className="w-4 h-4" />
            </button>
          </div>

          {/* New Expense Button with Dropdown */}
          <div className="relative">
            <Button
              onClick={handleNewExpenseClick}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 shadow-sm"
            >
              <Plus className="w-4 h-4" />
              <span className="font-medium">New Expense</span>
              <ChevronDown className="w-4 h-4" />
            </Button>

            <NewExpenseDropdown
              isOpen={showDropdown}
              onOptionSelect={handleDropdownOptionSelect}
              onClose={() => setShowDropdown(false)}
            />
          </div>
        </div>
      </div>

      {/* Filter Drawer */}
      <ExpenseFilterDrawer
        open={showFilterDrawer}
        onOpenChange={setShowFilterDrawer}
        onApplyFilters={handleApplyFilters}
        onClearFilters={handleClearFilters}
        initialFilters={activeFilters}
      />

      {/* New Expense Modal */}
      <NewExpenseModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
        expenseType={selectedExpenseType}
      />
    </div>
  );
}

export type { ExpenseFormData, ExpenseFilterData };
export default ExpenseHeader;