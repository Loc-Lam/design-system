import { useState } from 'react';
import { Check, X, Clock, User, MessageSquare, ChevronDown, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { TextArea } from '@/components/common/form-field';
import type { ApprovalStep } from '@/types/payment-request';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

interface ApprovalWorkflowProps {
  approvalSteps: ApprovalStep[];
  currentUserEmail?: string;
  onApprove?: (stepId: string, comments?: string) => Promise<void>;
  onReject?: (stepId: string, comments: string) => Promise<void>;
  isProcessing?: boolean;
  className?: string;
}

export default function ApprovalWorkflow({
  approvalSteps,
  currentUserEmail,
  onApprove,
  onReject,
  isProcessing = false,
  className,
}: ApprovalWorkflowProps) {
  const [expandedSteps, setExpandedSteps] = useState<Set<string>>(new Set());
  const [comments, setComments] = useState<Record<string, string>>({});
  const [processingStep, setProcessingStep] = useState<string | null>(null);

  const toggleStepExpansion = (stepId: string) => {
    const newExpanded = new Set(expandedSteps);
    if (newExpanded.has(stepId)) {
      newExpanded.delete(stepId);
    } else {
      newExpanded.add(stepId);
    }
    setExpandedSteps(newExpanded);
  };

  const updateComments = (stepId: string, value: string) => {
    setComments(prev => ({ ...prev, [stepId]: value }));
  };

  const handleApprove = async (step: ApprovalStep) => {
    if (!onApprove || processingStep) return;

    setProcessingStep(step.id);
    try {
      await onApprove(step.id, comments[step.id]);
      setComments(prev => ({ ...prev, [step.id]: '' }));
    } finally {
      setProcessingStep(null);
    }
  };

  const handleReject = async (step: ApprovalStep) => {
    if (!onReject || processingStep || !comments[step.id]) return;

    setProcessingStep(step.id);
    try {
      await onReject(step.id, comments[step.id]);
      setComments(prev => ({ ...prev, [step.id]: '' }));
    } finally {
      setProcessingStep(null);
    }
  };

  const getStepIcon = (step: ApprovalStep) => {
    switch (step.status) {
      case 'approved':
        return <Check className="w-4 h-4 text-green-600" />;
      case 'rejected':
        return <X className="w-4 h-4 text-red-600" />;
      case 'skipped':
        return <div className="w-4 h-4 border border-gray-300 rounded-full bg-gray-100" />;
      default:
        return <Clock className="w-4 h-4 text-yellow-600" />;
    }
  };

  const getStepColor = (step: ApprovalStep) => {
    switch (step.status) {
      case 'approved':
        return 'border-green-200 bg-green-50';
      case 'rejected':
        return 'border-red-200 bg-red-50';
      case 'skipped':
        return 'border-gray-200 bg-gray-50';
      default:
        return 'border-yellow-200 bg-yellow-50';
    }
  };

  const canUserActOnStep = (step: ApprovalStep) => {
    return (
      currentUserEmail === step.approverEmail &&
      step.status === 'pending' &&
      !isProcessing &&
      !processingStep
    );
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

  // Calculate overall progress
  const completedSteps = approvalSteps.filter(step =>
    step.status === 'approved' || step.status === 'rejected' || step.status === 'skipped'
  ).length;
  const progressPercentage = (completedSteps / approvalSteps.length) * 100;

  return (
    <div className={cn('bg-white border border-gray-200 rounded-lg p-6', className)}>
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-lg font-medium text-gray-900">Approval Workflow</h3>
        <div className="text-sm text-gray-600">
          {completedSteps} of {approvalSteps.length} steps completed
        </div>
      </div>

      {/* Progress Bar */}
      <div className="mb-6">
        <div className="flex justify-between text-xs text-gray-600 mb-2">
          <span>Progress</span>
          <span>{Math.round(progressPercentage)}% Complete</span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2">
          <div
            className="bg-blue-500 h-2 rounded-full transition-all duration-300"
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      </div>

      {/* Approval Steps */}
      <div className="space-y-4">
        {approvalSteps.map((step) => {
          const isExpanded = expandedSteps.has(step.id);
          const canAct = canUserActOnStep(step);
          const isCurrentUserStep = currentUserEmail === step.approverEmail;

          return (
            <div
              key={step.id}
              className={cn(
                'border rounded-lg transition-colors',
                getStepColor(step),
                isCurrentUserStep && step.status === 'pending' && 'ring-2 ring-blue-200'
              )}
            >
              <div className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    {/* Step Number */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white border-2 border-gray-200">
                      <span className="text-sm font-medium text-gray-600">
                        {step.stepNumber}
                      </span>
                    </div>

                    {/* Step Icon */}
                    <div className="flex items-center justify-center w-8 h-8 rounded-full bg-white">
                      {getStepIcon(step)}
                    </div>

                    {/* Approver Info */}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2">
                        <User className="w-4 h-4 text-gray-400" />
                        <p className="text-sm font-medium text-gray-900">
                          {step.approverName}
                        </p>
                        <span className="text-xs text-gray-500">
                          ({step.approverRole})
                        </span>
                        {isCurrentUserStep && step.status === 'pending' && (
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded-full">
                            Your turn
                          </span>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        {step.approverEmail}
                        {step.requiredAmount && (
                          <span className="ml-2">
                            • Authorized up to ${step.requiredAmount.toLocaleString()}
                          </span>
                        )}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    {/* Status and Timestamp */}
                    <div className="text-right">
                      <p className="text-sm font-medium capitalize">
                        {step.status.replace('_', ' ')}
                      </p>
                      {step.decidedAt && (
                        <p className="text-xs text-gray-500">
                          {formatTimestamp(step.decidedAt)}
                        </p>
                      )}
                    </div>

                    {/* Expand/Collapse Button */}
                    <button
                      onClick={() => toggleStepExpansion(step.id)}
                      className="p-1 hover:bg-white rounded transition-colors"
                    >
                      {isExpanded ? (
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                      ) : (
                        <ChevronRight className="w-4 h-4 text-gray-400" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Expanded Content */}
                {isExpanded && (
                  <div className="mt-4 pl-11 space-y-4">
                    {/* Existing Comments */}
                    {step.comments && (
                      <div className="bg-white p-3 rounded border">
                        <div className="flex items-center space-x-2 mb-2">
                          <MessageSquare className="w-4 h-4 text-gray-400" />
                          <span className="text-sm font-medium text-gray-700">Comments</span>
                        </div>
                        <p className="text-sm text-gray-600">{step.comments}</p>
                      </div>
                    )}

                    {/* Action Area for Current User */}
                    {canAct && (
                      <div className="bg-white p-4 rounded border border-blue-200">
                        <h4 className="text-sm font-medium text-gray-900 mb-3">
                          Review & Decision
                        </h4>

                        <div className="space-y-3">
                          <TextArea
                            placeholder="Add comments (required for rejection, optional for approval)"
                            value={comments[step.id] || ''}
                            onChange={(e) => updateComments(step.id, e.target.value)}
                            rows={3}
                            disabled={processingStep === step.id}
                          />

                          <div className="flex space-x-3">
                            <Button
                              onClick={() => handleApprove(step)}
                              disabled={processingStep === step.id}
                              className="flex-1"
                            >
                              {processingStep === step.id ? (
                                <>
                                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <Check className="w-4 h-4 mr-2" />
                                  Approve
                                </>
                              )}
                            </Button>

                            <Button
                              variant="outline"
                              onClick={() => handleReject(step)}
                              disabled={
                                processingStep === step.id || !comments[step.id]?.trim()
                              }
                              className="flex-1 border-red-200 text-red-700 hover:bg-red-50"
                            >
                              {processingStep === step.id ? (
                                <>
                                  <Clock className="w-4 h-4 mr-2 animate-spin" />
                                  Processing...
                                </>
                              ) : (
                                <>
                                  <X className="w-4 h-4 mr-2" />
                                  Reject
                                </>
                              )}
                            </Button>
                          </div>

                          {step.status === 'pending' && !comments[step.id]?.trim() && (
                            <p className="text-xs text-gray-500">
                              Comments are required for rejection
                            </p>
                          )}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Workflow Summary */}
      <div className="mt-6 pt-4 border-t border-gray-200">
        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-600">
            Next: {
              approvalSteps.find(step => step.status === 'pending')?.approverName ||
              'All approvals complete'
            }
          </span>
          <span className="text-gray-600">
            {approvalSteps.filter(step => step.status === 'pending').length} steps remaining
          </span>
        </div>
      </div>
    </div>
  );
}