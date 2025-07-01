
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  BarChart, 
  FileText, 
  Settings,
  Globe,
  FileCheck,
  LogOut
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarHeader,
  SidebarFooter
} from '@/components/ui/sidebar';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';

const menuItems = [
  {
    title: "Dashboard",
    url: "/",
    icon: Home,
    description: "EVCORE Home"
  },
  {
    title: "Smart Widgets",
    url: "/smart-widgets",
    icon: BarChart,
    description: "Real-time metrics"
  },
  {
    title: "Global Reports",
    url: "/global-reports",
    icon: FileText,
    description: "Platform reports"
  },
  {
    title: "Admin Settings",
    url: "/admin-toggle",
    icon: Settings,
    description: "Module management"
  },
  {
    title: "Language",
    url: "/language",
    icon: Globe,
    description: "Language settings"
  },
  {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: FileCheck,
    description: "System activity"
  }
];

export const NavigationSidebar: React.FC = () => {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();

  const handleLinkClick = () => {
    setOpenMobile(false);
  };

  const handleLogout = () => {
    logout();
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r border-sidebar-border bg-sidebar">
      <SidebarHeader>
        <div className="px-4 py-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-sidebar-accent rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-sidebar-accent-foreground">E</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-sidebar-foreground">
                EVZIP
              </h2>
              <p className="text-sm text-sidebar-foreground/70">
                EVCORE Platform
              </p>
            </div>
          </div>
          {user && (
            <div className="bg-sidebar-accent/10 rounded-lg p-3">
              <p className="text-sm font-medium text-sidebar-foreground">
                {user.role === 'admin' ? 'Administrator' : 'Supervisor'}
              </p>
              <p className="text-xs text-sidebar-foreground/60">
                Access Level: {user.role}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="mx-2"
                  >
                    <Link 
                      to={item.url}
                      onClick={handleLinkClick}
                      className={`evzip-sidebar-item ${location.pathname === item.url ? 'active' : ''}`}
                    >
                      <item.icon className="w-5 h-5" />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs opacity-70">
                          {item.description}
                        </span>
                      </div>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4">
          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg"
          >
            <LogOut className="w-5 h-5" />
            <span className="font-medium">Sign Out</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
