
import React, { useEffect } from 'react';
import { AppHeader } from '../components/AppHeader';
import { VehicleDeploymentForm } from '../components/VehicleDeploymentForm';
import { DashboardLayout } from '../components/DashboardLayout';
import { AppFooter } from '../components/AppFooter';

const Index = () => {
  useEffect(() => {
    // Initialize database
    console.log('Vehicle Deployment Tracker initialized');
  }, []);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <AppHeader />
        <VehicleDeploymentForm />
        <DashboardLayout />
        <AppFooter />
      </div>
    </div>
  );
};

export default Index;
