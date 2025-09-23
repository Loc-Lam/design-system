// Payment Request Type Definitions
// Following component hierarchy: Design Tokens → Base → Layout → Composite → Feature → Page

export type PaymentStatus =
  | 'draft'
  | 'submitted'
  | 'pending_approval'
  | 'approved'
  | 'rejected'
  | 'processing'
  | 'completed'
  | 'cancelled'
  | 'on_hold';

export type PaymentCategory =
  | 'expense_reimbursement'
  | 'vendor_payment'
  | 'salary'
  | 'contractor_payment'
  | 'utility'
  | 'office_supplies'
  | 'travel'
  | 'other';

export type PaymentMethod =
  | 'bank_transfer'
  | 'check'
  | 'credit_card'
  | 'paypal'
  | 'wire_transfer';

export type PaymentPriority = 'low' | 'normal' | 'high' | 'urgent';

export interface PayeeDetails {
  name: string;
  email?: string;
  phone?: string;
  address?: {
    street1: string;
    street2?: string;
    city: string;
    state: string;
    zipCode: string;
    country: string;
  };
  bankInfo?: {
    accountNumber: string;
    routingNumber: string;
    bankName: string;
    accountType: 'checking' | 'savings';
  };
}

export interface ApprovalStep {
  id: string;
  stepNumber: number;
  approverName: string;
  approverEmail: string;
  approverRole: string;
  status: 'pending' | 'approved' | 'rejected' | 'skipped';
  decision?: 'approved' | 'rejected';
  comments?: string;
  decidedAt?: string;
  requiredAmount?: number; // Minimum amount threshold for this approver
}

export interface PaymentRequest {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  category: PaymentCategory;
  paymentMethod: PaymentMethod;
  priority: PaymentPriority;
  status: PaymentStatus;
  payeeDetails: PayeeDetails;
  requestedBy: string;
  requestedAt: string;
  dueDate?: string;
  approvalWorkflow: ApprovalStep[];
  attachments?: string[];
  completedAt?: string;
  notes?: string;
  internalNotes?: string;
}

export interface PaymentRequestFormData {
  title: string;
  description: string;
  amount: string;
  currency: string;
  category: PaymentCategory;
  paymentMethod: PaymentMethod;
  priority: PaymentPriority;
  payeeDetails: {
    name: string;
    email?: string;
    phone?: string;
    address?: {
      street1: string;
      street2?: string;
      city: string;
      state: string;
      zipCode: string;
      country: string;
    };
    bankInfo?: {
      accountNumber: string;
      routingNumber: string;
      bankName: string;
      accountType: string;
    };
  };
  dueDate?: string;
}

export interface PaymentRequestValidationErrors {
  title?: string;
  description?: string;
  amount?: string;
  currency?: string;
  category?: string;
  paymentMethod?: string;
  priority?: string;
  payeeDetails?: {
    name?: string;
    email?: string;
    phone?: string;
    address?: {
      street1?: string;
      city?: string;
      state?: string;
      zipCode?: string;
      country?: string;
    };
    bankInfo?: {
      accountNumber?: string;
      routingNumber?: string;
      bankName?: string;
      accountType?: string;
    };
  };
  dueDate?: string;
  general?: string;
}

export interface PaymentRequestFilters {
  status?: PaymentStatus[];
  category?: PaymentCategory[];
  paymentMethod?: PaymentMethod[];
  priority?: PaymentPriority[];
  dateRange?: {
    start: string;
    end: string;
  };
  amountRange?: {
    min: number;
    max: number;
  };
  requestedBy?: string;
  search?: string;
}

export interface PaymentRequestStats {
  total: number;
  byStatus: Record<PaymentStatus, number>;
  byCategory: Record<PaymentCategory, number>;
  totalAmount: number;
  averageAmount: number;
  pendingApprovalCount: number;
  overDueCount: number;
}

// Sort and pagination types
export type SortField = 'createdAt' | 'requestedAt' | 'amount' | 'status' | 'dueDate' | 'priority';
export type SortDirection = 'asc' | 'desc';

export interface PaginationState {
  page: number;
  pageSize: number;
  total: number;
}