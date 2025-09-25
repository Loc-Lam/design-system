import { useState } from 'react';
import {
  Home,
  FileText,
  BarChart3,
  TrendingUp,
  Settings,
  HelpCircle,
  CreditCard,
  ChevronDown,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// Layout Components Level: Structural patterns and containers
// Following component hierarchy: Design Tokens → Base → Layout → Composite

export interface ExpenseSidebarProps {
  className?: string;
  userInfo?: {
    name: string;
    email: string;
    avatar?: string;
    initials: string;
  };
  activeItem?: string;
  onItemClick?: (itemId: string) => void;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  badge?: string | number;
  children?: NavItem[];
}

const navigationItems: NavItem[] = [
  {
    id: 'home',
    label: 'Home',
    icon: Home,
  },
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
    icon: TrendingUp,
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
  className,
  userInfo,
  activeItem = 'expenses',
  onItemClick,
}: ExpenseSidebarProps) {
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>({});

  const handleItemClick = (itemId: string) => {
    onItemClick?.(itemId);
  };

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems(prev => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const renderNavItem = (item: NavItem) => {
    const IconComponent = item.icon;
    const isActive = activeItem === item.id;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            handleItemClick(item.id);
            if (hasChildren) {
              toggleItemExpanded(item.id);
            }
          }}
          className={cn(
            'w-full flex items-center justify-between px-4 py-3 text-sm font-medium rounded-lg transition-colors',
            'hover:bg-white/10',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-slate-800',
            isActive
              ? 'bg-blue-600 text-white shadow-lg'
              : 'text-gray-300 hover:text-white'
          )}
        >
          <div className="flex items-center space-x-3">
            <IconComponent className="w-5 h-5" />
            <span>{item.label}</span>
          </div>
          <div className="flex items-center space-x-2">
            {item.badge && (
              <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                {item.badge}
              </span>
            )}
            {hasChildren && (
              isExpanded ? (
                <ChevronDown className="w-4 h-4" />
              ) : (
                <ChevronRight className="w-4 h-4" />
              )
            )}
          </div>
        </button>

        {/* Child items */}
        {hasChildren && isExpanded && (
          <div className="ml-8 mt-1 space-y-1">
            {item.children!.map((child) => (
              <button
                key={child.id}
                onClick={() => handleItemClick(child.id)}
                className={cn(
                  'w-full flex items-center justify-between px-4 py-2 text-sm rounded-lg transition-colors',
                  'hover:bg-white/10',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500',
                  activeItem === child.id
                    ? 'bg-blue-600 text-white'
                    : 'text-gray-400 hover:text-white'
                )}
              >
                <div className="flex items-center space-x-3">
                  <child.icon className="w-4 h-4" />
                  <span>{child.label}</span>
                </div>
                {child.badge && (
                  <span className="bg-blue-500 text-white text-xs px-2 py-1 rounded-full">
                    {child.badge}
                  </span>
                )}
              </button>
            ))}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={cn(
      'flex flex-col h-screen w-64 bg-slate-800 text-white border-r border-slate-700',
      className
    )}>
      {/* User Profile Section */}
      {userInfo && (
        <div className="flex items-center space-x-3 p-4 border-b border-slate-700">
          <div className="w-10 h-10 rounded-full bg-purple-600 flex items-center justify-center">
            {userInfo.avatar ? (
              <img
                src={userInfo.avatar}
                alt={userInfo.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <span className="text-white font-semibold text-sm">
                {userInfo.initials}
              </span>
            )}
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-white truncate">
              {userInfo.email}
            </p>
          </div>
        </div>
      )}

      {/* Navigation Items */}
      <nav className="flex-1 px-4 py-6 space-y-2 overflow-y-auto">
        {navigationItems.map(renderNavItem)}
      </nav>

      {/* Cash Back Section */}
      <div className="p-4 border-t border-slate-700">
        <button
          onClick={() => handleItemClick('cash-back')}
          className={cn(
            'w-full flex items-center space-x-3 px-4 py-3 text-sm font-medium rounded-lg transition-colors',
            'bg-blue-600 hover:bg-blue-700 text-white',
            'focus:outline-none focus:ring-2 focus:ring-blue-500'
          )}
        >
          <CreditCard className="w-5 h-5" />
          <span>Cash Back</span>
          <span className="ml-auto text-xs bg-white/20 px-2 py-1 rounded">
            $0
          </span>
        </button>
      </div>

      {/* Branding */}
      <div className="p-4 border-t border-slate-700">
        <div className="text-center">
          <h2 className="text-lg font-bold text-white">Expensify</h2>
        </div>
      </div>
    </div>
  );
}

export default ExpenseSidebar;