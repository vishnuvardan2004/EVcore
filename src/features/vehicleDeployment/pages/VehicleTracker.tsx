import React from 'react';
// Update the import path below to the correct location of PageLayout, for example:
import { PageLayout } from '../../../components/PageLayout';
// Or, if PageLayout is not created yet, create the file at the expected path.
import { VehicleDeploymentForm } from '../components/VehicleDeploymentForm';

const VehicleTracker = () => {
  return (
    <PageLayout 
      title="🚗 Vehicle Deployment Tracker" 
      subtitle="Track vehicle IN/OUT operations"
    >
      <VehicleDeploymentForm />
    </PageLayout>
  );
};

export default VehicleTracker;
