import { Check, Clock, X, AlertTriangle, PlayCircle, CheckCircle2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { PaymentStatus } from '@/types/payment-request';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

interface StatusStep {
  status: PaymentStatus;
  label: string;
  icon: React.ReactNode;
  color: string;
  bgColor: string;
  timestamp?: string;
}

interface PaymentStatusTrackerProps {
  currentStatus: PaymentStatus;
  statusHistory?: Array<{
    status: PaymentStatus;
    timestamp: string;
    notes?: string;
  }>;
  className?: string;
}

const STATUS_FLOW: StatusStep[] = [
  {
    status: 'draft',
    label: 'Draft',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  {
    status: 'submitted',
    label: 'Submitted',
    icon: <PlayCircle className="w-4 h-4" />,
    color: 'text-blue-600',
    bgColor: 'bg-blue-100',
  },
  {
    status: 'pending_approval',
    label: 'Pending Approval',
    icon: <Clock className="w-4 h-4" />,
    color: 'text-yellow-600',
    bgColor: 'bg-yellow-100',
  },
  {
    status: 'approved',
    label: 'Approved',
    icon: <Check className="w-4 h-4" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
  {
    status: 'processing',
    label: 'Processing',
    icon: <PlayCircle className="w-4 h-4" />,
    color: 'text-purple-600',
    bgColor: 'bg-purple-100',
  },
  {
    status: 'completed',
    label: 'Completed',
    icon: <CheckCircle2 className="w-4 h-4" />,
    color: 'text-green-600',
    bgColor: 'bg-green-100',
  },
];

const ERROR_STATUSES: StatusStep[] = [
  {
    status: 'rejected',
    label: 'Rejected',
    icon: <X className="w-4 h-4" />,
    color: 'text-red-600',
    bgColor: 'bg-red-100',
  },
  {
    status: 'cancelled',
    label: 'Cancelled',
    icon: <X className="w-4 h-4" />,
    color: 'text-gray-600',
    bgColor: 'bg-gray-100',
  },
  {
    status: 'on_hold',
    label: 'On Hold',
    icon: <AlertTriangle className="w-4 h-4" />,
    color: 'text-orange-600',
    bgColor: 'bg-orange-100',
  },
];

export default function PaymentStatusTracker({
  currentStatus,
  statusHistory,
  className,
}: PaymentStatusTrackerProps) {
  // Determine which flow to show based on current status
  const isErrorStatus = ERROR_STATUSES.some(step => step.status === currentStatus);
  const displayFlow = isErrorStatus ? STATUS_FLOW.slice(0, 3).concat(ERROR_STATUSES.filter(step => step.status === currentStatus)) : STATUS_FLOW;

  const getCurrentStepIndex = () => {
    return displayFlow.findIndex(step => step.status === currentStatus);
  };

  const isStepCompleted = (stepIndex: number) => {
    const currentIndex = getCurrentStepIndex();
    if (currentIndex === -1) return false;

    // If we're in an error state, only the steps before the error are completed
    if (isErrorStatus) {
      return stepIndex < currentIndex;
    }

    // Normal flow: all steps up to current are completed
    return stepIndex <= currentIndex;
  };

  const isStepCurrent = (stepIndex: number) => {
    return stepIndex === getCurrentStepIndex();
  };

  const getStepTimestamp = (status: PaymentStatus) => {
    return statusHistory?.find(h => h.status === status)?.timestamp;
  };

  const formatTimestamp = (timestamp?: string) => {
    if (!timestamp) return '';
    return new Date(timestamp).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-6', className)}>
      <h3 className="text-lg font-medium text-gray-900 mb-6">Payment Status</h3>

      <div className="space-y-4">
        {displayFlow.map((step, index) => {
          const isCompleted = isStepCompleted(index);
          const isCurrent = isStepCurrent(index);
          const timestamp = getStepTimestamp(step.status);

          return (
            <div key={step.status} className="flex items-center space-x-4">
              {/* Status Icon */}
              <div
                className={cn(
                  'flex items-center justify-center w-8 h-8 rounded-full border-2 transition-colors',
                  isCurrent
                    ? `${step.bgColor} ${step.color} border-current`
                    : isCompleted
                    ? 'bg-green-100 text-green-600 border-green-600'
                    : 'bg-gray-50 text-gray-400 border-gray-300'
                )}
              >
                {isCompleted && !isCurrent ? (
                  <Check className="w-4 h-4" />
                ) : (
                  step.icon
                )}
              </div>

              {/* Connecting Line */}
              {index < displayFlow.length - 1 && (
                <div className="absolute left-8 mt-8 w-0.5 h-6 bg-gray-200" />
              )}

              {/* Status Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p
                    className={cn(
                      'text-sm font-medium',
                      isCurrent
                        ? step.color
                        : isCompleted
                        ? 'text-green-600'
                        : 'text-gray-500'
                    )}
                  >
                    {step.label}
                    {isCurrent && (
                      <span className="ml-2 text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                        Current
                      </span>
                    )}
                  </p>
                  {timestamp && (
                    <p className="text-xs text-gray-500">
                      {formatTimestamp(timestamp)}
                    </p>
                  )}
                </div>

                {/* Additional notes for current or error statuses */}
                {isCurrent && (
                  <div className="mt-1">
                    {currentStatus === 'pending_approval' && (
                      <p className="text-xs text-gray-600">
                        Waiting for management approval
                      </p>
                    )}
                    {currentStatus === 'processing' && (
                      <p className="text-xs text-gray-600">
                        Payment is being processed by finance team
                      </p>
                    )}
                    {currentStatus === 'rejected' && (
                      <p className="text-xs text-red-600">
                        Request was rejected. Check comments for details.
                      </p>
                    )}
                    {currentStatus === 'on_hold' && (
                      <p className="text-xs text-orange-600">
                        Request is temporarily on hold
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="mt-6">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Progress</span>
          <span>
            {Math.round((getCurrentStepIndex() + 1) / displayFlow.length * 100)}% Complete
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className={cn(
              'h-2 rounded-full transition-all duration-300',
              isErrorStatus ? 'bg-red-500' : 'bg-blue-500'
            )}
            style={{
              width: `${((getCurrentStepIndex() + 1) / displayFlow.length) * 100}%`,
            }}
          />
        </div>
      </div>
    </div>
  );
}