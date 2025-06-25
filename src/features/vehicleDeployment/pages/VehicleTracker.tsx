
import React from 'react';
import { PageLayout } from '../../../shared/components/PageLayout';

const VehicleTracker = () => {
  return (
    <PageLayout 
      title="🚗 Vehicle Deployment Tracker" 
      subtitle="Track vehicle IN/OUT operations"
    >
      <div className="max-w-4xl mx-auto">
        <div className="text-center py-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Vehicle Tracker Coming Soon</h2>
          <p className="text-gray-600">This feature is under development.</p>
        </div>
      </div>
    </PageLayout>
  );
};

export default VehicleTracker;
