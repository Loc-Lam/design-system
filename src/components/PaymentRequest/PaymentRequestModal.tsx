import { useState } from 'react';
import { FileText, DollarSign, Clock, CheckCircle, Eye, Edit3 } from 'lucide-react';
import { Modal } from '@/components/common/modal';
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

// Feature Components Level: Business logic components with specific functionality
// Following component hierarchy: Base → Layout → Composite → Feature

export interface PaymentRequestModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'dashboard' | 'create' | 'edit' | 'view' | 'list';
  selectedRequest?: PaymentRequest | null;
  onSubmit?: (data: PaymentRequestFormData) => Promise<void>;
  onSaveDraft?: (data: PaymentRequestFormData) => Promise<void>;
  onApproval?: (stepId: string, comments?: string) => Promise<void>;
  onRejection?: (stepId: string, comments: string) => Promise<void>;
  className?: string;
}

// Mock data for demonstration - same as in PaymentRequestPage
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
];

const mockRecentRequests = mockAllRequests.slice(0, 3);

type ViewMode = 'dashboard' | 'create' | 'view' | 'edit' | 'list';

export function PaymentRequestModal({
  isOpen,
  onClose,
  initialMode = 'dashboard',
  selectedRequest = null,
  onSubmit,
  onSaveDraft,
  onApproval,
  onRejection,
  className,
}: PaymentRequestModalProps) {
  const [viewMode, setViewMode] = useState<ViewMode>(initialMode);
  const [currentRequest, setCurrentRequest] = useState<PaymentRequest | null>(selectedRequest);
  const [isLoading, setIsLoading] = useState(false);
  const [isDraftSaving, setIsDraftSaving] = useState(false);
  const [errors, setErrors] = useState<PaymentRequestValidationErrors | undefined>();
  const [currentUserEmail] = useState('michael@example.com'); // Mock current user
  const [filters, setFilters] = useState<PaymentRequestFilters>({});

  // Reset state when modal opens/closes
  const handleModalClose = () => {
    setViewMode(initialMode);
    setCurrentRequest(selectedRequest);
    setErrors(undefined);
    setIsLoading(false);
    setIsDraftSaving(false);
    onClose();
  };

  const handleCreateNew = () => {
    setCurrentRequest(null);
    setErrors(undefined);
    setViewMode('create');
  };

  const handleViewRequest = (request: PaymentRequest) => {
    setCurrentRequest(request);
    setViewMode('view');
  };

  const handleEditRequest = (request: PaymentRequest) => {
    setCurrentRequest(request);
    setErrors(undefined);
    setViewMode('edit');
  };

  const handleBackToDashboard = () => {
    setViewMode('dashboard');
    setCurrentRequest(null);
    setErrors(undefined);
  };

  const handleViewList = () => {
    setViewMode('list');
  };

  const handleSubmitForm = async (data: PaymentRequestFormData) => {
    setIsLoading(true);
    setErrors(undefined);

    try {
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Default behavior - simulate API call
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
      }

      // On success, go back to dashboard
      handleBackToDashboard();
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Failed to submit payment request. Please try again.' });
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveDraft = async (data: PaymentRequestFormData) => {
    setIsDraftSaving(true);

    try {
      if (onSaveDraft) {
        await onSaveDraft(data);
      } else {
        // Default behavior - simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    } catch (error) {
      if (error instanceof Error) {
        setErrors({ general: error.message });
      } else {
        setErrors({ general: 'Failed to save draft. Please try again.' });
      }
    } finally {
      setIsDraftSaving(false);
    }
  };

  const handleApproval = async (stepId: string, comments?: string) => {
    if (onApproval) {
      await onApproval(stepId, comments);
    } else {
      // Default behavior - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const handleRejection = async (stepId: string, comments: string) => {
    if (onRejection) {
      await onRejection(stepId, comments);
    } else {
      // Default behavior - simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  const getModalTitle = () => {
    switch (viewMode) {
      case 'create':
        return 'Create Payment Request';
      case 'edit':
        return 'Edit Payment Request';
      case 'view':
        return 'Payment Request Details';
      case 'list':
        return 'All Payment Requests';
      default:
        return 'Payment Requests';
    }
  };

  const getModalSize = () => {
    switch (viewMode) {
      case 'create':
      case 'edit':
      case 'list':
        return 'full' as const;
      case 'view':
        return 'xl' as const;
      default:
        return 'xl' as const;
    }
  };

  const renderContent = () => {
    // Dashboard View
    if (viewMode === 'dashboard') {
      return (
        <div className="p-6 space-y-6">
          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
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

          {/* Action Buttons */}
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-medium text-foreground">Recent Payment Requests</h3>
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={handleViewList}
                className="flex items-center gap-2"
                size="sm"
              >
                <FileText className="w-4 h-4" />
                View All
              </Button>
              <Button
                onClick={handleCreateNew}
                className="flex items-center gap-2"
                size="sm"
              >
                <DollarSign className="w-4 h-4" />
                New Request
              </Button>
            </div>
          </div>

          {/* Recent Requests */}
          <div className="border border-border rounded-lg divide-y divide-border">
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
      );
    }

    // List View
    if (viewMode === 'list') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-foreground">All Payment Requests</h3>
              <p className="text-sm text-muted-foreground mt-1">
                View and manage all payment requests
              </p>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                Back to Dashboard
              </Button>
              <Button onClick={handleCreateNew} size="sm" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                New Request
              </Button>
            </div>
          </div>

          <PaymentHistoryList
            payments={mockAllRequests}
            filters={filters}
            onFiltersChange={setFilters}
            onPaymentView={handleViewRequest}
            onPaymentEdit={handleEditRequest}
            onPaymentDelete={(id) => console.log('Delete payment:', id)}
          />
        </div>
      );
    }

    // Create/Edit Form View
    if (viewMode === 'create' || viewMode === 'edit') {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-foreground">
                {viewMode === 'create' ? 'Create' : 'Edit'} Payment Request
              </h3>
              <p className="text-sm text-muted-foreground mt-1">
                {viewMode === 'create'
                  ? 'Submit a new payment request for approval'
                  : 'Update payment request details'}
              </p>
            </div>
            <Button variant="outline" onClick={handleBackToDashboard} size="sm">
              Back to Dashboard
            </Button>
          </div>

          <PaymentRequestForm
            initialData={currentRequest ? {
              title: currentRequest.title,
              description: currentRequest.description,
              amount: currentRequest.amount.toString(),
              currency: currentRequest.currency,
              category: currentRequest.category,
              paymentMethod: currentRequest.paymentMethod,
              priority: currentRequest.priority,
              payeeDetails: currentRequest.payeeDetails,
              dueDate: currentRequest.dueDate?.split('T')[0] || '',
            } : undefined}
            onSubmit={handleSubmitForm}
            onSaveDraft={handleSaveDraft}
            isLoading={isLoading}
            isDraftSaving={isDraftSaving}
            errors={errors}
          />
        </div>
      );
    }

    // View Request Detail
    if (viewMode === 'view' && currentRequest) {
      return (
        <div className="p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h3 className="text-lg font-medium text-foreground">Payment Request Details</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Request ID: {currentRequest.id}
              </p>
            </div>
            <div className="flex items-center gap-3">
              {currentRequest.status === 'draft' && (
                <Button
                  onClick={() => handleEditRequest(currentRequest)}
                  size="sm"
                  className="flex items-center gap-2"
                >
                  <Edit3 className="w-4 h-4" />
                  Edit Request
                </Button>
              )}
              <Button variant="outline" onClick={handleBackToDashboard} size="sm">
                Back to Dashboard
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Request Details */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-card border border-border rounded-lg p-6">
                <h4 className="text-base font-medium text-foreground mb-4">Request Information</h4>
                <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Title</dt>
                    <dd className="mt-1 text-sm text-foreground">{currentRequest.title}</dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Amount</dt>
                    <dd className="mt-1 text-sm text-foreground">
                      {formatCurrency(currentRequest.amount)} {currentRequest.currency}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Category</dt>
                    <dd className="mt-1 text-sm text-foreground capitalize">
                      {currentRequest.category.replace('_', ' ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Payment Method</dt>
                    <dd className="mt-1 text-sm text-foreground capitalize">
                      {currentRequest.paymentMethod.replace('_', ' ')}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Priority</dt>
                    <dd className="mt-1 text-sm text-foreground capitalize">
                      {currentRequest.priority}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm font-medium text-muted-foreground">Payee</dt>
                    <dd className="mt-1 text-sm text-foreground">{currentRequest.payeeDetails.name}</dd>
                  </div>
                  <div className="sm:col-span-2">
                    <dt className="text-sm font-medium text-muted-foreground">Description</dt>
                    <dd className="mt-1 text-sm text-foreground">{currentRequest.description}</dd>
                  </div>
                </dl>
              </div>

              {/* Approval Workflow */}
              <ApprovalWorkflow
                approvalSteps={currentRequest.approvalWorkflow}
                currentUserEmail={currentUserEmail}
                onApprove={handleApproval}
                onReject={handleRejection}
              />
            </div>

            {/* Status Tracker */}
            <div className="space-y-6">
              <PaymentStatusTracker
                currentStatus={currentRequest.status}
                statusHistory={[
                  { status: 'draft', timestamp: currentRequest.requestedAt },
                  { status: 'submitted', timestamp: currentRequest.requestedAt },
                  ...(currentRequest.status !== 'draft' && currentRequest.status !== 'submitted'
                    ? [{ status: currentRequest.status, timestamp: new Date().toISOString() }]
                    : []),
                ]}
              />
            </div>
          </div>
        </div>
      );
    }

    return null;
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleModalClose}
      title={getModalTitle()}
      size={getModalSize()}
      className={className}
      closeOnBackdropClick={viewMode === 'dashboard'}
      closeOnEscape={true}
    >
      {renderContent()}
    </Modal>
  );
}

export default PaymentRequestModal;