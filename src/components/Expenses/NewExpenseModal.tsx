import React, { useState, useRef, useEffect } from 'react';
import { X, Receipt } from 'lucide-react';
import { Button } from '@/components/common/button';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';
import { cn } from '@/lib/utils';

// Feature Components Level: Business logic components with specific functionality
// Following component hierarchy: Base → Layout → Composite → Feature

interface ExpenseFormData {
  merchant: string;
  date: Date;
  taxType: string;
  taxAmount: number;
  total: number;
  currency: string;
  reimbursable: boolean;
  category: string;
  attendees: string[];
  tag: string;
  description: string;
  report: string;
}

interface NewExpenseModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: ExpenseFormData) => void;
  expenseType?: 'expense' | 'distance' | 'multiple';
  selectedOption?: string; // 'scan-receipt', 'manually-create', etc.
  extractedData?: Record<string, unknown>; // Data from SmartScan flow
  className?: string;
}

// Mock data for dropdowns
const mockMerchants = [
  'Walmart',
  'Walgreens',
  'Wawa',
  'Time Warner Cable',
  'Wal-Mart',
  'American Express',
  'Mb Service Station'
];

const mockCategories = [
  'Advertising',
  'Meals & Entertainment',
  'Transportation',
  'Office Supplies',
  'Software & Services',
  'Technology',
  'Lodging'
];

const mockTags = [
  'ICU',
  'TRAVEL',
  'CLIENT',
  'TOOLS',
  'AWS',
  'SUPPLIES'
];

const mockReports = [
  'May 2024 Expenses',
  'Q2 Business Travel',
  'Marketing Campaign',
  'Office Setup'
];

const currencies = [
  { value: 'USD', label: 'USD $' },
  { value: 'EUR', label: 'EUR €' },
  { value: 'GBP', label: 'GBP £' }
];

const taxTypes = [
  'Tax exempt (0%)',
  'Standard Rate (10%)',
  'Reduced Rate (5%)',
  'Custom Rate'
];

export type { ExpenseFormData };

