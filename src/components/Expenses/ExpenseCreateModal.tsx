import { useState } from 'react';
import { X } from 'lucide-react';
import { cn } from '@/lib/utils';
import ExpenseForm from './ExpenseForm';
import DistanceForm from './DistanceForm';
import MultipleExpenseForm from './MultipleExpenseForm';

interface ExpenseCreateModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (data: any) => void;
}

type TabType = 'expense' | 'distance' | 'multiple';

// Trigger cache refresh
export function ExpenseCreateModal({ isOpen, onClose, onSave }: ExpenseCreateModalProps) {
  const [activeTab, setActiveTab] = useState<TabType>('expense');

  if (!isOpen) return null;

  const tabs = [
    { id: 'expense' as const, label: 'Expense' },
    { id: 'distance' as const, label: 'Distance' },
    { id: 'multiple' as const, label: 'Multiple' },
  ];

  const handleSave = (data: any) => {
    onSave(data);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-lg font-semibold text-gray-900">New Expense</h2>
          <button
            onClick={onClose}
            className="p-1 text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="border-b border-gray-200">
          <div className="flex">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-6 py-3 text-sm font-medium border-b-2 transition-colors',
                  activeTab === tab.id
                    ? 'border-blue-500 text-blue-600 bg-blue-50'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-6 overflow-y-auto max-h-[calc(90vh-140px)]">
          {activeTab === 'expense' && (
            <ExpenseForm onSave={handleSave} onCancel={onClose} />
          )}
          {activeTab === 'distance' && (
            <DistanceForm onSave={handleSave} onCancel={onClose} />
          )}
          {activeTab === 'multiple' && (
            <MultipleExpenseForm onSave={handleSave} onCancel={onClose} />
          )}
        </div>
      </div>
    </div>
  );
}

export default ExpenseCreateModal;