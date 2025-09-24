import { useState, type ComponentType } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Home,
  Settings,
  Users,
  FileText,
  BarChart3,
  Mail,
  Menu,
  X,
} from 'lucide-react';
import * as Collapsible from '@radix-ui/react-collapsible';
import { cn } from '@/lib/utils';

// Removed complex theme system - using design system CSS variables and blue color compliance

export interface ExpandableSidebarItem {
  id: string;
  label: string;
  icon?: ComponentType<{
    className?: string;
  }>;
  href?: string;
  onClick?: () => void;
  badge?: string | number;
  children?: ExpandableSidebarItem[];
  defaultExpanded?: boolean;
}

export interface ExpandableSidebarSection {
  id: string;
  title: string;
  items: ExpandableSidebarItem[];
  defaultExpanded?: boolean;
  icon?: ComponentType<{
    className?: string;
  }>;
}

export interface ExpandableSidebarProps {
  'data-id'?: string;
  sections?: ExpandableSidebarSection[];
  items?: ExpandableSidebarItem[];
  userInfo?: {
    name: string;
    email: string;
    initial: string;
  };
  defaultCollapsed?: boolean;
  defaultActive?: string;
  onItemClick?: (item: ExpandableSidebarItem) => void;
  className?: string;
  title?: string;
}

const defaultSections: ExpandableSidebarSection[] = [
  {
    id: 'navigation',
    title: 'Navigation',
    defaultExpanded: true,
    items: [
      {
        id: 'home',
        label: 'Home',
        icon: Home,
      },
      {
        id: 'users',
        label: 'Users',
        icon: Users,
        badge: '12',
      },
      {
        id: 'documents',
        label: 'Documents',
        icon: FileText,
        children: [
          { id: 'recent', label: 'Recent Documents', icon: FileText },
          { id: 'archived', label: 'Archived', icon: FileText },
          { id: 'shared', label: 'Shared', icon: FileText, badge: '5' },
        ],
      },
    ],
  },
  {
    id: 'analytics',
    title: 'Analytics & Reports',
    defaultExpanded: false,
    items: [
      {
        id: 'analytics',
        label: 'Analytics',
        icon: BarChart3,
        children: [
          { id: 'dashboard', label: 'Dashboard', icon: BarChart3 },
          { id: 'reports', label: 'Reports', icon: FileText },
          { id: 'insights', label: 'Insights', icon: BarChart3 },
        ],
      },
      {
        id: 'messages',
        label: 'Messages',
        icon: Mail,
        badge: '3',
      },
    ],
  },
  {
    id: 'system',
    title: 'System',
    defaultExpanded: false,
    items: [
      {
        id: 'settings',
        label: 'Settings',
        icon: Settings,
        children: [
          { id: 'profile', label: 'Profile Settings', icon: Users },
          { id: 'notifications', label: 'Notifications', icon: Mail },
          { id: 'security', label: 'Security', icon: Settings },
        ],
      },
    ],
  },
];

