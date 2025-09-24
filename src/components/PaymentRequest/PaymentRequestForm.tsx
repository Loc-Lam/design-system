import { useState } from 'react';
import { DollarSign, FileText, Calendar, User, Building2 } from 'lucide-react';
import { Button } from '@/components/common/button';
import {
  FormField,
  FormSection,
  TextInput,
  TextArea,
  RadioGroup,
} from '@/components/common/form-field';
import { Select } from '@/components/common/select';
import type {
  PaymentRequestFormData,
  PaymentRequestValidationErrors,
  PaymentCategory,
  PaymentMethod,
  PaymentPriority,
} from '@/types/payment-request';

// Feature Components Level: Business logic components with specific functionality
// Following component hierarchy: Base → Layout → Composite → Feature

interface PaymentRequestFormProps {
  initialData?: Partial<PaymentRequestFormData>;
  onSubmit: (data: PaymentRequestFormData) => Promise<void>;
  onSaveDraft?: (data: PaymentRequestFormData) => Promise<void>;
  isLoading?: boolean;
  isDraftSaving?: boolean;
  errors?: PaymentRequestValidationErrors;
  className?: string;
}

const PAYMENT_CATEGORIES: Array<{ value: PaymentCategory; label: string }> = [
  { value: 'expense_reimbursement', label: 'Expense Reimbursement' },
  { value: 'vendor_payment', label: 'Vendor Payment' },
  { value: 'salary', label: 'Salary' },
  { value: 'contractor_payment', label: 'Contractor Payment' },
  { value: 'utility', label: 'Utility' },
  { value: 'office_supplies', label: 'Office Supplies' },
  { value: 'travel', label: 'Travel' },
  { value: 'other', label: 'Other' },
];

const PAYMENT_METHODS: Array<{ value: PaymentMethod; label: string; description?: string }> = [
  { value: 'bank_transfer', label: 'Bank Transfer', description: 'Direct deposit to bank account' },
  { value: 'check', label: 'Check', description: 'Physical or digital check' },
  { value: 'credit_card', label: 'Credit Card', description: 'Corporate credit card payment' },
  { value: 'paypal', label: 'PayPal', description: 'PayPal transfer' },
  { value: 'wire_transfer', label: 'Wire Transfer', description: 'International wire transfer' },
];

const PRIORITY_OPTIONS: Array<{ value: PaymentPriority; label: string; description?: string }> = [
  { value: 'low', label: 'Low', description: 'Standard processing time' },
  { value: 'normal', label: 'Normal', description: 'Default priority' },
  { value: 'high', label: 'High', description: 'Expedited processing' },
  { value: 'urgent', label: 'Urgent', description: 'Same-day processing required' },
];

const CURRENCIES = [
  { value: 'USD', label: 'USD - US Dollar' },
  { value: 'EUR', label: 'EUR - Euro' },
  { value: 'GBP', label: 'GBP - British Pound' },
  { value: 'CAD', label: 'CAD - Canadian Dollar' },
];

const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'CA', label: 'California' },
  { value: 'FL', label: 'Florida' },
  { value: 'NY', label: 'New York' },
  { value: 'TX', label: 'Texas' },
  { value: 'WA', label: 'Washington' },
  // Add more states as needed
];

