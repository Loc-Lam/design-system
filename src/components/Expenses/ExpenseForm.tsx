import { useState } from 'react';
import { Receipt, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { FormField, TextInput, Checkbox } from '@/components/common/form-field';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

interface ExpenseFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

interface ExpenseFormData {
  merchant: string;
  date: Date;
  total: string;
  category: string;
  description: string;
  reimbursable: boolean;
  attendees: string[];
  report: string;
}

export default function ExpenseForm({ onSave, onCancel }: ExpenseFormProps) {
  const [formData, setFormData] = useState<ExpenseFormData>({
    merchant: '',
    date: new Date(),
    total: '',
    category: '',
    description: '',
    reimbursable: true,
    attendees: [],
    report: '(automatic)',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof ExpenseFormData, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.merchant.trim()) {
      newErrors.merchant = 'Merchant name is required';
    }
    if (!formData.total.trim()) {
      newErrors.total = 'Total amount is required';
    }
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateForm()) {
      onSave(formData);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Left Column - Form Fields */}
        <div className="space-y-4">
          {/* Merchant */}
          <FormField
            label="Merchant"
            required
            error={errors.merchant}
          >
            <TextInput
              type="text"
              placeholder="Merchant name"
              value={formData.merchant}
              onChange={(e) => handleInputChange('merchant', e.target.value)}
              error={!!errors.merchant}
            />
          </FormField>

          {/* Date */}
          <FormField
            label="Date"
            required
          >
            <DatePicker
              date={formData.date}
              onDateChange={(date) => handleInputChange('date', date || new Date())}
              placeholder="Select date"
            />
          </FormField>

          {/* Total */}
          <FormField
            label="Total"
            required
            error={errors.total}
          >
            <TextInput
              type="text"
              placeholder="VND ₫"
              value={formData.total}
              onChange={(e) => handleInputChange('total', e.target.value)}
              error={!!errors.total}
            />
          </FormField>

          {/* Reimbursable */}
          <Checkbox
            label="Reimbursable"
            checked={formData.reimbursable}
            onChange={(e) => handleInputChange('reimbursable', e.target.checked)}
          />

          {/* Category */}
          <FormField
            label="Category"
            required
            error={errors.category}
          >
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
              placeholder="Type to search..."
            >
              <SelectContent>
                <SelectItem value="meals">Meals</SelectItem>
                <SelectItem value="travel">Travel</SelectItem>
                <SelectItem value="office">Office Supplies</SelectItem>
                <SelectItem value="fuel">Fuel</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {/* Attendees */}
          <FormField label="Attendees">
            <Button
              type="button"
              variant="ghost"
              className="w-fit p-0 h-auto text-blue-600 hover:text-blue-700 hover:bg-transparent"
            >
              <Plus className="h-4 w-4 mr-1" />
              Add attendees
            </Button>
          </FormField>

          {/* Description */}
          <FormField label="Description">
            <Select
              value={formData.description}
              onValueChange={(value) => handleInputChange('description', value)}
              placeholder="(automatic)"
            >
              <SelectContent>
                <SelectItem value="business_meal">Business Meal</SelectItem>
                <SelectItem value="client_meeting">Client Meeting</SelectItem>
                <SelectItem value="office_supplies">Office Supplies</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {/* Report */}
          <FormField label="Report">
            <Select
              value={formData.report}
              onValueChange={(value) => handleInputChange('report', value)}
              placeholder="(automatic)"
            >
              <SelectContent>
                <SelectItem value="monthly_report">Monthly Report</SelectItem>
                <SelectItem value="quarterly_report">Quarterly Report</SelectItem>
              </SelectContent>
            </Select>
          </FormField>
        </div>

        {/* Right Column - Receipt Upload */}
        <div className="flex flex-col items-center justify-center bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8 min-h-[300px]">
          <Receipt className="h-16 w-16 text-blue-500 mb-4" />
          <div className="text-center">
            <Button
              type="button"
              className="inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create receipt from snap
            </Button>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
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