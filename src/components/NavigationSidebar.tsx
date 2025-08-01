
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
  }
];

const systemItems = [
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

  const isActive = (url: string) => {
    if (url === '/') {
      return location.pathname === '/';
    }
    return location.pathname.startsWith(url);
  };

  const renderMenuItem = (item: any) => (
    <SidebarMenuItem key={item.title}>
      <SidebarMenuButton 
        asChild
        isActive={isActive(item.url)}
        className="mx-2 h-auto p-0"
      >
        <Link 
          to={item.url}
          onClick={handleLinkClick}
          className={`flex items-center gap-4 w-full p-3 rounded-2xl transition-all duration-200 ${
            isActive(item.url) 
              ? 'bg-gradient-to-r from-blue-600 to-purple-600 text-white shadow-lg shadow-blue-500/25' 
              : 'text-gray-300 hover:bg-gray-700/50 hover:text-white'
          }`}
        >
          <item.icon className="w-5 h-5 shrink-0" />
          <div className="text-left flex-1">
            <div className="font-semibold text-sm">{item.title}</div>
            <div className="text-xs opacity-80">{item.description}</div>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className="border-r border-gray-700/50 bg-gradient-to-br from-gray-900 via-gray-800 to-black sidebar-no-scrollbar backdrop-blur-xl">
      <SidebarHeader>
        <div className="p-6 border-b border-gray-700/50">
          <div className="flex items-center gap-4">
            <div className="relative">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl flex items-center justify-center shadow-lg">
                <span className="text-xl font-bold text-white">⚡</span>
              </div>
              <div className="absolute -top-1 -right-1 w-4 h-4 bg-green-400 rounded-full animate-pulse"></div>
            </div>
            <div>
              <h2 className="text-xl font-black bg-gradient-to-r from-white to-blue-200 bg-clip-text text-transparent">
                EVZIP
              </h2>
              <p className="text-sm text-blue-400 font-medium">
                EVCORE Platform
              </p>
            </div>
          </div>
          {user && (
            <div className="mt-6 bg-gradient-to-r from-gray-800/50 to-gray-700/50 rounded-2xl p-4 border border-gray-600/30">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-500 to-purple-500 rounded-xl flex items-center justify-center">
                  <span className="text-white text-sm font-bold">
                    {user.role.charAt(0).toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-sm font-bold text-white">
                    {user.role === 'admin' ? 'Administrator' : 'Supervisor'}
                  </p>
                  <p className="text-xs text-blue-400">
                    Access Level: {user.role}
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto sidebar-no-scrollbar py-6">
        {/* Core Platform */}
        <SidebarGroup>
          <div className="px-4 py-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Core Platform
            </h3>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {menuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup className="mt-8">
          <div className="px-4 py-2">
            <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              System
            </h3>
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="space-y-2">
              {systemItems
                .filter(item => {
                  // Only show Admin Settings to super admins
                  if (item.title === "Admin Settings") {
                    return user?.role === 'super-admin';
                  }
                  return true;
                })
                .map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t border-gray-700/50">
          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-4 text-gray-300 hover:text-red-300 hover:bg-red-900/20 rounded-2xl h-auto p-3 transition-all duration-200"
          >
            <LogOut className="w-5 h-5" />
            <div className="text-left flex-1">
              <div className="font-semibold text-sm">Sign Out</div>
              <div className="text-xs opacity-80">Exit platform</div>
            </div>
          </Button>
          <div className="text-center mt-4">
            <p className="text-xs text-gray-500">
              EVCORE Platform v3.0
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
