import { useState } from 'react';
import { Plus, FileText, DollarSign, Clock, CheckCircle, List } from 'lucide-react';
import { Button } from '@/components/common/button';
import { StatsCard } from '@/components/common/stats-card';
import { PaymentRequestCard } from '@/components/common/payment-request-card';
import PaymentRequestForm from './PaymentRequestForm';
import PaymentStatusTracker from './PaymentStatusTracker';
import ApprovalWorkflow from './ApprovalWorkflow';
import PaymentHistoryList from './PaymentHistoryList';
import type {
  PaymentRequest,
  PaymentRequestFormData,
  PaymentRequestValidationErrors,
  PaymentRequestStats,
  PaymentRequestFilters,
} from '@/types/payment-request';

// Page Components Level: Full page compositions
// Following component hierarchy: Base → Layout → Composite → Feature → Page

interface PaymentRequestPageProps {
  className?: string;
}

// Mock data for demonstration
const mockStats: PaymentRequestStats = {
  total: 156,
  byStatus: {
    draft: 8,
    submitted: 12,
    pending_approval: 15,
    approved: 25,
    rejected: 3,
    processing: 8,
    completed: 80,
    cancelled: 2,
    on_hold: 3,
  },
  byCategory: {
    expense_reimbursement: 45,
    vendor_payment: 32,
    salary: 28,
    contractor_payment: 20,
    utility: 15,
    office_supplies: 8,
    travel: 5,
    other: 3,
  },
  totalAmount: 1245600,
  averageAmount: 7984.62,
  pendingApprovalCount: 15,
  overDueCount: 3,
};

const mockAllRequests: PaymentRequest[] = [
  {
    id: '1',
    title: 'Office Supplies Q4 2024',
    description: 'Quarterly office supplies purchase',
    amount: 2500,
    currency: 'USD',
    category: 'office_supplies',
    paymentMethod: 'credit_card',
    priority: 'normal',
    status: 'pending_approval',
    payeeDetails: {
      name: 'Office Depot Inc.',
      email: 'billing@officedepot.com',
    },
    requestedBy: 'john@example.com',
    requestedAt: '2024-09-20T10:00:00Z',
    dueDate: '2024-09-30T23:59:59Z',
    approvalWorkflow: [
      {
        id: 'step1',
        stepNumber: 1,
        approverName: 'Sarah Johnson',
        approverEmail: 'sarah@example.com',
        approverRole: 'Manager',
        status: 'approved',
        decision: 'approved',
        decidedAt: '2024-09-20T14:30:00Z',
        comments: 'Approved - standard quarterly order',
      },
      {
        id: 'step2',
        stepNumber: 2,
        approverName: 'Michael Chen',
        approverEmail: 'michael@example.com',
        approverRole: 'Finance Director',
        status: 'pending',
        requiredAmount: 5000,
      },
    ],
  },
  {
    id: '2',
    title: 'Contractor Payment - Development Services',
    description: 'Monthly payment for web development services',
    amount: 8500,
    currency: 'USD',
    category: 'contractor_payment',
    paymentMethod: 'bank_transfer',
    priority: 'high',
    status: 'processing',
    payeeDetails: {
      name: 'TechCorp Solutions',
      email: 'finance@techcorp.com',
    },
    requestedBy: 'jane@example.com',
    requestedAt: '2024-09-18T09:15:00Z',
    approvalWorkflow: [
      {
        id: 'step1',
        stepNumber: 1,
        approverName: 'Sarah Johnson',
        approverEmail: 'sarah@example.com',
        approverRole: 'Manager',
        status: 'approved',
        decision: 'approved',
        decidedAt: '2024-09-18T11:00:00Z',
      },
      {
        id: 'step2',
        stepNumber: 2,
        approverName: 'Michael Chen',
        approverEmail: 'michael@example.com',
        approverRole: 'Finance Director',
        status: 'approved',
        decision: 'approved',
        decidedAt: '2024-09-19T08:30:00Z',
      },
    ],
  },
  {
    id: '3',
    title: 'Travel Reimbursement - Conference',
    description: 'Business travel expenses for tech conference',
    amount: 1850,
    currency: 'USD',
    category: 'travel',
    paymentMethod: 'check',
    priority: 'normal',
    status: 'completed',
    payeeDetails: {
      name: 'Alice Johnson',
      email: 'alice@example.com',
    },
    requestedBy: 'alice@example.com',
    requestedAt: '2024-09-15T14:20:00Z',
    dueDate: '2024-09-25T23:59:59Z',
    approvalWorkflow: [
      {
        id: 'step1',
        stepNumber: 1,
        approverName: 'Sarah Johnson',
        approverEmail: 'sarah@example.com',
        approverRole: 'Manager',
        status: 'approved',
        decision: 'approved',
        decidedAt: '2024-09-15T16:00:00Z',
      },
    ],
  },
  {
    id: '4',
    title: 'Software License Renewal',
    description: 'Annual renewal for development tools',
    amount: 3200,
    currency: 'USD',
    category: 'other',
    paymentMethod: 'credit_card',
    priority: 'low',
    status: 'draft',
    payeeDetails: {
      name: 'SoftwareCorp Inc.',
      email: 'billing@softwarecorp.com',
    },
    requestedBy: 'bob@example.com',
    requestedAt: '2024-09-22T11:30:00Z',
    approvalWorkflow: [],
  },
  {
    id: '5',
    title: 'Utility Payment - September',
    description: 'Monthly electricity and water bill',
    amount: 485,
    currency: 'USD',
    category: 'utility',
    paymentMethod: 'bank_transfer',
    priority: 'urgent',
    status: 'rejected',
    payeeDetails: {
      name: 'City Utilities',
      email: 'payments@cityutilities.com',
    },
    requestedBy: 'admin@example.com',
    requestedAt: '2024-09-19T09:45:00Z',
    approvalWorkflow: [
      {
        id: 'step1',
        stepNumber: 1,
        approverName: 'Sarah Johnson',
        approverEmail: 'sarah@example.com',
        approverRole: 'Manager',
        status: 'rejected',
        decision: 'rejected',
        decidedAt: '2024-09-19T12:00:00Z',
        comments: 'Please provide detailed breakdown of charges',
      },
    ],
  },
];

