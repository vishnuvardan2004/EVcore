
import React from 'react';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="flex-1 flex flex-col">
      {/* Header with EVZIP theme */}
      <header className="evzip-navbar h-16 flex items-center px-6 shadow-sm">
        <SidebarTrigger className="h-8 w-8 text-primary-foreground hover:bg-primary-foreground/10" />
        <div className="ml-6 flex items-center gap-3">
          <div className="w-8 h-8 bg-accent rounded-lg flex items-center justify-center">
            <span className="text-sm font-bold text-accent-foreground">E</span>
          </div>
          <div>
            <span className="text-lg font-bold text-primary-foreground">EVZIP</span>
            <span className="text-sm text-primary-foreground/70 ml-2">Internal Platform</span>
          </div>
        </div>
      </header>
      
      {/* Main content with EVZIP background */}
      <main className="flex-1 overflow-auto bg-background">
        {children}
      </main>
    </div>
  );
};
