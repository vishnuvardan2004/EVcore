
import React from 'react';
import { DeploymentStepRenderer } from './DeploymentStepRenderer';
import { useVehicleDeployment } from '../hooks/useVehicleDeployment';

export const VehicleDeploymentForm: React.FC = () => {
  const {
    currentStep,
    selectedVehicle,
    selectedDirection,
    vehicleData,
    tripSummary,
    canGoOut,
    canComeIn,
    handleVehicleDetected,
    handleDirectionSelected,
    handlePurposeSelected,
    handleFormSubmit,
    handleBack,
    resetApp,
  } = useVehicleDeployment();

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Start Deployment</h2>
      
      <DeploymentStepRenderer
        currentStep={currentStep}
        selectedVehicle={selectedVehicle}
        selectedDirection={selectedDirection}
        vehicleData={vehicleData}
        tripSummary={tripSummary}
        canGoOut={canGoOut}
        canComeIn={canComeIn}
        onVehicleDetected={handleVehicleDetected}
        onDirectionSelected={handleDirectionSelected}
        onPurposeSelected={handlePurposeSelected}
        onFormSubmit={handleFormSubmit}
        onBack={handleBack}
        onClose={resetApp}
      />
    </div>
  );
};
