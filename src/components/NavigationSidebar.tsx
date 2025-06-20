
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  Home, 
  FileText, 
  BarChart, 
  Users, 
  AlertTriangle, 
  User, 
  Settings 
} from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from '@/components/ui/sidebar';

const menuItems = [
  {
    title: "Home",
    url: "/",
    icon: Home,
    description: "Quick actions and dashboard"
  },
  {
    title: "Ride History",
    url: "/history",
    icon: FileText,
    description: "Full searchable IN/OUT log"
  },
  {
    title: "Reports",
    url: "/reports",
    icon: BarChart,
    description: "Trip summaries and exports"
  },
  {
    title: "Live Deployment",
    url: "/live-status",
    icon: Users,
    description: "Currently deployed vehicles"
  },
  {
    title: "Alerts & Mismatches",
    url: "/alerts",
    icon: AlertTriangle,
    description: "Checklist issues and alerts"
  },
  {
    title: "Profile",
    url: "/profile",
    icon: User,
    description: "User profile and login"
  },
  {
    title: "Settings",
    url: "/settings",
    icon: Settings,
    description: "Admin controls and configuration"
  }
];

export const NavigationSidebar: React.FC = () => {
  const location = useLocation();
  const { setOpenMobile } = useSidebar();

  const handleLinkClick = () => {
    // Auto-collapse sidebar on mobile after link click
    setOpenMobile(false);
  };

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <div className="px-4 py-3 border-b border-sidebar-border">
            <h2 className="text-lg font-semibold text-sidebar-foreground">
              🚗 Vehicle Tracker
            </h2>
          </div>
          <SidebarGroupContent className="pt-4">
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
    </Sidebar>
  );
};
