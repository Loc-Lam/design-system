import { cn } from '@/lib/utils';
import type { PaymentStatus } from '@/types/payment-request';

// Base Components Level: Foundational UI primitives from @/components/common
// Following component hierarchy: Design Tokens → Base Components
// Blue color system compliance: Using blue variants instead of mixed colors

interface StatusBadgeProps {
  status: PaymentStatus;
  className?: string;
}

const statusConfig: Record<PaymentStatus, { label: string; className: string }> = {
  draft: {
    label: 'Draft',
    className: 'bg-gray-100 text-gray-700',
  },
  submitted: {
    label: 'Submitted',
    className: 'bg-blue-100 text-blue-700',
  },
  pending_approval: {
    label: 'Pending Approval',
    className: 'bg-blue-50 text-blue-600',
  },
  approved: {
    label: 'Approved',
    className: 'bg-blue-100 text-blue-700',
  },
  rejected: {
    label: 'Rejected',
    className: 'bg-red-100 text-red-700',
  },
  processing: {
    label: 'Processing',
    className: 'bg-blue-100 text-blue-700',
  },
  completed: {
    label: 'Completed',
    className: 'bg-blue-100 text-blue-700',
  },
  cancelled: {
    label: 'Cancelled',
    className: 'bg-gray-100 text-gray-700',
  },
  on_hold: {
    label: 'On Hold',
    className: 'bg-gray-100 text-gray-700',
  },
};

export function StatusBadge({ status, className }: StatusBadgeProps) {
  const config = statusConfig[status];

  return (
    <span
      className={cn(
        'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
        config.className,
        className
      )}
    >
      {config.label}
    </span>
  );
}

export default StatusBadge;