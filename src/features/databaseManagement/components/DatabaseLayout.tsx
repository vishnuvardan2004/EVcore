import React, { useState } from 'react';
import { Outlet, useLocation, Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { 
  Menu, 
  Database, 
  Car, 
  Zap, 
  Cpu, 
  Computer, 
  Building2,
  Users,
  UserCheck,
  BarChart3,
  Settings
} from 'lucide-react';
import { cn } from '@/lib/utils';

const sidebarItems = [
  {
    title: 'Dashboard',
    icon: BarChart3,
    href: '/database',
    description: 'Overview and analytics'
  },
  {
    title: 'Asset Management',
    icon: Database,
    items: [
      {
        title: 'Vehicles',
        icon: Car,
        href: '/database/vehicles',
        description: 'Fleet vehicles and specifications'
      },
      {
        title: 'Charging Equipment',
        icon: Zap,
        href: '/database/charging-equipment',
        description: 'EV charging infrastructure'
      },
      {
        title: 'Electrical Equipment',
        icon: Cpu,
        href: '/database/electrical-equipment',
        description: 'Electrical systems and panels'
      },
      {
        title: 'IT Equipment',
        icon: Computer,
        href: '/database/it-equipment',
        description: 'Computing and network assets'
      },
      {
        title: 'Infrastructure & Furniture',
        icon: Building2,
        href: '/database/infra-furniture',
        description: 'Facilities and office equipment'
      }
    ]
  },
  {
    title: 'Resource Management',
    icon: Users,
    items: [
      {
        title: 'Employees',
        icon: Users,
        href: '/database/employees',
        description: 'Staff and employee records'
      },
      {
        title: 'Pilots',
        icon: UserCheck,
        href: '/database/pilots',
        description: 'Certified pilots and licenses'
      }
    ]
  },
  {
    title: 'Settings',
    icon: Settings,
    href: '/database/settings',
    description: 'Database configuration'
  }
];

interface SidebarContentProps {
  currentPath: string;
  onItemClick?: () => void;
}

const SidebarContent: React.FC<SidebarContentProps> = ({ currentPath, onItemClick }) => {
  const [expandedItems, setExpandedItems] = useState<string[]>(['Asset Management', 'Resource Management']);

  const toggleExpanded = (title: string) => {
    setExpandedItems(prev => 
      prev.includes(title) 
        ? prev.filter(item => item !== title)
        : [...prev, title]
    );
  };

  const renderNavItem = (item: typeof sidebarItems[0]) => {
    const isActive = currentPath === item.href;
    const hasSubItems = 'items' in item && item.items;
    const isExpanded = expandedItems.includes(item.title);

    if (hasSubItems) {
      return (
        <div key={item.title} className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start text-left font-medium"
            onClick={() => toggleExpanded(item.title)}
          >
            <item.icon className="w-4 h-4 mr-3" />
            {item.title}
          </Button>
          {isExpanded && (
            <div className="ml-7 space-y-1">
              {item.items.map((subItem) => {
                const isSubActive = currentPath === subItem.href;
                return (
                  <Link
                    key={subItem.href}
                    to={subItem.href}
                    onClick={onItemClick}
                    className={cn(
                      "flex items-center w-full px-3 py-2 text-sm rounded-md transition-colors",
                      isSubActive
                        ? "bg-blue-100 text-blue-900 font-medium"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                    )}
                  >
                    <subItem.icon className="w-4 h-4 mr-3" />
                    <div>
                      <div>{subItem.title}</div>
                      <div className="text-xs text-gray-500">{subItem.description}</div>
                    </div>
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        key={item.href}
        to={item.href}
        onClick={onItemClick}
        className={cn(
          "flex items-center w-full px-3 py-2 rounded-md transition-colors",
          isActive
            ? "bg-blue-100 text-blue-900 font-medium"
            : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
        )}
      >
        <item.icon className="w-4 h-4 mr-3" />
        <div>
          <div>{item.title}</div>
          <div className="text-xs text-gray-500">{item.description}</div>
        </div>
      </Link>
    );
  };

  return (
    <div className="h-full bg-white border-r border-gray-200">
      <div className="pt-6 pr-6 pb-6 pl-6">
        <div className="flex items-center gap-2 mb-6">
          <Database className="w-6 h-6 text-blue-600" />
          <h2 className="text-lg font-semibold">Master Database</h2>
        </div>
        <nav className="space-y-2">
          {sidebarItems.map(renderNavItem)}
        </nav>
      </div>
    </div>
  );
};

export const DatabaseLayout: React.FC = () => {
  const location = useLocation();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen bg-gray-50 m-0 p-0">
      {/* Desktop Sidebar */}
      <div className="hidden md:flex md:w-80 md:flex-col md:ml-0">
        <SidebarContent currentPath={location.pathname} />
      </div>

      {/* Mobile Sidebar */}
      <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
        <SheetTrigger asChild>
          <Button variant="ghost" size="icon" className="md:hidden fixed top-4 left-4 z-50">
            <Menu className="w-5 h-5" />
          </Button>
        </SheetTrigger>
        <SheetContent side="left" className="w-80 p-0">
          <SidebarContent 
            currentPath={location.pathname} 
            onItemClick={() => setSidebarOpen(false)}
          />
        </SheetContent>
      </Sheet>

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        <main className="flex-1 overflow-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
};
