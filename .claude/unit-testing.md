---
name: unit-testing
description: Testing all components in the source code with 100% coverage and make sure it don't break the flow
tools: Read, Write, Edit, MultiEdit, Grep, Glob
color: Blue
---

# Purpose

Testing all components in the source code with 100% coverage and make sure it don't break the flow after the agent @style.md is implemented. Just run unit testing if the component is modified or impacted from the other components.

## MANDATORY UNIT TESTING REQUIREMENTS

### **CRITICAL TESTING CONSTRAINTS:**

**EVERY component MUST have 100% test coverage before being considered complete.**
- **NO component without comprehensive unit tests**
- **NO merge/commit without passing test suite**
- **NO component considered "done" without testing all props, states, and interactions**
- **ALL new components MUST include tests as part of initial implementation**

### **TESTING FRAMEWORK STANDARDS:**

**Required Testing Stack:**
- **Testing Framework**: Vitest (already configured)
- **React Testing Library**: `@testing-library/react` for component testing
- **User Interactions**: `@testing-library/user-event` for user interactions
- **Mocking**: Vitest built-in mocks for external dependencies
- **Coverage**: Vitest coverage reporting with 100% threshold

**File Naming Convention:**
```
src/components/ComponentName.test.tsx
src/components/ComponentName/ComponentName.test.tsx
src/components/common/component-name.test.tsx
```

### **COMPREHENSIVE TESTING CHECKLIST:**

**For EVERY Component, Test:**

1. **Rendering Tests** (25% of coverage):
   - [ ] Component renders without crashing
   - [ ] Default props render correctly
   - [ ] All prop variations render correctly
   - [ ] Conditional rendering based on props
   - [ ] Component renders with different data scenarios

2. **Props Testing** (25% of coverage):
   - [ ] All required props function correctly
   - [ ] Optional props have proper defaults
   - [ ] Invalid props handle gracefully
   - [ ] Props validation works as expected
   - [ ] Edge cases for prop values

3. **State Management** (20% of coverage):
   - [ ] Initial state is correct
   - [ ] State updates work correctly
   - [ ] State transitions are valid
   - [ ] Complex state scenarios
   - [ ] State cleanup on unmount

4. **User Interactions** (20% of coverage):
   - [ ] Click events work correctly
   - [ ] Form submissions handle properly
   - [ ] Keyboard navigation functions
   - [ ] Focus management works
   - [ ] Hover states trigger correctly

5. **Accessibility Testing** (10% of coverage):
   - [ ] ARIA attributes are correct
   - [ ] Screen reader compatibility
   - [ ] Keyboard navigation works
   - [ ] Focus indicators visible
   - [ ] Color contrast requirements met

### **TESTING IMPLEMENTATION PATTERNS:**

**Base Component Test Template:**
```typescript
import { render, screen, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi } from 'vitest';
import ComponentName from './ComponentName';
import type { ComponentNameProps } from './ComponentName';

const defaultProps: ComponentNameProps = {
  // Define minimal required props
};

const mockProps = {
  ...defaultProps,
  // Add optional props for testing
  onClick: vi.fn(),
  onSubmit: vi.fn(),
};

describe('ComponentName', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  describe('Rendering', () => {
    it('renders without crashing', () => {
      render(<ComponentName {...defaultProps} />);
      expect(screen.getByRole('...')).toBeInTheDocument();
    });

    it('renders with all props', () => {
      render(<ComponentName {...mockProps} />);
      expect(screen.getByText('...')).toBeInTheDocument();
    });

    it('applies custom className', () => {
      render(<ComponentName {...defaultProps} className="test-class" />);
      expect(screen.getByRole('...')).toHaveClass('test-class');
    });
  });

  describe('Props', () => {
    it('handles required props correctly', () => {
      // Test each required prop
    });

    it('uses default values for optional props', () => {
      // Test default prop behavior
    });
  });

  describe('User Interactions', () => {
    it('handles click events', async () => {
      const user = userEvent.setup();
      render(<ComponentName {...mockProps} />);

      await user.click(screen.getByRole('button'));
      expect(mockProps.onClick).toHaveBeenCalledTimes(1);
    });
  });

  describe('Accessibility', () => {
    it('has correct ARIA attributes', () => {
      render(<ComponentName {...mockProps} />);
      expect(screen.getByRole('...')).toHaveAttribute('aria-label', '...');
    });

    it('supports keyboard navigation', async () => {
      const user = userEvent.setup();
      render(<ComponentName {...mockProps} />);

      await user.tab();
      expect(screen.getByRole('button')).toHaveFocus();
    });
  });
});
```

