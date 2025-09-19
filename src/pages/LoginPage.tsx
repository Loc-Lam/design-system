import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LoginForm from '../components/LoginForm';
import { useAuth } from '../contexts/AuthContext';

const LoginPage = () => {
  const navigate = useNavigate();
  const { login, isAuthenticated } = useAuth();
  const [formErrors, setFormErrors] = useState<{
    email?: string;
    password?: string;
    general?: string;
  }>({});

  useEffect(() => {
    if (isAuthenticated) {
      navigate('/dashboard', { replace: true });
    }
  }, [isAuthenticated, navigate]);

  const handleSignIn = async (email: string, password: string, rememberMe: boolean) => {
    setFormErrors({});

    const errors: any = {};

    if (!email.trim()) {
      errors.email = 'Email is required';
    }
    if (!password.trim()) {
      errors.password = 'Password is required';
    }

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    try {
      await login(email, password, rememberMe);
    } catch (error) {
      if (error instanceof Error) {
        if (error.message.includes('Email is required')) {
          setFormErrors({ email: error.message });
        } else if (error.message.includes('Password is required')) {
          setFormErrors({ password: error.message });
        } else if (error.message.includes('valid email')) {
          setFormErrors({ email: error.message });
        } else {
          setFormErrors({ general: error.message });
        }
      }
    }
  };

  const handleCreateAccount = () => {
    alert('Create account functionality would be implemented here');
  };

  const handleForgotPassword = () => {
    alert('Forgot password functionality would be implemented here');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <LoginForm
        data-id="login-form"
        onSignIn={handleSignIn}
        onCreateAccount={handleCreateAccount}
        onForgotPassword={handleForgotPassword}
        errors={formErrors}
        colorTheme="default"
        layout="single"
      />
    </div>
  );
};

export default LoginPage;