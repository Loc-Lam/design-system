import React, { useState, type ComponentType } from "react";
import {
	ChevronLeft,
	ChevronRight,
	Home,
	Settings,
	Users,
	FileText,
	BarChart3,
	Mail,
	Menu,
	X,
} from "lucide-react";
import * as Collapsible from "@radix-ui/react-collapsible";
import { cn } from "@/lib/utils";
export interface SidebarItem {
	id: string;
	label: string;
	icon?: ComponentType<{
		className?: string;
	}>;
	href?: string;
	onClick?: () => void;
	badge?: string | number;
	children?: SidebarItem[];
}
export interface SidebarProps {
  'data-id'?: string;
  items?: SidebarItem[];

  userInfo?: {
    name: string;
    email: string;
    initial: string;
  };
  defaultCollapsed?: boolean;
  defaultActive?: string;
  onItemClick?: (item: SidebarItem) => void;
  className?: string;
}
const defaultItems: SidebarItem[] = [
	{
		id: "home",
		label: "Home",
		icon: Home,
	},
	{
		id: "users",
		label: "Users",
		icon: Users,
		badge: "12",
	},
	{
		id: "documents",
		label: "Documents",
		icon: FileText,
	},
	{
		id: "analytics",
		label: "Analytics",
		icon: BarChart3,
	},
	{
		id: "messages",
		label: "Messages",
		icon: Mail,
		badge: "3",
	},
	{
		id: "settings",
		label: "Settings",
		icon: Settings,
	},
];
export function Sidebar({
		"data-id": dataId,
		items = defaultItems,
		defaultCollapsed = false,
		className,
		userInfo,
		defaultActive,
		onItemClick,
	}: SidebarProps) {
		const [isCollapsed, setIsCollapsed] = useState(defaultCollapsed);
		const [activeItem, setActiveItem] = useState<string>(defaultActive || "home");
		const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
		const handleItemClick = (item: SidebarItem) => {
			setActiveItem(item.id);
			onItemClick?.(item);
			item.onClick?.();
			// Close mobile menu when item is clicked
			setIsMobileMenuOpen(false);
		};
		const toggleCollapsed = () => {
			setIsCollapsed(!isCollapsed);
		};
		const toggleMobileMenu = () => {
			setIsMobileMenuOpen(!isMobileMenuOpen);
		};
		// Safe check for window availability
		const isMobile = typeof window !== "undefined" && window.innerWidth < 768;
		return (
			<>
				{/* Mobile Hamburger Button Only */}
				<div className="md:hidden fixed top-4 left-4 z-50">
					<button
						onClick={toggleMobileMenu}
						className="p-3 rounded-lg bg-card border border-border shadow-lg hover:bg-accent hover:text-accent-foreground transition-colors"
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
						"flex flex-col h-screen bg-card border-r border-border transition-all duration-300 ease-in-out",
						isCollapsed ? "md:w-16" : "md:w-64",
						// Mobile styles - full screen overlay
						"md:relative fixed top-0 left-0 z-50",
						"md:translate-x-0",
						isMobileMenuOpen
							? "translate-x-0 w-full"
							: "-translate-x-full w-full",
						className,
					)}
				>
					{/* Header */}
					<div className="flex items-center justify-between p-4 border-b border-border">
						{(!isCollapsed || isMobileMenuOpen) && (
							<div className="flex items-center space-x-2">
								<div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
									<span className="text-primary-foreground font-semibold text-sm">
										S
									</span>
								</div>
								<h2 className="text-lg font-semibold text-foreground">
									Sidebar
								</h2>
							</div>
						)}
						{/* Hide collapse button on mobile */}
						<button
							onClick={toggleCollapsed}
							className="hidden md:block p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
							aria-label={isCollapsed ? "Expand sidebar" : "Collapse sidebar"}
						>
							{isCollapsed ? (
								<ChevronRight className="w-4 h-4" />
							) : (
								<ChevronLeft className="w-4 h-4" />
							)}
						</button>
						{/* Close button for mobile full screen */}
						<button
							onClick={() => setIsMobileMenuOpen(false)}
							className="md:hidden p-2 rounded-lg hover:bg-accent hover:text-accent-foreground transition-colors"
							aria-label="Close menu"
						>
							<X className="w-5 h-5" />
						</button>
					</div>
					{/* Navigation */}
					<nav className="flex-1 p-4 space-y-2 overflow-y-auto">
						{items.map((item) => {
							const IconComponent = item.icon;
							return (
        <div key={item.id}>
          <button
            onClick={() => handleItemClick(item)}
            className={cn(
              'w-full relative flex items-center space-x-3 py-3 rounded-lg text-sm font-medium transition-colors',
              'hover:bg-accent hover:text-accent-foreground',
              'focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2',
              activeItem === item.id
                ? 'bg-blue-100 text-blue-700 border-blue-500'
                : 'text-muted-foreground',
              // Desktop collapsed styles
              isCollapsed
                ? 'md:justify-center md:px-1'
                : 'md:justify-start md:px-3',
              // Mobile always expanded with more padding
              'justify-start px-4'
            )}
            title={isCollapsed ? item.label : undefined}
          >
            {!!IconComponent && (
              <IconComponent className="w-6 h-6 flex-shrink-0" />
            )}
            {/* Show label on mobile or when desktop is not collapsed */}
            {!isCollapsed || isMobileMenuOpen ? (
              <div
                className={cn(
                  'flex items-center justify-between flex-1',
                  !isCollapsed || isMobileMenuOpen ? 'md:flex' : 'md:hidden'
                )}
              >
                <span className="text-left text-base">{item.label}</span>
                {!!item.badge && (
                  <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full">
                    {item.badge}
                  </span>
                )}
              </div>
            ) : (
              !!item.badge && (
                <span className="bg-blue-100 text-blue-700 text-xs px-2 py-1 rounded-full absolute top-0 left-[6px]">
                  {item.badge}
                </span>
              )
            )}
          </button>
          {/* Submenu items */}
          {item.children &&
            (!isCollapsed || isMobile) &&
            activeItem === item.id && (
              <Collapsible.Root defaultOpen className="mt-2">
                <Collapsible.Content className="space-y-1 ml-8">
                  {item.children.map((child) => {
                    const ChildIconComponent = child.icon;
                    return (
                      <button
                        key={child.id}
                        onClick={() => handleItemClick(child)}
                        className="w-full flex items-center space-x-3 px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                      >
                        <ChildIconComponent className="w-5 h-5 flex-shrink-0" />
                        <span className="flex-1 text-left">{child.label}</span>
                      </button>
                    );
                  })}
                </Collapsible.Content>
              </Collapsible.Root>
            )}
        </div>
      );
						})}
					</nav>
					{/* Footer */}
					{(!isCollapsed || isMobile) && !!userInfo && (
						<div
							className={cn(
								"p-4 border-t border-border",
								"block",
								"md:hidden",
								!isCollapsed && "md:block",
							)}
						>
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
