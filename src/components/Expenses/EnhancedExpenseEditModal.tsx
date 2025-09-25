import React, { useState } from 'react';
import { X, Download, Calendar, DollarSign } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Modal } from '@/components/common/modal';
import { Select } from '@/components/ui/select';
import { MultiSelect } from '@/components/ui/multi-select';
import type { ExpenseData } from './ExpenseTableRow';

// Enhanced Expense Edit Modal Component
// Matches Figma design with SmartScan integration and receipt preview

interface EnhancedExpenseEditModalProps {
  expense: ExpenseData | null;
  isOpen: boolean;
  onClose: () => void;
  onSave?: (expense: ExpenseData) => void;
  onAttachExpense?: () => void;
  onSplitExpense?: () => void;
  onDuplicate?: () => void;
  onDelete?: () => void;
}

interface SmartScanData {
  isScanning: boolean;
  confidence: number;
  extractedData: {
    merchant?: string;
    amount?: number;
    date?: string;
    category?: string;
  };
}

const categoryOptions = [
  { value: 'advertising', label: 'Advertising' },
  { value: 'coffee', label: 'Coffee' },
  { value: 'meals', label: 'Meals' },
  { value: 'office-supplies', label: 'Office Supplies' },
  { value: 'travel', label: 'Travel' },
  { value: 'utilities', label: 'Utilities' },
];

const attendeeOptions = [
  { value: 'you', label: 'You', avatar: true },
  { value: 'john-doe', label: 'John Doe' },
  { value: 'jane-smith', label: 'Jane Smith' },
];

const reportOptions = [
  { value: 'expense-report-2024-05-20', label: 'Expense Report 2024-05-20' },
  { value: 'monthly-expenses-may', label: 'Monthly Expenses - May' },
  { value: 'travel-expenses-q2', label: 'Travel Expenses Q2' },
];

