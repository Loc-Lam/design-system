import { useState } from 'react';
import {
  DollarSign,
  Clock,
  CheckCircle,
  XCircle,
  AlertCircle,
  Eye,
  Download,
  Search,
  Calendar,
  User,
  Building,
} from 'lucide-react';
import { cn } from '@/lib/utils';

type ColorTheme = 'default' | 'blue' | 'green' | 'purple' | 'red' | 'orange';
type Layout = 'single' | 'double';
type ApprovalStatus = 'pending' | 'approved' | 'rejected' | 'in_review';
type Priority = 'low' | 'medium' | 'high' | 'urgent';

const colorThemes = {
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    mutedText: 'text-gray-700',
    labelText: 'text-gray-700',
    border: 'border-gray-200',
    cardBg: 'bg-white',
    button: 'bg-gray-800 hover:bg-gray-700 text-white',
    secondaryButton: 'bg-gray-50 hover:bg-gray-100 text-black',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-gray-50',
    dropdownBorder: 'border-gray-200',
    skillBg: 'bg-gray-100 text-gray-800',
    dangerText: 'text-red-600',
    successText: 'text-green-600',
    warningText: 'text-yellow-600',
  },
  blue: {
    background: 'bg-blue-50',
    text: 'text-blue-900',
    mutedText: 'text-blue-700',
    labelText: 'text-blue-600',
    border: 'border-blue-200',
    cardBg: 'bg-white',
    button: 'bg-blue-600 hover:bg-blue-700 text-white',
    secondaryButton: 'bg-blue-100 hover:bg-blue-200 text-blue-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-blue-50',
    dropdownBorder: 'border-blue-200',
    skillBg: 'bg-blue-100 text-blue-800',
    dangerText: 'text-red-600',
    successText: 'text-green-600',
    warningText: 'text-yellow-600',
  },
  green: {
    background: 'bg-green-50',
    text: 'text-green-900',
    mutedText: 'text-green-700',
    labelText: 'text-green-600',
    border: 'border-green-200',
    cardBg: 'bg-white',
    button: 'bg-green-600 hover:bg-green-700 text-white',
    secondaryButton: 'bg-green-100 hover:bg-green-200 text-green-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-green-50',
    dropdownBorder: 'border-green-200',
    skillBg: 'bg-green-100 text-green-800',
    dangerText: 'text-red-600',
    successText: 'text-green-700',
    warningText: 'text-yellow-600',
  },
  purple: {
    background: 'bg-purple-50',
    text: 'text-purple-900',
    mutedText: 'text-purple-700',
    labelText: 'text-purple-600',
    border: 'border-purple-200',
    cardBg: 'bg-white',
    button: 'bg-purple-600 hover:bg-purple-700 text-white',
    secondaryButton: 'bg-purple-100 hover:bg-purple-200 text-purple-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-purple-50',
    dropdownBorder: 'border-purple-200',
    skillBg: 'bg-purple-100 text-purple-800',
    dangerText: 'text-red-600',
    successText: 'text-green-600',
    warningText: 'text-yellow-600',
  },
  red: {
    background: 'bg-red-50',
    text: 'text-red-900',
    mutedText: 'text-red-700',
    labelText: 'text-red-600',
    border: 'border-red-200',
    cardBg: 'bg-white',
    button: 'bg-red-600 hover:bg-red-700 text-white',
    secondaryButton: 'bg-red-100 hover:bg-red-200 text-red-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-red-50',
    dropdownBorder: 'border-red-200',
    skillBg: 'bg-red-100 text-red-800',
    dangerText: 'text-red-700',
    successText: 'text-green-600',
    warningText: 'text-yellow-600',
  },
  orange: {
    background: 'bg-orange-50',
    text: 'text-orange-900',
    mutedText: 'text-orange-700',
    labelText: 'text-orange-600',
    border: 'border-orange-200',
    cardBg: 'bg-white',
    button: 'bg-orange-600 hover:bg-orange-700 text-white',
    secondaryButton: 'bg-orange-100 hover:bg-orange-200 text-orange-900',
    dropdownBg: 'bg-white',
    dropdownHover: 'hover:bg-orange-50',
    dropdownBorder: 'border-orange-200',
    skillBg: 'bg-orange-100 text-orange-800',
    dangerText: 'text-red-600',
    successText: 'text-green-600',
    warningText: 'text-yellow-600',
  },
};

