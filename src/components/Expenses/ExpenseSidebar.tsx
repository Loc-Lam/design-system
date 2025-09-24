import { useState } from 'react';
import {
  FileText,
  BarChart3,
  Lightbulb,
  Settings,
  CreditCard,
  HelpCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import type { ComponentType } from 'react';

// Feature Components Level: Business logic components with specific functionality
// Following component hierarchy: Base → Layout → Composite → Feature

interface ExpenseNavItem {
  id: string;
  label: string;
  icon: ComponentType<{ className?: string }>;
  href?: string;
  onClick?: () => void;
  isActive?: boolean;
}

interface ExpenseSidebarProps {
  userInfo: {
    name: string;
    email: string;
    initial: string;
  };
  onItemClick?: (item: ExpenseNavItem) => void;
  activeItem?: string;
  className?: string;
}

const navigationItems: ExpenseNavItem[] = [
  {
    id: 'expenses',
    label: 'Expenses',
    icon: FileText,
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

export function ExpenseSidebar({
  userInfo,
  onItemClick,
  activeItem = 'expenses',
  className,
}: ExpenseSidebarProps) {
  const [selectedItem, setSelectedItem] = useState<string>(activeItem);

  const handleItemClick = (item: ExpenseNavItem) => {
    setSelectedItem(item.id);
    onItemClick?.(item);
    item.onClick?.();
  };

  return (
    <div
      className={cn(
        'flex flex-col h-screen bg-card text-card-foreground border-r border-border w-64 flex-shrink-0',
        className
      )}
    >
      {/* Header */}
      <div className="flex items-center p-6 border-b border-border">
        <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
          <span className="text-primary-foreground font-semibold text-lg">
            {userInfo.initial}
          </span>
        </div>
        <div className="ml-3">
          <p className="text-sm font-medium text-foreground truncate">
            {userInfo.name}
          </p>
          <p className="text-xs text-muted-foreground truncate">
            {userInfo.email}
          </p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 py-6">
        <ul className="space-y-2">
          {navigationItems.map((item) => {
            const IconComponent = item.icon;
            const isActive = selectedItem === item.id;

            return (
              <li key={item.id}>
                <button
                  onClick={() => handleItemClick(item)}
                  className={cn(
                    'w-full flex items-center px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200',
                    'hover:bg-accent hover:text-accent-foreground focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    isActive
                      ? 'bg-blue-100 text-blue-700 border-blue-500'
                      : 'text-muted-foreground hover:text-foreground'
                  )}
                >
                  <IconComponent className="w-5 h-5 mr-3 flex-shrink-0" />
                  <span className="text-left">{item.label}</span>
                </button>
              </li>
            );
          })}
        </ul>
      </nav>

      {/* Cash Back Section */}
      <div className="px-4 pb-4">
        <div className="bg-blue-100 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center">
            <CreditCard className="w-5 h-5 text-blue-600 mr-2" />
            <div>
              <p className="text-xs text-blue-700 font-medium">Cash Back</p>
              <p className="text-lg text-blue-700 font-bold">$0</p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Branding */}
      <div className="px-4 pb-6">
        <div className="text-center">
          <h2 className="text-xl font-bold text-foreground">Expensify</h2>
        </div>
      </div>
    </div>
  );
}

export default ExpenseSidebar;