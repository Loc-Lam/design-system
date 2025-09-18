import { useState, useEffect } from 'react';
import LoginForm from './components/LoginForm';
import Profile from './components/Profile';
import Timeline from './components/Timeline';
import { Sidebar } from './components/Sidebar';
import './App.css';

// Mock user database based on user story requirements
const MOCK_USERS = {
  'john@example.com': {
    email: 'john@example.com',
    password: 'Password123!',
    status: 'active',
    fullName: 'John Smith',
    firstName: 'John',
    lastName: 'Smith',
    phone: '+1-555-123-4567',
    birthday: '1990-05-15',
    gender: 'Male',
    avatar:
      'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face',
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
      cardNumber: '1234567890123456',
      cardholderName: 'John Smith',
      expirationDate: '12/2026',
      cvv: '123',
      billingAddressSame: true,
      isDefault: true,
      cardType: 'Visa',
    },
  },
  'inactive@example.com': {
    email: 'inactive@example.com',
    password: 'Password123!',
    status: 'inactive',
  },
  'locked@example.com': {
    email: 'locked@example.com',
    password: 'Password123!',
    status: 'locked',
    failedAttempts: 5,
  },
};

function App() {
  const [currentView, setCurrentView] = useState('login'); // 'timeline', 'login', 'profile'
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<any>(null);

  // Check for existing session on mount
  useEffect(() => {
    const storedUser = localStorage.getItem('authenticatedUser');
    if (storedUser) {
      try {
        const user = JSON.parse(storedUser);
        setCurrentUser(user);
        setIsAuthenticated(true);
      } catch {
        localStorage.removeItem('authenticatedUser');
      }
    }
  }, []);

  const handleSignIn = async (
    email: string,
    password: string,
    rememberMe: boolean
  ) => {
    const trimmedEmail = email.trim().toLowerCase();

    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1500));

    // Check if user exists
    const user = MOCK_USERS[trimmedEmail as keyof typeof MOCK_USERS];
    if (!user) {
      throw new Error('Invalid email or password');
    }

    // Check account status
    if (user.status === 'inactive') {
      throw new Error('Account is inactive. Please contact support.');
    }

    if (user.status === 'locked') {
      throw new Error(
        'Account is temporarily locked due to multiple failed login attempts'
      );
    }

    // Check password
    if (user.password !== password) {
      throw new Error('Invalid email or password');
    }

    // Successful login - redirect to profile as per user story
    setCurrentUser(user);
    setIsAuthenticated(true);
    setCurrentView('profile');

    // Store session if remember me is checked
    if (rememberMe) {
      localStorage.setItem('authenticatedUser', JSON.stringify(user));
    }
  };

  const handleForgotPassword = () => {
    alert('Forgot password feature would be implemented here');
  };

  const handleCreateAccount = () => {
    alert('Create account feature would be implemented here');
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentView('login');
    localStorage.removeItem('authenticatedUser');
  };

  const handleSaveProfile = async (section: string, data: any) => {
    // Simulate API call delay
    await new Promise((resolve) => setTimeout(resolve, 1000));

    // Validation logic based on section
    const errors: any = {};

    if (section === 'personal') {
      if (!data.firstName?.trim()) errors.firstName = 'First Name is required';
      if (!data.lastName?.trim()) errors.lastName = 'Last Name is required';
      if (!data.email?.trim()) {
        errors.email = 'Email is required';
      } else if (!data.email.includes('@')) {
        errors.email = 'Please enter a valid email address';
      }

      if (Object.keys(errors).length > 0) {
        const error = new Error('Validation failed');
        (error as any).fieldErrors = errors;
        throw error;
      }

      // Update user data
      const updatedUser = {
        ...currentUser,
        firstName: data.firstName,
        lastName: data.lastName,
        fullName: `${data.firstName} ${data.lastName}`,
        email: data.email,
        phone: data.phone,
        birthday: data.birthday,
        gender: data.gender,
        about: data.about,
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('authenticatedUser', JSON.stringify(updatedUser));
    }

    if (section === 'address') {
      if (!data.street1?.trim()) errors.street1 = 'Street Address is required';
      if (!data.city?.trim()) errors.city = 'City is required';
      if (!data.state?.trim()) errors.state = 'State/Province is required';
      if (!data.zipCode?.trim()) {
        errors.zipCode = 'ZIP/Postal Code is required';
      } else if (!/^[0-9]{5}(-[0-9]{4})?$/.test(data.zipCode)) {
        errors.zipCode = 'Please enter a valid ZIP/Postal Code';
      }

      if (Object.keys(errors).length > 0) {
        const error = new Error('Validation failed');
        (error as any).fieldErrors = errors;
        throw error;
      }

      // Update address data
      const updatedUser = {
        ...currentUser,
        address: {
          ...currentUser.address,
          ...data,
        },
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('authenticatedUser', JSON.stringify(updatedUser));
    }

    if (section === 'payment') {
      if (!data.cardNumber?.trim())
        errors.cardNumber = 'Card Number is required';
      if (!data.cardholderName?.trim())
        errors.cardholderName = 'Cardholder Name is required';
      if (!data.expirationDate?.trim())
        errors.expirationDate = 'Expiration Date is required';
      if (!data.cvv?.trim()) errors.cvv = 'CVV is required';

      // Validate card number format (16 digits)
      if (
        data.cardNumber &&
        !/^[0-9]{16}$/.test(data.cardNumber.replace(/\s/g, ''))
      ) {
        errors.cardNumber = 'Please enter a valid 16-digit card number';
      }

      // Validate expiration date is not in the past
      if (data.expirationDate) {
        const [month, year] = data.expirationDate.split('/');
        const expDate = new Date(parseInt(`20${year}`), parseInt(month) - 1);
        const now = new Date();
        if (expDate < now) {
          errors.expirationDate = 'Card expiration date cannot be in the past';
        }
      }

      if (Object.keys(errors).length > 0) {
        const error = new Error('Validation failed');
        (error as any).fieldErrors = errors;
        throw error;
      }

      // Update payment data
      const updatedUser = {
        ...currentUser,
        payment: {
          ...currentUser.payment,
          ...data,
        },
      };

      setCurrentUser(updatedUser);
      localStorage.setItem('authenticatedUser', JSON.stringify(updatedUser));
    }
  };

  // Timeline component demo data
  const timelineItems = [
    {
      date: '10 May 2025',
      title: 'Flowbite Figma Design System',
      description:
        'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &, Publisher and Marketing pages.',
      actions: {
        primary: {
          label: 'Read more',
          onClick: () => console.log('Read more clicked'),
        },
        secondary: {
          label: 'Download now',
          onClick: () => console.log('Download clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2V10M8 10L5 7M8 10L11 7M3 14H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      },
    },
    {
      date: '14 March 2025',
      title: 'Flowbite Figma Design System',
      description:
        'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &, Publisher and Marketing pages.',
      tags: ['Changelog'],
      actions: {
        secondary: {
          label: 'Download now',
          onClick: () => console.log('Download clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2V10M8 10L5 7M8 10L11 7M3 14H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      },
    },
    {
      date: '22 February 2025',
      title: 'Flowbite Blocks v.3.0',
      description:
        'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &, Publisher and Marketing pages.',
      actions: {
        primary: {
          label: 'View blocks',
          onClick: () => console.log('View blocks clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="8"
                cy="8"
                r="2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      },
    },
    {
      date: '29 October 2024',
      title: 'E-commerce UI Figma & Code',
      description:
        'Get access to over 20+ pages including a dashboard layout, charts, kanban board, calendar, and pre-order E-commerce &, Publisher and Marketing pages.',
      actions: {
        primary: {
          label: 'View in blocks',
          onClick: () => console.log('View in blocks clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M1 8C1 8 3.5 3 8 3C12.5 3 15 8 15 8C15 8 12.5 13 8 13C3.5 13 1 8 1 8Z"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <circle
                cx="8"
                cy="8"
                r="2"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
        secondary: {
          label: 'Download now',
          onClick: () => console.log('Download clicked'),
          icon: (
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2V10M8 10L5 7M8 10L11 7M3 14H13"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          ),
        },
      },
    },
  ];

  // Sidebar items configuration
  const sidebarItems = [
    // {
    //   id: 'timeline',
    //   label: 'Timeline',
    //   onClick: () => setCurrentView('timeline'),
    // },
    // {
    //   id: 'login',
    //   label: 'Login Demo',
    //   onClick: () => setCurrentView('login'),
    // },
    ...(isAuthenticated
      ? [
          {
            id: 'profile',
            label: 'Profile',
            onClick: () => setCurrentView('profile'),
          },
        ]
      : []),
    ...(isAuthenticated
      ? [
          {
            id: 'logout',
            label: 'Logout',
            onClick: handleLogout,
          },
        ]
      : []),
  ];

  const userInfo =
    isAuthenticated && currentUser
      ? {
          name:
            currentUser.fullName ||
            `${currentUser.firstName} ${currentUser.lastName}`,
          email: currentUser.email,
          initial: currentUser.firstName?.[0] || 'U',
        }
      : undefined;

  // Render content based on current view
  const renderContent = () => {
    if (currentView === 'login' && !isAuthenticated) {
      return (
        <div className="flex justify-center items-center h-screen">
          <LoginForm
            onSignIn={handleSignIn}
            onForgotPassword={handleForgotPassword}
            onCreateAccount={handleCreateAccount}
          />
        </div>
      );
    }

    if (currentView === 'profile' && isAuthenticated && currentUser) {
      return (
        <Profile
          userProfile={currentUser}
          onLogout={handleLogout}
          onSaveProfile={handleSaveProfile}
        />
      );
    }

    return null;
    // Default timeline view
    // return (
    //   <div className="app">
    //     <div className="container">
    //       <header className="header">
    //         <h1>Timeline Component Example</h1>
    //         <p>This example shows how you can use the component as a variant. Simply click on the component, and you'll see all the available options in the right sidebar.</p>
    //         <a href="#" className="docs-link">
    //           Coded version docs →
    //         </a>
    //       </header>

    //       <div className="timeline-demo">
    //         <Timeline items={timelineItems} />
    //       </div>

    //       <div className="variant-demo">
    //         <h2>Compact Variant</h2>
    //         <Timeline items={timelineItems} variant="compact" />
    //       </div>

    //       <div className="variant-demo">
    //         <h2>Without Connector Lines</h2>
    //         <Timeline items={timelineItems} showConnector={false} />
    //       </div>
    //     </div>
    //   </div>
    // );
  };

  return (
    <div className="flex h-screen">
      {isAuthenticated && (
        <Sidebar
          items={sidebarItems}
          userInfo={userInfo}
          defaultActive={currentView}
          onItemClick={(item) => {
            // Handle item clicks if needed
            console.log('Sidebar item clicked:', item);
          }}
        />
      )}
      <main className="flex-1 overflow-auto">{renderContent()}</main>
    </div>
  );
}

export default App;