const mockRecentRequests = mockAllRequests.slice(0, 3);

type ViewMode = 'dashboard' | 'create' | 'view' | 'edit' | 'list';

export default function PaymentRequestPage({ className }: PaymentRequestPageProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
  const [selectedRequest, setSelectedRequest] = useState<PaymentRequest | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [errors, setErrors] = useState<PaymentRequestValidationErrors | undefined>();
  const [currentUserEmail] = useState('michael@example.com'); // Mock current user
  const [filters, setFilters] = useState<PaymentRequestFilters>({});

  const handleCreateNew = () => {
    setSelectedRequest(null);
    setErrors(undefined);
    setViewMode('create');
  };

  const handleViewRequest = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setViewMode('view');
  };

  const handleEditRequest = (request: PaymentRequest) => {
    setSelectedRequest(request);
    setErrors(undefined);
    setViewMode('edit');
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setSelectedRequest(null);
    setErrors(undefined);
  };

  const handleViewList = () => {
    setViewMode('list');
  };

  const handleSubmitForm = async (data: PaymentRequestFormData) => {
    setIsLoading(true);
    setErrors(undefined);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));

      // Mock validation
      if (!data.title.trim()) {
        setErrors({ title: 'Title is required' });
        return;
      }

      if (!data.amount || parseFloat(data.amount) <= 0) {
        setErrors({ amount: 'Valid amount is required' });
        return;
      }

      // Simulate successful submission
      // In real app: await submitPaymentRequest(data);
      handleBackToDashboard();
    } catch {
      setErrors({ general: 'Failed to submit payment request. Please try again.' });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (data: PaymentRequestFormData) => {
    setIsDraftSaving(true);

    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      // Simulate successful draft save
      // In real app: await saveDraftPaymentRequest(data);
      void data; // Acknowledge parameter usage
    } catch {
      setErrors({ general: 'Failed to save draft. Please try again.' });
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleApproval = async (stepId: string, comments?: string) => {
    // Simulate approval API call
    // In real app: await approvePaymentStep(stepId, comments);
    void stepId; void comments; // Acknowledge parameter usage
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const handleRejection = async (stepId: string, comments: string) => {
    // Simulate rejection API call
    // In real app: await rejectPaymentStep(stepId, comments);
    void stepId; void comments; // Acknowledge parameter usage
    await new Promise(resolve => setTimeout(resolve, 1000));
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };


  // Dashboard View
  if (viewMode === 'dashboard') {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Payment Requests</h1>
              <p className="text-sm text-gray-600 mt-1">
                Manage and track payment requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleViewList}
                className="flex items-center gap-2"
              >
                <List className="w-4 h-4" />
                View All
              </Button>
              <Button onClick={handleCreateNew} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" />
                New Payment Request
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto space-y-6">
            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <StatsCard
                title="Total Requests"
                value={mockStats.total}
                icon={FileText}
                iconColor="blue"
              />
              <StatsCard
                title="Total Amount"
                value={formatCurrency(mockStats.totalAmount)}
                icon={DollarSign}
                iconColor="blue"
              />
              <StatsCard
                title="Pending Approval"
                value={mockStats.pendingApprovalCount}
                icon={Clock}
                iconColor="blue"
              />
              <StatsCard
                title="Completed"
                value={mockStats.byStatus.completed}
                icon={CheckCircle}
                iconColor="blue"
              />
            </div>

            {/* Recent Requests */}
            <div className="bg-white border border-gray-200 rounded-lg">
              <div className="p-6 border-b border-gray-200">
                <div className="flex items-center justify-between">
                  <h2 className="text-lg font-medium text-gray-900">Recent Payment Requests</h2>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={handleViewList}
                    className="flex items-center gap-2"
                  >
                    <List className="w-4 h-4" />
                    View All
                  </Button>
                </div>
              </div>
              <div className="divide-y divide-gray-200">
                {mockRecentRequests.map((request) => (
                  <PaymentRequestCard
                    key={request.id}
                    request={request}
                    onView={handleViewRequest}
                    onEdit={handleEditRequest}
                    showEditButton={true}
                  />
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // List View
  if (viewMode === 'list') {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">All Payment Requests</h1>
              <p className="text-sm text-gray-600 mt-1">
                View and manage all payment requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleBackToDashboard}>
                Back to Dashboard
              </Button>
              <Button onClick={handleCreateNew} className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="w-4 h-4" />
                New Request
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <PaymentHistoryList
              payments={mockAllRequests}
              filters={filters}
              onFiltersChange={setFilters}
              onPaymentView={handleViewRequest}
              onPaymentEdit={handleEditRequest}
              onPaymentDelete={(id) => console.log('Delete payment:', id)}
            />
          </div>
        </div>
      </div>
    );
  }

  // Create/Edit Form View
  if (viewMode === 'create' || viewMode === 'edit') {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">
                {viewMode === 'create' ? 'Create' : 'Edit'} Payment Request
              </h1>
              <p className="text-sm text-gray-600 mt-1">
                {viewMode === 'create'
                  ? 'Submit a new payment request for approval'
                  : 'Update payment request details'}
              </p>
            </div>
            <Button variant="outline" onClick={handleBackToDashboard}>
              Back to Dashboard
            </Button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <PaymentRequestForm
              initialData={selectedRequest ? {
                title: selectedRequest.title,
                description: selectedRequest.description,
                amount: selectedRequest.amount.toString(),
                currency: selectedRequest.currency,
                category: selectedRequest.category,
                paymentMethod: selectedRequest.paymentMethod,
                priority: selectedRequest.priority,
                payeeDetails: selectedRequest.payeeDetails,
                dueDate: selectedRequest.dueDate?.split('T')[0] || '',
              } : undefined}
              onSubmit={handleSubmitForm}
              onSaveDraft={handleSaveDraft}
              isLoading={isLoading}
              isDraftSaving={isDraftSaving}
              errors={errors}
            />
          </div>
        </div>
      </div>
    );
  }

  // View Request Detail
  if (viewMode === 'view' && selectedRequest) {
    return (
      <div className={`flex flex-col h-full ${className}`}>
        {/* Page Header */}
        <div className="bg-white border-b border-gray-200 px-6 py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-semibold text-gray-900">Payment Request Details</h1>
              <p className="text-sm text-gray-600 mt-1">
                Request ID: {selectedRequest.id}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {selectedRequest.status === 'draft' && (
                <Button
                  onClick={() => handleEditRequest(selectedRequest)}
                  className="bg-blue-600 hover:bg-blue-700 text-white"
                >
                  Edit Request
                </Button>
              )}
              <Button variant="outline" onClick={handleBackToDashboard}>
                Back to Dashboard
              </Button>
            </div>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-auto p-6 bg-gray-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Request Details */}
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white border border-gray-200 rounded-lg p-6">
              <h2 className="text-lg font-medium text-gray-900 mb-4">Request Information</h2>
              <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <dt className="text-sm font-medium text-gray-500">Title</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRequest.title}</dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Amount</dt>
                  <dd className="mt-1 text-sm text-gray-900">
                    {formatCurrency(selectedRequest.amount)} {selectedRequest.currency}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Category</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedRequest.category.replace('_', ' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payment Method</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedRequest.paymentMethod.replace('_', ' ')}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Priority</dt>
                  <dd className="mt-1 text-sm text-gray-900 capitalize">
                    {selectedRequest.priority}
                  </dd>
                </div>
                <div>
                  <dt className="text-sm font-medium text-gray-500">Payee</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRequest.payeeDetails.name}</dd>
                </div>
                <div className="sm:col-span-2">
                  <dt className="text-sm font-medium text-gray-500">Description</dt>
                  <dd className="mt-1 text-sm text-gray-900">{selectedRequest.description}</dd>
                </div>
              </dl>
            </div>

            {/* Approval Workflow */}
            <ApprovalWorkflow
              approvalSteps={selectedRequest.approvalWorkflow}
              currentUserEmail={currentUserEmail}
              onApprove={handleApproval}
              onReject={handleRejection}
            />
          </div>

              {/* Status Tracker */}
              <div className="space-y-6">
                <PaymentStatusTracker
                  currentStatus={selectedRequest.status}
                  statusHistory={[
                    { status: 'draft', timestamp: selectedRequest.requestedAt },
                    { status: 'submitted', timestamp: selectedRequest.requestedAt },
                    ...(selectedRequest.status !== 'draft' && selectedRequest.status !== 'submitted'
                      ? [{ status: selectedRequest.status, timestamp: new Date().toISOString() }]
                      : []),
                  ]}
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}