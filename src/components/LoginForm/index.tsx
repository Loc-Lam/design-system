import React, { useState } from 'react';
import { Mail, Lock } from 'lucide-react';

type ColorTheme = 'default' | 'blue' | 'green' | 'purple' | 'red' | 'orange';
type Layout = 'single' | 'double';

const colorThemes = {
  default: {
    background: 'bg-white',
    text: 'text-gray-900',
    mutedText: 'text-gray-600',
    accent: 'text-red-500',
    input: 'bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-500',
    inputFocus: 'focus:ring-blue-500 focus:border-blue-500 focus:ring-2',
    inputError: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    button:
      'bg-slate-800 hover:bg-slate-700 text-white disabled:bg-gray-400 disabled:cursor-not-allowed',
    buttonFocus: 'focus:ring-slate-800 focus:ring-2 focus:ring-offset-2',
    buttonLoading: 'bg-slate-600 cursor-not-allowed',
    link: 'text-gray-900 hover:text-blue-600',
    error: 'text-red-600',
    success: 'text-green-600',
  },
  blue: {
    background: 'bg-blue-50',
    text: 'text-blue-900',
    mutedText: 'text-blue-600',
    accent: 'text-blue-500',
    input: 'bg-white border-blue-200 text-blue-900 placeholder-blue-400',
    inputFocus: 'focus:ring-blue-500 focus:border-blue-500 focus:ring-2',
    inputError: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    button:
      'bg-blue-600 hover:bg-blue-700 text-white disabled:bg-blue-400 disabled:cursor-not-allowed',
    buttonFocus: 'focus:ring-blue-600 focus:ring-2 focus:ring-offset-2',
    buttonLoading: 'bg-blue-500 cursor-not-allowed',
    link: 'text-blue-900 hover:text-blue-600',
    error: 'text-red-600',
    success: 'text-green-600',
  },
  green: {
    background: 'bg-green-50',
    text: 'text-green-900',
    mutedText: 'text-green-600',
    accent: 'text-green-500',
    input: 'bg-white border-green-200 text-green-900 placeholder-green-400',
    inputFocus: 'focus:ring-green-500 focus:border-green-500 focus:ring-2',
    inputError: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    button:
      'bg-green-600 hover:bg-green-700 text-white disabled:bg-green-400 disabled:cursor-not-allowed',
    buttonFocus: 'focus:ring-green-600 focus:ring-2 focus:ring-offset-2',
    buttonLoading: 'bg-green-500 cursor-not-allowed',
    link: 'text-green-900 hover:text-green-600',
    error: 'text-red-600',
    success: 'text-green-700',
  },
  purple: {
    background: 'bg-purple-50',
    text: 'text-purple-900',
    mutedText: 'text-purple-600',
    accent: 'text-purple-500',
    input: 'bg-white border-purple-200 text-purple-900 placeholder-purple-400',
    inputFocus: 'focus:ring-purple-500 focus:border-purple-500 focus:ring-2',
    inputError: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    button:
      'bg-purple-600 hover:bg-purple-700 text-white disabled:bg-purple-400 disabled:cursor-not-allowed',
    buttonFocus: 'focus:ring-purple-600 focus:ring-2 focus:ring-offset-2',
    buttonLoading: 'bg-purple-500 cursor-not-allowed',
    link: 'text-purple-900 hover:text-purple-600',
    error: 'text-red-600',
    success: 'text-green-600',
  },
  red: {
    background: 'bg-red-50',
    text: 'text-red-900',
    mutedText: 'text-red-600',
    accent: 'text-red-500',
    input: 'bg-white border-red-200 text-red-900 placeholder-red-400',
    inputFocus: 'focus:ring-red-500 focus:border-red-500 focus:ring-2',
    inputError: 'border-red-600 focus:ring-red-600 focus:border-red-600',
    button:
      'bg-red-600 hover:bg-red-700 text-white disabled:bg-red-400 disabled:cursor-not-allowed',
    buttonFocus: 'focus:ring-red-600 focus:ring-2 focus:ring-offset-2',
    buttonLoading: 'bg-red-500 cursor-not-allowed',
    link: 'text-red-900 hover:text-red-600',
    error: 'text-red-700',
    success: 'text-green-600',
  },
  orange: {
    background: 'bg-orange-50',
    text: 'text-orange-900',
    mutedText: 'text-orange-600',
    accent: 'text-orange-500',
    input: 'bg-white border-orange-200 text-orange-900 placeholder-orange-400',
    inputFocus: 'focus:ring-orange-500 focus:border-orange-500 focus:ring-2',
    inputError: 'border-red-500 focus:ring-red-500 focus:border-red-500',
    button:
      'bg-orange-600 hover:bg-orange-700 text-white disabled:bg-orange-400 disabled:cursor-not-allowed',
    buttonFocus: 'focus:ring-orange-600 focus:ring-2 focus:ring-offset-2',
    buttonLoading: 'bg-orange-500 cursor-not-allowed',
    link: 'text-orange-900 hover:text-orange-600',
    error: 'text-red-600',
    success: 'text-green-600',
  },
};

