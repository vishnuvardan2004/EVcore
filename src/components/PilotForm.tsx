import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Camera } from 'lucide-react';
import { ChecklistSection } from './ChecklistSection';
import { DriverChecklist, VehicleChecklist } from '../types/vehicle';
import { useCamera } from '../hooks/useCamera';

interface PilotFormProps {
  direction: 'OUT' | 'IN';
  onSubmit: (data: any) => void;
  onBack: () => void;
  previousData?: any;
}

export const PilotForm: React.FC<PilotFormProps> = ({ 
  direction, 
  onSubmit, 
  onBack,
  previousData 
}) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    pilotId: previousData?.outData?.pilotId || '',
    location: previousData?.outData?.location || '',
    odometer: previousData?.inData ? 0 : (previousData?.outData?.odometer || 0),
    returnOdometer: previousData?.outData?.odometer || 0,
    batteryCharge: previousData?.outData?.batteryCharge || 0,
    range: previousData?.outData?.range || 0,
    supervisorName: '',
    notes: previousData?.outData?.notes || '',
  });

  const [driverChecklist, setDriverChecklist] = useState<DriverChecklist>({
    idCard: false,
    uniform: false,
    shoes: false,
    groomed: false,
  });

  const [vehicleChecklist, setVehicleChecklist] = useState<VehicleChecklist>({
    fireExtinguisher: false,
    stepney: false,
    carFreshener: false,
    cleaningCloth: false,
    umbrella: false,
    torch: false,
    toolkit: false,
    spanner: false,
    medicalKit: false,
    carCharger: false,
    jack: false,
    lightsWorking: false,
    tyrePressure: false,
    wheelCaps: false,
    wiperWater: false,
    cleanliness: false,
    antenna: false,
    acWorking: false,
    mobileCable: false,
    mobileAdapter: false,
    phoneStand: false,
    hornWorking: false,
    damages: '',
  });

  const [vehiclePhotos, setVehiclePhotos] = useState<string[]>([]);
  const [driverPhoto, setDriverPhoto] = useState<string>('');
  const [checklistMismatches, setChecklistMismatches] = useState<string[]>([]);

  const { startCamera, capturedImage, resetCapture } = useCamera();

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleDriverChecklistChange = (checklist: DriverChecklist | VehicleChecklist) => {
    setDriverChecklist(checklist as DriverChecklist);
  };

  const handleVehicleChecklistChange = (checklist: DriverChecklist | VehicleChecklist) => {
    setVehicleChecklist(checklist as VehicleChecklist);
  };

  const handleScanSupervisor = () => {
    const mockSupervisorName = `SUP-${Math.floor(Math.random() * 999)}`;
    setFormData(prev => ({ ...prev, supervisorName: mockSupervisorName }));
  };

  const captureDriverPhoto = () => {
    startCamera();
    setTimeout(() => {
      const mockPhoto = `data:image/jpeg;base64,mockDriverPhoto${Date.now()}`;
      setDriverPhoto(mockPhoto);
    }, 2000);
  };

  const captureVehiclePhoto = () => {
    startCamera();
    setTimeout(() => {
      const mockPhoto = `data:image/jpeg;base64,mockVehiclePhoto${Date.now()}`;
      setVehiclePhotos(prev => [...prev, mockPhoto]);
    }, 2000);
  };

  const detectMismatches = () => {
    if (!previousData?.outData?.vehicleChecklist) return [];
    
    const outChecklist = previousData.outData.vehicleChecklist;
    const mismatches: string[] = [];
    
    Object.keys(vehicleChecklist).forEach(key => {
      if (key !== 'damages' && outChecklist[key] && !vehicleChecklist[key as keyof VehicleChecklist]) {
        mismatches.push(key);
      }
    });
    
    return mismatches;
  };

  const getTotalSteps = () => {
    if (direction === 'OUT') return 3; // Driver info, Driver checklist, Vehicle section
    return 2; // Vehicle return, Mismatch detection
  };

  const handleNext = () => {
    if (direction === 'IN' && currentStep === 1) {
      const mismatches = detectMismatches();
      setChecklistMismatches(mismatches);
    }
    setCurrentStep(prev => Math.min(prev + 1, getTotalSteps()));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 1));
  };

  const handleSubmit = () => {
    if (direction === 'OUT') {
      onSubmit({
        outData: {
          pilotId: formData.pilotId,
          location: formData.location,
          odometer: Number(formData.odometer),
          batteryCharge: Number(formData.batteryCharge),
          range: Number(formData.range),
          supervisorName: formData.supervisorName,
          driverPhoto,
          vehiclePhotos,
          driverChecklist,
          vehicleChecklist,
          notes: formData.notes,
        }
      });
    } else {
      onSubmit({
        inData: {
          returnOdometer: Number(formData.returnOdometer),
          vehiclePhotos,
          inSupervisorName: formData.supervisorName,
          vehicleChecklist,
          checklistMismatches,
        }
      });
    }
  };

  const renderStep = () => {
    if (direction === 'OUT') {
      switch (currentStep) {
        case 1:
          return (
            <Card className="p-6">
              <h3 className="text-lg font-semibold mb-4">Driver Information</h3>
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="pilotId">Pilot ID *</Label>
                  <Input
                    id="pilotId"
                    value={formData.pilotId}
                    onChange={(e) => handleInputChange('pilotId', e.target.value)}
                    placeholder="Enter pilot ID"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location">Location *</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange('location', e.target.value)}
                    placeholder="Enter location"
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label>Driver Photo (Optional)</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={captureDriverPhoto}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    {driverPhoto ? 'Retake Photo' : 'Capture Driver Photo'}
                  </Button>
                  {driverPhoto && (
                    <div className="text-sm text-green-600">✓ Photo captured</div>
                  )}
                </div>
              </div>
            </Card>
          );

        case 2:
          return (
            <ChecklistSection
              type="driver"
              checklist={driverChecklist}
              onChange={handleDriverChecklistChange}
            />
          );

        case 3:
          return (
            <div className="space-y-6">
              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Vehicle Information</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="odometer">ODO *</Label>
                    <Input
                      id="odometer"
                      type="number"
                      value={formData.odometer}
                      onChange={(e) => handleInputChange('odometer', Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="batteryCharge">Charge % *</Label>
                    <Input
                      id="batteryCharge"
                      type="number"
                      min="0"
                      max="100"
                      value={formData.batteryCharge}
                      onChange={(e) => handleInputChange('batteryCharge', Number(e.target.value))}
                      required
                    />
                  </div>
                  
                  <div className="space-y-2">
                    <Label htmlFor="range">Range (KM) *</Label>
                    <Input
                      id="range"
                      type="number"
                      value={formData.range}
                      onChange={(e) => handleInputChange('range', Number(e.target.value))}
                      required
                    />
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label>Vehicle Photos</Label>
                  <Button
                    type="button"
                    variant="outline"
                    onClick={captureVehiclePhoto}
                    className="w-full"
                  >
                    <Camera className="w-4 h-4 mr-2" />
                    Capture Vehicle Photo ({vehiclePhotos.length})
                  </Button>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="supervisorName">Supervised By *</Label>
                  <div className="flex gap-2">
                    <Input
                      id="supervisorName"
                      value={formData.supervisorName}
                      onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                      placeholder="Enter supervisor name"
                      required
                    />
                    <Button
                      type="button"
                      variant="outline"
                      onClick={handleScanSupervisor}
                      className="px-3"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                <div className="mt-4 space-y-2">
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    value={formData.notes}
                    onChange={(e) => handleInputChange('notes', e.target.value)}
                    placeholder="Additional notes..."
                    rows={3}
                  />
                </div>
              </Card>

              <ChecklistSection
                type="vehicle"
                checklist={vehicleChecklist}
                onChange={handleVehicleChecklistChange}
              />
            </div>
          );

        default:
          return null;
      }
    } else {
      // IN Flow
      switch (currentStep) {
        case 1:
          return (
            <div className="space-y-6">
              {previousData && (
                <Card className="p-4 bg-gray-50">
                  <h3 className="font-medium mb-2">Previous OUT Data</h3>
                  <p>Pilot ID: {previousData.outData?.pilotId}</p>
                  <p>Location: {previousData.outData?.location}</p>
                  <p>OUT Odometer: {previousData.outData?.odometer} km</p>
                </Card>
              )}

              <Card className="p-6">
                <h3 className="text-lg font-semibold mb-4">Vehicle Return</h3>
                <div className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="returnOdometer">Return Odometer Reading *</Label>
                    <Input
                      id="returnOdometer"
                      type="number"
                      value={formData.returnOdometer}
                      onChange={(e) => handleInputChange('returnOdometer', Number(e.target.value))}
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label>Post-Trip Vehicle Photos</Label>
                    <Button
                      type="button"
                      variant="outline"
                      onClick={captureVehiclePhoto}
                      className="w-full"
                    >
                      <Camera className="w-4 h-4 mr-2" />
                      Capture Vehicle Photo ({vehiclePhotos.length})
                    </Button>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="inSupervisorName">IN Supervisor Name *</Label>
                    <div className="flex gap-2">
                      <Input
                        id="inSupervisorName"
                        value={formData.supervisorName}
                        onChange={(e) => handleInputChange('supervisorName', e.target.value)}
                        placeholder="Enter supervisor name"
                        required
                      />
                      <Button
                        type="button"
                        variant="outline"
                        onClick={handleScanSupervisor}
                        className="px-3"
                      >
                        <Camera className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>

              <ChecklistSection
                type="vehicle"
                checklist={vehicleChecklist}
                onChange={handleVehicleChecklistChange}
              />
            </div>
          );

        case 2:
          return (
            <div className="space-y-6">
              <ChecklistSection
                type="vehicle"
                checklist={vehicleChecklist}
                onChange={handleVehicleChecklistChange}
                mismatches={checklistMismatches}
                showMismatches={true}
              />

              {checklistMismatches.length > 0 && (
                <Card className="p-4 bg-red-50 border-red-200">
                  <h3 className="font-medium text-red-800 mb-2">Checklist Mismatches Detected</h3>
                  <ul className="text-sm text-red-700 space-y-1">
                    {checklistMismatches.map(mismatch => (
                      <li key={mismatch}>• {mismatch.replace(/([A-Z])/g, ' $1').toLowerCase()}</li>
                    ))}
                  </ul>
                </Card>
              )}
            </div>
          );

        default:
          return null;
      }
    }
  };

  const isStepValid = () => {
    if (direction === 'OUT') {
      switch (currentStep) {
        case 1:
          return formData.pilotId && formData.location;
        case 2:
          return true; // Driver checklist is optional
        case 3:
          return formData.odometer > 0 && formData.supervisorName;
        default:
          return false;
      }
    } else {
      switch (currentStep) {
        case 1:
          return formData.returnOdometer > 0 && formData.supervisorName;
        case 2:
          return true; // Final review step
        default:
          return false;
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold">
          Pilot Purpose - {direction} Form
        </h2>
        <p className="text-sm text-gray-600">
          Step {currentStep} of {getTotalSteps()}
        </p>
      </div>

      {renderStep()}

      <div className="flex gap-4">
        {currentStep > 1 && (
          <Button type="button" variant="outline" onClick={handlePrevious} className="flex-1">
            Previous
          </Button>
        )}
        
        {currentStep === 1 && (
          <Button type="button" variant="outline" onClick={onBack} className="flex-1">
            Back
          </Button>
        )}

        {currentStep < getTotalSteps() ? (
          <Button 
            type="button" 
            onClick={handleNext} 
            disabled={!isStepValid()} 
            className="flex-1"
          >
            Next
          </Button>
        ) : (
          <Button 
            type="button" 
            onClick={handleSubmit} 
            disabled={!isStepValid()} 
            className="flex-1"
          >
            Submit {direction}
          </Button>
        )}
      </div>
    </div>
  );
};
