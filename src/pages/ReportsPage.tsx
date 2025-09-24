import React, { useState } from 'react';
import { ReportCard, type ReportData, type ExpenseItem } from '@/components/Reports/ReportCard';
import { ReportActionButtons } from '@/components/Reports/ReportActionButtons';
import { ReportRejectionModal, type RejectFormData } from '@/components/Reports/ReportRejectionModal';
import { cn } from '@/lib/utils';

// Page Components Level: Full page compositions
// Following component hierarchy: Base → Layout → Composite → Feature → Page

interface ReportsPageProps {
  className?: string;
}

// Mock data matching the Figma design
const mockReportData: ReportData = {
  id: 'rpt_001',
  title: 'JDMobbin',
  submittedBy: {
    name: 'Jana Smith',
    email: 'janasmith.mobbin@gmail.com',
    initial: 'J',
  },
  approver: {
    name: 'Manager',
    email: 'janasmith.mobbin@gmail.com',
    initial: 'J',
  },
  submittedDate: 'May 20, 2024',
  totalAmount: 42.08,
  status: 'processing',
  nextStep: 'Waiting for you to review these expenses.',
  stepDescription: 'Waiting for you to review these expenses.',
  categories: [
    {
      id: 'cat_1',
      name: 'Advertising',
      total: 10.00,
      expenses: [
        {
          id: 'exp_1',
          date: 'May 20',
          merchant: 'Walmart',
          tag: 'Meals',
          total: 3.33,
          status: 'rejected',
        },
        {
          id: 'exp_2',
          date: 'May 20',
          merchant: 'Walmart',
          tag: 'Meals',
          total: 3.33,
          status: 'rejected',
        },
        {
          id: 'exp_3',
          date: 'May 20',
          merchant: 'Walmart',
          tag: 'Meals',
          total: 3.34,
          status: 'pending',
        },
      ],
    },
    {
      id: 'cat_2',
      name: 'Coffee',
      total: 32.08,
      expenses: [
        {
          id: 'exp_4',
          date: 'May 20',
          merchant: 'Walmart',
          tag: '(untagged)',
          total: 16.04,
          status: 'rejected',
        },
        {
          id: 'exp_5',
          date: 'May 20',
          merchant: 'Walmart',
          tag: '(untagged)',
          total: 16.04,
          status: 'approved',
        },
      ],
    },
  ],
};

export function ReportsPage({ className }: ReportsPageProps) {
  const [reports, setReports] = useState<ReportData[]>([mockReportData]);
  const [showRejectionModal, setShowRejectionModal] = useState(false);
  const [selectedReport, setSelectedReport] = useState<ReportData | null>(null);

  // Handle report actions
  const handleReview = () => {
    console.log('Reviewing reports...');
    alert('Review functionality would open detailed view');
  };

  const handleApprove = () => {
    console.log('Approving reports...');
    if (selectedReport) {
      setReports(prev =>
        prev.map(report =>
          report.id === selectedReport.id
            ? { ...report, status: 'approved' as const }
            : report
        )
      );
      alert(`Report "${selectedReport.title}" has been approved!`);
    }
  };

  const handleReject = () => {
    setSelectedReport(reports[0]); // For demo, select first report
    setShowRejectionModal(true);
  };

  const handleRejectSubmit = (rejectData: RejectFormData) => {
    console.log('Rejecting report with data:', rejectData);

    if (selectedReport) {
      setReports(prev =>
        prev.map(report =>
          report.id === selectedReport.id
            ? { ...report, status: 'rejected' as const }
            : report
        )
      );

      const memoText = rejectData.memo ? ` with memo: "${rejectData.memo}"` : '';
      alert(`Report "${selectedReport.title}" has been rejected${memoText}`);
    }

    setShowRejectionModal(false);
    setSelectedReport(null);
  };

  const handleAddExpenses = () => {
    console.log('Adding expenses...');
    alert('Add Expenses functionality would open expense creation flow');
  };

  const handleDetails = () => {
    console.log('Viewing details...');
    alert('Details functionality would show detailed report view');
  };

  const handleExpenseStatusChange = (expenseId: string, status: ExpenseItem['status']) => {
    console.log(`Changing expense ${expenseId} to status: ${status}`);

    setReports(prev =>
      prev.map(report => ({
        ...report,
        categories: report.categories.map(category => ({
          ...category,
          expenses: category.expenses.map(expense =>
            expense.id === expenseId
              ? { ...expense, status }
              : expense
          ),
        })),
      }))
    );
  };

  return (
    <div className={cn('flex flex-col h-full', className)}>
      {/* Page Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-gray-900">Reports</h1>
            <p className="text-sm text-gray-600 mt-1">
              Review and manage expense reports
            </p>
          </div>

          {/* Action Buttons */}
          <ReportActionButtons
            onReview={handleReview}
            onApprove={handleApprove}
            onReject={handleReject}
            onAddExpenses={handleAddExpenses}
            onDetails={handleDetails}
            pendingCount={1}
          />
        </div>
      </div>

      {/* Reports List */}
      <div className="flex-1 overflow-auto p-6 bg-gray-50">
        <div className="max-w-6xl mx-auto space-y-6">
          {reports.map((report) => (
            <ReportCard
              key={report.id}
              report={report}
              onExpenseStatusChange={handleExpenseStatusChange}
            />
          ))}

          {reports.length === 0 && (
            <div className="text-center py-12">
              <div className="text-gray-400 text-lg mb-2">No reports found</div>
              <p className="text-gray-500">There are no reports to review at this time.</p>
            </div>
          )}
        </div>
      </div>

      {/* Rejection Modal */}
      <ReportRejectionModal
        isOpen={showRejectionModal}
        onClose={() => {
          setShowRejectionModal(false);
          setSelectedReport(null);
        }}
        onReject={handleRejectSubmit}
        reportTitle={selectedReport?.title}
        submitterEmail={selectedReport?.submittedBy.email}
      />
    </div>
  );
}

export default ReportsPage;