import React from 'react';
import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { SidebarTrigger } from '@/components/ui/sidebar';

export const FloatingMenuButton: React.FC = () => {
  return (
    <div className="fixed top-4 left-4 z-50">
      <SidebarTrigger asChild>
        <Button
          variant="default"
          size="icon"
          className="h-10 w-10 bg-primary hover:bg-primary/90 shadow-lg"
        >
          <Menu className="h-5 w-5" />
        </Button>
      </SidebarTrigger>
    </div>
  );
};
