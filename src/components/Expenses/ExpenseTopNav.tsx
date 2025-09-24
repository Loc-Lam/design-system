import React from 'react';
import { Home, BarChart3, Lightbulb, Settings, HelpCircle } from 'lucide-react';
import { cn } from '@/lib/utils';

// Layout Components Level: Grid, container, and structural patterns
// Following component hierarchy: Base → Layout

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  isActive?: boolean;
}

interface ExpenseTopNavProps {
  userInfo: {
    name: string;
    email: string;
    initial: string;
  };
  onNavClick?: (itemId: string) => void;
  activeItem?: string;
  className?: string;
}

const navItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
  },
  {
    id: 'expenses',
    label: 'Expenses',
    icon: BarChart3,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
  },
  {
    id: 'insights',
    label: 'Insights',
    icon: Lightbulb,
  },
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
  },
  {
    id: 'support',
    label: 'Support',
    icon: HelpCircle,
  },
];

export function ExpenseTopNav({
  userInfo,
  onNavClick,
  activeItem = 'expenses',
  className,
}: ExpenseTopNavProps) {
  return (
    <div className={cn('bg-gray-900 text-white px-6 py-4', className)}>
      <div className="flex items-center justify-between">
        {/* Left - User Info */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center">
              <span className="text-white font-semibold text-sm">
                {userInfo.initial}
              </span>
            </div>
            <div>
              <p className="text-sm font-medium text-white">
                {userInfo.email}
              </p>
            </div>
          </div>
        </div>

        {/* Center - Navigation */}
        <div className="flex items-center gap-1">
          {navItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onNavClick?.(item.id)}
                className={cn(
                  'flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium transition-colors duration-200',
                  'hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-blue-500',
                  isActive
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-300 hover:text-white'
                )}
              >
                <IconComponent className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>

        {/* Right - Expensify Branding */}
        <div>
          <h2 className="text-lg font-bold text-white">Expensify</h2>
        </div>
      </div>
    </div>
  );
}

export default ExpenseTopNav;