
import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from '../../../shared/components/ui/sidebar';
import { Battery, History, BarChart3, Home } from 'lucide-react';

const menuItems = [
  {
    title: 'Charging Tracker',
    url: '/charging-tracker',
    icon: Battery,
    description: 'Start/End charging sessions'
  },
  {
    title: 'Charging History',
    url: '/charging-history',
    icon: History,
    description: 'View all charging sessions'
  },
  {
    title: 'Charging Summary',
    url: '/charging-summary',
    icon: BarChart3,
    description: 'Analytics and reports'
  },
  {
    title: 'Back to Dashboard',
    url: '/',
    icon: Home,
    description: 'Return to main dashboard'
  }
];

export function ChargingNavigationSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  return (
    <Sidebar>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="text-lg font-semibold text-gray-900 mb-2">
            ⚡ Charging Tracker
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton 
                    asChild
                    isActive={location.pathname === item.url}
                    className="flex items-center gap-3 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <button
                      onClick={() => navigate(item.url)}
                      className="w-full text-left"
                    >
                      <item.icon className="w-5 h-5" />
                      <div>
                        <span className="font-medium">{item.title}</span>
                        <p className="text-xs text-gray-500">{item.description}</p>
                      </div>
                    </button>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
