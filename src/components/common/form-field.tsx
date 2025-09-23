import React from 'react';
import { cn } from '@/lib/utils';

// Base Components Level: Form Field wrapper and input components
// Following component hierarchy: Design Tokens → Base Components

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  labelClassName?: string;
}

export function FormField({
  label,
  required = false,
  error,
  hint,
  children,
  className,
  labelClassName,
}: FormFieldProps) {
  return (
    <div className={cn('space-y-2', className)}>
      <label className={cn('block text-sm font-medium text-gray-700', labelClassName)}>
        {label}
        {required && (
          <span className="text-red-500 ml-1" aria-label="required">
            *
          </span>
        )}
      </label>
      {children}
      {hint && !error && (
        <p className="text-xs text-gray-500">{hint}</p>
      )}
      {error && (
        <p className="text-xs text-red-600" role="alert">
          {error}
        </p>
      )}
    </div>
  );
}

// Enhanced TextInput extending the basic input component
interface TextInputProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'date' | 'url';
  error?: boolean;
}

export function TextInput({ className, error, ...props }: TextInputProps) {
  return (
    <input
      className={cn(
        'w-full px-3 py-2 border rounded-lg transition-colors',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        error
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-200 hover:border-gray-300',
        className
      )}
      {...props}
    />
  );
}

// TextArea component
interface TextAreaProps extends React.ComponentProps<'textarea'> {
  error?: boolean;
}

export function TextArea({ className, error, ...props }: TextAreaProps) {
  return (
    <textarea
      className={cn(
        'w-full px-3 py-2 border rounded-lg transition-colors resize-vertical',
        'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
        'disabled:bg-gray-50 disabled:text-gray-500 disabled:cursor-not-allowed',
        error
          ? 'border-red-500 focus:ring-red-500 focus:border-red-500'
          : 'border-gray-200 hover:border-gray-300',
        className
      )}
      {...props}
    />
  );
}

// Checkbox component
interface CheckboxProps extends Omit<React.ComponentProps<'input'>, 'type'> {
  label?: string;
  description?: string;
}

export function Checkbox({ label, description, className, id, ...props }: CheckboxProps) {
  const checkboxId = id || `checkbox-${Math.random().toString(36).substr(2, 9)}`;

  if (!label) {
    return (
      <input
        id={checkboxId}
        type="checkbox"
        className={cn(
          'h-4 w-4 text-blue-600 border-gray-300 rounded',
          'focus:ring-blue-500 focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
    );
  }

  return (
    <div className="flex items-start space-x-3">
      <input
        id={checkboxId}
        type="checkbox"
        className={cn(
          'mt-0.5 h-4 w-4 text-blue-600 border-gray-300 rounded',
          'focus:ring-blue-500 focus:ring-2 focus:ring-offset-0',
          'disabled:opacity-50 disabled:cursor-not-allowed',
          className
        )}
        {...props}
      />
      <div className="flex-1">
        <label htmlFor={checkboxId} className="text-sm font-medium text-gray-700 cursor-pointer">
          {label}
        </label>
        {description && (
          <p className="text-xs text-gray-500 mt-1">{description}</p>
        )}
      </div>
    </div>
  );
}

// Radio Group component
interface RadioGroupProps {
  name: string;
  value: string;
  onChange: (value: string) => void;
  options: Array<{
    value: string;
    label: string;
    description?: string;
  }>;
  direction?: 'horizontal' | 'vertical';
  className?: string;
}

export function RadioGroup({
  name,
  value,
  onChange,
  options,
  direction = 'vertical',
  className,
}: RadioGroupProps) {
  return (
    <div
      className={cn(
        'space-y-3',
        direction === 'horizontal' && 'flex space-x-6 space-y-0',
        className
      )}
    >
      {options.map((option) => (
        <div key={option.value} className="flex items-start space-x-3">
          <input
            type="radio"
            id={`${name}-${option.value}`}
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={(e) => onChange(e.target.value)}
            className="mt-0.5 h-4 w-4 text-blue-600 border-gray-300 focus:ring-blue-500 focus:ring-2"
          />
          <div className="flex-1">
            <label
              htmlFor={`${name}-${option.value}`}
              className="text-sm font-medium text-gray-700 cursor-pointer"
            >
              {option.label}
            </label>
            {option.description && (
              <p className="text-xs text-gray-500 mt-1">{option.description}</p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}

// Form Section component for organizing form layouts
interface FormSectionProps {
  title: string;
  description?: string;
  children: React.ReactNode;
  className?: string;
}

export function FormSection({ title, description, children, className }: FormSectionProps) {
  return (
    <div className={cn('space-y-6', className)}>
      <div className="border-b border-gray-200 pb-4">
        <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        {description && (
          <p className="text-sm text-gray-600 mt-1">{description}</p>
        )}
      </div>
      <div className="space-y-6">{children}</div>
    </div>
  );
}