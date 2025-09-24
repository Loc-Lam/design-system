import { useState } from 'react';
import { X, Filter, Calendar, DollarSign, Tag, Flag, CreditCard } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { FormField, TextInput, Checkbox } from '@/components/common/form-field';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { MultiSelect } from '@/components/ui/multi-select';
import type {
  PaymentRequestFilters,
  PaymentStatus,
  PaymentCategory,
  PaymentMethod,
  PaymentPriority,
} from '@/types/payment-request';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

interface FilterPanelProps {
  filters: PaymentRequestFilters;
  onFiltersChange: (filters: PaymentRequestFilters) => void;
  onClose: () => void;
  className?: string;
}

const STATUS_OPTIONS: Array<{ value: PaymentStatus; label: string; color: string }> = [
  { value: 'draft', label: 'Draft', color: 'bg-gray-100 text-gray-700' },
  { value: 'submitted', label: 'Submitted', color: 'bg-blue-100 text-blue-700' },
  { value: 'pending_approval', label: 'Pending Approval', color: 'bg-blue-100 text-blue-700' },
  { value: 'approved', label: 'Approved', color: 'bg-blue-100 text-blue-700' },
  { value: 'rejected', label: 'Rejected', color: 'bg-blue-100 text-blue-700' },
  { value: 'processing', label: 'Processing', color: 'bg-blue-100 text-blue-700' },
  { value: 'completed', label: 'Completed', color: 'bg-blue-100 text-blue-700' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-gray-100 text-gray-700' },
  { value: 'on_hold', label: 'On Hold', color: 'bg-blue-100 text-blue-700' },
];

const CATEGORY_OPTIONS: Array<{ value: PaymentCategory; label: string; icon: React.ReactNode }> = [
  { value: 'expense_reimbursement', label: 'Expense Reimbursement', icon: <CreditCard className="w-4 h-4" /> },
  { value: 'vendor_payment', label: 'Vendor Payment', icon: <Tag className="w-4 h-4" /> },
  { value: 'salary', label: 'Salary', icon: <DollarSign className="w-4 h-4" /> },
  { value: 'contractor_payment', label: 'Contractor Payment', icon: <Tag className="w-4 h-4" /> },
  { value: 'utility', label: 'Utility', icon: <Tag className="w-4 h-4" /> },
  { value: 'office_supplies', label: 'Office Supplies', icon: <Tag className="w-4 h-4" /> },
  { value: 'travel', label: 'Travel', icon: <Tag className="w-4 h-4" /> },
  { value: 'other', label: 'Other', icon: <Tag className="w-4 h-4" /> },
];

const METHOD_OPTIONS: Array<{ value: PaymentMethod; label: string }> = [
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'check', label: 'Check' },
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'wire_transfer', label: 'Wire Transfer' },
];

const PRIORITY_OPTIONS: Array<{ value: PaymentPriority; label: string; color: string }> = [
  { value: 'low', label: 'Low', color: 'bg-gray-500' },
  { value: 'normal', label: 'Normal', color: 'bg-blue-500' },
  { value: 'high', label: 'High', color: 'bg-orange-500' },
  { value: 'urgent', label: 'Urgent', color: 'bg-blue-500' },
];