export interface LoginProps {
  'data-id'?: string;
  onSignIn?: (
    email: string,
    password: string,
    rememberMe: boolean
  ) => Promise<void> | void;
  onForgotPassword?: () => void;
  onCreateAccount?: () => void;
  className?: string;
  colorTheme?: ColorTheme;
  layout?: Layout;
  isLoading?: boolean;
  errors?: {
    email?: string;
    password?: string;
    general?: string;
  };
  success?: string;
}
const LoginForm = ({
  'data-id': dataId,
  onSignIn,
  onForgotPassword,
  onCreateAccount,
  className = '',
  colorTheme = 'default',
  layout = 'single',
  isLoading = false,
  errors,
  success,
}: LoginProps) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [internalLoading, setInternalLoading] = useState(false);

  const theme = colorThemes[colorTheme];
  const loading = isLoading || internalLoading;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (onSignIn && !loading) {
      setInternalLoading(true);
      try {
        await onSignIn(email, password, rememberMe);
      } catch (error) {
        // Error handling is managed by parent component through errors prop
      } finally {
        setInternalLoading(false);
      }
    }
  };
  const containerWidth = layout === 'double' ? 'max-w-2xl' : 'max-w-md';
  const formLayout =
    layout === 'double' ? 'grid grid-cols-1 md:grid-cols-2 gap-6' : 'space-y-6';

  return (
    <div
      data-id={dataId}
      className={`w-full ${containerWidth} mx-auto p-6 sm:p-8 ${theme.background} rounded-lg sm:rounded-2xl shadow-sm ${className}`}
    >
      <h1 className={`text-4xl font-bold ${theme.text} mb-8`}>Welcome!</h1>

      {/* Success Message */}
      {success && (
        <div
          className={`mb-4 p-3 rounded-lg bg-green-50 border border-green-200`}
          role="alert"
        >
          <p className={`text-sm ${theme.success}`}>{success}</p>
        </div>
      )}

      {/* General Error Message */}
      {errors?.general && (
        <div
          className={`mb-4 p-3 rounded-lg bg-red-50 border border-red-200`}
          role="alert"
        >
          <p className={`text-sm ${theme.error}`}>{errors.general}</p>
        </div>
      )}

      <form onSubmit={handleSubmit} noValidate>
        <div className={formLayout}>
          <div>
            <label
              htmlFor="email"
              className={`block text-sm font-medium ${theme.text} mb-2`}
            >
              Your email{' '}
              <span className={theme.accent} aria-label="required">
                *
              </span>
            </label>
            <div className="relative">
              <Mail
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.mutedText} w-5 h-5`}
                aria-hidden="true"
              />
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={loading}
                aria-invalid={errors?.email ? 'true' : 'false'}
                aria-describedby={errors?.email ? 'email-error' : undefined}
                className={`w-full pl-12 pr-4 py-4 ${theme.input} border rounded-2xl focus:outline-none transition-colors ${errors?.email ? theme.inputError : theme.inputFocus} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors?.email && (
              <p
                id="email-error"
                className={`mt-1 text-sm ${theme.error}`}
                role="alert"
              >
                {errors.email}
              </p>
            )}
          </div>
          <div>
            <label
              htmlFor="password"
              className={`block text-sm font-medium ${theme.text} mb-2`}
            >
              Your password{' '}
              <span className={theme.accent} aria-label="required">
                *
              </span>
            </label>
            <div className="relative">
              <Lock
                className={`absolute left-4 top-1/2 transform -translate-y-1/2 ${theme.mutedText} w-5 h-5`}
                aria-hidden="true"
              />
              <input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••"
                required
                disabled={loading}
                aria-invalid={errors?.password ? 'true' : 'false'}
                aria-describedby={
                  errors?.password ? 'password-error' : undefined
                }
                className={`w-full pl-12 pr-4 py-4 ${theme.input} border rounded-2xl focus:outline-none transition-colors ${errors?.password ? theme.inputError : theme.inputFocus} ${loading ? 'opacity-50 cursor-not-allowed' : ''}`}
              />
            </div>
            {errors?.password && (
              <p
                id="password-error"
                className={`mt-1 text-sm ${theme.error}`}
                role="alert"
              >
                {errors.password}
              </p>
            )}
          </div>
        </div>
        <div className={`mt-6 ${layout === 'double' ? 'md:col-span-2' : ''}`}>
          <div className="flex items-center justify-between mb-6">
            <label className="flex items-center space-x-2 cursor-pointer">
              <input
                type="checkbox"
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className={`w-4 h-4 ${theme.accent} ${theme.background} border rounded focus:ring-2 ${theme.buttonFocus} disabled:opacity-50`}
                disabled={loading}
              />
              <span
                className={`text-sm ${theme.text} ${loading ? 'opacity-50' : ''}`}
              >
                Remember me
              </span>
            </label>
            <button
              type="button"
              onClick={onForgotPassword}
              className={`text-sm ${theme.link} transition-colors ${loading ? 'opacity-50 pointer-events-none' : ''}`}
              disabled={loading}
            >
              Forgot password?
            </button>
          </div>
          <button
            type="submit"
            disabled={loading}
            className={`w-full ${loading ? theme.buttonLoading : theme.button} font-medium py-4 px-4 rounded-2xl transition-all duration-200 focus:outline-none focus:ring-2 ${theme.buttonFocus} focus:ring-offset-2 flex items-center justify-center gap-2`}
          >
            {loading && (
              <svg
                className="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
            )}
            {loading ? 'Signing in...' : 'Sign in'}
          </button>
        </div>
      </form>
      <div className="mt-4 flex gap-4">
        <span className={`${theme.mutedText} text-sm`}>Not registered? </span>
        <button
          onClick={onCreateAccount}
          className={`cursor-pointer text-sm ${theme.link} transition-colors font-medium ${loading ? 'opacity-50 pointer-events-none' : ''}`}
          disabled={loading}
        >
          Create account
        </button>
      </div>
    </div>
  );
};

export default LoginForm;
