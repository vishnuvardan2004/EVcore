
import React, { useEffect } from 'react';
import { VehicleTrackerLayout } from '../components/VehicleTrackerLayout';
import { VehicleDeploymentForm } from '../components/VehicleDeploymentForm';
import { DashboardLayout } from '../components/DashboardLayout';
import { AppFooter } from '../components/AppFooter';

const VehicleTracker = () => {
  useEffect(() => {
    // Initialize database
    console.log('Vehicle Deployment Tracker initialized');
  }, []);

  return (
    <VehicleTrackerLayout 
      title="🚗 Vehicle Deployment Tracker" 
      subtitle="Track vehicle IN/OUT movements with comprehensive logging"
    >
      <div className="space-y-6">
        <VehicleDeploymentForm />
        <DashboardLayout />
        <AppFooter />
      </div>
    </VehicleTrackerLayout>
  );
};

export default VehicleTracker;
