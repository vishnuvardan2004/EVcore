
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, Battery, MapPin } from 'lucide-react';
import { VehicleInfoCard } from './VehicleInfoCard';

interface StartChargingData {
  odoReading: string;
  chargePercent: string;
  range: string;
  location: 'HUB' | 'Outside';
  brand: string;
  locationName: string;
}

interface StartChargingFormProps {
  vehicleNumber: string;
  pilotId: string;
  startData: StartChargingData;
  onStartDataChange: (data: StartChargingData) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const StartChargingForm: React.FC<StartChargingFormProps> = ({
  vehicleNumber,
  pilotId,
  startData,
  onStartDataChange,
  onSubmit,
  onBack
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <VehicleInfoCard vehicleNumber={vehicleNumber} pilotId={pilotId} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Battery className="w-5 h-5 text-green-600" />
            Start Charging Session
          </CardTitle>
          <CardDescription>
            Record initial readings before starting the charging process
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label htmlFor="odoReading">ODO Reading</Label>
              <Input
                id="odoReading"
                type="number"
                placeholder="Enter ODO reading"
                value={startData.odoReading}
                onChange={(e) => onStartDataChange({ ...startData, odoReading: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startChargePercent">Charge %</Label>
              <Input
                id="startChargePercent"
                type="number"
                min="0"
                max="100"
                placeholder="0-100%"
                value={startData.chargePercent}
                onChange={(e) => onStartDataChange({ ...startData, chargePercent: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startRange">Range (km)</Label>
              <Input
                id="startRange"
                type="number"
                placeholder="Enter range"
                value={startData.range}
                onChange={(e) => onStartDataChange({ ...startData, range: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-4">
            <Label className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Charging Location
            </Label>
            <RadioGroup
              value={startData.location}
              onValueChange={(value: 'HUB' | 'Outside') => onStartDataChange({ ...startData, location: value })}
            >
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="HUB" id="hub" />
                <Label htmlFor="hub">🏢 HUB</Label>
              </div>
              <div className="flex items-center space-x-2">
                <RadioGroupItem value="Outside" id="outside" />
                <Label htmlFor="outside">🌍 Outside</Label>
              </div>
            </RadioGroup>
          </div>

          {startData.location === 'Outside' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
              <div className="space-y-2">
                <Label htmlFor="brand">Brand</Label>
                <Input
                  id="brand"
                  placeholder="Enter charging station brand"
                  value={startData.brand}
                  onChange={(e) => onStartDataChange({ ...startData, brand: e.target.value })}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                  id="locationName"
                  placeholder="Enter location name"
                  value={startData.locationName}
                  onChange={(e) => onStartDataChange({ ...startData, locationName: e.target.value })}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={onBack} variant="outline" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={onSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
              Start Charging Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
