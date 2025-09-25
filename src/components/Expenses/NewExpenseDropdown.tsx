import React, { useRef, useEffect } from 'react';
import {
  FileText,
  ScanLine,
  Copy,
  MapPin,
  Car
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Composite Components Level: Complex components built from base components
// Following component hierarchy: Base → Layout → Composite

interface ExpenseOption {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  description?: string;
  category: 'expense' | 'distance';
}

interface NewExpenseDropdownProps {
  onOptionSelect: (option: ExpenseOption) => void;
  onClose?: () => void;
  isOpen: boolean;
  className?: string;
}

const expenseOptions: ExpenseOption[] = [
  {
    id: 'manually-create',
    label: 'Manually Create',
    icon: FileText,
    description: 'Create an expense manually',
    category: 'expense'
  },
  {
    id: 'scan-receipt',
    label: 'Scan Receipt',
    icon: ScanLine,
    description: 'Upload and scan a receipt',
    category: 'expense'
  },
  {
    id: 'create-multiple',
    label: 'Create Multiple',
    icon: Copy,
    description: 'Create multiple expenses at once',
    category: 'expense'
  },
  {
    id: 'distance-manual',
    label: 'Manually Create',
    icon: Car,
    description: 'Create a distance expense',
    category: 'distance'
  },
  {
    id: 'distance-map',
    label: 'Create from Map',
    icon: MapPin,
    description: 'Use map to calculate distance',
    category: 'distance'
  }
];

export function NewExpenseDropdown({
  onOptionSelect,
  onClose,
  isOpen,
  className
}: NewExpenseDropdownProps) {
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose?.();
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen, onClose]);

  const handleOptionClick = (option: ExpenseOption) => {
    onOptionSelect(option);
    onClose?.();
  };

  if (!isOpen) return null;

  const expenseItems = expenseOptions.filter(option => option.category === 'expense');
  const distanceItems = expenseOptions.filter(option => option.category === 'distance');

  return (
    <div
      ref={dropdownRef}
      className={cn(
        'absolute right-0 top-full mt-2 w-64 bg-white rounded-lg shadow-lg border border-gray-200 z-50',
        'animate-in fade-in-0 zoom-in-95 duration-100',
        className
      )}
    >
      {/* Expense Section */}
      <div className="p-2">
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            EXPENSE
          </h3>
        </div>

        {expenseItems.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                'hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                'text-gray-700 hover:text-blue-700'
              )}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{option.label}</p>
                {option.description && (
                  <p className="text-xs text-gray-500">{option.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>

      {/* Divider */}
      <div className="border-t border-gray-100 mx-2" />

      {/* Distance Section */}
      <div className="p-2">
        <div className="px-3 py-2">
          <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider">
            DISTANCE
          </h3>
        </div>

        {distanceItems.map((option) => {
          const IconComponent = option.icon;
          return (
            <button
              key={option.id}
              onClick={() => handleOptionClick(option)}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-2 rounded-lg text-left transition-colors duration-200',
                'hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1',
                'text-gray-700 hover:text-blue-700'
              )}
            >
              <div className="flex-shrink-0">
                <div className="w-8 h-8 rounded-lg bg-blue-100 flex items-center justify-center">
                  <IconComponent className="w-4 h-4 text-green-600" />
                </div>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium">{option.label}</p>
                {option.description && (
                  <p className="text-xs text-gray-500">{option.description}</p>
                )}
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
}

export type { ExpenseOption };
export default NewExpenseDropdown;