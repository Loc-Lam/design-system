import { useState } from 'react';
import { MapPin, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/common/button';
import { FormField, TextInput, Checkbox } from '@/components/common/form-field';
import { Select, SelectContent, SelectItem } from '@/components/ui/select';
import { DatePicker } from '@/components/ui/date-picker';

interface DistanceFormProps {
  onSave: (data: any) => void;
  onCancel: () => void;
}

interface DistanceFormData {
  distance: string;
  unit: string;
  rate: string;
  date: Date;
  amount: number;
  reimbursable: boolean;
  category: string;
  description: string;
  report: string;
}

export default function DistanceForm({ onSave, onCancel }: DistanceFormProps) {
  const [formData, setFormData] = useState<DistanceFormData>({
    distance: '',
    unit: 'mi',
    rate: '',
    date: new Date(),
    amount: 0,
    reimbursable: true,
    category: 'Car',
    description: '(automatic)',
    report: '(automatic)',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof DistanceFormData, value: any) => {
    setFormData(prev => {
      const updated = { ...prev, [field]: value };

      // Auto-calculate amount when distance or rate changes
      if (field === 'distance' || field === 'rate') {
        const distance = parseFloat(field === 'distance' ? value : updated.distance) || 0;
        const rate = parseFloat(field === 'rate' ? value : updated.rate) || 0;
        updated.amount = distance * rate;
      }

      return updated;
    });

    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.distance.trim()) {
      newErrors.distance = 'Distance is required';
    }
    if (!formData.rate.trim()) {
      newErrors.rate = 'Rate is required';
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
          {/* Distance */}
          <FormField
            label="Distance"
            error={errors.distance}
          >
            <div className="flex">
              <TextInput
                type="number"
                placeholder="0"
                value={formData.distance}
                onChange={(e) => handleInputChange('distance', e.target.value)}
                error={!!errors.distance}
                className="flex-1 rounded-r-none border-r-0"
              />
              <Select
                value={formData.unit}
                onValueChange={(value) => handleInputChange('unit', value)}
              >
                <SelectContent>
                  <SelectItem value="mi">mi</SelectItem>
                  <SelectItem value="km">km</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </FormField>

          {/* Rate */}
          <FormField
            label="Rate"
            error={errors.rate}
          >
            <Select
              value={formData.rate}
              onValueChange={(value) => handleInputChange('rate', value)}
              placeholder="Select rate"
            >
              <SelectContent>
                <SelectItem value="0.65">$0.65 per mile (Standard)</SelectItem>
                <SelectItem value="0.50">$0.50 per mile (Custom)</SelectItem>
                <SelectItem value="0.75">$0.75 per mile (Premium)</SelectItem>
              </SelectContent>
            </Select>
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

          {/* Amount (Auto-calculated) */}
          <FormField label="Amount">
            <div className="px-3 py-2 bg-blue-50 border border-blue-200 rounded-md text-blue-700 font-medium">
              ${formData.amount.toFixed(2)}
            </div>
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
          >
            <Select
              value={formData.category}
              onValueChange={(value) => handleInputChange('category', value)}
            >
              <SelectContent>
                <SelectItem value="Car">Car</SelectItem>
                <SelectItem value="Motorcycle">Motorcycle</SelectItem>
                <SelectItem value="Bicycle">Bicycle</SelectItem>
              </SelectContent>
            </Select>
          </FormField>

          {/* Description */}
          <FormField label="Description">
            <Select
              value={formData.description}
              onValueChange={(value) => handleInputChange('description', value)}
              placeholder="(automatic)"
            >
              <SelectContent>
                <SelectItem value="business_travel">Business Travel</SelectItem>
                <SelectItem value="client_visit">Client Visit</SelectItem>
                <SelectItem value="site_visit">Site Visit</SelectItem>
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

        {/* Right Column - Map/Location */}
        <div className="flex flex-col items-center justify-center bg-blue-50 border-2 border-dashed border-blue-300 rounded-lg p-8 min-h-[300px]">
          <div className="bg-blue-100 rounded-full p-4 mb-4">
            <MapPin className="h-12 w-12 text-blue-500" />
          </div>
          <div className="text-center">
            <Button
              type="button"
              className="inline-flex items-center"
            >
              <Plus className="h-4 w-4 mr-2" />
              Create receipt from map
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