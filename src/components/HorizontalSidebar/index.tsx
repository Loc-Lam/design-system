import { useState, type ComponentType } from 'react';
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  BarChart3,
  Bell,
  Settings,
  ChevronDown,
} from 'lucide-react';
import { cn } from '@/lib/utils';

export interface HorizontalSidebarItem {
  id: string;
  label: string;
  icon?: ComponentType<{
    className?: string;
  }>;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  hasNotification?: boolean;
}

export interface HorizontalSidebarProps {
  'data-id'?: string;
  items?: HorizontalSidebarItem[];
  defaultActive?: string;
  onItemClick?: (item: HorizontalSidebarItem) => void;
  className?: string;
  logo?: {
    text: string;
    className?: string;
  };
  actions?: {
    notifications?: {
      count?: number;
      onClick?: () => void;
    };
    settings?: {
      onClick?: () => void;
    };
  };
}

const defaultItems: HorizontalSidebarItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard',
    icon: LayoutDashboard,
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: FolderKanban,
  },
  {
    id: 'team',
    label: 'Team',
    icon: Users,
  },
  {
    id: 'reports',
    label: 'Reports',
    icon: BarChart3,
  },
];

export function HorizontalSidebar({
  'data-id': dataId,
  items = defaultItems,
  defaultActive,
  onItemClick,
  className,
  logo = { text: 'Company' },
  actions,
}: HorizontalSidebarProps) {
  const [activeItem, setActiveItem] = useState<string>(
    defaultActive || items[0]?.id || 'dashboard'
  );

  const handleItemClick = (item: HorizontalSidebarItem) => {
    setActiveItem(item.id);
    onItemClick?.(item);
    item.onClick?.();
  };

  return (
    <nav
      data-id={dataId}
      className={cn(
        'w-full bg-card border-b border-border px-6 py-3',
        'flex items-center justify-between',
        'shadow-sm',
        className
      )}
    >
      {/* Left Section: Logo + Navigation */}
      <div className="flex items-center space-x-8">
        {/* Logo/Company Name */}
        <div className="flex items-center">
          <h1
            className={cn(
              'text-xl font-semibold text-foreground',
              logo.className
            )}
          >
            {logo.text}
          </h1>
        </div>

        {/* Navigation Items */}
        <div className="hidden md:flex items-center space-x-6">
          {items.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  'flex items-center space-x-2 px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-blue-500'
                    : 'text-muted-foreground hover:text-foreground'
                )}
                title={item.label}
              >
                {IconComponent && (
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="hidden lg:block">{item.label}</span>
                {item.badge && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Right Section: Actions */}
      <div className="flex items-center space-x-4">
        {/* Notifications */}
        {actions?.notifications && (
          <button
            onClick={actions.notifications.onClick}
            className={cn(
              'relative p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
            title="Notifications"
          >
            <Bell className="w-5 h-5" />
            {actions.notifications.count && actions.notifications.count > 0 && (
              <span className="absolute -top-1 -right-1 w-3 h-3 bg-blue-100 rounded-full flex items-center justify-center border border-blue-500">
                <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
              </span>
            )}
          </button>
        )}

        {/* Settings */}
        {actions?.settings && (
          <button
            onClick={actions.settings.onClick}
            className={cn(
              'p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
            title="Settings"
          >
            <Settings className="w-5 h-5" />
          </button>
        )}

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button
            className={cn(
              'p-2 text-muted-foreground hover:text-foreground hover:bg-accent rounded-lg transition-colors',
              'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            )}
            title="Menu"
          >
            <ChevronDown className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Mobile Navigation - Dropdown */}
      <div className="md:hidden absolute top-full left-0 right-0 bg-card border-b border-border shadow-lg hidden">
        <div className="px-6 py-4 space-y-2">
          {items.map((item) => {
            const IconComponent = item.icon;
            const isActive = activeItem === item.id;

            return (
              <button
                key={item.id}
                onClick={() => handleItemClick(item)}
                className={cn(
                  'w-full flex items-center space-x-3 px-3 py-2 text-sm font-medium rounded-lg transition-colors text-left',
                  'hover:bg-accent hover:text-accent-foreground',
                  'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                  isActive
                    ? 'bg-blue-100 text-blue-700 border-blue-500'
                    : 'text-muted-foreground hover:text-foreground'
                )}
              >
                {IconComponent && (
                  <IconComponent className="w-5 h-5 flex-shrink-0" />
                )}
                <span className="flex-1">{item.label}</span>
                {item.badge && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

export default HorizontalSidebar;