**Form Component Testing Pattern:**
```typescript
describe('FormComponent', () => {
  it('handles form submission', async () => {
    const user = userEvent.setup();
    const onSubmit = vi.fn();

    render(<FormComponent onSubmit={onSubmit} />);

    // Fill form fields
    await user.type(screen.getByLabelText('Name'), 'John Doe');
    await user.type(screen.getByLabelText('Email'), 'john@example.com');

    // Submit form
    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(onSubmit).toHaveBeenCalledWith({
      name: 'John Doe',
      email: 'john@example.com'
    });
  });

  it('validates form fields', async () => {
    const user = userEvent.setup();
    render(<FormComponent />);

    await user.click(screen.getByRole('button', { name: /submit/i }));

    expect(screen.getByText('Name is required')).toBeInTheDocument();
    expect(screen.getByText('Email is required')).toBeInTheDocument();
  });
});
```

**Status Component Testing (Blue Color System):**
```typescript
describe('StatusBadge', () => {
  it('applies correct blue color classes', () => {
    render(<StatusBadge status="approved" />);
    expect(screen.getByText('Approved')).toHaveClass('bg-blue-100', 'text-blue-700');
  });

  it('handles all status variants', () => {
    const statuses = ['draft', 'submitted', 'pending_approval', 'approved', 'rejected'];

    statuses.forEach(status => {
      const { rerender } = render(<StatusBadge status={status} />);
      expect(screen.getByRole('text')).toBeInTheDocument();
      rerender(<></>); // Clean up for next iteration
    });
  });
});
```

### **COVERAGE REQUIREMENTS:**

**100% Coverage Enforcement:**
```json
// vitest.config.ts coverage settings
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        lines: 100,
        functions: 100,
        branches: 100,
        statements: 100
      },
      include: ['src/components/**/*.tsx'],
      exclude: [
        'src/components/**/*.test.tsx',
        'src/components/**/*.stories.tsx',
        'src/components/**/index.tsx' // Re-export files
      ]
    }
  }
});
```

**Pre-commit Hook for Testing:**
```bash
#!/bin/sh
# Pre-commit testing hook
npm run test -- --coverage --reporter=verbose
if [ $? -ne 0 ]; then
  echo "❌ Tests failed. Commit blocked."
  exit 1
fi

npm run test:coverage-check
if [ $? -ne 0 ]; then
  echo "❌ Coverage below 100%. Commit blocked."
  exit 1
fi

echo "✅ All tests passed with 100% coverage."
```

### **TESTING WORKFLOW INTEGRATION:**

**Component Development Process:**
1. **Write Component Interface** (TypeScript types)
2. **Write Tests First** (Test-Driven Development)
3. **Implement Component** (Pass all tests)
4. **Verify 100% Coverage** (No exceptions)
5. **Integration Testing** (Component in context)

**MANDATORY Testing Commands:**
```bash
# Run all tests
npm run test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch

# Run specific component tests
npm run test StatusBadge

# Generate coverage report
npm run test:coverage:report
```

### **TESTING BEST PRACTICES:**

**DO:**
- [ ] Write descriptive test names that explain the behavior
- [ ] Test edge cases and error conditions
- [ ] Mock external dependencies appropriately
- [ ] Use screen queries that match user behavior
- [ ] Test accessibility features explicitly
- [ ] Keep tests focused and isolated
- [ ] Use setup/teardown for common test scenarios

**DON'T:**
- [ ] Test implementation details (test behavior, not internals)
- [ ] Write tests that depend on other tests
- [ ] Mock everything (test real behavior when possible)
- [ ] Ignore async behavior in tests
- [ ] Skip accessibility testing
- [ ] Write tests that are too complex

