import { cn } from '@/lib/utils';
import type { PaymentStatus } from '@/types/payment-request';

// Base Components Level: Foundational UI primitives from @/components/common
// Following component hierarchy: Design Tokens → Base Components
// Blue color system compliance: Using blue variants instead of mixed colors

export type ExpenseStatus = 'pending' | 'submitted' | 'approved' | 'rejected' | 'reimbursed';
export type ReportStatus = 'open' | 'processing' | 'retracted';
export type StatusBadgeStatus = PaymentStatus | ExpenseStatus | ReportStatus;

interface StatusBadgeProps {
  status: StatusBadgeStatus;
  color?: 'blue' | 'blue-light' | 'gray';
  className?: string;
}

const colorClassMap = {
  blue: 'bg-blue-100 text-blue-700',
  'blue-light': 'bg-blue-50 text-blue-600 border border-blue-200',
  gray: 'bg-gray-100 text-gray-700'
};

const statusConfig: Record<StatusBadgeStatus, { label: string; defaultColor: keyof typeof colorClassMap }> = {
  // Payment statuses
  draft: { label: 'Draft', defaultColor: 'gray' },
  submitted: { label: 'Submitted', defaultColor: 'blue' },
  pending_approval: { label: 'Pending Approval', defaultColor: 'blue-light' },
  approved: { label: 'Approved', defaultColor: 'blue' },
  rejected: { label: 'Rejected', defaultColor: 'blue' },
  processing: { label: 'Processing', defaultColor: 'blue' },
  completed: { label: 'Completed', defaultColor: 'blue' },
  cancelled: { label: 'Cancelled', defaultColor: 'gray' },
  on_hold: { label: 'On Hold', defaultColor: 'gray' },
  // Expense statuses
  pending: { label: 'Pending', defaultColor: 'blue-light' },
  reimbursed: { label: 'Reimbursed', defaultColor: 'blue' },
  // Report statuses
  open: { label: 'Open', defaultColor: 'blue-light' },
  retracted: { label: 'Retracted', defaultColor: 'gray' }
};

export function StatusBadge({ status, color, className }: StatusBadgeProps) {
  const config = statusConfig[status];
  const statusColor = color || config.defaultColor;
  const colorClass = colorClassMap[statusColor];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        colorClass,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;