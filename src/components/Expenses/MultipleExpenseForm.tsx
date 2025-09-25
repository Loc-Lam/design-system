import { useState } from 'react';
import { Trash2, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { TextInput } from '@/components/common/form-field';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';

interface ExpenseRow {
  id: string;
  date: string;
  merchant: string;
  total: string;
  category: string;
  description: string;
}

interface MultipleExpenseFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

const initialExpenseRow = (): ExpenseRow => ({
  id: Date.now().toString(),
  date: 'Sep 25',
  merchant: '',
  total: '',
  category: '',
  description: '',
});

export default function MultipleExpenseForm({ onSave, onCancel }: MultipleExpenseFormProps) {
  const [expenses, setExpenses] = useState<ExpenseRow[]>([
    ...Array(10).fill(null).map(() => initialExpenseRow())
  ]);

  const [errors, setErrors] = useState<Record<string, Record<string, string>>>({});

  const handleInputChange = (rowId: string, field: keyof ExpenseRow, value: string) => {
    setExpenses(prev =>
      prev.map(expense =>
        expense.id === rowId ? { ...expense, [field]: value } : expense
      )
    );

    // Clear specific field error
    if (errors[rowId]?.[field]) {
      setErrors(prev => ({
        ...prev,
        [rowId]: {
          ...prev[rowId],
          [field]: ''
        }
      }));
    }
  };

  const addExpenseRow = () => {
    setExpenses(prev => [...prev, initialExpenseRow()]);
  };

  const removeExpenseRow = (rowId: string) => {
    if (expenses.length > 1) {
      setExpenses(prev => prev.filter(expense => expense.id !== rowId));
      setErrors(prev => {
        const { [rowId]: removed, ...rest } = prev;
        return rest;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, Record<string, string>> = {};
    let hasErrors = false;

    expenses.forEach(expense => {
      const rowErrors: Record<string, string> = {};

      if (!expense.merchant.trim()) {
        rowErrors.merchant = 'Required';
        hasErrors = true;
      }
      if (!expense.total.trim()) {
        rowErrors.total = 'Required';
        hasErrors = true;
      }

      if (Object.keys(rowErrors).length > 0) {
        newErrors[expense.id] = rowErrors;
      }
    });

    setErrors(newErrors);
    return !hasErrors;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      const validExpenses = expenses.filter(expense =>
        expense.merchant.trim() || expense.total.trim()
      );
      onSave({ expenses: validExpenses });
    }
  };

  const handleReset = () => {
    setExpenses([initialExpenseRow()]);
    setErrors({});
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Table Header */}
      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="border-b border-gray-200">
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 w-20">
                DATE
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                MERCHANT
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700 w-24">
                TOTAL
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                CATEGORY
              </th>
              <th className="text-left py-3 px-2 text-sm font-medium text-gray-700">
                DESCRIPTION
              </th>
              <th className="w-10"></th>
            </tr>
          </thead>
          <tbody>
            {expenses.map((expense, index) => (
              <tr key={expense.id} className="border-b border-gray-100 hover:bg-blue-50">
                {/* Date */}
                <td className="py-2 px-2">
                  <TextInput
                    type="text"
                    value={expense.date}
                    onChange={(e) => handleInputChange(expense.id, 'date', e.target.value)}
                    className="text-sm px-2 py-1 h-8"
                    placeholder="Sep 25"
                  />
                </td>

                {/* Merchant */}
                <td className="py-2 px-2">
                  <TextInput
                    type="text"
                    value={expense.merchant}
                    onChange={(e) => handleInputChange(expense.id, 'merchant', e.target.value)}
                    error={!!errors[expense.id]?.merchant}
                    className="text-sm px-2 py-1 h-8"
                    placeholder="Merchant name"
                  />
                  {errors[expense.id]?.merchant && (
                    <div className="text-red-500 text-xs mt-1">{errors[expense.id].merchant}</div>
                  )}
                </td>

                {/* Total */}
                <td className="py-2 px-2">
                  <div className="flex items-center">
                    <TextInput
                      type="text"
                      value={expense.total}
                      onChange={(e) => handleInputChange(expense.id, 'total', e.target.value)}
                      error={!!errors[expense.id]?.total}
                      className="text-sm px-2 py-1 h-8 flex-1"
                      placeholder="40"
                    />
                    <span className="ml-2 text-sm text-gray-500">VND</span>
                  </div>
                  {errors[expense.id]?.total && (
                    <div className="text-red-500 text-xs mt-1">{errors[expense.id].total}</div>
                  )}
                </td>

                {/* Category */}
                <td className="py-2 px-2">
                  <Select
                    value={expense.category}
                    onValueChange={(value) => handleInputChange(expense.id, 'category', value)}
                  >
                    <SelectContent>
                      <SelectItem value="meals">Meals</SelectItem>
                      <SelectItem value="travel">Travel</SelectItem>
                      <SelectItem value="office">Office</SelectItem>
                      <SelectItem value="fuel">Fuel</SelectItem>
                    </SelectContent>
                  </Select>
                </td>

                {/* Description */}
                <td className="py-2 px-2">
                  <TextInput
                    type="text"
                    value={expense.description}
                    onChange={(e) => handleInputChange(expense.id, 'description', e.target.value)}
                    className="text-sm px-2 py-1 h-8"
                    placeholder="Description"
                  />
                </td>

                {/* Delete Button */}
                <td className="py-2 px-2">
                  {expenses.length > 1 && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeExpenseRow(expense.id)}
                      className="p-1 h-8 w-8 text-gray-400 hover:text-red-500 hover:bg-red-50"
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Add Row Button */}
      <div className="flex justify-start">
        <Button
          type="button"
          variant="ghost"
          onClick={addExpenseRow}
          className="text-blue-600 hover:text-blue-700 hover:bg-blue-50 p-0 h-auto"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add another expense
        </Button>
      </div>

      {/* Summary */}
      <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
        <div className="flex justify-between items-center">
          <span className="text-sm font-medium text-blue-700">
            Total Expenses: {expenses.filter(e => e.merchant.trim() || e.total.trim()).length}
          </span>
          <span className="text-sm font-medium text-blue-700">
            Total Amount: {expenses.reduce((sum, expense) => {
              const amount = parseFloat(expense.total) || 0;
              return sum + amount;
            }, 0)} VND
          </span>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={handleReset}
        >
          Reset
        </Button>
        <Button
          type="submit"
        >
          Save
        </Button>
      </div>
    </form>
  );
}