### **COMPONENT-SPECIFIC TESTING REQUIREMENTS:**

**Base Components** (`@/components/common/`):
- [ ] Test all prop combinations
- [ ] Test blue color system compliance
- [ ] Test accessibility features
- [ ] Test responsive behavior
- [ ] Test error states

**Layout Components**:
- [ ] Test grid/flexbox behavior
- [ ] Test responsive breakpoints
- [ ] Test container behavior
- [ ] Test spacing and alignment

**Feature Components**:
- [ ] Test business logic
- [ ] Test data flow
- [ ] Test error handling
- [ ] Test loading states
- [ ] Test user workflows

**Page Components**:
- [ ] Test routing integration
- [ ] Test component composition
- [ ] Test data loading
- [ ] Test error boundaries
- [ ] Test navigation

### **MOCK DATA STANDARDS:**

**Mock Data Patterns:**
```typescript
// Mock data should match TypeScript interfaces exactly
export const mockPaymentRequest: PaymentRequest = {
  id: 'test-id-1',
  title: 'Test Payment Request',
  description: 'Test Description',
  amount: 1000,
  currency: 'USD',
  category: 'expense_reimbursement',
  paymentMethod: 'bank_transfer',
  priority: 'normal',
  status: 'draft',
  // ... complete object matching interface
};

// Factory functions for different scenarios
export const createMockPaymentRequest = (overrides = {}) => ({
  ...mockPaymentRequest,
  ...overrides
});

// Edge case data
export const mockEdgeCases = {
  emptyString: '',
  longString: 'A'.repeat(1000),
  negativeAmount: -100,
  zerAmount: 0,
  maxAmount: Number.MAX_SAFE_INTEGER
};
```

### **ERROR TESTING REQUIREMENTS:**

**Error Boundary Testing:**
```typescript
describe('Component Error Handling', () => {
  it('handles API errors gracefully', async () => {
    const mockError = new Error('API Error');
    vi.mocked(apiCall).mockRejectedValue(mockError);

    render(<Component />);

    await waitFor(() => {
      expect(screen.getByText(/error occurred/i)).toBeInTheDocument();
    });
  });

  it('displays loading state', () => {
    vi.mocked(apiCall).mockImplementation(() => new Promise(() => {}));

    render(<Component />);

    expect(screen.getByText(/loading/i)).toBeInTheDocument();
  });
});
```

### **INTEGRATION WITH CI/CD:**

**GitHub Actions Testing:**
```yaml
name: Test Suite
on: [push, pull_request]
jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
      - run: npm ci
      - run: npm run test:coverage
      - run: npm run test:coverage:enforce-100
```

### **TESTING DOCUMENTATION:**

**Each Test File Must Include:**
```typescript
/**
 * @fileoverview Tests for ComponentName
 *
 * Test Coverage:
 * ✅ Rendering with all prop variations
 * ✅ User interaction handling
 * ✅ Accessibility compliance
 * ✅ Error state handling
 * ✅ Blue color system compliance
 *
 * Coverage: 100% (Lines: 100%, Functions: 100%, Branches: 100%)
 */
```

### **ENFORCEMENT AND VALIDATION:**

**Pre-merge Checklist:**
- [ ] All tests pass ✅
- [ ] 100% code coverage ✅
- [ ] No console errors/warnings ✅
- [ ] Accessibility tests pass ✅
- [ ] Performance benchmarks met ✅
- [ ] Blue color system compliance ✅

**GOLDEN RULE FOR TESTING: Every line of component code must be tested. No exceptions. No incomplete components. No merge without 100% coverage.**

**Testing Failure Protocol:**
- If tests fail: Fix immediately, don't bypass
- If coverage < 100%: Add missing tests, don't lower threshold
- If accessibility fails: Fix component, don't skip tests
- If performance fails: Optimize component, don't remove benchmarks

**CRITICAL SUCCESS METRICS:**
- **100% test coverage maintained across all components**
- **Zero test failures in CI/CD pipeline**
- **All accessibility requirements tested and passing**
- **Blue color system compliance verified through tests**
- **Error handling validated for all user scenarios**