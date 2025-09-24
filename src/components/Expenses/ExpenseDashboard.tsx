import React, { useState, useEffect } from 'react';
import { ExpenseHeader } from './ExpenseHeader';
import { ExpenseTable } from './ExpenseTable';
import type { ExpenseData } from './ExpenseTableRow';
import type { ExpenseFormData, ExpenseFilterData } from './ExpenseHeader';
import { cn } from '@/lib/utils';

// Page Components Level: Full page compositions
// Following component hierarchy: Base → Layout → Composite → Feature → Page

interface ExpenseDashboardProps {
  expenses?: ExpenseData[];
  userInfo?: {
    name: string;
    email: string;
    initial: string;
  };
  onNewExpense?: (data: ExpenseFormData) => void;
  onExpenseClick?: (expense: ExpenseData) => void;
  onSidebarItemClick?: (item: any) => void;
  onSelectionChange?: (selectedIds: string[]) => void;
  onShowFilters?: () => void;
  onViewChange?: (view: 'list' | 'grid' | 'detailed') => void;
  initialView?: 'list' | 'grid' | 'detailed';
  initialShowFilters?: boolean;
  activeSection?: string;
  className?: string;
}

// Default mock data as fallback
const defaultExpenses: ExpenseData[] = [
  {
    id: 'default_1',
    date: '2024-05-18',
    merchant: 'JDMobbin',
    amount: 250.00,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Advertising',
    tag: 'ICU',
    description: 'Travel Expense',
    status: 'Processing',
    receipt: {
      url: '/mock-receipt-1.jpg',
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
];

const defaultUser = {
  name: 'janasmith.mobbin',
  email: 'janasmith.mobbin@gmail.com',
  initial: 'J'
};

export function ExpenseDashboard({
  expenses = defaultExpenses,
  userInfo = defaultUser,
  onNewExpense,
  onExpenseClick,
  onSidebarItemClick,
  onSelectionChange,
  onShowFilters,
  onViewChange,
  initialView = 'list',
  initialShowFilters = false,
  activeSection = 'expenses',
  className
}: ExpenseDashboardProps) {
  const [selectedExpenses, setSelectedExpenses] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'grid' | 'detailed'>(initialView);
  const [showFilters, setShowFilters] = useState(initialShowFilters);
  const [activeFilters, setActiveFilters] = useState<ExpenseFilterData>({
    categories: [],
    tags: [],
    dateFrom: undefined,
    dateTo: undefined,
    amountMin: undefined,
    amountMax: undefined,
    description: '',
    merchant: '',
    status: undefined,
  });
  const [filteredExpenses, setFilteredExpenses] = useState(expenses);

  const applyFilters = (filters: ExpenseFilterData) => {
    let filtered = [...expenses];

    // Filter by categories
    if (filters.categories.length > 0) {
      filtered = filtered.filter(expense =>
        filters.categories.includes(expense.category.toLowerCase().replace(/\s+/g, '-'))
      );
    }

    // Filter by tags
    if (filters.tags.length > 0) {
      filtered = filtered.filter(expense =>
        filters.tags.includes(expense.tag.toLowerCase())
      );
    }

    // Filter by date range
    if (filters.dateFrom) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate >= filters.dateFrom!;
      });
    }

    if (filters.dateTo) {
      filtered = filtered.filter(expense => {
        const expenseDate = new Date(expense.date);
        return expenseDate <= filters.dateTo!;
      });
    }

    // Filter by amount range
    if (filters.amountMin !== undefined) {
      filtered = filtered.filter(expense => expense.amount >= filters.amountMin!);
    }

    if (filters.amountMax !== undefined) {
      filtered = filtered.filter(expense => expense.amount <= filters.amountMax!);
    }

    // Filter by description
    if (filters.description) {
      const searchTerm = filters.description.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.description.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by merchant
    if (filters.merchant) {
      const searchTerm = filters.merchant.toLowerCase();
      filtered = filtered.filter(expense =>
        expense.merchant.toLowerCase().includes(searchTerm)
      );
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter(expense =>
        expense.status.toLowerCase() === filters.status!.toLowerCase()
      );
    }

    return filtered;
  };

  const handleApplyFilters = (filters: ExpenseFilterData) => {
    setActiveFilters(filters);
    const filtered = applyFilters(filters);
    setFilteredExpenses(filtered);
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
    setActiveFilters(clearedFilters);
    setFilteredExpenses(expenses);
  };

  // Update filtered expenses when expenses prop changes
  useEffect(() => {
    const filtered = applyFilters(activeFilters);
    setFilteredExpenses(filtered);
  }, [expenses, activeFilters]);

  const handleNewExpense = (data: ExpenseFormData) => {
    console.log('Dashboard received new expense data:', data);
    onNewExpense?.(data);
  };

  const handleExpenseClick = (expense: ExpenseData) => {
    onExpenseClick?.(expense);
  };

  const handleSidebarItemClick = (item: any) => {
    onSidebarItemClick?.(item);
  };

  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedExpenses(selectedIds);
    onSelectionChange?.(selectedIds);
  };

  const handleShowFilters = () => {
    const newState = !showFilters;
    setShowFilters(newState);
    onShowFilters?.();
  };

  const handleViewChange = (view: 'list' | 'grid' | 'detailed') => {
    setCurrentView(view);
    onViewChange?.(view);
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ExpenseHeader
          onNewExpense={handleNewExpense}
          onShowFilters={handleShowFilters}
          onViewChange={handleViewChange}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          showFilters={showFilters}
          currentView={currentView}
          activeFilters={activeFilters}
        />

        {/* Main Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          {currentView === 'list' && (
            <div className="max-w-6xl mx-auto">
              <ExpenseTable
                expenses={filteredExpenses}
                onRowClick={handleExpenseClick}
                onSelectionChange={handleSelectionChange}
                className=""
              />
            </div>
          )}

          {currentView === 'grid' && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900">Grid View</h3>
                <p className="text-gray-600 mt-2">Grid view implementation would go here</p>
              </div>
            </div>
          )}

          {currentView === 'detailed' && (
            <div className="max-w-6xl mx-auto">
              <div className="bg-white rounded-lg shadow-sm p-8 text-center">
                <h3 className="text-lg font-medium text-gray-900">Detailed View</h3>
                <p className="text-gray-600 mt-2">Detailed view implementation would go here</p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="bg-white border-t border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between text-sm text-gray-500">
            <div className="flex items-center gap-4">
              <span>Terms</span>
              <span>Privacy</span>
              <span>Licenses</span>
              <span>Status</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
              <span className="text-gray-600">All systems operational</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ExpenseDashboard;