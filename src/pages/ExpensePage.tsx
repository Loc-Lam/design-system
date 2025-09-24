import React, { useState } from 'react';
import { ExpenseDashboard } from '@/components/Expenses';
import type { ExpenseData } from '@/components/Expenses';
import type { ExpenseFormData } from '@/components/Expenses/ExpenseHeader';

// Page Components Level: Full page compositions
// Following component hierarchy: Base → Layout → Composite → Feature → Page

interface ExpensePageProps {
  className?: string;
}

// Comprehensive mock data matching the Figma design structure
const mockExpensesData: ExpenseData[] = [
  {
    id: 'exp_001',
    date: '2024-05-18',
    merchant: 'JDMobbin',
    amount: 250.00,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Advertising',
    tag: 'ICU',
    description: 'Travel Expense',
    status: 'Processing',
    receipt: {
      url: '/mock-receipt-jdmobbin.jpg',
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_002',
    date: '2024-05-17',
    merchant: 'Uber Technologies',
    amount: 45.75,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Transportation',
    tag: 'TRAVEL',
    description: 'Airport Transport',
    status: 'Approved',
    receipt: {
      url: '/mock-receipt-uber.jpg',
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_003',
    date: '2024-05-16',
    merchant: 'Starbucks Coffee',
    amount: 12.50,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Meals & Entertainment',
    tag: 'CLIENT',
    description: 'Client Meeting Coffee',
    status: 'Pending',
    receipt: {
      url: '/mock-receipt-starbucks.jpg',
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_004',
    date: '2024-05-15',
    merchant: 'Adobe Creative Cloud',
    amount: 79.99,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Software & Services',
    tag: 'TOOLS',
    description: 'Monthly Subscription',
    status: 'Processing',
    receipt: {
      url: '/mock-receipt-adobe.pdf',
      type: 'pdf'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_005',
    date: '2024-05-14',
    merchant: 'Amazon Web Services',
    amount: 156.23,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Technology',
    tag: 'AWS',
    description: 'Cloud Infrastructure',
    status: 'Approved',
    receipt: {
      url: '/mock-receipt-aws.pdf',
      type: 'pdf'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_006',
    date: '2024-05-13',
    merchant: 'Office Depot',
    amount: 89.45,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Office Supplies',
    tag: 'SUPPLIES',
    description: 'Office Equipment',
    status: 'Rejected',
    receipt: {
      url: '/mock-receipt-office-depot.jpg',
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_007',
    date: '2024-05-12',
    merchant: 'Hotel Continental',
    amount: 320.00,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Lodging',
    tag: 'TRAVEL',
    description: 'Business Trip Accommodation',
    status: 'Approved',
    receipt: {
      url: '/mock-receipt-hotel.pdf',
      type: 'pdf'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  }
];

const mockUserInfo = {
  name: 'janasmith.mobbin',
  email: 'janasmith.mobbin@gmail.com',
  initial: 'J'
};

export function ExpensePage({ className }: ExpensePageProps) {
  const [expenses, setExpenses] = useState<ExpenseData[]>(mockExpensesData);
  const [selectedExpenseIds, setSelectedExpenseIds] = useState<string[]>([]);
  const [currentView, setCurrentView] = useState<'list' | 'grid' | 'detailed'>('list');
  const [showFilters, setShowFilters] = useState(false);
  const [currentSection, setCurrentSection] = useState<string>('expenses');

  // Handle expense creation
  const handleNewExpense = (data: ExpenseFormData) => {
    console.log('Creating new expense with data:', data);

    // Generate a new expense ID
    const newExpenseId = `exp_${Date.now()}`;

    // Convert form data to expense data
    const newExpense: ExpenseData = {
      id: newExpenseId,
      date: data.date.toISOString().split('T')[0], // Format date as YYYY-MM-DD
      merchant: data.merchant,
      amount: data.total,
      workspace: mockUserInfo.email + "'s Expensify",
      category: data.category || 'Uncategorized',
      tag: data.tag,
      description: data.description || `${data.merchant} expense`,
      status: 'Processing', // New expenses start as processing
      receipt: {
        url: '/mock-receipt-new.jpg',
        type: 'image'
      },
      submittedBy: {
        name: mockUserInfo.name,
        initial: mockUserInfo.initial
      }
    };

    // Add the new expense to the beginning of the list (most recent first)
    setExpenses(prev => [newExpense, ...prev]);

    // Show success message
    alert(`New expense "${data.merchant} - $${data.total}" created successfully!`);
  };

  // Handle expense selection
  const handleExpenseClick = (expense: ExpenseData) => {
    console.log('Viewing expense details:', expense.id);
    // In a real app, this would open expense details modal or page
    alert(`Viewing details for expense: ${expense.merchant} - $${expense.amount}`);
  };

  // Handle sidebar navigation
  const handleSidebarNavigation = (item: any) => {
    setCurrentSection(item.id);
    console.log('Navigating to section:', item.id);

    // In a real app, this would handle routing to different sections
    if (item.id !== 'expenses') {
      alert(`Navigation to ${item.label} section would be implemented here`);
    }
  };

  // Handle expense selection changes
  const handleSelectionChange = (selectedIds: string[]) => {
    setSelectedExpenseIds(selectedIds);
    console.log('Selected expenses:', selectedIds);
  };

  // Handle filter toggle
  const handleShowFilters = () => {
    setShowFilters(prev => !prev);
    console.log('Filters toggled:', !showFilters);
  };

  // Handle view changes
  const handleViewChange = (view: 'list' | 'grid' | 'detailed') => {
    setCurrentView(view);
    console.log('View changed to:', view);
  };

  return (
    <ExpenseDashboard
      expenses={expenses}
      userInfo={mockUserInfo}
      onNewExpense={handleNewExpense}
      onExpenseClick={handleExpenseClick}
      onSidebarItemClick={handleSidebarNavigation}
      onSelectionChange={handleSelectionChange}
      onShowFilters={handleShowFilters}
      onViewChange={handleViewChange}
      initialView={currentView}
      initialShowFilters={showFilters}
      activeSection={currentSection}
      className={className}
    />
  );
}

export default ExpensePage;