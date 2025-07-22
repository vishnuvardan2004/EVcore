import React, { useState } from 'react';
import { DatabaseNavigationSidebar } from './DatabaseNavigationSidebar';
import { Button } from '@/components/ui/button';
import { Menu, X } from 'lucide-react';

interface DatabaseLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const DatabaseLayout: React.FC<DatabaseLayoutProps> = ({
  children,
  title,
  subtitle
}) => {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="relative h-full bg-gray-50 flex">
      {/* Database Sidebar */}
      <div className={`
        relative transform transition-all duration-300 ease-in-out bg-white border-r border-gray-200
        ${sidebarOpen ? 'w-64' : 'w-0'}
        overflow-hidden
      `}>
        <DatabaseNavigationSidebar />
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header with Hamburger */}
        <header className="bg-white border-b border-gray-200 px-4 py-4 lg:px-6 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              {/* Database Hamburger Button */}
              <Button
                variant="outline"
                size="sm"
                onClick={() => setSidebarOpen(!sidebarOpen)}
                className="flex items-center gap-2 bg-white shadow-sm border border-gray-200 hover:bg-gray-50"
              >
                {sidebarOpen ? (
                  <X className="w-4 h-4" />
                ) : (
                  <Menu className="w-4 h-4" />
                )}
                <span className="hidden sm:inline text-xs">
                  {sidebarOpen ? 'Hide Menu' : ''}
                </span>
              </Button>
              
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-sm text-gray-600">{subtitle}</p>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
};
