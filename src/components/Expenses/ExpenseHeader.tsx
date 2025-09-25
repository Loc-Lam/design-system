import React, { useState } from 'react';
import { Filter, Plus, ChevronDown } from 'lucide-react';
import { Button } from '@/components/common/button';
import { ViewToggle, type ViewMode } from '@/components/common/view-toggle';
import { NewExpenseDropdown, type ExpenseOption } from './NewExpenseDropdown';
import { ExpenseCreateModal } from './ExpenseCreateModal';
import { SmartScanFlow } from './SmartScanFlow';
import { ExpenseFilterDrawer, type ExpenseFilterData } from './ExpenseFilterDrawer';
import { cn } from '@/lib/utils';

// Layout Components Level: Grid, container, and structural patterns
// Following component hierarchy: Base → Layout

export interface ExpenseFormData {
  merchant: string;
  date: Date;
  taxType: string;
  taxAmount: number;
  total: number;
  currency: string;
  reimbursable: boolean;
  category: string;
  attendees: string[];
  tag: string;
  description: string;
  report: string;
}

interface ExpenseHeaderProps {
  onNewExpense?: (data: ExpenseFormData) => void;
  onShowFilters?: () => void;
  onViewChange?: (view: ViewMode) => void;
  onApplyFilters?: (filters: ExpenseFilterData) => void;
  onClearFilters?: () => void;
  showFilters?: boolean;
  currentView?: ViewMode;
  activeFilters?: ExpenseFilterData;
  className?: string;
}

export function ExpenseHeader({
  onNewExpense,
  onShowFilters,
  onViewChange,
  onApplyFilters,
  onClearFilters,
  currentView = 'list',
  activeFilters = { categories: [], tags: [] },
  className,
}: ExpenseHeaderProps) {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showFilterDrawer, setShowFilterDrawer] = useState(false);
  const [showSmartScanFlow, setShowSmartScanFlow] = useState(false);
  const [selectedExpenseType, setSelectedExpenseType] = useState<'expense' | 'distance' | 'multiple'>('expense');
  const [selectedOption, setSelectedOption] = useState<string>('manually-create');
  const [extractedData, setExtractedData] = useState<Record<string, unknown> | null>(null);

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

  const handleViewChange = (view: ViewMode) => {
    onViewChange?.(view);
  };

  const handleNewExpenseClick = () => {
    setShowDropdown(!showDropdown);
  };

  const handleDropdownOptionSelect = (option: ExpenseOption) => {
    // Store the selected option
    setSelectedOption(option.id);

    // Determine expense type based on option
    if (option.category === 'distance') {
      setSelectedExpenseType('distance');
    } else if (option.id === 'create-multiple') {
      setSelectedExpenseType('multiple');
    } else {
      setSelectedExpenseType('expense');
    }

    // If scan receipt is selected, show SmartScan flow instead of modal
    if (option.id === 'scan-receipt') {
      setShowSmartScanFlow(true);
    } else {
      setShowModal(true);
    }

    setShowDropdown(false);
  };

  const handleModalSave = (data: ExpenseFormData) => {
    onNewExpense?.(data);
    setShowModal(false);
  };

  const handleModalClose = () => {
    setShowModal(false);
  };

  // SmartScan handlers
  const handleSmartScanComplete = (extractedData: Record<string, unknown>) => {
    // Store extracted data and show the form modal
    setExtractedData(extractedData);
    setShowSmartScanFlow(false);
    setSelectedOption('manually-create'); // Switch to manual mode with pre-filled data
    setShowModal(true);
  };

  const handleSmartScanClose = () => {
    setShowSmartScanFlow(false);
    setExtractedData(null);
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
          <ViewToggle
            currentView={currentView}
            onViewChange={handleViewChange}
          />

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
      <ExpenseCreateModal
        isOpen={showModal}
        onClose={handleModalClose}
        onSave={handleModalSave}
      />

      {/* SmartScan Flow */}
      <SmartScanFlow
        isOpen={showSmartScanFlow}
        onClose={handleSmartScanClose}
        onComplete={handleSmartScanComplete}
      />
    </div>
  );
}

export type { ExpenseFormData, ExpenseFilterData };
export default ExpenseHeader;