interface PaymentRequestData {
  id: string;
  title: string;
  description: string;
  amount: number;
  currency: string;
  status: ApprovalStatus;
  priority: Priority;
  requestedBy: {
    name: string;
    email: string;
    department: string;
    avatar?: string;
  };
  requestedDate: string;
  dueDate?: string;
  approvedBy?: {
    name: string;
    email: string;
    approvedDate: string;
  };
  rejectedBy?: {
    name: string;
    email: string;
    rejectedDate: string;
    reason?: string;
  };
  attachments?: {
    name: string;
    url: string;
    type: string;
    size: string;
  }[];
  category: string;
  vendor?: string;
  invoiceNumber?: string;
  approvalWorkflow?: {
    currentStep: number;
    totalSteps: number;
    steps: {
      step: number;
      approver: string;
      status: 'pending' | 'approved' | 'rejected';
      date?: string;
    }[];
  };
}

interface PaymentRequestProps {
  'data-id'?: string;
  paymentRequests?: PaymentRequestData[];
  layout?: Layout;
  colorTheme?: ColorTheme;
  isLoading?: boolean;
  onApprove?: (id: string) => void;
  onReject?: (id: string, reason?: string) => void;
  onViewDetails?: (id: string) => void;
  currentUser?: {
    name: string;
    role: string;
    permissions: string[];
  };
}

