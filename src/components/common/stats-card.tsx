import type { LucideIcon } from 'lucide-react';
import { cn } from '@/lib/utils';

// Base Components Level: Foundational UI primitives from @/components/common
// Following component hierarchy: Design Tokens → Base Components

interface StatsCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  iconColor?: 'blue' | 'gray';
  className?: string;
}

export function StatsCard({
  title,
  value,
  icon: Icon,
  iconColor = 'blue',
  className,
}: StatsCardProps) {
  const iconColorClasses = {
    blue: 'text-blue-500',
    gray: 'text-gray-500',
  };

  return (
    <div className={cn(
      "bg-white p-6 rounded-lg border border-gray-200",
      className
    )}>
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm text-gray-600">{title}</p>
          <p className="text-2xl font-bold text-gray-900">{value}</p>
        </div>
        <Icon className={cn("w-8 h-8", iconColorClasses[iconColor])} />
      </div>
    </div>
  );
}

export default StatsCard;