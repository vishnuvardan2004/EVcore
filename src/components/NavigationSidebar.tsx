
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
    title: "Home",
    url: "/",
    icon: Home,
    description: "EVCORE Dashboard"
  },
  {
    title: "Smart Widgets Dashboard",
    url: "/smart-widgets",
    icon: BarChart,
    description: "Real-time metrics and widgets"
  },
  {
    title: "Global Reports",
    url: "/global-reports",
    icon: FileText,
    description: "Export and view platform reports"
  },
  {
    title: "Admin Module Toggle",
    url: "/admin-toggle",
    icon: Settings,
    description: "Enable/disable platform modules"
  },
  {
    title: "Language Selector",
    url: "/language",
    icon: Globe,
    description: "Choose your language"
  },
  {
    title: "Audit Logs",
    url: "/audit-logs",
    icon: FileCheck,
    description: "View system activity logs"
  }
];

export const NavigationSidebar: React.FC = () => {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();
  const { user, logout } = useAuth();

  const handleLinkClick = () => {
    // Auto-collapse sidebar on mobile after link click
    setOpenMobile(false);
  };

  const handleLogout = () => {
    logout();
    setOpenMobile(false);
  };

  return (
    <Sidebar className="border-r">
      <SidebarHeader>
        <div className="px-4 py-3">
          <h2 className="text-lg font-semibold text-sidebar-foreground">
            🌐 EVCORE Platform
          </h2>
          {user && (
            <p className="text-sm text-sidebar-foreground/70 mt-1">
              Logged in as: {user.role === 'admin' ? 'Admin' : 'Supervisor'}
            </p>
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
                  >
                    <Link 
                      to={item.url}
                      onClick={handleLinkClick}
                      className="flex items-center gap-3 px-3 py-2 rounded-lg transition-colors"
                    >
                      <item.icon className="w-5 h-5" />
                      <div className="flex flex-col">
                        <span className="font-medium">{item.title}</span>
                        <span className="text-xs text-sidebar-foreground/70">
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
        <div className="p-4 border-t border-sidebar-border">
          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <LogOut className="w-5 h-5" />
            <span>Logout</span>
          </Button>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
