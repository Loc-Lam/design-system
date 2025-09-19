import { useState } from 'react';
import PaymentRequest from '../components/PaymentRequest';

// Mock payment request data
const mockPaymentRequests = [
  {
    id: 'PR-001',
    title: 'Office Supplies Purchase',
    description: 'Monthly office supplies including paper, pens, and printer cartridges for Q4 operations.',
    amount: 1250.00,
    currency: '$',
    status: 'pending' as const,
    priority: 'medium' as const,
    requestedBy: {
      name: 'Sarah Johnson',
      email: 'sarah.johnson@company.com',
      department: 'Administration',
      avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
    },
    requestedDate: '2024-01-15',
    dueDate: '2024-01-30',
    category: 'Office Expenses',
    vendor: 'Staples Inc.',
    invoiceNumber: 'INV-2024-001',
    attachments: [
      {
        name: 'Invoice_Staples_001.pdf',
        url: '/documents/invoice1.pdf',
        type: 'PDF',
        size: '245 KB',
      },
      {
        name: 'Receipt_Supplies.jpg',
        url: '/documents/receipt1.jpg',
        type: 'JPG',
        size: '180 KB',
      },
    ],
    approvalWorkflow: {
      currentStep: 1,
      totalSteps: 3,
      steps: [
        { step: 1, approver: 'Department Manager', status: 'pending' as const },
        { step: 2, approver: 'Finance Director', status: 'pending' as const },
        { step: 3, approver: 'CFO', status: 'pending' as const },
      ],
    },
  },
  {
    id: 'PR-002',
    title: 'Software License Renewal',
    description: 'Annual renewal for Adobe Creative Suite licenses for the design team (10 users).',
    amount: 5400.00,
    currency: '$',
    status: 'approved' as const,
    priority: 'high' as const,
    requestedBy: {
      name: 'Michael Chen',
      email: 'michael.chen@company.com',
      department: 'Design',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
    },
    requestedDate: '2024-01-10',
    dueDate: '2024-01-20',
    approvedBy: {
      name: 'Jennifer Walsh',
      email: 'jennifer.walsh@company.com',
      approvedDate: '2024-01-12',
    },
    category: 'Software & Technology',
    vendor: 'Adobe Systems Inc.',
    invoiceNumber: 'ADO-2024-789',
    attachments: [
      {
        name: 'Adobe_License_Quote.pdf',
        url: '/documents/adobe_quote.pdf',
        type: 'PDF',
        size: '320 KB',
      },
    ],
    approvalWorkflow: {
      currentStep: 3,
      totalSteps: 3,
      steps: [
        { step: 1, approver: 'Department Manager', status: 'approved' as const, date: '2024-01-11' },
        { step: 2, approver: 'Finance Director', status: 'approved' as const, date: '2024-01-12' },
        { step: 3, approver: 'CFO', status: 'approved' as const, date: '2024-01-12' },
      ],
    },
  },
  {
    id: 'PR-003',
    title: 'Marketing Campaign Budget',
    description: 'Q1 2024 digital marketing campaign for new product launch including social media ads, Google Ads, and influencer partnerships.',
    amount: 15000.00,
    currency: '$',
    status: 'in_review' as const,
    priority: 'urgent' as const,
    requestedBy: {
      name: 'Emily Rodriguez',
      email: 'emily.rodriguez@company.com',
      department: 'Marketing',
      avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
    },
    requestedDate: '2024-01-12',
    dueDate: '2024-01-18',
    category: 'Marketing & Advertising',
    vendor: 'Digital Marketing Agency Pro',
    invoiceNumber: 'DMA-2024-456',
    attachments: [
      {
        name: 'Marketing_Proposal_Q1.pdf',
        url: '/documents/marketing_proposal.pdf',
        type: 'PDF',
        size: '1.2 MB',
      },
      {
        name: 'Budget_Breakdown.xlsx',
        url: '/documents/budget_breakdown.xlsx',
        type: 'XLSX',
        size: '85 KB',
      },
    ],
    approvalWorkflow: {
      currentStep: 2,
      totalSteps: 3,
      steps: [
        { step: 1, approver: 'Department Manager', status: 'approved' as const, date: '2024-01-13' },
        { step: 2, approver: 'Finance Director', status: 'pending' as const },
        { step: 3, approver: 'CFO', status: 'pending' as const },
      ],
    },
  },
  {
    id: 'PR-004',
    title: 'Equipment Maintenance',
    description: 'Quarterly maintenance for production equipment including cleaning, calibration, and parts replacement.',
    amount: 3200.00,
    currency: '$',
    status: 'rejected' as const,
    priority: 'medium' as const,
    requestedBy: {
      name: 'David Thompson',
      email: 'david.thompson@company.com',
      department: 'Operations',
      avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
    },
    requestedDate: '2024-01-08',
    dueDate: '2024-01-25',
    rejectedBy: {
      name: 'Jennifer Walsh',
      email: 'jennifer.walsh@company.com',
      rejectedDate: '2024-01-14',
      reason: 'Budget allocated for this quarter has been exceeded. Please resubmit in Q2 or provide additional cost justification.',
    },
    category: 'Maintenance & Repairs',
    vendor: 'Industrial Maintenance Corp',
    invoiceNumber: 'IMC-2024-123',
    attachments: [
      {
        name: 'Maintenance_Quote.pdf',
        url: '/documents/maintenance_quote.pdf',
        type: 'PDF',
        size: '410 KB',
      },
    ],
    approvalWorkflow: {
      currentStep: 2,
      totalSteps: 3,
      steps: [
        { step: 1, approver: 'Department Manager', status: 'approved' as const, date: '2024-01-09' },
        { step: 2, approver: 'Finance Director', status: 'rejected' as const, date: '2024-01-14' },
        { step: 3, approver: 'CFO', status: 'pending' as const },
      ],
    },
  },
  {
    id: 'PR-005',
    title: 'Travel & Accommodation',
    description: 'Business travel expenses for client meeting in Chicago including flights, hotel, and meals for 3 team members.',
    amount: 2800.00,
    currency: '$',
    status: 'pending' as const,
    priority: 'high' as const,
    requestedBy: {
      name: 'Alex Morgan',
      email: 'alex.morgan@company.com',
      department: 'Sales',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
    },
    requestedDate: '2024-01-16',
    dueDate: '2024-01-22',
    category: 'Travel & Entertainment',
    vendor: 'Corporate Travel Solutions',
    invoiceNumber: 'CTS-2024-567',
    attachments: [
      {
        name: 'Travel_Itinerary.pdf',
        url: '/documents/travel_itinerary.pdf',
        type: 'PDF',
        size: '290 KB',
      },
    ],
    approvalWorkflow: {
      currentStep: 1,
      totalSteps: 2,
      steps: [
        { step: 1, approver: 'Department Manager', status: 'pending' as const },
        { step: 2, approver: 'Finance Director', status: 'pending' as const },
      ],
    },
  },
  {
    id: 'PR-006',
    title: 'Cloud Infrastructure Upgrade',
    description: 'Upgrade to premium AWS plan to support increased user load and storage requirements for Q2.',
    amount: 8500.00,
    currency: '$',
    status: 'pending' as const,
    priority: 'low' as const,
    requestedBy: {
      name: 'Lisa Park',
      email: 'lisa.park@company.com',
      department: 'IT',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&h=150&fit=crop&crop=face',
    },
    requestedDate: '2024-01-14',
    dueDate: '2024-02-01',
    category: 'Infrastructure & Technology',
    vendor: 'Amazon Web Services',
    invoiceNumber: 'AWS-2024-890',
    attachments: [
      {
        name: 'AWS_Upgrade_Proposal.pdf',
        url: '/documents/aws_proposal.pdf',
        type: 'PDF',
        size: '565 KB',
      },
      {
        name: 'Cost_Analysis.xlsx',
        url: '/documents/cost_analysis.xlsx',
        type: 'XLSX',
        size: '124 KB',
      },
    ],
    approvalWorkflow: {
      currentStep: 1,
      totalSteps: 3,
      steps: [
        { step: 1, approver: 'Department Manager', status: 'pending' as const },
        { step: 2, approver: 'Finance Director', status: 'pending' as const },
        { step: 3, approver: 'CFO', status: 'pending' as const },
      ],
    },
  },
];

