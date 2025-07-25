// Database Management Feature - Quick Test Component

import React from 'react';
import { DatabaseDashboard } from './DatabaseDashboard';
import { VehicleManagement } from './VehicleManagement';
import { ChargingEquipmentManagement } from './ChargingEquipmentManagement';
import { EmployeeManagement } from './EmployeeManagement';

export const DatabaseTest: React.FC = () => {
  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Database Management Test</h1>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Dashboard</h2>
        <DatabaseDashboard />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Vehicle Management</h2>
        <VehicleManagement />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Charging Equipment</h2>
        <ChargingEquipmentManagement />
      </div>
      
      <div className="mb-8">
        <h2 className="text-xl font-semibold mb-2">Employee Management</h2>
        <EmployeeManagement />
      </div>
    </div>
  );
};
