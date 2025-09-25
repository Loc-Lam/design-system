/**
 * @fileoverview Simple test for ExpenseForm component to debug basic functionality
 */

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ExpenseForm from './ExpenseForm';

// Mock the UI components that are external dependencies
vi.mock('@/components/ui/select', () => ({
  Select: ({ children, value, onValueChange }: any) => (
    <select value={value || ''} onChange={(e) => onValueChange && onValueChange(e.target.value)}>
      {children}
    </select>
  ),
  SelectContent: ({ children }: any) => <>{children}</>,
  SelectItem: ({ children, value }: any) => <option value={value}>{children}</option>,
}));

vi.mock('@/components/ui/date-picker', () => ({
  DatePicker: ({ date, onDateChange }: any) => (
    <input
      type="date"
      value={date ? date.toISOString().split('T')[0] : ''}
      onChange={(e) => onDateChange && onDateChange(new Date(e.target.value))}
    />
  ),
}));

vi.mock('@/components/common/form-field', () => ({
  FormField: ({ label, children }: any) => (
    <div>
      <label>{label}</label>
      {children}
    </div>
  ),
  TextInput: (props: any) => <input {...props} />,
  Checkbox: ({ label, checked, onChange }: any) => (
    <label>
      <input type="checkbox" checked={checked} onChange={onChange} />
      {label}
    </label>
  ),
}));

const defaultProps = {
  onSave: vi.fn(),
  onCancel: vi.fn(),
};

describe('ExpenseForm Simple Test', () => {
  it('renders basic form elements', () => {
    render(<ExpenseForm {...defaultProps} />);

    // Check that the form renders without crashing
    expect(screen.getByRole('button', { name: /save/i })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /reset/i })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('Merchant name')).toBeInTheDocument();
  });

  it('handles form submission', async () => {
    const user = userEvent.setup();
    render(<ExpenseForm {...defaultProps} />);

    // Fill merchant field
    const merchantInput = screen.getByPlaceholderText('Merchant name');
    await user.type(merchantInput, 'Test Merchant');

    // Fill total field
    const totalInput = screen.getByPlaceholderText('VND ₫');
    await user.type(totalInput, '100');

    // Fill category field (required) - the first select is the category
    const selects = screen.getAllByRole('combobox');
    const categorySelect = selects[0]; // Category is the first select
    await user.selectOptions(categorySelect, 'meals');

    // Submit form
    const saveButton = screen.getByRole('button', { name: /save/i });
    await user.click(saveButton);

    // Should call onSave with form data
    expect(defaultProps.onSave).toHaveBeenCalled();
  });
});