import React, { useState } from 'react';
import { Search, Calendar, DollarSign, Tag, FileText, RotateCcw } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Select } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter, SheetClose } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

export interface ExpenseFilterData {
  categories: string[];
  tags: string[];
  dateFrom?: Date;
  dateTo?: Date;
  amountMin?: number;
  amountMax?: number;
  description?: string;
  merchant?: string;
  status?: string;
}

interface ExpenseFilterDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onApplyFilters: (filters: ExpenseFilterData) => void;
  onClearFilters: () => void;
  initialFilters?: ExpenseFilterData;
  className?: string;
}

// Mock options for filters
const categoryOptions = [
  { value: 'advertising', label: 'Advertising' },
  { value: 'meals', label: 'Meals & Entertainment' },
  { value: 'travel', label: 'Travel' },
  { value: 'office-supplies', label: 'Office Supplies' },
  { value: 'software', label: 'Software' },
  { value: 'equipment', label: 'Equipment' },
  { value: 'training', label: 'Training & Development' },
  { value: 'utilities', label: 'Utilities' },
  { value: 'insurance', label: 'Insurance' },
  { value: 'professional-services', label: 'Professional Services' },
];

const tagOptions = [
  { value: 'icu', label: 'ICU' },
  { value: 'marketing', label: 'Marketing' },
  { value: 'sales', label: 'Sales' },
  { value: 'engineering', label: 'Engineering' },
  { value: 'hr', label: 'HR' },
  { value: 'finance', label: 'Finance' },
  { value: 'operations', label: 'Operations' },
  { value: 'client-work', label: 'Client Work' },
  { value: 'internal', label: 'Internal' },
  { value: 'urgent', label: 'Urgent' },
  { value: 'recurring', label: 'Recurring' },
];

const statusOptions = [
  { value: 'all', label: 'All Status' },
  { value: 'draft', label: 'Draft' },
  { value: 'submitted', label: 'Submitted' },
  { value: 'processing', label: 'Processing' },
  { value: 'approved', label: 'Approved' },
  { value: 'rejected', label: 'Rejected' },
  { value: 'reimbursed', label: 'Reimbursed' },
];

export function ExpenseFilterDrawer({
  open,
  onOpenChange,
  onApplyFilters,
  onClearFilters,
  initialFilters = {},
  className,
}: ExpenseFilterDrawerProps) {
  const [filters, setFilters] = useState<ExpenseFilterData>(initialFilters);

  const handleApplyFilters = () => {
    onApplyFilters(filters);
    onOpenChange(false);
  };

  const handleClearFilters = () => {
    const clearedFilters: ExpenseFilterData = {
      categories: [],
      tags: [],
      dateFrom: undefined,
      dateTo: undefined,
      amountMin: undefined,
      amountMax: undefined,
      description: '',
      merchant: '',
      status: undefined,
    };
    setFilters(clearedFilters);
    onClearFilters();
  };

  const hasActiveFilters = () => {
    return (
      filters.categories.length > 0 ||
      filters.tags.length > 0 ||
      filters.dateFrom ||
      filters.dateTo ||
      filters.amountMin !== undefined ||
      filters.amountMax !== undefined ||
      filters.description ||
      filters.merchant ||
      filters.status
    );
  };

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className={cn('w-full max-w-md', className)}>
        <SheetClose onClick={() => onOpenChange(false)} />

        <SheetHeader>
          <SheetTitle>Filter Expenses</SheetTitle>
          <SheetDescription>
            Apply filters to find specific expenses and transactions
          </SheetDescription>
        </SheetHeader>

        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
          {/* Category Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 text-blue-600" />
              Categories
            </label>
            <MultiSelect
              options={categoryOptions}
              value={filters.categories}
              onValueChange={(categories) => setFilters({ ...filters, categories })}
              placeholder="Select categories..."
              className="w-full"
            />
          </div>

          {/* Tags Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Tag className="w-4 h-4 text-blue-600" />
              Tags
            </label>
            <MultiSelect
              options={tagOptions}
              value={filters.tags}
              onValueChange={(tags) => setFilters({ ...filters, tags })}
              placeholder="Select tags..."
              className="w-full"
            />
          </div>

          {/* Date Range Filter */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Calendar className="w-4 h-4 text-blue-600" />
              Date Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">From</label>
                <DatePicker
                  selected={filters.dateFrom}
                  onDateChange={(date) => setFilters({ ...filters, dateFrom: date })}
                  placeholder="Start date"
                  className="w-full"
                />
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">To</label>
                <DatePicker
                  selected={filters.dateTo}
                  onDateChange={(date) => setFilters({ ...filters, dateTo: date })}
                  placeholder="End date"
                  className="w-full"
                />
              </div>
            </div>
          </div>

          {/* Amount Range Filter */}
          <div className="space-y-3">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <DollarSign className="w-4 h-4 text-blue-600" />
              Amount Range
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="block text-xs text-gray-500 mb-1">Min Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.amountMin || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      amountMin: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    placeholder="0.00"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
              <div>
                <label className="block text-xs text-gray-500 mb-1">Max Amount</label>
                <div className="relative">
                  <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    value={filters.amountMax || ''}
                    onChange={(e) => setFilters({
                      ...filters,
                      amountMax: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    placeholder="No limit"
                    className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Status Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <FileText className="w-4 h-4 text-blue-600" />
              Status
            </label>
            <Select
              value={filters.status || ''}
              onValueChange={(status) => setFilters({ ...filters, status: status || undefined })}
              placeholder="All Status"
            >
              {statusOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </Select>
          </div>

          {/* Description Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Search className="w-4 h-4 text-blue-600" />
              Description
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.description || ''}
                onChange={(e) => setFilters({ ...filters, description: e.target.value })}
                placeholder="Search descriptions..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          {/* Merchant Filter */}
          <div className="space-y-2">
            <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
              <Search className="w-4 h-4 text-blue-600" />
              Merchant
            </label>
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
              <input
                type="text"
                value={filters.merchant || ''}
                onChange={(e) => setFilters({ ...filters, merchant: e.target.value })}
                placeholder="Search merchants..."
                className="pl-10 w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>

        <SheetFooter>
          <div className="flex items-center justify-between gap-3 w-full">
            <Button
              variant="outline"
              onClick={handleClearFilters}
              disabled={!hasActiveFilters()}
              className="flex items-center gap-2"
            >
              <RotateCcw className="w-4 h-4" />
              Clear All
            </Button>
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => onOpenChange(false)}
              >
                Cancel
              </Button>
              <Button
                onClick={handleApplyFilters}
                className="bg-blue-600 hover:bg-blue-700 text-white"
              >
                Apply Filters
                {hasActiveFilters() && (
                  <span className="ml-1 px-2 py-1 bg-blue-500 text-xs rounded-full">
                    {[
                      filters.categories.length,
                      filters.tags.length,
                      filters.dateFrom ? 1 : 0,
                      filters.dateTo ? 1 : 0,
                      filters.amountMin !== undefined ? 1 : 0,
                      filters.amountMax !== undefined ? 1 : 0,
                      filters.description ? 1 : 0,
                      filters.merchant ? 1 : 0,
                      filters.status ? 1 : 0,
                    ].reduce((sum, count) => sum + count, 0)}
                  </span>
                )}
              </Button>
            </div>
          </div>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  );
}

export default ExpenseFilterDrawer;