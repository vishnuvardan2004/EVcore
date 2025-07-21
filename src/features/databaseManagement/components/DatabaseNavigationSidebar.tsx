import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Database, 
  Car, 
  UserCheck, 
  Users, 
  Building2,
  BarChart3,
  FileText
} from 'lucide-react';
import { cn } from '@/lib/utils';

interface NavigationItem {
  id: string;
  label: string;
  icon: React.ElementType;
  href: string;
  description: string;
}

const navigationItems: NavigationItem[] = [
  {
    id: 'dashboard',
    label: 'Database Overview',
    icon: Database,
    href: '/database',
    description: 'Main database dashboard and statistics'
  },
  {
    id: 'vehicles',
    label: 'Vehicles',
    icon: Car,
    href: '/database/vehicles',
    description: 'Vehicle registry and specifications'
  },
  {
    id: 'pilots',
    label: 'Pilots',
    icon: UserCheck,
    href: '/database/pilots',
    description: 'Pilot profiles and certifications'
  },
  {
    id: 'customers',
    label: 'Customers',
    icon: Users,
    href: '/database/customers',
    description: 'Customer database and profiles'
  },
  {
    id: 'staff',
    label: 'Staff',
    icon: Building2,
    href: '/database/staff',
    description: 'Staff management (General, Admin, Supervisors)'
  },
  {
    id: 'analytics',
    label: 'Data Analytics',
    icon: BarChart3,
    href: '/database/analytics',
    description: 'Database insights and reports'
  }
];

export const DatabaseNavigationSidebar: React.FC = () => {
  const location = useLocation();

  const isActiveRoute = (href: string) => {
    if (href === '/database') {
      return location.pathname === '/database';
    }
    return location.pathname.startsWith(href);
  };

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-full flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-100 rounded-lg">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-gray-900">Database</h2>
            <p className="text-sm text-gray-600">Management System</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navigationItems.map((item) => {
          const Icon = item.icon;
          const isActive = isActiveRoute(item.href);

          return (
            <Link
              key={item.id}
              to={item.href}
              className={cn(
                'flex items-center gap-3 p-3 rounded-lg transition-all duration-200 group',
                isActive
                  ? 'bg-blue-50 text-blue-700 border border-blue-200'
                  : 'text-gray-700 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <Icon 
                className={cn(
                  'w-5 h-5 transition-colors',
                  isActive ? 'text-blue-600' : 'text-gray-500 group-hover:text-gray-700'
                )} 
              />
              <div className="flex-1">
                <div className={cn(
                  'font-medium text-sm',
                  isActive ? 'text-blue-700' : 'text-gray-900'
                )}>
                  {item.label}
                </div>
                <div className={cn(
                  'text-xs leading-tight',
                  isActive ? 'text-blue-600' : 'text-gray-500'
                )}>
                  {item.description}
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <FileText className="w-4 h-4" />
          <span>6 Database Modules</span>
        </div>
      </div>
    </div>
  );
};