const PaymentRequest = ({
  'data-id': dataId,
  paymentRequests = [],
  layout = 'single',
  colorTheme = 'default',
  isLoading = false,
  onApprove,
  onReject,
  onViewDetails,
  currentUser,
}: PaymentRequestProps) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ApprovalStatus | 'all'>('all');
  const [priorityFilter, setPriorityFilter] = useState<Priority | 'all'>('all');
  const [selectedRequest, setSelectedRequest] = useState<string | null>(null);
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [rejectReason, setRejectReason] = useState('');

  const theme = colorThemes[colorTheme];

  const getStatusIcon = (status: ApprovalStatus) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'rejected':
        return <XCircle className="w-5 h-5 text-red-500" />;
      case 'in_review':
        return <AlertCircle className="w-5 h-5 text-yellow-500" />;
      default:
        return <Clock className="w-5 h-5 text-gray-500" />;
    }
  };

  const getStatusBadge = (status: ApprovalStatus) => {
    const styles = {
      approved: 'bg-green-100 text-green-800 border-green-200',
      rejected: 'bg-red-100 text-red-800 border-red-200',
      in_review: 'bg-yellow-100 text-yellow-800 border-yellow-200',
      pending: 'bg-gray-100 text-gray-800 border-gray-200',
    };

    return (
      <span className={`inline-flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium border ${styles[status]}`}>
        {getStatusIcon(status)}
        {status.replace('_', ' ').charAt(0).toUpperCase() + status.replace('_', ' ').slice(1)}
      </span>
    );
  };

  const getPriorityBadge = (priority: Priority) => {
    const styles = {
      urgent: 'bg-red-100 text-red-800',
      high: 'bg-orange-100 text-orange-800',
      medium: 'bg-yellow-100 text-yellow-800',
      low: 'bg-green-100 text-green-800',
    };

    return (
      <span className={`inline-flex px-2 py-1 rounded-full text-xs font-medium ${styles[priority]}`}>
        {priority.charAt(0).toUpperCase() + priority.slice(1)}
      </span>
    );
  };

  const handleApprove = (id: string) => {
    if (onApprove) {
      onApprove(id);
    } else {
      alert(`Approved payment request: ${id}`);
    }
  };

  const handleReject = (id: string) => {
    setSelectedRequest(id);
    setRejectModalOpen(true);
  };

  const confirmReject = () => {
    if (selectedRequest) {
      if (onReject) {
        onReject(selectedRequest, rejectReason);
      } else {
        alert(`Rejected payment request: ${selectedRequest}\nReason: ${rejectReason}`);
      }
      setRejectModalOpen(false);
      setRejectReason('');
      setSelectedRequest(null);
    }
  };

  const filteredRequests = paymentRequests.filter(request => {
    const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedBy.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || request.status === statusFilter;
    const matchesPriority = priorityFilter === 'all' || request.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const pendingCount = paymentRequests.filter(r => r.status === 'pending').length;
  const totalAmount = paymentRequests.reduce((sum, r) => sum + r.amount, 0);

  if (isLoading) {
    return (
      <div className={`max-w-6xl mx-auto p-6 ${theme.background}`}>
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
          <div className="h-32 bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div
      data-id={dataId}
      className={`max-w-6xl mx-auto p-6 ${theme.background}`}
    >
      {/* Header Section */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className={`text-3xl font-bold ${theme.text}`} id="main-heading">
              Payment Requests
            </h1>
            <p className={`${theme.mutedText} mt-2`}>
              Manage and track payment approval requests
            </p>
          </div>
          <div className="flex items-center gap-4">
            <button
              className={`flex items-center gap-2 px-4 py-2 ${theme.button} rounded-lg transition-colors cursor-pointer`}
              aria-label="Export payment requests data"
            >
              <Download className="w-4 h-4" />
              Export
            </button>
          </div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className={`p-4 ${theme.cardBg} border ${theme.border} rounded-lg`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-blue-600" />
              </div>
              <div>
                <p className={`text-sm ${theme.mutedText}`}>Total Requests</p>
                <p className={`text-2xl font-bold ${theme.text}`}>{paymentRequests.length}</p>
              </div>
            </div>
          </div>

          <div className={`p-4 ${theme.cardBg} border ${theme.border} rounded-lg`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-yellow-100 rounded-lg">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
              <div>
                <p className={`text-sm ${theme.mutedText}`}>Pending</p>
                <p className={`text-2xl font-bold ${theme.text}`}>{pendingCount}</p>
              </div>
            </div>
          </div>

          <div className={`p-4 ${theme.cardBg} border ${theme.border} rounded-lg`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-green-100 rounded-lg">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
              <div>
                <p className={`text-sm ${theme.mutedText}`}>Approved</p>
                <p className={`text-2xl font-bold ${theme.text}`}>
                  {paymentRequests.filter(r => r.status === 'approved').length}
                </p>
              </div>
            </div>
          </div>

          <div className={`p-4 ${theme.cardBg} border ${theme.border} rounded-lg`}>
            <div className="flex items-center gap-3">
              <div className="p-2 bg-gray-100 rounded-lg">
                <DollarSign className="w-6 h-6 text-gray-600" />
              </div>
              <div>
                <p className={`text-sm ${theme.mutedText}`}>Total Amount</p>
                <p className={`text-2xl font-bold ${theme.text}`}>
                  ${totalAmount.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-4 mb-6">
          <div className="flex-1 min-w-64">
            <div className="relative">
              <Search className={`absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 ${theme.mutedText}`} />
              <input
                type="text"
                placeholder="Search requests..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className={`w-full pl-10 pr-4 py-2 border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
                aria-label="Search payment requests"
              />
            </div>
          </div>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as ApprovalStatus | 'all')}
            className={`px-4 py-2 border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label="Filter by status"
          >
            <option value="all">All Status</option>
            <option value="pending">Pending</option>
            <option value="in_review">In Review</option>
            <option value="approved">Approved</option>
            <option value="rejected">Rejected</option>
          </select>

          <select
            value={priorityFilter}
            onChange={(e) => setPriorityFilter(e.target.value as Priority | 'all')}
            className={`px-4 py-2 border ${theme.border} rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500`}
            aria-label="Filter by priority"
          >
            <option value="all">All Priority</option>
            <option value="urgent">Urgent</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>
      </div>

      {/* Payment Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className={`text-center py-12 ${theme.cardBg} border ${theme.border} rounded-lg`}>
            <DollarSign className={`w-12 h-12 ${theme.mutedText} mx-auto mb-4`} />
            <h3 className={`text-lg font-medium ${theme.text} mb-2`}>No payment requests found</h3>
            <p className={theme.mutedText}>Try adjusting your search or filter criteria.</p>
          </div>
        ) : (
          filteredRequests.map((request) => (
            <div
              key={request.id}
              className={`p-6 ${theme.cardBg} border ${theme.border} rounded-lg hover:shadow-md transition-shadow`}
            >
              <div className={cn(
                'flex flex-col gap-4',
                layout === 'double' ? 'lg:flex-row lg:items-center lg:justify-between' : ''
              )}>
                {/* Main Request Info */}
                <div className="flex-1">
                  <div className="flex items-start gap-4">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className={`text-lg font-semibold ${theme.text}`}>
                          {request.title}
                        </h3>
                        {getStatusBadge(request.status)}
                        {getPriorityBadge(request.priority)}
                      </div>

                      <p className={`${theme.mutedText} mb-3`}>
                        {request.description}
                      </p>

                      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
                        <div className="flex items-center gap-2">
                          <DollarSign className={`w-4 h-4 ${theme.mutedText}`} />
                          <span className={`font-medium ${theme.text}`}>
                            {request.currency} {request.amount.toLocaleString()}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <User className={`w-4 h-4 ${theme.mutedText}`} />
                          <span className={theme.mutedText}>
                            {request.requestedBy.name}
                          </span>
                        </div>

                        <div className="flex items-center gap-2">
                          <Calendar className={`w-4 h-4 ${theme.mutedText}`} />
                          <span className={theme.mutedText}>
                            {new Date(request.requestedDate).toLocaleDateString()}
                          </span>
                        </div>
                      </div>

                      {request.vendor && (
                        <div className="flex items-center gap-2 mb-2">
                          <Building className={`w-4 h-4 ${theme.mutedText}`} />
                          <span className={theme.mutedText}>
                            Vendor: {request.vendor}
                          </span>
                        </div>
                      )}

                      {request.approvalWorkflow && (
                        <div className="mb-4">
                          <p className={`text-sm font-medium ${theme.labelText} mb-2`}>
                            Approval Progress ({request.approvalWorkflow.currentStep}/{request.approvalWorkflow.totalSteps})
                          </p>
                          <div className="flex items-center gap-2">
                            {request.approvalWorkflow.steps.map((step, index) => (
                              <div key={index} className="flex items-center">
                                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-medium ${
                                  step.status === 'approved' ? 'bg-green-100 text-green-800' :
                                  step.status === 'rejected' ? 'bg-red-100 text-red-800' :
                                  step.step === request.approvalWorkflow!.currentStep ? 'bg-blue-100 text-blue-800' :
                                  'bg-gray-100 text-gray-600'
                                }`}>
                                  {step.step}
                                </div>
                                {index < request.approvalWorkflow!.steps.length - 1 && (
                                  <div className={`w-8 h-0.5 ${
                                    step.status === 'approved' ? 'bg-green-300' : 'bg-gray-300'
                                  }`} />
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex flex-wrap gap-2">
                  <button
                    onClick={() => onViewDetails?.(request.id)}
                    className={`flex items-center gap-2 px-3 py-2 border ${theme.border} ${theme.secondaryButton} rounded-lg transition-colors text-sm cursor-pointer`}
                    aria-label={`View details for ${request.title}`}
                  >
                    <Eye className="w-4 h-4" />
                    View Details
                  </button>

                  {request.status === 'pending' && currentUser?.permissions.includes('approve_payments') && (
                    <>
                      <button
                        onClick={() => handleApprove(request.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors text-sm cursor-pointer"
                        aria-label={`Approve payment request: ${request.title}`}
                      >
                        <CheckCircle className="w-4 h-4" />
                        Approve
                      </button>

                      <button
                        onClick={() => handleReject(request.id)}
                        className="flex items-center gap-2 px-3 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors text-sm cursor-pointer"
                        aria-label={`Reject payment request: ${request.title}`}
                      >
                        <XCircle className="w-4 h-4" />
                        Reject
                      </button>
                    </>
                  )}

                  {request.attachments && request.attachments.length > 0 && (
                    <button
                      className={`flex items-center gap-2 px-3 py-2 border ${theme.border} ${theme.secondaryButton} rounded-lg transition-colors text-sm cursor-pointer`}
                      aria-label={`Download ${request.attachments.length} attachments for ${request.title}`}
                    >
                      <Download className="w-4 h-4" />
                      Attachments ({request.attachments.length})
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Reject Modal */}
      {rejectModalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50" role="dialog" aria-modal="true" aria-labelledby="reject-modal-title">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4" id="reject-modal-title">
              Reject Payment Request
            </h3>
            <p className="text-gray-600 mb-4">
              Please provide a reason for rejecting this payment request:
            </p>
            <textarea
              value={rejectReason}
              onChange={(e) => setRejectReason(e.target.value)}
              placeholder="Enter rejection reason..."
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 resize-none"
              rows={4}
              aria-label="Reason for rejecting payment request"
              required
            />
            <div className="flex gap-3 mt-6">
              <button
                onClick={() => {
                  setRejectModalOpen(false);
                  setRejectReason('');
                  setSelectedRequest(null);
                }}
                className="flex-1 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors cursor-pointer"
                aria-label="Cancel rejection"
              >
                Cancel
              </button>
              <button
                onClick={confirmReject}
                disabled={!rejectReason.trim()}
                className="flex-1 px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer"
                aria-label="Confirm rejection of payment request"
              >
                Reject Request
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentRequest;