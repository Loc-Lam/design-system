import { useState } from 'react';
import { ChevronDown, ChevronUp, Filter, X } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';

// Layout Components Level: Structural patterns and containers
// Following component hierarchy: Design Tokens → Base → Layout → Composite

export interface FilterState {
  dateRange?: {
    from?: string;
    to?: string;
  };
  merchants?: string[];
  categories?: string[];
  statuses?: string[];
  amountRange?: {
    min?: number;
    max?: number;
  };
  workspaces?: string[];
  tags?: string[];
}

export interface ExpenseFilterPanelProps {
  isVisible: boolean;
  onToggleVisibility: () => void;
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  availableOptions?: {
    merchants?: string[];
    categories?: string[];
    statuses?: string[];
    workspaces?: string[];
    tags?: string[];
  };
  className?: string;
}

const defaultStatuses = ['Open', 'Processing', 'Approved', 'Rejected', 'Reimbursed'];
const defaultCategories = ['Meals', 'Travel', 'Office Supplies', 'Advertising', 'Other'];
const defaultWorkspaces = ['Marketing', 'Engineering', 'Sales', 'Operations'];

export function ExpenseFilterPanel({
  isVisible,
  onToggleVisibility,
  filters,
  onFiltersChange,
  availableOptions = {},
  className,
}: ExpenseFilterPanelProps) {
  const [expandedSections, setExpandedSections] = useState<Record<string, boolean>>({
    date: true,
    merchant: false,
    category: false,
    status: false,
    amount: false,
    workspace: false,
    tags: false,
  });

  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section],
    }));
  };

  const updateFilter = <K extends keyof FilterState>(key: K, value: FilterState[K]) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearAllFilters = () => {
    onFiltersChange({});
  };

  const getActiveFilterCount = () => {
    let count = 0;
    if (filters.dateRange?.from || filters.dateRange?.to) count++;
    if (filters.merchants?.length) count++;
    if (filters.categories?.length) count++;
    if (filters.statuses?.length) count++;
    if (filters.amountRange?.min !== undefined || filters.amountRange?.max !== undefined) count++;
    if (filters.workspaces?.length) count++;
    if (filters.tags?.length) count++;
    return count;
  };

  const FilterSection = ({
    title,
    sectionKey,
    children,
  }: {
    title: string;
    sectionKey: string;
    children: React.ReactNode;
  }) => {
    const isExpanded = expandedSections[sectionKey];

    return (
      <div className="border-b border-gray-200 last:border-b-0">
        <button
          onClick={() => toggleSection(sectionKey)}
          className="w-full flex items-center justify-between px-4 py-3 text-left hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
        >
          <span className="text-sm font-medium text-gray-900">{title}</span>
          {isExpanded ? (
            <ChevronUp className="w-4 h-4 text-gray-500" />
          ) : (
            <ChevronDown className="w-4 h-4 text-gray-500" />
          )}
        </button>

        {isExpanded && (
          <div className="px-4 pb-4">
            {children}
          </div>
        )}
      </div>
    );
  };

  const MultiSelectFilter = ({
    options,
    selectedValues,
    onChange,
    placeholder,
  }: {
    options: string[];
    selectedValues: string[] | undefined;
    onChange: (values: string[]) => void;
    placeholder: string;
  }) => {
    const toggleOption = (option: string) => {
      const current = selectedValues || [];
      if (current.includes(option)) {
        onChange(current.filter(v => v !== option));
      } else {
        onChange([...current, option]);
      }
    };

    return (
      <div className="space-y-2">
        {options.map((option) => (
          <label key={option} className="flex items-center space-x-2">
            <input
              type="checkbox"
              checked={selectedValues?.includes(option) || false}
              onChange={() => toggleOption(option)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="text-sm text-gray-700">{option}</span>
          </label>
        ))}
      </div>
    );
  };

  return (
    <>
      {/* Filter Toggle Button */}
      <Button
        variant="outline"
        onClick={onToggleVisibility}
        className={cn(
          'flex items-center space-x-2',
          isVisible && 'bg-blue-50 border-blue-200 text-blue-700'
        )}
      >
        <Filter className="w-4 h-4" />
        <span>Show Filters</span>
        {getActiveFilterCount() > 0 && (
          <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
            {getActiveFilterCount()}
          </span>
        )}
      </Button>

      {/* Filter Panel */}
      {isVisible && (
        <div className={cn(
          'bg-white border border-gray-200 rounded-lg shadow-sm',
          'animate-in slide-in-from-top-2 duration-200',
          className
        )}>
          {/* Header */}
          <div className="flex items-center justify-between px-4 py-3 border-b border-gray-200">
            <h3 className="text-lg font-medium text-gray-900">Filters</h3>
            <div className="flex items-center space-x-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={clearAllFilters}
                className="text-blue-600 hover:text-blue-700"
              >
                Clear All
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={onToggleVisibility}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </div>

          {/* Filter Sections */}
          <div className="max-h-96 overflow-y-auto">
            <FilterSection title="Date Range" sectionKey="date">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    From
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange?.from || ''}
                    onChange={(e) => updateFilter('dateRange', {
                      ...filters.dateRange,
                      from: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    To
                  </label>
                  <input
                    type="date"
                    value={filters.dateRange?.to || ''}
                    onChange={(e) => updateFilter('dateRange', {
                      ...filters.dateRange,
                      to: e.target.value
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </FilterSection>

            <FilterSection title="Status" sectionKey="status">
              <MultiSelectFilter
                options={availableOptions.statuses || defaultStatuses}
                selectedValues={filters.statuses}
                onChange={(values) => updateFilter('statuses', values)}
                placeholder="Select statuses"
              />
            </FilterSection>

            <FilterSection title="Category" sectionKey="category">
              <MultiSelectFilter
                options={availableOptions.categories || defaultCategories}
                selectedValues={filters.categories}
                onChange={(values) => updateFilter('categories', values)}
                placeholder="Select categories"
              />
            </FilterSection>

            <FilterSection title="Workspace" sectionKey="workspace">
              <MultiSelectFilter
                options={availableOptions.workspaces || defaultWorkspaces}
                selectedValues={filters.workspaces}
                onChange={(values) => updateFilter('workspaces', values)}
                placeholder="Select workspaces"
              />
            </FilterSection>

            <FilterSection title="Amount Range" sectionKey="amount">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Min Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="0.00"
                    value={filters.amountRange?.min || ''}
                    onChange={(e) => updateFilter('amountRange', {
                      ...filters.amountRange,
                      min: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-gray-700 mb-1">
                    Max Amount
                  </label>
                  <input
                    type="number"
                    min="0"
                    step="0.01"
                    placeholder="1000.00"
                    value={filters.amountRange?.max || ''}
                    onChange={(e) => updateFilter('amountRange', {
                      ...filters.amountRange,
                      max: e.target.value ? parseFloat(e.target.value) : undefined
                    })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>
            </FilterSection>
          </div>
        </div>
      )}
    </>
  );
}

export default ExpenseFilterPanel;