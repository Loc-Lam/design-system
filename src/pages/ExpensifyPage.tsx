import { useState } from 'react';
import { Plus, Grid3X3, List, Settings, X } from 'lucide-react';
import { Button } from '@/components/common/button';
import { ViewToggle, type ViewMode } from '@/components/common/view-toggle';
import { ExpenseSidebar } from '@/components/common/expense-sidebar';
import { ExpenseTable, type ExpenseItem } from '@/components/common/expense-table';
import { ExpenseFilterPanel, type FilterState } from '@/components/common/expense-filter-panel';
import { NotificationToast, useToast } from '@/components/common/notification-toast';
import { Modal } from '@/components/common/modal';
import { ReceiptUpload, type ReceiptFile } from '@/components/common/receipt-upload';
import { ExpenseHeader, type ExpenseFormData, type ExpenseFilterData } from '@/components/Expenses/ExpenseHeader';
import { SmartScanStatusIndicator, type SmartScanStatus } from '@/components/Expenses/SmartScanStatusIndicator';
import { cn } from '@/lib/utils';

// Page Components Level: Full page compositions
// Following component hierarchy: Base → Layout → Composite → Feature → Page

const mockExpenses: ExpenseItem[] = [
  {
    id: '1',
    date: '2024-05-20',
    merchant: 'SmartScanning',
    amount: 0,
    currency: 'USD',
    workspace: 'JobMobbin',
    category: 'Meals',
    description: 'Fill out the details',
    status: 'processing',
    receiptType: 'smartscan',
    receiptImage: '/api/placeholder/120/80',
    assignee: {
      name: 'John Doe',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
  },
  {
    id: '2',
    date: '2024-05-20',
    merchant: 'Walmart',
    amount: 3.33,
    currency: 'USD',
    workspace: 'JobMobbin',
    category: 'Meals',
    tag: 'Advertising',
    description: '',
    status: 'open',
    receiptImage: '/api/placeholder/120/80',
    assignee: {
      name: 'John Doe',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
  },
  {
    id: '3',
    date: '2024-05-20',
    merchant: 'Walmart',
    amount: 3.34,
    currency: 'USD',
    workspace: 'JobMobbin',
    category: 'Meals',
    tag: 'Advertising',
    description: '',
    status: 'open',
    receiptImage: '/api/placeholder/120/80',
    assignee: {
      name: 'John Doe',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
  },
  {
    id: '4',
    date: '2024-05-20',
    merchant: 'Walmart',
    amount: 3.33,
    currency: 'USD',
    workspace: 'JobMobbin',
    category: 'Meals',
    tag: 'Advertising',
    description: '',
    status: 'open',
    receiptImage: '/api/placeholder/120/80',
    assignee: {
      name: 'John Doe',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
  },
  {
    id: '5',
    date: '2024-05-18',
    merchant: 'JobMobbin',
    amount: 1250.0,
    currency: 'USD',
    workspace: "jonsmith.mobbin's Expensifies",
    category: 'Travel Expense',
    tag: 'Advertising',
    description: '',
    status: 'processing',
    receiptImage: '/api/placeholder/120/80',
    assignee: {
      name: 'John Doe',
      avatar: '/api/placeholder/32/32',
      initials: 'JD',
    },
  },
];

export function ExpensifyPage() {
  const [activeView, setActiveView] = useState<ViewMode>('list');
  const [isFilterVisible, setIsFilterVisible] = useState(false);
  const [filters, setFilters] = useState<FilterState>({});
  const [expenseFilters, setExpenseFilters] = useState<ExpenseFilterData>({});
  const [isNewExpenseModalOpen, setIsNewExpenseModalOpen] = useState(false);
  const [isSmartScanModalOpen, setIsSmartScanModalOpen] = useState(false);
  const [uploadedReceipts, setUploadedReceipts] = useState<ReceiptFile[]>([]);
  const [isSmartScanProcessing, setIsSmartScanProcessing] = useState(false);
  const [smartScanCount, setSmartScanCount] = useState(0);
  const [smartScanStatuses, setSmartScanStatuses] = useState<SmartScanStatus[]>([]);
  const { toasts, addToast, removeToast } = useToast();

  const userInfo = {
    name: 'John Smith',
    email: 'jonsmith.mobbin@gmail.com',
    initials: 'JS',
    avatar: '/api/placeholder/40/40',
  };

  const handleSidebarItemClick = (itemId: string) => {
    console.log('Sidebar item clicked:', itemId);
    // Handle navigation or actions based on the clicked item
  };

  const handleExpenseClick = (expense: ExpenseItem) => {
    console.log('Expense clicked:', expense);
    // Handle expense detail view or editing
  };

  const handleExpenseEdit = (expense: ExpenseItem) => {
    console.log('Edit expense:', expense);
    // Handle expense editing
  };

  const handleSmartScanClick = () => {
    setIsSmartScanModalOpen(true);
  };

  const handleReceiptUpload = async (files: File[]) => {
    // Simulate upload process
    const newReceipts: ReceiptFile[] = files.map((file, index) => ({
      id: Math.random().toString(36).substr(2, 9),
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      size: file.size,
      type: file.type,
      uploadStatus: 'uploading' as const,
    }));

    // Create SmartScan status entries
    const newSmartScans: SmartScanStatus[] = newReceipts.map(receipt => ({
      id: receipt.id,
      fileName: receipt.name,
      status: 'processing',
      progress: 0,
    }));

    setUploadedReceipts(prev => [...prev, ...newReceipts]);
    setSmartScanStatuses(prev => [...prev, ...newSmartScans]);
    setIsSmartScanProcessing(true);
    setSmartScanCount(prev => prev + files.length);

    // Simulate upload and processing
    for (const receipt of newReceipts) {
      // Simulate progressive processing
      for (let progress = 0; progress <= 100; progress += 10) {
        await new Promise(resolve => setTimeout(resolve, 200));

        setSmartScanStatuses(prev =>
          prev.map(s =>
            s.id === receipt.id
              ? { ...s, progress }
              : s
          )
        );

        setUploadedReceipts(prev =>
          prev.map(r =>
            r.id === receipt.id
              ? { ...r, uploadStatus: progress < 100 ? 'processing' : 'completed' }
              : r
          )
        );
      }

      // Complete processing with extracted data
      const extractedData = {
        merchant: 'Auto-detected Merchant',
        amount: 25.50,
        date: new Date().toISOString().split('T')[0],
        category: 'Meals',
      };

      const confidence = 0.95;

      setSmartScanStatuses(prev =>
        prev.map(s =>
          s.id === receipt.id
            ? {
                ...s,
                status: 'completed' as const,
                confidence,
                extractedData,
              }
            : s
        )
      );

      setUploadedReceipts(prev =>
        prev.map(r =>
          r.id === receipt.id
            ? {
                ...r,
                uploadStatus: 'completed',
                smartScanData: {
                  ...extractedData,
                  confidence,
                },
              }
            : r
        )
      );

      addToast({
        type: 'success',
        title: 'SmartScan completed',
        message: `${receipt.name} processed with ${Math.round(confidence * 100)}% confidence`,
      });
    }

    setIsSmartScanProcessing(false);
  };

  const handleNewExpense = (data: ExpenseFormData) => {
    console.log('Creating new expense:', data);
    addToast({
      type: 'success',
      title: 'Expense created',
      message: 'Your expense has been added successfully',
    });
  };

  const handleApplyFilters = (newFilters: ExpenseFilterData) => {
    setExpenseFilters(newFilters);
    console.log('Applying expense filters:', newFilters);
  };

  const handleClearFilters = () => {
    setExpenseFilters({});
    console.log('Clearing all expense filters');
  };

  const handleReceiptRemove = (receiptId: string) => {
    setUploadedReceipts(prev => prev.filter(r => r.id !== receiptId));
    addToast({
      type: 'info',
      title: 'Receipt removed',
      message: 'Receipt has been removed from the list',
    });
  };

  const handleReceiptPreview = (receipt: ReceiptFile) => {
    console.log('Preview receipt:', receipt);
    // Handle receipt preview
  };

  const handleDismissSmartScan = (scanId: string) => {
    setSmartScanStatuses(prev => prev.filter(s => s.id !== scanId));

    // Also update smart scan count
    const completedScans = smartScanStatuses.filter(s =>
      s.status === 'completed' || s.status === 'failed'
    );
    if (completedScans.some(s => s.id === scanId)) {
      setSmartScanCount(prev => Math.max(0, prev - 1));
    }
  };

  // Apply filters to expenses
  const filteredExpenses = mockExpenses.filter(expense => {
    if (filters.statuses?.length && !filters.statuses.includes(expense.status)) {
      return false;
    }
    if (filters.categories?.length && !filters.categories.includes(expense.category)) {
      return false;
    }
    if (filters.workspaces?.length && !filters.workspaces.includes(expense.workspace)) {
      return false;
    }
    if (filters.dateRange?.from && new Date(expense.date) < new Date(filters.dateRange.from)) {
      return false;
    }
    if (filters.dateRange?.to && new Date(expense.date) > new Date(filters.dateRange.to)) {
      return false;
    }
    if (filters.amountRange?.min !== undefined && expense.amount < filters.amountRange.min) {
      return false;
    }
    if (filters.amountRange?.max !== undefined && expense.amount > filters.amountRange.max) {
      return false;
    }
    return true;
  });

  return (
    <div className="flex h-screen bg-gray-50">
      {/* Sidebar */}
      <ExpenseSidebar
        userInfo={userInfo}
        activeItem="expenses"
        onItemClick={handleSidebarItemClick}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <ExpenseHeader
          currentView={activeView}
          onViewChange={setActiveView}
          onNewExpense={handleNewExpense}
          onSmartScan={handleSmartScanClick}
          onApplyFilters={handleApplyFilters}
          onClearFilters={handleClearFilters}
          activeFilters={expenseFilters}
          isSmartScanProcessing={isSmartScanProcessing}
          smartScanCount={smartScanCount}
        />

        {/* Toolbar */}
        <div className="bg-white border-b border-gray-200 px-6 py-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <ExpenseFilterPanel
                isVisible={isFilterVisible}
                onToggleVisibility={() => setIsFilterVisible(!isFilterVisible)}
                filters={filters}
                onFiltersChange={setFilters}
              />
            </div>

            <div className="flex items-center space-x-2">
              <ViewToggle
                currentView={activeView}
                onViewChange={setActiveView}
                options={[
                  { value: 'list', icon: List, title: 'List View' },
                  { value: 'grid', icon: Grid3X3, title: 'Grid View' },
                ]}
              />
              <Button variant="ghost" size="sm">
                <Settings className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Content */}
        <main className="flex-1 overflow-auto p-6">
          <ExpenseTable
            expenses={filteredExpenses}
            onExpenseClick={handleExpenseClick}
            onExpenseEdit={handleExpenseEdit}
          />
        </main>
      </div>

      {/* SmartScan Modal */}
      <Modal
        isOpen={isSmartScanModalOpen}
        onClose={() => setIsSmartScanModalOpen(false)}
        title="SmartScan & OCR Processing"
        size="lg"
      >
        <div className="p-6">
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Upload Receipt for SmartScan</h3>
            <p className="text-sm text-gray-600 mb-4">
              Upload your receipt and let our AI extract all the details automatically with high confidence OCR processing.
            </p>
          </div>
          <ReceiptUpload
            onUpload={handleReceiptUpload}
            onRemove={handleReceiptRemove}
            onPreview={handleReceiptPreview}
            uploadedReceipts={uploadedReceipts}
          />

          {/* SmartScan Processing Status */}
          {isSmartScanProcessing && (
            <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-center space-x-3">
                <div className="flex-shrink-0">
                  <div className="w-8 h-8 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-blue-900">SmartScan Processing</h4>
                  <p className="text-sm text-blue-700">
                    Analyzing receipt with OCR technology... This may take a few seconds.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </Modal>

      {/* New Expense Modal */}
      <Modal
        isOpen={isNewExpenseModalOpen}
        onClose={() => setIsNewExpenseModalOpen(false)}
        title="Create New Expense"
        size="lg"
      >
        <div className="p-6">
          <ReceiptUpload
            onUpload={handleReceiptUpload}
            onRemove={handleReceiptRemove}
            onPreview={handleReceiptPreview}
            uploadedReceipts={uploadedReceipts}
          />
        </div>
      </Modal>

      {/* Success Toast - matching Figma design */}
      {toasts.length > 0 && (
        <div className="fixed bottom-4 right-4 z-50 space-y-2">
          {toasts.map((toast) => (
            <div
              key={toast.id}
              className="bg-blue-50 border border-blue-200 rounded-lg p-4 shadow-lg max-w-sm"
            >
              <div className="flex items-start space-x-3">
                <div className="flex-1">
                  <p className="text-sm font-medium text-blue-800">
                    {toast.title}
                  </p>
                  {toast.message && (
                    <p className="text-sm text-blue-600 mt-1">
                      {toast.message}
                    </p>
                  )}
                </div>
                <button
                  onClick={() => removeToast(toast.id!)}
                  className="text-blue-400 hover:text-blue-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* SmartScan Status Indicator */}
      <SmartScanStatusIndicator
        scans={smartScanStatuses}
        isVisible={smartScanStatuses.length > 0}
        onDismiss={handleDismissSmartScan}
      />
    </div>
  );
}

export default ExpensifyPage;