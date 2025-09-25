import { useState } from 'react';
import { ExpenseDashboard } from '@/components/Expenses';
import type { ExpenseData } from '@/components/Expenses';
import type { ExpenseFormData } from '@/components/Expenses/ExpenseHeader';
import { MOCK_RECEIPTS } from '@/types/mock-receipts';

// Page Components Level: Full page compositions
// Following component hierarchy: Base → Layout → Composite → Feature → Page

interface ExpensePageProps {
  className?: string;
}

// Comprehensive mock data matching the Figma design structure with real receipt images
const mockExpensesData: ExpenseData[] = [
  {
    id: 'exp_001',
    date: '2024-03-15',
    merchant: 'Starbucks Coffee',
    amount: 10.30,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Meals & Entertainment',
    tag: 'CLIENT',
    description: 'Client Meeting Coffee',
    status: 'Processing',
    receipt: {
      url: MOCK_RECEIPTS[0].url,
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_002',
    date: '2024-03-16',
    merchant: 'Whole Foods Market',
    amount: 19.78,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Office Supplies',
    tag: 'OFFICE',
    description: 'Office Snacks & Supplies',
    status: 'Approved',
    receipt: {
      url: MOCK_RECEIPTS[1].url,
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_003',
    date: '2024-03-17',
    merchant: 'Shell Gas Station',
    amount: 57.42,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Travel & Transportation',
    tag: 'TRAVEL',
    description: 'Business Trip Fuel',
    status: 'Pending',
    receipt: {
      url: MOCK_RECEIPTS[2].url,
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_004',
    date: '2024-03-18',
    merchant: 'Best Buy',
    amount: 68.11,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Equipment & Software',
    tag: 'TECH',
    description: 'Office Equipment Purchase',
    status: 'Processing',
    receipt: {
      url: MOCK_RECEIPTS[3].url,
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_005',
    date: '2024-03-19',
    merchant: 'Uber Eats',
    amount: 46.84,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Meals & Entertainment',
    tag: 'TEAM',
    description: 'Team Lunch Order',
    status: 'Approved',
    receipt: {
      url: MOCK_RECEIPTS[4].url,
      type: 'image'
    },
    submittedBy: {
      name: 'Jana Smith',
      initial: 'J'
    }
  },
  {
    id: 'exp_006',
    date: '2024-03-20',
    merchant: 'Office Depot',
    amount: 89.45,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Office Supplies',
    tag: 'SUPPLIES',
    description: 'Office Equipment',
    status: 'Rejected',
    receipt: {
      url: MOCK_RECEIPTS[0].url, // Cycling back to Starbucks receipt
      type: 'image'
    },
    submittedBy: {
      name: 'Mike Wilson',
      initial: 'M'
    }
  },
  {
    id: 'exp_007',
    date: '2024-03-21',
    merchant: 'Hotel Continental',
    amount: 320.00,
    workspace: "janasmith.mobbin@gmail.com's Expensify",
    category: 'Lodging',
    tag: 'TRAVEL',
    description: 'Business Trip Accommodation',
    status: 'Approved',
    receipt: {
      url: MOCK_RECEIPTS[1].url, // Whole Foods receipt
      type: 'image'
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
  const [currentView, setCurrentView] = useState<'list' | 'grid' | 'detailed'>('list');
  const [showFilters, setShowFilters] = useState(false);

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
        url: MOCK_RECEIPTS[Math.floor(Math.random() * MOCK_RECEIPTS.length)].url,
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

  // Handle expense selection changes
  const handleSelectionChange = (selectedIds: string[]) => {
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
      onNewExpense={handleNewExpense}
      onExpenseClick={handleExpenseClick}
      onSelectionChange={handleSelectionChange}
      onShowFilters={handleShowFilters}
      onViewChange={handleViewChange}
      initialView={currentView}
      initialShowFilters={showFilters}
      className={className}
    />
  );
}

export default ExpensePage;