export default function FilterPanel({
  filters,
  onFiltersChange,
  onClose,
  className,
}: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<PaymentRequestFilters>(filters);

  const updateFilter = <K extends keyof PaymentRequestFilters>(
    key: K,
    value: PaymentRequestFilters[K]
  ) => {
    setLocalFilters(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayFilter = <K extends keyof PaymentRequestFilters>(
    key: K,
    value: string,
    currentArray?: string[]
  ) => {
    const array = currentArray || [];
    const newArray = array.includes(value)
      ? array.filter(item => item !== value)
      : [...array, value];

    updateFilter(key, newArray.length > 0 ? newArray as PaymentRequestFilters[K] : undefined);
  };

  const applyFilters = () => {
    onFiltersChange(localFilters);
    onClose();
  };

  const clearFilters = () => {
    setLocalFilters({});
  };

  const hasActiveFilters = Object.keys(localFilters).some(key => {
    const value = localFilters[key as keyof PaymentRequestFilters];
    if (Array.isArray(value)) return value.length > 0;
    if (typeof value === 'object' && value !== null) {
      return Object.values(value).some(v => v);
    }
    return !!value;
  });

  return (
    <div className={cn("fixed inset-0 z-50 bg-black/50", className)}>
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-xl">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="border-b px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Filter className="h-5 w-5 text-gray-600" />
                <h2 className="text-lg font-semibold">Filters</h2>
                {hasActiveFilters && (
                  <span className="ml-2 rounded-full bg-blue-100 px-2 py-1 text-xs font-medium text-blue-700">
                    Active
                  </span>
                )}
              </div>
              <button
                onClick={onClose}
                className="rounded-lg p-2 hover:bg-gray-100 transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
          </div>

          {/* Filter Content */}
          <div className="flex-1 overflow-y-auto px-6 py-4 space-y-6">
            {/* Status Filter */}
            <div className="space-y-3">
              <FormField label="Status">
                <Select
                  value={localFilters.status?.[0] || ''}
                  onValueChange={(value) => updateFilter('status', value ? [value as PaymentStatus] : undefined)}
                  placeholder="Select status"
                >
                  <SelectContent>
                    {STATUS_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Category Filter */}
            <div className="space-y-3">
              <FormField label="Category">
                <Select
                  value={localFilters.category?.[0] || ''}
                  onValueChange={(value) => updateFilter('category', value ? [value as PaymentCategory] : undefined)}
                  placeholder="Select category"
                >
                  <SelectContent>
                    {CATEGORY_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Date Range */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <Calendar className="w-4 h-4" />
                Date Range
              </h3>
              <div className="space-y-2">
                <FormField label="From">
                  <DatePicker
                    date={localFilters.dateRange?.start || ''}
                    onDateChange={(date) => updateFilter('dateRange', {
                      start: date ? date.toISOString().split('T')[0] : '',
                      end: localFilters.dateRange?.end || ''
                    })}
                    placeholder="Select start date"
                  />
                </FormField>
                <FormField label="To">
                  <DatePicker
                    date={localFilters.dateRange?.end || ''}
                    onDateChange={(date) => updateFilter('dateRange', {
                      start: localFilters.dateRange?.start || '',
                      end: date ? date.toISOString().split('T')[0] : ''
                    })}
                    placeholder="Select end date"
                  />
                </FormField>
              </div>
            </div>

            {/* Amount Range */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700 flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Amount Range
              </h3>
              <div className="grid grid-cols-2 gap-2">
                <FormField label="Min">
                  <TextInput
                    type="number"
                    step="0.01"
                    placeholder="0.00"
                    value={localFilters.amountRange?.min || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      updateFilter('amountRange', {
                        min: isNaN(value) ? 0 : value,
                        max: localFilters.amountRange?.max || 999999
                      });
                    }}
                  />
                </FormField>
                <FormField label="Max">
                  <TextInput
                    type="number"
                    step="0.01"
                    placeholder="999,999"
                    value={localFilters.amountRange?.max || ''}
                    onChange={(e) => {
                      const value = parseFloat(e.target.value);
                      updateFilter('amountRange', {
                        min: localFilters.amountRange?.min || 0,
                        max: isNaN(value) ? 999999 : value
                      });
                    }}
                  />
                </FormField>
              </div>
            </div>

            {/* Payment Method */}
            <div className="space-y-3">
              <FormField label="Payment Method">
                <Select
                  value={localFilters.paymentMethod?.[0] || ''}
                  onValueChange={(value) => updateFilter('paymentMethod', value ? [value as PaymentMethod] : undefined)}
                  placeholder="Select payment method"
                >
                  <SelectContent>
                    {METHOD_OPTIONS.map(option => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormField>
            </div>

            {/* Priority */}
            <div className="space-y-3">
              <FormField label="Priority">
                <MultiSelect
                  options={PRIORITY_OPTIONS}
                  value={localFilters.priority || []}
                  onValueChange={(values) => updateFilter('priority', values.length > 0 ? values as PaymentPriority[] : undefined)}
                  placeholder="Select priorities"
                />
              </FormField>
            </div>

            {/* Search */}
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-700">Search</h3>
              <TextInput
                type="text"
                placeholder="Search by title, payee, description..."
                value={localFilters.search || ''}
                onChange={(e) => updateFilter('search', e.target.value)}
              />
            </div>
          </div>

          {/* Footer */}
          <div className="border-t px-6 py-4">
            <div className="flex gap-3">
              <Button
                variant="outline"
                onClick={clearFilters}
                disabled={!hasActiveFilters}
                className="flex-1"
              >
                Clear All
              </Button>
              <Button
                onClick={applyFilters}
                className="flex-1"
              >
                Apply Filters
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}