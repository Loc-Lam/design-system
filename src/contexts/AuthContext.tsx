import React, { createContext, useContext, useReducer, useEffect } from 'react';

export interface User {
  email: string;
  fullName: string;
  avatar: string;
  firstName?: string;
  lastName?: string;
  phone?: string;
  birthday?: string;
  gender?: string;
  about?: string;
  address?: {
    street1?: string;
    street2?: string;
    city?: string;
    state?: string;
    zipCode?: string;
    country?: string;
    addressType?: string;
  };
  payment?: {
    cardNumber?: string;
    cardholderName?: string;
    expirationDate?: string;
    cvv?: string;
    billingAddressSame?: boolean;
    isDefault?: boolean;
    cardType?: string;
  };
}

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

type AuthAction =
  | { type: 'LOGIN_START' }
  | { type: 'LOGIN_SUCCESS'; payload: User }
  | { type: 'LOGIN_FAILURE'; payload: string }
  | { type: 'LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<User> }
  | { type: 'CLEAR_ERROR' };

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
};

const mockUser: User = {
  email: 'john@example.com',
  fullName: 'John Smith',
  avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
  firstName: 'John',
  lastName: 'Smith',
  phone: '+1-555-123-4567',
  birthday: '1990-05-15',
  gender: 'Male',
  about: 'Software developer from NYC',
  address: {
    street1: '123 Main Street',
    street2: 'Apt 4B',
    city: 'New York',
    state: 'NY',
    zipCode: '10001',
    country: 'United States',
    addressType: 'Home',
  },
  payment: {
    cardNumber: '4111111111111234',
    cardholderName: 'John Smith',
    expirationDate: '12/2026',
    cvv: '123',
    billingAddressSame: true,
    isDefault: true,
    cardType: 'Visa',
  },
};

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_START':
      return {
        ...state,
        isLoading: true,
        error: null,
      };
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
        isAuthenticated: true,
        isLoading: false,
        error: null,
      };
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: action.payload,
      };
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
        error: null,
      };
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? { ...state.user, ...action.payload } : null,
      };
    case 'CLEAR_ERROR':
      return {
        ...state,
        error: null,
      };
    default:
      return state;
  }
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string, rememberMe: boolean) => Promise<void>;
  logout: () => void;
  updateProfile: (section: string, data: any) => Promise<void>;
  clearError: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(authReducer, initialState);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        const user = JSON.parse(savedUser);
        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } catch (error) {
        localStorage.removeItem('user');
      }
    }
  }, []);

  const login = async (email: string, password: string, rememberMe: boolean) => {
    dispatch({ type: 'LOGIN_START' });

    try {
      await new Promise(resolve => setTimeout(resolve, 1000));

      const trimmedEmail = email.trim().toLowerCase();

      if (!email) {
        throw new Error('Email is required');
      }
      if (!password) {
        throw new Error('Password is required');
      }

      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(trimmedEmail)) {
        throw new Error('Please enter a valid email address');
      }

      if (trimmedEmail === 'john@example.com' && password === 'Password123!') {
        const user = { ...mockUser, email: trimmedEmail };

        if (rememberMe) {
          localStorage.setItem('user', JSON.stringify(user));
        }

        dispatch({ type: 'LOGIN_SUCCESS', payload: user });
      } else if (trimmedEmail === 'inactive@example.com') {
        throw new Error('Account is inactive. Please contact support.');
      } else if (trimmedEmail === 'locked@example.com') {
        throw new Error('Account is temporarily locked due to multiple failed login attempts');
      } else {
        throw new Error('Invalid email or password');
      }
    } catch (error) {
      dispatch({ type: 'LOGIN_FAILURE', payload: error instanceof Error ? error.message : 'Login failed' });
      throw error;
    }
  };

  const logout = () => {
    localStorage.removeItem('user');
    dispatch({ type: 'LOGOUT' });
  };

  const updateProfile = async (section: string, data: any) => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));

      const errors: any = {};

      if (section === 'personal') {
        if (!data.firstName?.trim()) {
          errors.firstName = 'First Name is required';
        }
        if (!data.lastName?.trim()) {
          errors.lastName = 'Last Name is required';
        }
        if (!data.email?.trim()) {
          errors.email = 'Email is required';
        } else {
          const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
          if (!emailRegex.test(data.email.trim())) {
            errors.email = 'Please enter a valid email address';
          }
        }
      }

      if (section === 'address') {
        if (!data.street1?.trim()) {
          errors.street1 = 'Street Address is required';
        }
        if (!data.city?.trim()) {
          errors.city = 'City is required';
        }
        if (!data.state?.trim()) {
          errors.state = 'State is required';
        }
        if (!data.zipCode?.trim()) {
          errors.zipCode = 'ZIP/Postal Code is required';
        } else {
          const zipRegex = /^\d{5}(-\d{4})?$/;
          if (!zipRegex.test(data.zipCode.trim())) {
            errors.zipCode = 'Please enter a valid ZIP/Postal Code';
          }
        }
      }

      if (section === 'payment') {
        if (!data.cardNumber?.trim()) {
          errors.cardNumber = 'Card Number is required';
        } else {
          const cardRegex = /^\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4}$/;
          if (!cardRegex.test(data.cardNumber.replace(/[\s-]/g, ''))) {
            errors.cardNumber = 'Please enter a valid 16-digit card number';
          }
        }
        if (!data.cardholderName?.trim()) {
          errors.cardholderName = 'Cardholder Name is required';
        }
        if (!data.expirationDate?.trim()) {
          errors.expirationDate = 'Expiration Date is required';
        } else {
          const expRegex = /^(0[1-9]|1[0-2])\/\d{4}$/;
          if (!expRegex.test(data.expirationDate)) {
            errors.expirationDate = 'Please enter date in MM/YYYY format';
          } else {
            const [month, year] = data.expirationDate.split('/');
            const expDate = new Date(parseInt(year), parseInt(month) - 1);
            const now = new Date();
            if (expDate < now) {
              errors.expirationDate = 'Card expiration date cannot be in the past';
            }
          }
        }
        if (!data.cvv?.trim()) {
          errors.cvv = 'CVV is required';
        } else {
          const cvvRegex = /^\d{3,4}$/;
          if (!cvvRegex.test(data.cvv)) {
            errors.cvv = 'Please enter a valid CVV';
          }
        }
      }

      if (Object.keys(errors).length > 0) {
        const error = new Error('Validation failed');
        (error as any).fieldErrors = errors;
        throw error;
      }

      let updateData: Partial<User> = {};

      if (section === 'personal') {
        updateData = {
          firstName: data.firstName,
          lastName: data.lastName,
          fullName: `${data.firstName} ${data.lastName}`,
          email: data.email,
          phone: data.phone,
          birthday: data.birthday,
          gender: data.gender,
          about: data.about,
        };
      } else if (section === 'address') {
        updateData = {
          address: data
        };
      } else if (section === 'payment') {
        updateData = {
          payment: data
        };
      }

      dispatch({ type: 'UPDATE_PROFILE', payload: updateData });

      if (state.user) {
        const updatedUser = { ...state.user, ...updateData };
        localStorage.setItem('user', JSON.stringify(updatedUser));
      }

    } catch (error) {
      throw error;
    }
  };

  const clearError = () => {
    dispatch({ type: 'CLEAR_ERROR' });
  };

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        logout,
        updateProfile,
        clearError,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}