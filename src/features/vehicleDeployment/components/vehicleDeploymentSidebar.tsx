import React from 'react';

interface SidebarProps {
  collapsed: boolean;
}

export const VehicleDeploymentSidebar: React.FC<SidebarProps> = ({ collapsed }) => {
  return (
    <aside className={`bg-white border-r p-4 transition-all duration-300 ${collapsed ? 'w-16' : 'w-64'}`}>
      {!collapsed && (
        <>
          <h3 className="font-bold mb-4 text-lg">Vehicle Deployment</h3>
          <nav>
            <ul className="space-y-2">
              <li>
                <a href="#deploy" className="block py-2 px-3 rounded hover:bg-gray-100">Deploy Vehicle</a>
              </li>
              <li>
                <a href="#history" className="block py-2 px-3 rounded hover:bg-gray-100">Deployment History</a>
              </li>
              <li>
                <a href="#status" className="block py-2 px-3 rounded hover:bg-gray-100">Current Status</a>
              </li>
            </ul>
          </nav>
        </>
      )}
    </aside>
  );
};