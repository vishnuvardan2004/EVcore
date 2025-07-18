import React, { useState } from 'react';
import { VehicleDeploymentSidebar } from './vehicleDeploymentSidebar';

interface VehicleTrackerLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export const VehicleTrackerLayout: React.FC<VehicleTrackerLayoutProps> = ({ 
  children, 
  title, 
  subtitle 
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div className="min-h-screen flex w-full bg-gray-50">
      {/* Sidebar with collapsed state */}
      <VehicleDeploymentSidebar collapsed={collapsed} />
      <main className="flex-1 flex flex-col">
        {/* Sidebar trigger button */}
        <button
          className="m-4 p-2 rounded bg-gray-200 hover:bg-gray-300 w-8"
          onClick={() => setCollapsed(!collapsed)}
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? '➡️' : '⬅️'}
        </button>
        <div className="flex-1 p-6">
          {children}
        </div>
      </main>
    </div>
  );
};
