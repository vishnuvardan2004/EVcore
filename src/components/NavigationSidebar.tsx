
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
        className="mx-2 h-auto p-3"
      >
        <Link 
          to={item.url}
          onClick={handleLinkClick}
          className={`flex items-center gap-3 w-full transition-all ${
            isActive(item.url) 
              ? 'bg-blue-600 text-white border border-blue-500 rounded-lg' 
              : 'text-white hover:bg-gray-800 hover:text-blue-300 rounded-lg'
          }`}
        >
          <item.icon className={`w-5 h-5 shrink-0 ${
            isActive(item.url) ? 'text-white' : 'text-white'
          }`} />
          <div className="text-left flex-1">
            <div className={`font-semibold text-sm ${
              isActive(item.url) ? 'text-white' : 'text-white'
            }`}>{item.title}</div>
            <div className={`text-xs font-medium ${
              isActive(item.url) ? 'text-blue-100' : 'text-gray-300'
            }`}>{item.description}</div>
          </div>
        </Link>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );

  return (
    <Sidebar className="border-r border-gray-200 bg-gray-900 sidebar-no-scrollbar">
      <SidebarHeader>
        <div className="p-4 border-b border-gray-700">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-600 rounded-xl flex items-center justify-center">
              <span className="text-xl font-bold text-white">E</span>
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">
                EVZIP
              </h2>
              <p className="text-sm font-medium text-white">
                EVCORE Platform
              </p>
            </div>
          </div>
          {user && (
            <div className="bg-gray-800 rounded-lg p-3 mt-4">
              <p className="text-sm font-bold text-white">
                {user.role === 'admin' ? 'Administrator' : 'Supervisor'}
              </p>
              <p className="text-xs font-medium text-white">
                Access Level: {user.role}
              </p>
            </div>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent className="overflow-y-auto sidebar-no-scrollbar">
        {/* Core Platform */}
        <SidebarGroup>
          <div className="px-4 py-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              Core Platform
            </h3>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* System */}
        <SidebarGroup>
          <div className="px-4 py-2">
            <h3 className="text-xs font-bold text-white uppercase tracking-wider">
              System
            </h3>
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {systemItems.map(renderMenuItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <div className="p-4 border-t border-gray-700">
          <Button 
            onClick={handleLogout}
            variant="ghost"
            className="w-full justify-start gap-3 text-white hover:text-red-300 hover:bg-red-900/20 rounded-lg h-auto p-3"
          >
            <LogOut className="w-5 h-5 text-white" />
            <div className="text-left">
              <div className="font-semibold text-sm text-white">Sign Out</div>
              <div className="text-xs font-medium text-white">Exit platform</div>
            </div>
          </Button>
          <div className="text-center mt-3">
            <p className="text-xs font-medium text-white">
              EVCORE Platform v1.0
            </p>
          </div>
        </div>
      </SidebarFooter>
    </Sidebar>
  );
};