export function NewExpenseModal({
  isOpen,
  onClose,
  onSave,
  expenseType = 'expense',
  selectedOption = 'manually-create',
  extractedData,
  className
}: NewExpenseModalProps) {
  const [activeTab, setActiveTab] = useState<'expense' | 'distance' | 'multiple'>(expenseType);
  const [formData, setFormData] = useState<ExpenseFormData>({
    merchant: '',
    date: new Date(),
    taxType: 'Tax exempt (0%)',
    taxAmount: 0,
    total: 0,
    currency: 'USD',
    reimbursable: true,
    category: '',
    attendees: ['You'],
    tag: '',
    description: '',
    report: '(automatic)'
  });

  const [merchantSuggestions, setMerchantSuggestions] = useState<string[]>([]);
  const [showMerchantSuggestions, setShowMerchantSuggestions] = useState(false);
  const merchantInputRef = useRef<HTMLInputElement>(null);

  // Pre-populate form with extracted data from SmartScan
  useEffect(() => {
    if (extractedData) {
      setFormData(prev => ({
        ...prev,
        merchant: extractedData.merchant || prev.merchant,
        total: extractedData.amount || prev.total,
        date: extractedData.date ? new Date(extractedData.date) : prev.date,
        category: extractedData.category || prev.category,
        description: extractedData.description || prev.description,
      }));
    }
  }, [extractedData]);

  const handleInputChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleMerchantChange = (value: string) => {
    setFormData(prev => ({ ...prev, merchant: value }));

    if (value.length > 0) {
      const filtered = mockMerchants.filter(merchant =>
        merchant.toLowerCase().includes(value.toLowerCase())
      );
      setMerchantSuggestions(filtered);
      setShowMerchantSuggestions(true);
    } else {
      setShowMerchantSuggestions(false);
    }
  };

  const selectMerchant = (merchant: string) => {
    setFormData(prev => ({ ...prev, merchant }));
    setShowMerchantSuggestions(false);
  };

  const handleSave = () => {
    onSave(formData);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 z-50 flex items-center justify-center p-4">
      <div
        className={cn(
          'bg-white rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-hidden',
          'animate-in fade-in-0 zoom-in-95 duration-200',
          className
        )}
      >
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">New Expense</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors duration-200"
            aria-label="Close modal"
          >
            <X className="w-5 h-5 text-gray-500" />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-gray-200">
          {[
            { id: 'expense', label: 'Expense' },
            { id: 'distance', label: 'Distance' },
            { id: 'multiple', label: 'Multiple' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as typeof activeTab)}
              className={cn(
                'px-6 py-3 text-sm font-medium border-b-2 transition-colors duration-200',
                activeTab === tab.id
                  ? 'border-blue-600 text-blue-600'
                  : 'border-transparent text-gray-500 hover:text-gray-700'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Form Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-200px)]">
          <div className="grid grid-cols-1 gap-6">
            {/* Left Column - Form */}
            <div className="space-y-4">
              {/* Merchant Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Merchant <span className="text-red-500">*</span>
                </label>
                <input
                  ref={merchantInputRef}
                  type="text"
                  value={formData.merchant}
                  onChange={(e) => handleMerchantChange(e.target.value)}
                  placeholder="Merchant Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />

                {/* Merchant Suggestions */}
                {showMerchantSuggestions && merchantSuggestions.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-200 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                    {merchantSuggestions.map((merchant) => (
                      <button
                        key={merchant}
                        onClick={() => selectMerchant(merchant)}
                        className="w-full px-3 py-2 text-left hover:bg-blue-50 focus:bg-blue-50 focus:outline-none"
                      >
                        {merchant}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Date Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date <span className="text-red-500">*</span>
                </label>
                <DatePicker
                  date={formData.date}
                  onDateChange={(date) => handleInputChange('date', date || new Date())}
                  className="w-full"
                />
              </div>

              {/* Tax Section */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax
                  </label>
                  <Select value={formData.taxType} onValueChange={(value) => handleInputChange('taxType', value)}>
                    <SelectContent>
                      {taxTypes.map((type) => (
                        <SelectItem key={type} value={type}>{type}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Tax Amount
                  </label>
                  <input
                    type="number"
                    value={formData.taxAmount}
                    onChange={(e) => handleInputChange('taxAmount', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>
              </div>

              {/* Total and Currency */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Total <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="number"
                    value={formData.total}
                    onChange={(e) => handleInputChange('total', parseFloat(e.target.value) || 0)}
                    step="0.01"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Currency
                  </label>
                  <Select value={formData.currency} onValueChange={(value) => handleInputChange('currency', value)}>
                    <SelectContent>
                      {currencies.map((currency) => (
                        <SelectItem key={currency.value} value={currency.value}>
                          {currency.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Reimbursable Checkbox */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="reimbursable"
                  checked={formData.reimbursable}
                  onChange={(e) => handleInputChange('reimbursable', e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="reimbursable" className="ml-2 text-sm text-gray-700">
                  Reimbursable
                </label>
              </div>

              {/* Category */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Category
                </label>
                <Select value={formData.category} onValueChange={(value) => handleInputChange('category', value)} placeholder="Type to search...">
                  <SelectContent>
                    {mockCategories.map((category) => (
                      <SelectItem key={category} value={category}>{category}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Attendees */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Attendees
                </label>
                <div className="flex items-center gap-2 p-2 border border-gray-300 rounded-lg bg-gray-50">
                  <div className="w-6 h-6 bg-blue-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-xs font-medium">J</span>
                  </div>
                  <span className="text-sm text-gray-700">You</span>
                </div>
              </div>

              {/* Tag */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tag
                </label>
                <Select value={formData.tag} onValueChange={(value) => handleInputChange('tag', value)} placeholder="Type to search...">
                  <SelectContent>
                    {mockTags.map((tag) => (
                      <SelectItem key={tag} value={tag}>{tag}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Description
                </label>
                <textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Add a description..."
                />
              </div>

              {/* Report */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Report
                </label>
                <Select value={formData.report} onValueChange={(value) => handleInputChange('report', value)}>
                  <SelectContent>
                    <SelectItem value="(automatic)">(automatic)</SelectItem>
                    {mockReports.map((report) => (
                      <SelectItem key={report} value={report}>{report}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            {/* Right Column - Receipt Preview */}
            <div className="flex justify-end">
              <div className="w-24 h-32 bg-blue-100 rounded-lg border-2 border-dashed border-blue-300 flex flex-col items-center justify-center">
                <Receipt className="w-8 h-8 text-purple-400 mb-2" />
                <div className="w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center">
                  <span className="text-white text-xs">+</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 p-6 border-t border-gray-200">
          <Button
            variant="outline"
            onClick={onClose}
            className="px-4 py-2"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSave}
            className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white"
          >
            Save
          </Button>
        </div>
      </div>
    </div>
  );
}

export type { ExpenseFormData };
export default NewExpenseModal;