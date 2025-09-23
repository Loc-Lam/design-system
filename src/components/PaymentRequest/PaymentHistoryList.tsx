import { useState } from 'react';
import {
  Search,
  Filter,
  User,
  FileText,
  Eye,
  Edit,
  Download,
  Trash2,
  ChevronLeft,
  ChevronRight,
  SortAsc,
  SortDesc,
  X,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { TextInput, Checkbox } from '@/components/common/form-field';
import FilterPanel from './FilterPanel';
import type {
  PaymentRequest,
  PaymentRequestFilters,
  PaymentStatus,
  PaymentPriority,
  SortField,
  SortDirection,
} from '@/types/payment-request';

// Feature Components Level: Business logic components with specific functionality
// Following component hierarchy: Base → Layout → Composite → Feature

interface PaymentHistoryListProps {
  payments: PaymentRequest[];
  filters: PaymentRequestFilters;
  onFiltersChange?: (filters: PaymentRequestFilters) => void;
  onPaymentView?: (payment: PaymentRequest) => void;
  onPaymentEdit?: (payment: PaymentRequest) => void;
  onPaymentDelete?: (paymentId: string) => void;
  isLoading?: boolean;
  className?: string;
}

export default function PaymentHistoryList({
  payments,
  filters,
  onFiltersChange,
  onPaymentView,
  onPaymentEdit,
  onPaymentDelete,
  isLoading = false,
  className,
}: PaymentHistoryListProps) {
  const [showFilters, setShowFilters] = useState(false);
  const [sortField, setSortField] = useState<SortField>('requestedAt');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedPayments, setSelectedPayments] = useState<Set<string>>(new Set());

  const updateFilters = <K extends keyof PaymentRequestFilters>(
    key: K,
    value: PaymentRequestFilters[K]
  ) => {
    if (onFiltersChange) {
      onFiltersChange({ ...filters, [key]: value });
    }
  };

  const handleSort = (field: SortField) => {
    const newDirection = sortField === field && sortDirection === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortDirection(newDirection);
  };

  const togglePaymentSelection = (paymentId: string) => {
    const newSelected = new Set(selectedPayments);
    if (newSelected.has(paymentId)) {
      newSelected.delete(paymentId);
    } else {
      newSelected.add(paymentId);
    }
    setSelectedPayments(newSelected);
  };

  const selectAllPayments = () => {
    if (selectedPayments.size === payments.length) {
      setSelectedPayments(new Set());
    } else {
      setSelectedPayments(new Set(payments.map(p => p.id)));
    }
  };

  const formatCurrency = (amount: number, currency: string) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: currency,
    }).format(amount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    });
  };

  const getStatusLabel = (status: PaymentStatus): string => {
    return status.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase());
  };

  const getStatusColor = (status: PaymentStatus): string => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-700';
      case 'pending_approval':
        return 'bg-yellow-100 text-yellow-700';
      case 'processing':
        return 'bg-purple-100 text-purple-700';
      case 'approved':
        return 'bg-blue-100 text-blue-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      case 'cancelled':
        return 'bg-gray-100 text-gray-700';
      case 'on_hold':
        return 'bg-orange-100 text-orange-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getPriorityColor = (priority: PaymentPriority): string => {
    switch (priority) {
      case 'urgent':
        return 'text-red-600';
      case 'high':
        return 'text-orange-600';
      case 'normal':
        return 'text-blue-600';
      case 'low':
        return 'text-gray-600';
      default:
        return 'text-gray-600';
    }
  };

  // Count active filters
  const activeFilterCount = Object.keys(filters).reduce((count, key) => {
    const value = filters[key as keyof PaymentRequestFilters];
    if (Array.isArray(value) && value.length > 0) return count + 1;
    if (typeof value === 'object' && value !== null) {
      const hasValue = Object.values(value).some(v => v);
      if (hasValue) return count + 1;
    }
    if (value) return count + 1;
    return count;
  }, 0);

  // Get active filter badges
  const getFilterBadges = () => {
    const badges = [];

    if (filters.status && filters.status.length > 0) {
      badges.push({ key: 'status', label: `Status (${filters.status.length})`, values: filters.status });
    }
    if (filters.category && filters.category.length > 0) {
      badges.push({ key: 'category', label: `Category (${filters.category.length})`, values: filters.category });
    }
    if (filters.paymentMethod && filters.paymentMethod.length > 0) {
      badges.push({ key: 'paymentMethod', label: `Method (${filters.paymentMethod.length})`, values: filters.paymentMethod });
    }
    if (filters.priority && filters.priority.length > 0) {
      badges.push({ key: 'priority', label: `Priority (${filters.priority.length})`, values: filters.priority });
    }
    if (filters.dateRange && (filters.dateRange.start || filters.dateRange.end)) {
      const start = filters.dateRange.start ? formatDate(filters.dateRange.start) : '';
      const end = filters.dateRange.end ? formatDate(filters.dateRange.end) : '';
      badges.push({ key: 'dateRange', label: `Date: ${start} - ${end}`, values: [] });
    }
    if (filters.amountRange && (filters.amountRange.min > 0 || filters.amountRange.max < 999999)) {
      badges.push({
        key: 'amountRange',
        label: `Amount: $${filters.amountRange.min} - $${filters.amountRange.max}`,
        values: []
      });
    }
    if (filters.search) {
      badges.push({ key: 'search', label: `Search: "${filters.search}"`, values: [] });
    }

    return badges;
  };

  const removeFilter = (key: string) => {
    if (onFiltersChange) {
      const newFilters = { ...filters };
      delete newFilters[key as keyof PaymentRequestFilters];
      onFiltersChange(newFilters);
    }
  };

  const sortedPayments = [...payments].sort((a, b) => {
    let comparison = 0;

    switch (sortField) {
      case 'requestedAt':
        comparison = new Date(a.requestedAt).getTime() - new Date(b.requestedAt).getTime();
        break;
      case 'amount':
        comparison = a.amount - b.amount;
        break;
      case 'status':
        comparison = a.status.localeCompare(b.status);
        break;
      case 'dueDate': {
        const aDue = a.dueDate ? new Date(a.dueDate).getTime() : 0;
        const bDue = b.dueDate ? new Date(b.dueDate).getTime() : 0;
        comparison = aDue - bDue;
        break;
      }
      case 'priority':
        const priorityOrder = { low: 1, normal: 2, high: 3, urgent: 4 };
        comparison = priorityOrder[a.priority] - priorityOrder[b.priority];
        break;
    }

    return sortDirection === 'asc' ? comparison : -comparison;
  });

  return (
    <div className={cn('space-y-6', className)}>
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Payment History</h2>
          <p className="text-sm text-gray-600">
            {payments.length} payment requests found
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowFilters(true)}
            className="flex items-center gap-2"
          >
            <Filter className="w-4 h-4" />
            Filters
            {activeFilterCount > 0 && (
              <span className="ml-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded-full">
                {activeFilterCount}
              </span>
            )}
          </Button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
        <TextInput
          placeholder="Search by title, payee, or description..."
          value={filters.search || ''}
          onChange={(e) => updateFilters('search', e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Active Filters Display */}
      {getFilterBadges().length > 0 && (
        <div className="flex flex-wrap gap-2">
          {getFilterBadges().map(badge => (
            <div
              key={badge.key}
              className="inline-flex items-center gap-1 px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-sm"
            >
              <span>{badge.label}</span>
              <button
                onClick={() => removeFilter(badge.key)}
                className="ml-1 hover:bg-blue-200 rounded-full p-0.5 transition-colors"
              >
                <X className="w-3 h-3" />
              </button>
            </div>
          ))}
          <button
            onClick={() => onFiltersChange && onFiltersChange({})}
            className="text-sm text-gray-600 hover:text-gray-800 underline"
          >
            Clear all
          </button>
        </div>
      )}

      {/* Table */}
      <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
        {/* Bulk Actions */}
        {selectedPayments.size > 0 && (
          <div className="px-6 py-3 bg-blue-50 border-b border-blue-200">
            <div className="flex items-center justify-between">
              <span className="text-sm text-blue-700">
                {selectedPayments.size} payment{selectedPayments.size > 1 ? 's' : ''} selected
              </span>
              <div className="flex items-center gap-2">
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Export
                </Button>
                <Button size="sm" variant="outline" className="text-red-600 hover:text-red-700">
                  <Trash2 className="w-4 h-4 mr-2" />
                  Delete
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Table Header */}
        <div className="px-6 py-4 bg-gray-50 border-b border-gray-200">
          <div className="grid grid-cols-12 gap-4 items-center text-sm font-medium text-gray-600">
            <div className="col-span-1">
              <Checkbox
                checked={selectedPayments.size === payments.length && payments.length > 0}
                onChange={selectAllPayments}
              />
            </div>
            <div className="col-span-3">
              <button
                onClick={() => handleSort('requestedAt')}
                className="flex items-center gap-1 hover:text-gray-900"
              >
                Request
                {sortField === 'requestedAt' && (
                  sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="col-span-2">
              <button
                onClick={() => handleSort('amount')}
                className="flex items-center gap-1 hover:text-gray-900"
              >
                Amount
                {sortField === 'amount' && (
                  sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="col-span-2">Payee</div>
            <div className="col-span-1">
              <button
                onClick={() => handleSort('status')}
                className="flex items-center gap-1 hover:text-gray-900"
              >
                Status
                {sortField === 'status' && (
                  sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="col-span-1">
              <button
                onClick={() => handleSort('priority')}
                className="flex items-center gap-1 hover:text-gray-900"
              >
                Priority
                {sortField === 'priority' && (
                  sortDirection === 'asc' ? <SortAsc className="w-4 h-4" /> : <SortDesc className="w-4 h-4" />
                )}
              </button>
            </div>
            <div className="col-span-2 text-right">Actions</div>
          </div>
        </div>

        {/* Table Body */}
        <div className="divide-y divide-gray-200">
          {isLoading ? (
            <div className="px-6 py-12 text-center">
              <div className="text-gray-500">Loading payment requests...</div>
            </div>
          ) : sortedPayments.length === 0 ? (
            <div className="px-6 py-12 text-center">
              <FileText className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No payment requests found</h3>
              <p className="text-gray-500">Try adjusting your search criteria or filters</p>
            </div>
          ) : (
            sortedPayments.map((payment) => (
              <div
                key={payment.id}
                className="px-6 py-4 hover:bg-gray-50 transition-colors"
              >
                <div className="grid grid-cols-12 gap-4 items-center">
                  <div className="col-span-1">
                    <Checkbox
                      checked={selectedPayments.has(payment.id)}
                      onChange={() => togglePaymentSelection(payment.id)}
                    />
                  </div>
                  <div className="col-span-3">
                    <div className="flex items-center space-x-3">
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium text-gray-900 truncate">
                          {payment.title}
                        </p>
                        <p className="text-xs text-gray-500">
                          {formatDate(payment.requestedAt)}
                        </p>
                      </div>
                    </div>
                  </div>
                  <div className="col-span-2">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(payment.amount, payment.currency)}
                    </p>
                    <p className="text-xs text-gray-500 capitalize">
                      {payment.category.replace('_', ' ')}
                    </p>
                  </div>
                  <div className="col-span-2">
                    <div className="flex items-center space-x-2">
                      <User className="w-4 h-4 text-gray-400" />
                      <p className="text-sm text-gray-900 truncate">
                        {payment.payeeDetails.name}
                      </p>
                    </div>
                  </div>
                  <div className="col-span-1">
                    <span
                      className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(
                        payment.status
                      )}`}
                    >
                      {getStatusLabel(payment.status)}
                    </span>
                  </div>
                  <div className="col-span-1">
                    <span className={`text-xs font-medium uppercase ${getPriorityColor(payment.priority)}`}>
                      {payment.priority}
                    </span>
                  </div>
                  <div className="col-span-2 text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPaymentView?.(payment)}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                      {payment.status === 'draft' && (
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => onPaymentEdit?.(payment)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      )}
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => onPaymentDelete?.(payment.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Pagination */}
      {!isLoading && sortedPayments.length > 0 && (
        <div className="flex items-center justify-between">
          <p className="text-sm text-gray-700">
            Showing <span className="font-medium">1</span> to{' '}
            <span className="font-medium">{sortedPayments.length}</span> of{' '}
            <span className="font-medium">{payments.length}</span> results
          </p>
          <div className="flex items-center space-x-2">
            <Button variant="outline" size="sm" disabled>
              <ChevronLeft className="w-4 h-4" />
              Previous
            </Button>
            <Button variant="outline" size="sm" disabled>
              Next
              <ChevronRight className="w-4 h-4" />
            </Button>
          </div>
        </div>
      )}

      {/* Filter Panel */}
      {showFilters && (
        <FilterPanel
          filters={filters}
          onFiltersChange={onFiltersChange || (() => {})}
          onClose={() => setShowFilters(false)}
        />
      )}
    </div>
  );
}