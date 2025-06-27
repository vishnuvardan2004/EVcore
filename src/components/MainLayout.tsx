
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header with sidebar trigger */}
      <header className="h-12 flex items-center border-b bg-white px-4">
        <SidebarTrigger className="h-8 w-8" />
        <div className="ml-4">
          <span className="text-lg font-semibold text-gray-900">EVCORE Platform</span>
        </div>
      </header>
      
      {/* Main content */}
      <main className="flex-1 overflow-auto">
        {children}
      </main>
    </div>
  );
};
