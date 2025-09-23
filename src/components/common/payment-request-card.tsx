import { AlertTriangle } from 'lucide-react';
import { Button } from '@/components/common/button';
import { StatusBadge } from '@/components/common/status-badge';
import type { PaymentRequest } from '@/types/payment-request';
import { cn } from '@/lib/utils';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

interface PaymentRequestCardProps {
  request: PaymentRequest;
  onView: (request: PaymentRequest) => void;
  onEdit?: (request: PaymentRequest) => void;
  showEditButton?: boolean;
  className?: string;
}

export function PaymentRequestCard({
  request,
  onView,
  onEdit,
  showEditButton = true,
  className,
}: PaymentRequestCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(amount);
  };

  return (
    <div className={cn(
      "p-6 hover:bg-blue-50 transition-colors",
      className
    )}>
      <div className="flex items-center justify-between">
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-3">
            <h3 className="text-sm font-medium text-gray-900 truncate">
              {request.title}
            </h3>
            <StatusBadge status={request.status} />
            {request.priority === 'high' && (
              <AlertTriangle className="w-4 h-4 text-blue-500" />
            )}
            {request.priority === 'urgent' && (
              <AlertTriangle className="w-4 h-4 text-red-600" />
            )}
          </div>
          <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
            <span>{formatCurrency(request.amount)}</span>
            <span>•</span>
            <span>{request.payeeDetails.name}</span>
            <span>•</span>
            <span>
              Requested by {request.requestedBy}
            </span>
          </div>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => onView(request)}
          >
            View
          </Button>
          {showEditButton && request.status === 'draft' && onEdit && (
            <Button
              size="sm"
              onClick={() => onEdit(request)}
            >
              Edit
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}

export default PaymentRequestCard;