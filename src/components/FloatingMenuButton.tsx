import React from 'react';
import { Menu, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger, useSidebar } from '@/components/ui/sidebar';

export const FloatingMenuButton: React.FC = () => {
  const { open } = useSidebar();
  
  return (
    <div className={`fixed top-4 z-50 transition-all duration-300 ease-in-out ${
      open ? 'left-[calc(16rem+1rem)]' : 'left-4'
    }`}>
      <SidebarTrigger className="h-10 w-10 bg-white shadow-lg border border-gray-200 hover:bg-gray-50 hover:shadow-xl transition-all">
        {open ? (
          <X className="h-5 w-5 text-gray-800" />
        ) : (
          <Menu className="h-5 w-5 text-gray-800" />
        )}
      </SidebarTrigger>
    </div>
  );
};
