
import React from 'react';
import { SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar';
import { ChargingNavigationSidebar } from './ChargingNavigationSidebar';
import { Menu } from 'lucide-react';

interface ChargingTrackerLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const ChargingTrackerLayout: React.FC<ChargingTrackerLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-gray-50">
        <ChargingNavigationSidebar />
        <main className="flex-1 flex flex-col">
          <div className="flex items-center gap-4 p-4 bg-white border-b border-gray-200">
            <SidebarTrigger className="h-8 w-8 hover:bg-gray-100 rounded-md flex items-center justify-center">
              <Menu className="h-5 w-5" />
            </SidebarTrigger>
            {title && (
              <div>
                <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                {subtitle && (
                  <p className="text-gray-600 text-sm">{subtitle}</p>
                )}
              </div>
            )}
          </div>
          <div className="flex-1 p-6">
            {children}
          </div>
        </main>
      </div>
    </SidebarProvider>
  );
};
