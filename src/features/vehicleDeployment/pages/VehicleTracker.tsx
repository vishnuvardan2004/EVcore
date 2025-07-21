import React from 'react';
import { PageLayout } from '../../../components/PageLayout';
import { VehicleDeploymentForm } from '../components/VehicleDeploymentForm';
import { RecentVehicleActivities } from '../components/RecentVehicleActivities';
import { LiveDeploymentStatus } from '../components/LiveDeploymentStatus';

const VehicleTracker = () => {
  return (
    <PageLayout 
      title="🚗 Vehicle Deployment Tracker" 
      subtitle="Track vehicle IN/OUT operations"
    >
      <div className="space-y-6">
        {/* Main deployment form */}
        <VehicleDeploymentForm />
        
        {/* Two-column grid for Recent Activities and Live Status */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentVehicleActivities />
          <LiveDeploymentStatus />
        </div>
      </div>
    </PageLayout>
  );
};

export default VehicleTracker;
