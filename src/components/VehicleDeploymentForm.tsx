
import React, { useState, useEffect } from 'react';
import { VehicleScanner } from './VehicleScanner';
import { DirectionSelector } from './DirectionSelector';
import { PurposeSelector } from './PurposeSelector';
import { OfficeForm } from './OfficeForm';
import { PilotForm } from './PilotForm';
import { TripSummary } from './TripSummary';
import { vehicleService } from '../services/database';
import { Vehicle, Deployment, TripSummary as TripSummaryType } from '../types/vehicle';
import { calculateDuration } from '../utils/reportGenerator';
import { useToast } from '../hooks/use-toast';

type AppStep = 
  | 'scanner' 
  | 'direction' 
  | 'purpose' 
  | 'office-form' 
  | 'pilot-form' 
  | 'summary';

export const VehicleDeploymentForm: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<AppStep>('scanner');
  const [selectedVehicle, setSelectedVehicle] = useState<string>('');
  const [selectedDirection, setSelectedDirection] = useState<'OUT' | 'IN' | null>(null);
  const [selectedPurpose, setSelectedPurpose] = useState<'Office' | 'Pilot' | null>(null);
  const [vehicleData, setVehicleData] = useState<Vehicle | null>(null);
  const [tripSummary, setTripSummary] = useState<TripSummaryType | null>(null);
  const { toast } = useToast();

  const handleVehicleDetected = async (vehicleNumber: string) => {
    setSelectedVehicle(vehicleNumber);
    console.log('Vehicle detected:', vehicleNumber);
    
    try {
      const vehicle = await vehicleService.getVehicle(vehicleNumber);
      setVehicleData(vehicle || null);
      setCurrentStep('direction');
    } catch (error) {
      console.error('Error fetching vehicle data:', error);
      setCurrentStep('direction');
    }
  };

  const handleDirectionSelected = (direction: 'OUT' | 'IN') => {
    setSelectedDirection(direction);
    console.log('Direction selected:', direction);
    
    if (direction === 'OUT') {
      setCurrentStep('purpose');
    } else {
      // For IN, use the purpose from the last OUT deployment
      const lastOutPurpose = vehicleData?.currentDeployment?.purpose || 'Office';
      setSelectedPurpose(lastOutPurpose);
      setCurrentStep(lastOutPurpose.toLowerCase() + '-form' as AppStep);
    }
  };

  const handlePurposeSelected = (purpose: 'Office' | 'Pilot') => {
    setSelectedPurpose(purpose);
    console.log('Purpose selected:', purpose);
    setCurrentStep(purpose.toLowerCase() + '-form' as AppStep);
  };

  const handleFormSubmit = async (formData: any) => {
    console.log('Form submitted:', formData);
    
    try {
      const deploymentId = `${selectedVehicle}-${Date.now()}`;
      const timestamp = new Date().toISOString();
      
      if (selectedDirection === 'OUT') {
        const deployment: Deployment = {
          id: deploymentId,
          vehicleNumber: selectedVehicle,
          direction: 'OUT',
          purpose: selectedPurpose!,
          outTimestamp: timestamp,
          outData: formData.outData,
        };
        
        await vehicleService.createDeployment(deployment);
        
        toast({
          title: "Success",
          description: `Vehicle ${selectedVehicle} marked as OUT`,
        });
        
        resetApp();
      } else {
        // Handle IN flow
        if (vehicleData?.currentDeployment) {
          const updatedDeployment: Partial<Deployment> = {
            inTimestamp: timestamp,
            inData: formData.inData,
            duration: Math.floor((new Date().getTime() - new Date(vehicleData.currentDeployment.outTimestamp!).getTime()) / (1000 * 60)),
            totalKms: formData.inData.returnOdometer - vehicleData.currentDeployment.outData!.odometer,
          };
          
          await vehicleService.updateDeployment(vehicleData.currentDeployment.id, updatedDeployment);
          
          // Generate trip summary
          const summary: TripSummaryType = {
            vehicleNumber: selectedVehicle,
            outDateTime: new Date(vehicleData.currentDeployment.outTimestamp!).toLocaleString(),
            inDateTime: new Date(timestamp).toLocaleString(),
            totalDuration: calculateDuration(vehicleData.currentDeployment.outTimestamp!, timestamp),
            totalKms: updatedDeployment.totalKms!,
            mismatches: formData.inData.checklistMismatches || [],
            outSupervisor: vehicleData.currentDeployment.outData?.supervisorName || '',
            inSupervisor: formData.inData.inSupervisorName,
            purpose: vehicleData.currentDeployment.purpose,
          };
          
          setTripSummary(summary);
          setCurrentStep('summary');
          
          toast({
            title: "Success",
            description: `Vehicle ${selectedVehicle} marked as IN`,
          });
        }
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      toast({
        title: "Error",
        description: "Failed to submit form. Please try again.",
        variant: "destructive",
      });
    }
  };

  const resetApp = () => {
    setCurrentStep('scanner');
    setSelectedVehicle('');
    setSelectedDirection(null);
    setSelectedPurpose(null);
    setVehicleData(null);
    setTripSummary(null);
  };

  const handleBack = () => {
    switch (currentStep) {
      case 'direction':
        setCurrentStep('scanner');
        break;
      case 'purpose':
        setCurrentStep('direction');
        break;
      case 'office-form':
      case 'pilot-form':
        if (selectedDirection === 'OUT') {
          setCurrentStep('purpose');
        } else {
          setCurrentStep('direction');
        }
        break;
      case 'summary':
        resetApp();
        break;
      default:
        resetApp();
    }
  };

  const canGoOut = !vehicleData || vehicleData.status === 'IN';
  const canComeIn = vehicleData && vehicleData.status === 'OUT' && Boolean(vehicleData.currentDeployment);

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-8">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Start Deployment</h2>
      
      {currentStep === 'scanner' && (
        <VehicleScanner onVehicleDetected={handleVehicleDetected} />
      )}

      {currentStep === 'direction' && (
        <DirectionSelector
          vehicleNumber={selectedVehicle}
          canGoOut={canGoOut}
          canComeIn={canComeIn}
          onDirectionSelected={handleDirectionSelected}
        />
      )}

      {currentStep === 'purpose' && (
        <PurposeSelector onPurposeSelected={handlePurposeSelected} />
      )}

      {currentStep === 'office-form' && (
        <OfficeForm
          direction={selectedDirection!}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
          previousData={vehicleData?.currentDeployment}
        />
      )}

      {currentStep === 'pilot-form' && (
        <PilotForm
          direction={selectedDirection!}
          onSubmit={handleFormSubmit}
          onBack={handleBack}
          previousData={vehicleData?.currentDeployment}
        />
      )}

      {currentStep === 'summary' && tripSummary && (
        <TripSummary summary={tripSummary} onClose={resetApp} />
      )}
    </div>
  );
};