// Mock current user with approval permissions
const mockCurrentUser = {
  name: 'Jennifer Walsh',
  role: 'Finance Director',
  permissions: ['approve_payments', 'view_all_requests', 'export_data'],
};

const PaymentRequestDashboard = () => {
  const [paymentRequests, setPaymentRequests] = useState(mockPaymentRequests);
  const [successMessage, setSuccessMessage] = useState('');

  const handleApprove = (id: string) => {
    setPaymentRequests(prev =>
      prev.map(request =>
        request.id === id
          ? {
              ...request,
              status: 'approved' as const,
              approvedBy: {
                name: mockCurrentUser.name,
                email: 'jennifer.walsh@company.com',
                approvedDate: new Date().toISOString().split('T')[0],
              }
            } as any
          : request
      )
    );
    setSuccessMessage(`Payment request ${id} has been approved successfully.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleReject = (id: string, reason?: string) => {
    setPaymentRequests(prev =>
      prev.map(request =>
        request.id === id
          ? {
              ...request,
              status: 'rejected' as const,
              rejectedBy: {
                name: mockCurrentUser.name,
                email: 'jennifer.walsh@company.com',
                rejectedDate: new Date().toISOString().split('T')[0],
                reason: reason || 'No reason provided',
              }
            } as any
          : request
      )
    );
    setSuccessMessage(`Payment request ${id} has been rejected.`);
    setTimeout(() => setSuccessMessage(''), 3000);
  };

  const handleViewDetails = (id: string) => {
    alert(`Viewing details for payment request: ${id}\n\nIn a real application, this would navigate to a detailed view page.`);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {successMessage && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-lg">
            <p className="text-sm text-green-700">{successMessage}</p>
          </div>
        )}

        <PaymentRequest
          data-id="payment-request-dashboard"
          paymentRequests={paymentRequests}
          onApprove={handleApprove}
          onReject={handleReject}
          onViewDetails={handleViewDetails}
          currentUser={mockCurrentUser}
          colorTheme="default"
          layout="single"
        />
      </div>
    </div>
  );
};

export default PaymentRequestDashboard;