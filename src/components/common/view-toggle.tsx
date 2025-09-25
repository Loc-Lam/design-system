import { List, Grid3X3, MoreHorizontal } from 'lucide-react';
import { cn } from '@/lib/utils';

// Base Components Level: Foundational UI primitives
// Following component hierarchy: Design Tokens → Base → Layout → Composite
// Blue color system compliance: Using blue variants instead of gray

export type ViewMode = 'list' | 'grid' | 'detailed';

interface ViewOption {
  value: ViewMode;
  icon: React.ComponentType<{ className?: string }>;
  title: string;
}

const defaultViewOptions: ViewOption[] = [
  {
    value: 'list',
    icon: List,
    title: 'List View',
  },
  {
    value: 'grid',
    icon: Grid3X3,
    title: 'Grid View',
  },
  {
    value: 'detailed',
    icon: MoreHorizontal,
    title: 'Detailed View',
  },
];

export interface ViewToggleProps {
  currentView: ViewMode;
  onViewChange: (view: ViewMode) => void;
  options?: ViewOption[];
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const sizeClasses = {
  sm: 'p-1.5',
  md: 'p-2',
  lg: 'p-2.5',
};

const iconSizes = {
  sm: 'w-3 h-3',
  md: 'w-4 h-4',
  lg: 'w-5 h-5',
};

export function ViewToggle({
  currentView,
  onViewChange,
  options = defaultViewOptions,
  className,
  size = 'md',
}: ViewToggleProps) {
  return (
    <div className={cn(
      'flex items-center border border-blue-200 rounded-lg bg-white',
      className
    )}>
      {options.map((option, index) => {
        const IconComponent = option.icon;
        const isActive = currentView === option.value;
        const isFirst = index === 0;
        const isLast = index === options.length - 1;

        return (
          <button
            key={option.value}
            onClick={() => onViewChange(option.value)}
            className={cn(
              'transition-colors duration-200',
              'hover:bg-blue-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-inset',
              sizeClasses[size],
              isFirst && 'rounded-l-lg',
              isLast && 'rounded-r-lg',
              isActive
                ? 'bg-blue-500 text-white hover:bg-blue-600'
                : 'text-blue-600 hover:text-blue-700'
            )}
            title={option.title}
            aria-label={option.title}
            aria-pressed={isActive}
          >
            <IconComponent className={iconSizes[size]} />
          </button>
        );
      })}
    </div>
  );
}

export default ViewToggle;