export default function PaymentRequestForm({
  initialData,
  onSubmit,
  onSaveDraft,
  isLoading = false,
  isDraftSaving = false,
  errors,
  className,
}: PaymentRequestFormProps) {
  const [formData, setFormData] = useState<PaymentRequestFormData>({
    title: '',
    description: '',
    amount: '',
    currency: 'USD',
    category: 'expense_reimbursement',
    paymentMethod: 'bank_transfer',
    priority: 'normal',
    payeeDetails: {
      name: '',
      email: '',
      phone: '',
      address: {
        street1: '',
        street2: '',
        city: '',
        state: '',
        zipCode: '',
        country: 'United States',
      },
      bankInfo: {
        accountNumber: '',
        routingNumber: '',
        bankName: '',
        accountType: 'checking',
      },
    },
    dueDate: '',
    ...initialData,
  });

  const updateFormData = <K extends keyof PaymentRequestFormData>(
    key: K,
    value: PaymentRequestFormData[K]
  ) => {
    setFormData(prev => ({ ...prev, [key]: value }));
  };

  const updatePayeeDetails = <K extends keyof PaymentRequestFormData['payeeDetails']>(
    key: K,
    value: PaymentRequestFormData['payeeDetails'][K]
  ) => {
    setFormData(prev => ({
      ...prev,
      payeeDetails: { ...prev.payeeDetails, [key]: value }
    }));
  };

  const updateAddress = <K extends keyof NonNullable<PaymentRequestFormData['payeeDetails']['address']>>(
    key: K,
    value: NonNullable<PaymentRequestFormData['payeeDetails']['address']>[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      payeeDetails: {
        ...prev.payeeDetails,
        address: { ...prev.payeeDetails.address, [key]: value }
      }
    }));
  };

  const updateBankInfo = <K extends keyof NonNullable<PaymentRequestFormData['payeeDetails']['bankInfo']>>(
    key: K,
    value: NonNullable<PaymentRequestFormData['payeeDetails']['bankInfo']>[K]
  ) => {
    setFormData(prev => ({
      ...prev,
      payeeDetails: {
        ...prev.payeeDetails,
        bankInfo: { ...prev.payeeDetails.bankInfo, [key]: value }
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isLoading) {
      await onSubmit(formData);
    }
  };

  const handleSaveDraft = async () => {
    if (onSaveDraft && !isDraftSaving) {
      await onSaveDraft(formData);
    }
  };

  const getError = (path: string): string | undefined => {
    if (!errors) return undefined;

    const keys = path.split('.');
    let current: any = errors;

    for (const key of keys) {
      if (current && typeof current === 'object') {
        current = current[key];
      } else {
        return undefined;
      }
    }

    return typeof current === 'string' ? current : undefined;
  };

  const needsBankInfo = formData.paymentMethod === 'bank_transfer' || formData.paymentMethod === 'wire_transfer';

  return (
    <div className={`max-w-4xl mx-auto p-6 ${className}`}>
      <form onSubmit={handleSubmit} className="space-y-8">
        {/* General Error */}
        {errors?.general && (
          <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-red-600">{errors.general}</p>
          </div>
        )}

        {/* Payment Request Details */}
        <FormSection
          title="Payment Request Details"
          description="Basic information about the payment request"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Request Title"
              required
              error={getError('title')}
              className="md:col-span-2"
            >
              <TextInput
                value={formData.title}
                onChange={(e) => updateFormData('title', e.target.value)}
                placeholder="Brief description of payment request"
                error={!!getError('title')}
                disabled={isLoading}
              />
            </FormField>

            <FormField
              label="Amount"
              required
              error={getError('amount')}
            >
              <div className="relative">
                <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <TextInput
                  type="number"
                  step="0.01"
                  min="0"
                  value={formData.amount}
                  onChange={(e) => updateFormData('amount', e.target.value)}
                  placeholder="0.00"
                  className="pl-10"
                  error={!!getError('amount')}
                  disabled={isLoading}
                />
              </div>
            </FormField>

            <FormField
              label="Currency"
              required
              error={getError('currency')}
            >
              <Select
                value={formData.currency}
                onChange={(e) => updateFormData('currency', e.target.value)}
                error={!!getError('currency')}
                disabled={isLoading}
              >
                {CURRENCIES.map((currency) => (
                  <option key={currency.value} value={currency.value}>
                    {currency.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Category"
              required
              error={getError('category')}
            >
              <Select
                value={formData.category}
                onChange={(e) => updateFormData('category', e.target.value as PaymentCategory)}
                error={!!getError('category')}
                disabled={isLoading}
              >
                {PAYMENT_CATEGORIES.map((category) => (
                  <option key={category.value} value={category.value}>
                    {category.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="Due Date"
              error={getError('dueDate')}
            >
              <div className="relative">
                <Calendar className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <TextInput
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => updateFormData('dueDate', e.target.value)}
                  className="pl-10"
                  error={!!getError('dueDate')}
                  disabled={isLoading}
                />
              </div>
            </FormField>

            <FormField
              label="Description"
              required
              error={getError('description')}
              className="md:col-span-2"
            >
              <TextArea
                value={formData.description}
                onChange={(e) => updateFormData('description', e.target.value)}
                placeholder="Detailed description of the payment request..."
                rows={4}
                error={!!getError('description')}
                disabled={isLoading}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Payment Method and Priority */}
        <FormSection
          title="Payment Information"
          description="How and when should this payment be processed"
        >
          <div className="space-y-6">
            <FormField
              label="Payment Method"
              required
              error={getError('paymentMethod')}
            >
              <RadioGroup
                name="paymentMethod"
                value={formData.paymentMethod}
                onChange={(value) => updateFormData('paymentMethod', value as PaymentMethod)}
                options={PAYMENT_METHODS}
              />
            </FormField>

            <FormField
              label="Priority"
              required
              error={getError('priority')}
            >
              <RadioGroup
                name="priority"
                value={formData.priority}
                onChange={(value) => updateFormData('priority', value as PaymentPriority)}
                options={PRIORITY_OPTIONS}
                direction="horizontal"
              />
            </FormField>
          </div>
        </FormSection>

        {/* Payee Information */}
        <FormSection
          title="Payee Information"
          description="Details about who will receive the payment"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Payee Name"
              required
              error={getError('payeeDetails.name')}
              className="md:col-span-2"
            >
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <TextInput
                  value={formData.payeeDetails.name}
                  onChange={(e) => updatePayeeDetails('name', e.target.value)}
                  placeholder="Full name or company name"
                  className="pl-10"
                  error={!!getError('payeeDetails.name')}
                  disabled={isLoading}
                />
              </div>
            </FormField>

            <FormField
              label="Email"
              error={getError('payeeDetails.email')}
            >
              <TextInput
                type="email"
                value={formData.payeeDetails.email}
                onChange={(e) => updatePayeeDetails('email', e.target.value)}
                placeholder="email@example.com"
                error={!!getError('payeeDetails.email')}
                disabled={isLoading}
              />
            </FormField>

            <FormField
              label="Phone"
              error={getError('payeeDetails.phone')}
            >
              <TextInput
                type="tel"
                value={formData.payeeDetails.phone}
                onChange={(e) => updatePayeeDetails('phone', e.target.value)}
                placeholder="(555) 123-4567"
                error={!!getError('payeeDetails.phone')}
                disabled={isLoading}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Address Information */}
        <FormSection
          title="Address Information"
          description="Payee's mailing address"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              label="Street Address"
              error={getError('payeeDetails.address.street1')}
              className="md:col-span-2"
            >
              <div className="relative">
                <Building2 className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <TextInput
                  value={formData.payeeDetails.address?.street1}
                  onChange={(e) => updateAddress('street1', e.target.value)}
                  placeholder="123 Main Street"
                  className="pl-10"
                  error={!!getError('payeeDetails.address.street1')}
                  disabled={isLoading}
                />
              </div>
            </FormField>

            <FormField
              label="Street Address 2"
              error={getError('payeeDetails.address.street2')}
              className="md:col-span-2"
            >
              <TextInput
                value={formData.payeeDetails.address?.street2}
                onChange={(e) => updateAddress('street2', e.target.value)}
                placeholder="Apartment, suite, etc. (optional)"
                error={!!getError('payeeDetails.address.street2')}
                disabled={isLoading}
              />
            </FormField>

            <FormField
              label="City"
              error={getError('payeeDetails.address.city')}
            >
              <TextInput
                value={formData.payeeDetails.address?.city}
                onChange={(e) => updateAddress('city', e.target.value)}
                placeholder="San Francisco"
                error={!!getError('payeeDetails.address.city')}
                disabled={isLoading}
              />
            </FormField>

            <FormField
              label="State"
              error={getError('payeeDetails.address.state')}
            >
              <Select
                value={formData.payeeDetails.address?.state}
                onChange={(e) => updateAddress('state', e.target.value)}
                placeholder="Select state"
                error={!!getError('payeeDetails.address.state')}
                disabled={isLoading}
              >
                {US_STATES.map((state) => (
                  <option key={state.value} value={state.value}>
                    {state.label}
                  </option>
                ))}
              </Select>
            </FormField>

            <FormField
              label="ZIP Code"
              error={getError('payeeDetails.address.zipCode')}
            >
              <TextInput
                value={formData.payeeDetails.address?.zipCode}
                onChange={(e) => updateAddress('zipCode', e.target.value)}
                placeholder="12345"
                error={!!getError('payeeDetails.address.zipCode')}
                disabled={isLoading}
              />
            </FormField>

            <FormField
              label="Country"
              error={getError('payeeDetails.address.country')}
            >
              <TextInput
                value={formData.payeeDetails.address?.country}
                onChange={(e) => updateAddress('country', e.target.value)}
                placeholder="United States"
                error={!!getError('payeeDetails.address.country')}
                disabled={isLoading}
              />
            </FormField>
          </div>
        </FormSection>

        {/* Bank Information - Only show for relevant payment methods */}
        {needsBankInfo && (
          <FormSection
            title="Bank Information"
            description="Required for bank transfers and wire transfers"
          >
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                label="Account Number"
                required
                error={getError('payeeDetails.bankInfo.accountNumber')}
              >
                <TextInput
                  value={formData.payeeDetails.bankInfo?.accountNumber}
                  onChange={(e) => updateBankInfo('accountNumber', e.target.value)}
                  placeholder="Account number"
                  error={!!getError('payeeDetails.bankInfo.accountNumber')}
                  disabled={isLoading}
                />
              </FormField>

              <FormField
                label="Routing Number"
                required
                error={getError('payeeDetails.bankInfo.routingNumber')}
              >
                <TextInput
                  value={formData.payeeDetails.bankInfo?.routingNumber}
                  onChange={(e) => updateBankInfo('routingNumber', e.target.value)}
                  placeholder="Routing number"
                  error={!!getError('payeeDetails.bankInfo.routingNumber')}
                  disabled={isLoading}
                />
              </FormField>

              <FormField
                label="Bank Name"
                required
                error={getError('payeeDetails.bankInfo.bankName')}
              >
                <TextInput
                  value={formData.payeeDetails.bankInfo?.bankName}
                  onChange={(e) => updateBankInfo('bankName', e.target.value)}
                  placeholder="Bank name"
                  error={!!getError('payeeDetails.bankInfo.bankName')}
                  disabled={isLoading}
                />
              </FormField>

              <FormField
                label="Account Type"
                required
                error={getError('payeeDetails.bankInfo.accountType')}
              >
                <Select
                  value={formData.payeeDetails.bankInfo?.accountType}
                  onChange={(e) => updateBankInfo('accountType', e.target.value)}
                  error={!!getError('payeeDetails.bankInfo.accountType')}
                  disabled={isLoading}
                >
                  <option value="checking">Checking</option>
                  <option value="savings">Savings</option>
                </Select>
              </FormField>
            </div>
          </FormSection>
        )}

        {/* Form Actions */}
        <div className="flex gap-4 justify-end border-t pt-6">
          {onSaveDraft && (
            <Button
              type="button"
              variant="outline"
              onClick={handleSaveDraft}
              disabled={isDraftSaving || isLoading}
            >
              {isDraftSaving ? (
                <>
                  <FileText className="w-4 h-4 mr-2 animate-spin" />
                  Saving Draft...
                </>
              ) : (
                <>
                  <FileText className="w-4 h-4 mr-2" />
                  Save Draft
                </>
              )}
            </Button>
          )}
          <Button
            type="submit"
            disabled={isLoading || isDraftSaving}
          >
            {isLoading ? (
              <>
                <DollarSign className="w-4 h-4 mr-2 animate-spin" />
                Submitting...
              </>
            ) : (
              <>
                <DollarSign className="w-4 h-4 mr-2" />
                Submit Request
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}