export function ExpandableSidebar({
  'data-id': dataId,
  sections = defaultSections,
  items = [],
  defaultCollapsed = false,
  className,
  userInfo,
  defaultActive,
  onItemClick,
  title = 'Dashboard',
}: ExpandableSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
  const [activeItem, setActiveItem] = useState<string>(defaultActive || 'home');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [expandedSections, setExpandedSections] = useState<
    Record<string, boolean>
  >(
    sections.reduce(
      (acc, section) => {
        acc[section.id] = section.defaultExpanded ?? false;
        return acc;
      },
      {} as Record<string, boolean>
    )
  );
  const [expandedItems, setExpandedItems] = useState<Record<string, boolean>>(
    {}
  );

  // Using design system CSS variables for consistent styling

  const handleItemClick = (item: ExpandableSidebarItem) => {
    setActiveItem(item.id);
    onItemClick?.(item);
    item.onClick?.();
    setIsMobileMenuOpen(false);
  };

  const toggleSectionExpanded = (sectionId: string) => {
    setExpandedSections((prev) => ({
      ...prev,
      [sectionId]: !prev[sectionId],
    }));
  };

  const toggleItemExpanded = (itemId: string) => {
    setExpandedItems((prev) => ({
      ...prev,
      [itemId]: !prev[itemId],
    }));
  };

  const toggleCollapsed = () => {
    setIsCollapsed(!isCollapsed);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const renderItem = (item: ExpandableSidebarItem, isChild = false) => {
    const IconComponent = item.icon;
    const hasChildren = item.children && item.children.length > 0;
    const isExpanded = expandedItems[item.id];
    const isActive = activeItem === item.id;

    return (
      <div key={item.id}>
        <button
          onClick={() => {
            if (hasChildren) {
              toggleItemExpanded(item.id);
            }
            handleItemClick(item);
          }}
          className={cn(
            'w-full relative flex items-center space-x-3 py-3 rounded-lg text-sm font-medium transition-colors',
            'hover:bg-accent hover:text-accent-foreground',
            'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
            isActive
              ? 'bg-blue-100 text-blue-700 border-blue-500'
              : 'text-muted-foreground',
            isCollapsed
              ? 'md:justify-center md:px-1'
              : 'md:justify-start md:px-3',
            'justify-start px-4',
            isChild ? 'ml-6 py-2' : ''
          )}
          title={isCollapsed ? item.label : undefined}
        >
          {!!IconComponent && (
            <IconComponent
              className={cn(
                'w-5 h-5 flex-shrink-0',
                isChild ? 'w-4 h-4' : 'w-5 h-5'
              )}
            />
          )}
          {(!isCollapsed || isMobileMenuOpen) && (
            <div className="flex items-center justify-between flex-1">
              <span className="text-left">{item.label}</span>
              <div className="flex items-center space-x-2">
                {!!item.badge && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
                {hasChildren &&
                  (isExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  ))}
              </div>
            </div>
          )}
          {isCollapsed && !!item.badge && (
            <span className="bg-blue-100 text-blue-700 text-xs px-1 py-0.5 rounded-full absolute -top-1 -right-1">
              {item.badge}
            </span>
          )}
        </button>

        {/* Child items */}
        {hasChildren && isExpanded && (!isCollapsed || isMobileMenuOpen) && (
          <Collapsible.Root open={isExpanded}>
            <Collapsible.Content className="space-y-1 mt-1">
              {item.children!.map((child) => renderItem(child, true))}
            </Collapsible.Content>
          </Collapsible.Root>
        )}
      </div>
    );
  };

  return (
    <>
      {/* Mobile Hamburger Button */}
      <div className="md:hidden fixed top-4 left-4 z-50">
        <button
          onClick={toggleMobileMenu}
          className={cn(
            'p-3 rounded-lg bg-card border border-border shadow-lg transition-colors',
            'hover:bg-accent hover:text-accent-foreground'
          )}
          aria-label="Toggle menu"
        >
          {isMobileMenuOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Mobile Backdrop */}
      {isMobileMenuOpen && (
        <div
          className="md:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setIsMobileMenuOpen(false)}
        />
      )}

      {/* Sidebar */}
      <div
        data-id={dataId}
        className={cn(
          'flex flex-col h-screen bg-card text-card-foreground border-r border-border transition-all duration-300 ease-in-out',
          isCollapsed ? 'md:w-16' : 'md:w-64',
          'md:relative fixed top-0 left-0 z-50',
          'md:translate-x-0',
          isMobileMenuOpen
            ? 'translate-x-0 w-full'
            : '-translate-x-full w-full',
          className
        )}
      >
        {/* Header */}
        <div
          className={cn(
            'flex items-center justify-between p-4 border-b border-border'
          )}
        >
          {(!isCollapsed || isMobileMenuOpen) && (
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <span className="text-primary-foreground font-semibold text-sm">
                  {title.charAt(0).toUpperCase()}
                </span>
              </div>
              <h2 className="text-lg font-semibold text-foreground">
                {title}
              </h2>
            </div>
          )}

          <button
            onClick={toggleCollapsed}
            className={cn(
              'hidden md:block p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors'
            )}
            aria-label={isCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
          >
            {isCollapsed ? (
              <ChevronRight className="w-4 h-4" />
            ) : (
              <ChevronLeft className="w-4 h-4" />
            )}
          </button>

          <button
            onClick={() => setIsMobileMenuOpen(false)}
            className={cn(
              'md:hidden p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors'
            )}
            aria-label="Close menu"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-4 overflow-y-auto">
          {/* Render standalone items first */}
          {items.map((item) => renderItem(item))}

          {/* Render sections */}
          {sections.map((section) => {
            const SectionIcon = section.icon;
            const isSectionExpanded = expandedSections[section.id];

            return (
              <div key={section.id} className="space-y-2">
                {/* Section Header */}
                <button
                  onClick={() => toggleSectionExpanded(section.id)}
                  className={cn(
                    'w-full flex items-center justify-between py-2 px-2 rounded-lg text-sm font-semibold transition-colors',
                    'bg-blue-50 text-blue-700 hover:bg-blue-100',
                    'focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2',
                    !isCollapsed || isMobileMenuOpen
                      ? 'flex'
                      : 'hidden md:hidden'
                  )}
                >
                  <div className="flex items-center space-x-2">
                    {!!SectionIcon && <SectionIcon className="w-4 h-4" />}
                    <span>{section.title}</span>
                  </div>
                  {isSectionExpanded ? (
                    <ChevronUp className="w-4 h-4" />
                  ) : (
                    <ChevronDown className="w-4 h-4" />
                  )}
                </button>

                {/* Section Items */}
                <Collapsible.Root open={isSectionExpanded || isCollapsed}>
                  <Collapsible.Content className="space-y-1">
                    {section.items.map((item) => renderItem(item))}
                  </Collapsible.Content>
                </Collapsible.Root>
              </div>
            );
          })}
        </nav>

        {/* Footer */}
        {(!isCollapsed || isMobileMenuOpen) && !!userInfo && (
          <div className={cn('p-4 border-t border-border')}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-muted rounded-full flex items-center justify-center">
                <span className="text-muted-foreground text-base font-medium">
                  {userInfo.initial}
                </span>
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-base font-medium text-foreground truncate">
                  {userInfo.name}
                </p>
                <p className="text-sm text-muted-foreground truncate">
                  {userInfo.email}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
