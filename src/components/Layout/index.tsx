import type { ReactNode } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { Sidebar, type SidebarItem } from '../Sidebar';
import { useAuth } from '../../contexts/AuthContext';
import {
  Home,
  User,
  Car,
  CreditCard,
  LogOut,
} from 'lucide-react';

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
    navigate('/login', { replace: true });
  };

  const sidebarItems: SidebarItem[] = [
    {
      id: 'dashboard',
      label: 'Dashboard',
      icon: Home,
      onClick: () => navigate('/dashboard'),
    },
    {
      id: 'profile',
      label: 'Profile',
      icon: User,
      onClick: () => navigate('/profile'),
    },
    {
      id: 'cars',
      label: 'Car Details',
      icon: Car,
      onClick: () => navigate('/car/tesla-model-s-2023'),
    },
    {
      id: 'payments',
      label: 'Payment Requests',
      icon: CreditCard,
      onClick: () => navigate('/payments'),
    },
    {
      id: 'logout',
      label: 'Logout',
      icon: LogOut,
      onClick: handleLogout,
    },
  ];

  // Determine active item based on current route
  const getActiveItem = () => {
    const path = location.pathname;
    if (path === '/dashboard') return 'dashboard';
    if (path === '/profile') return 'profile';
    if (path.startsWith('/car/')) return 'cars';
    if (path === '/payments') return 'payments';
    return 'dashboard';
  };

  const userInfo = user ? {
    name: user.fullName || (user.firstName && user.lastName ? user.firstName + ' ' + user.lastName : 'User'),
    email: user.email,
    initial: (user.firstName || user.fullName || 'U').charAt(0).toUpperCase(),
  } : undefined;

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar
        data-id="main-sidebar"
        items={sidebarItems}
        userInfo={userInfo}
        defaultActive={getActiveItem()}
        onItemClick={() => {
          // Item click is handled by individual onClick handlers
        }}
      />
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};

export default Layout;