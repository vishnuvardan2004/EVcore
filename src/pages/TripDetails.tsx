
import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { TripDetailsProvider } from '../contexts/TripDetailsContext';
import { TripDetailsForm } from '../components/trip-details/TripDetailsForm';

const TripDetails = () => {
  return (
    <TripDetailsProvider>
      <PageLayout 
        title="🚘 Driver Trip Details" 
        subtitle="Complete trip logging and shift management system"
      >
        <div className="max-w-4xl mx-auto">
          <TripDetailsForm />
        </div>
      </PageLayout>
    </TripDetailsProvider>
  );
};

export default TripDetails;
