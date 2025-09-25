/**
 * @fileoverview Vitest test setup configuration
 *
 * This file configures the testing environment for all component tests.
 * It includes global test utilities, custom matchers, and setup/teardown logic.
 */

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach, beforeAll, afterAll } from 'vitest';
import React from 'react';

// Global test environment setup
beforeAll(() => {
  // Mock window.matchMedia for responsive components
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: (query: string) => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: () => {},
      removeListener: () => {},
      addEventListener: () => {},
      removeEventListener: () => {},
      dispatchEvent: () => {},
    }),
  });

  // Mock IntersectionObserver for components that use it
  global.IntersectionObserver = class IntersectionObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };

  // Mock ResizeObserver for responsive components
  global.ResizeObserver = class ResizeObserver {
    constructor() {}
    disconnect() {}
    observe() {}
    unobserve() {}
  };

  // Mock HTMLElement.scrollIntoView for navigation tests
  HTMLElement.prototype.scrollIntoView = () => {};

  // Mock console methods to reduce noise in tests (optional)
  global.console.warn = () => {};

  // Setup global fetch mock if needed
  global.fetch = fetch;
});

// Cleanup after each test
afterEach(() => {
  // Clean up DOM after each test
  cleanup();

  // Clear all mocks
  if (typeof jest !== 'undefined') {
    jest.clearAllMocks();
  }
});

// Global teardown
afterAll(() => {
  // Any global cleanup if needed
});

// Custom test utilities
export const createMockProps = <T extends object>(overrides: Partial<T> = {}): T => {
  return { ...overrides } as T;
};

// Helper for testing async components
export const waitForAsyncComponent = (timeout = 1000) => {
  return new Promise(resolve => setTimeout(resolve, timeout));
};

// Mock data generators
export const generateMockId = () => `test-id-${Math.random().toString(36).substr(2, 9)}`;

export const createMockEvent = (eventType: string, eventProperties = {}) => {
  const event = new Event(eventType, { bubbles: true, cancelable: true });
  Object.assign(event, eventProperties);
  return event;
};

// Blue color system test helpers
export const BLUE_COLOR_CLASSES = {
  'blue-50': 'bg-blue-50',
  'blue-100': 'bg-blue-100',
  'blue-500': 'bg-blue-500',
  'blue-600': 'bg-blue-600',
  'blue-700': 'bg-blue-700',
  'text-blue-600': 'text-blue-600',
  'text-blue-700': 'text-blue-700',
  'border-blue-200': 'border-blue-200',
  'border-blue-500': 'border-blue-500'
};

export const assertBlueColorCompliance = (element: HTMLElement, expectedClasses: string[]) => {
  expectedClasses.forEach(className => {
    expect(element).toHaveClass(className);
  });
};

// Accessibility test helpers
export const checkAccessibilityFeatures = {
  hasAriaLabel: (element: HTMLElement, expectedLabel?: string) => {
    const ariaLabel = element.getAttribute('aria-label');
    expect(ariaLabel).toBeTruthy();
    if (expectedLabel) {
      expect(ariaLabel).toBe(expectedLabel);
    }
  },

  hasRole: (element: HTMLElement, expectedRole: string) => {
    expect(element).toHaveAttribute('role', expectedRole);
  },

  isFocusable: (element: HTMLElement) => {
    const tabIndex = element.getAttribute('tabindex');
    const isInteractive = ['button', 'input', 'select', 'textarea', 'a'].includes(element.tagName.toLowerCase());
    expect(isInteractive || tabIndex === '0' || tabIndex === '-1').toBe(true);
  },

  hasKeyboardNavigation: async (element: HTMLElement, userEvent: any) => {
    element.focus();
    expect(element).toHaveFocus();

    await userEvent.keyboard('{Enter}');
    // Test should verify expected behavior after Enter key
  }
};

// Form testing utilities
export const fillForm = async (userEvent: any, formData: Record<string, string>) => {
  for (const [fieldName, value] of Object.entries(formData)) {
    const field = document.querySelector(`[name="${fieldName}"]`) ||
                   document.querySelector(`[data-testid="${fieldName}"]`);
    if (field) {
      await userEvent.clear(field);
      await userEvent.type(field, value);
    }
  }
};

// Component state testing helpers
export const triggerStateChange = async (userEvent: any, trigger: HTMLElement, expectedChange: () => void) => {
  await userEvent.click(trigger);
  expectedChange();
};

// Error boundary test helper
export const ThrowError = ({ shouldThrow }: { shouldThrow: boolean }) => {
  if (shouldThrow) {
    throw new Error('Test error');
  }
  return React.createElement('div', null, 'No error');
};