export function EnhancedExpenseEditModal({
  expense,
  isOpen,
  onClose,
  onSave,
  onAttachExpense,
  onSplitExpense,
  onDuplicate,
  onDelete,
}: EnhancedExpenseEditModalProps) {
  const [formData, setFormData] = useState(() => ({
    merchant: expense?.merchant || '',
    amount: expense?.amount || 0,
    category: expense?.category || 'coffee',
    attendees: ['you'],
    tag: expense?.tag || '',
    description: expense?.description || '',
    report: 'expense-report-2024-05-20',
  }));

  const [smartScan] = useState<SmartScanData>({
    isScanning: false,
    confidence: 95,
    extractedData: {
      merchant: 'La Ventana Pesque',
      amount: 6.50,
      date: '2024-05-20',
      category: 'meals',
    },
  });

  const [receiptControls, setReceiptControls] = useState({
    rotation: 0,
    zoom: 100,
  });

  if (!expense) return null;

  const handleSave = () => {
    if (onSave) {
      const updatedExpense: ExpenseData = {
        ...expense,
        merchant: formData.merchant,
        amount: formData.amount,
        category: formData.category,
        tag: formData.tag,
        description: formData.description,
      };
      onSave(updatedExpense);
    }
    onClose();
  };

  const handleRotate = () => {
    setReceiptControls(prev => ({
      ...prev,
      rotation: (prev.rotation + 90) % 360,
    }));
  };

  const handleCrop = () => {
    console.log('Crop functionality would be implemented here');
  };

  const handleDownload = () => {
    if (expense.receipt?.url) {
      const link = document.createElement('a');
      link.href = expense.receipt.url;
      link.download = `receipt-${expense.merchant}-${expense.date}.jpg`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const formatCurrency = (amount: number) => `$${amount.toFixed(2)}`;

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={`Edit Expense - ${expense.id.split('_')[1] || '1'} of 5 expenses`}
      size="full"
    >
      <div className="flex h-full">
        {/* Left Panel - Form */}
        <div className="w-96 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-6 border-b border-gray-200">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-gray-900">Edit Expense</h2>
              <Button variant="outline" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>

            {/* Next Step Notice */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
              <div className="flex items-start gap-3">
                <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="text-sm font-medium text-blue-900 mb-1">Next Step:</p>
                  <p className="text-sm text-blue-700">
                    This expense is scheduled to <strong>automatically submit on Sunday!</strong> No further action required!
                  </p>
                </div>
              </div>
            </div>

            {/* User Info */}
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white text-sm font-medium">J</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-900">jonsmith.mobbin@gmail...</p>
                  <p className="text-xs text-gray-500">Cash</p>
                </div>
              </div>
              <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                Open
              </Button>
            </div>

            {/* SmartScanning Section */}
            {smartScan.isScanning && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <div className="flex items-start gap-3">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                    <DollarSign className="w-6 h-6 text-green-600" />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-sm font-semibold text-green-900 mb-1">SmartScanning...</h3>
                    <p className="text-sm text-green-700 mb-3">
                      We're transcribing the details of your receipt. No need to wait around – we'll let you know if something looks off.
                    </p>
                    <Button
                      variant="outline"
                      size="sm"
                      className="border-green-300 text-green-700 hover:bg-green-100"
                    >
                      Fill out the details myself
                    </Button>
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Form Fields */}
          <div className="flex-1 p-6 overflow-y-auto">
            <div className="space-y-6">
              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, category: value }))}
                  options={categoryOptions}
                />
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Attendees
                </label>
                <MultiSelect
                  value={formData.attendees}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, attendees: value }))}
                  options={attendeeOptions}
                  placeholder="Select attendees..."
                />
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tag
                </label>
                <input
                  type="text"
                  value={formData.tag}
                  onChange={(e) => setFormData(prev => ({ ...prev, tag: e.target.value }))}
                  placeholder="Type to search..."
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  rows={3}
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                />
              </div>

              {/* Report */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Report
                </label>
                <Select
                  value={formData.report}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, report: value }))}
                  options={reportOptions}
                />
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="p-6 border-t border-gray-200">
            <div className="flex items-center justify-between gap-3">
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={onAttachExpense}>
                  Attach Expense
                </Button>
                <Button variant="outline" size="sm" onClick={onSplitExpense}>
                  Split Expense
                </Button>
                <Button variant="outline" size="sm" onClick={onDuplicate}>
                  Duplicate
                </Button>
                {onDelete && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={onDelete}
                    className="text-red-600 border-red-300 hover:bg-red-50"
                  >
                    Delete
                  </Button>
                )}
              </div>
              <Button
                onClick={handleSave}
                className="bg-green-500 hover:bg-green-600 text-white"
              >
                Save
              </Button>
            </div>
          </div>
        </div>

        {/* Right Panel - Receipt Preview */}
        <div className="flex-1 flex flex-col bg-gray-50">
          {/* Receipt Controls */}
          <div className="bg-white border-b border-gray-200 p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-sm font-medium text-gray-700">
                  ${smartScan.extractedData.amount?.toFixed(2) || expense.amount.toFixed(2)}
                </span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">
                  {smartScan.extractedData.merchant || expense.merchant}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Button variant="outline" size="sm" onClick={handleRotate}>
                  Rotate
                </Button>
                <Button variant="outline" size="sm" onClick={handleCrop}>
                  Crop
                </Button>
                <Button variant="outline" size="sm" onClick={handleDownload}>
                  <Download className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Receipt Image */}
          <div className="flex-1 flex items-center justify-center p-8">
            {expense.receipt?.url ? (
              <div className="max-w-full max-h-full bg-white rounded-lg shadow-lg overflow-hidden">
                <img
                  src={expense.receipt.url}
                  alt={`Receipt from ${expense.merchant}`}
                  className="max-w-full max-h-full object-contain"
                  style={{
                    transform: `rotate(${receiptControls.rotation}deg) scale(${receiptControls.zoom / 100})`,
                    transformOrigin: 'center',
                    transition: 'transform 0.2s ease',
                  }}
                />
              </div>
            ) : (
              <div className="text-center">
                <div className="w-24 h-24 bg-gray-200 rounded-lg flex items-center justify-center mb-4 mx-auto">
                  <DollarSign className="w-12 h-12 text-gray-400" />
                </div>
                <p className="text-gray-500">No receipt attached</p>
              </div>
            )}
          </div>

          {/* Receipt Details Footer */}
          <div className="bg-white border-t border-gray-200 p-6">
            <div className="grid grid-cols-3 gap-6">
              <div>
                <span className="text-sm text-gray-500 block mb-1">Amount</span>
                <span className="font-semibold text-lg">
                  {formatCurrency(smartScan.extractedData.amount || expense.amount)}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Date</span>
                <span className="font-medium">
                  {new Date(smartScan.extractedData.date || expense.date).toLocaleDateString()}
                </span>
              </div>
              <div>
                <span className="text-sm text-gray-500 block mb-1">Category</span>
                <span className="font-medium capitalize">
                  {smartScan.extractedData.category || expense.category}
                </span>
              </div>
            </div>
            {smartScan.confidence > 0 && (
              <div className="mt-4 pt-4 border-t border-gray-200">
                <div className="flex items-center justify-between">
                  <span className="text-sm text-gray-500">SmartScan Confidence</span>
                  <span className="text-sm font-medium text-green-600">
                    {smartScan.confidence}%
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${smartScan.confidence}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default EnhancedExpenseEditModal;