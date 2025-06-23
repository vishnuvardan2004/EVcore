
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Car, User } from 'lucide-react';

interface AccessData {
  vehicleNumber: string;
  pilotId: string;
}

interface AccessFormProps {
  accessData: AccessData;
  onAccessDataChange: (data: AccessData) => void;
  onSubmit: () => void;
  onStartFlow: () => void;
  onEndFlow: () => void;
}

export const AccessForm: React.FC<AccessFormProps> = ({
  accessData,
  onAccessDataChange,
  onSubmit,
  onStartFlow,
  onEndFlow
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="text-4xl mb-4">⚡</div>
          <CardTitle className="text-2xl">Vehicle Charging Tracker</CardTitle>
          <CardDescription>
            Enter vehicle and pilot information to start tracking charging sessions
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="vehicleNumber" className="flex items-center gap-2">
              <Car className="w-4 h-4" />
              Vehicle Number
            </Label>
            <Input
              id="vehicleNumber"
              placeholder="Enter vehicle number"
              value={accessData.vehicleNumber}
              onChange={(e) => onAccessDataChange({ ...accessData, vehicleNumber: e.target.value })}
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="pilotId" className="flex items-center gap-2">
              <User className="w-4 h-4" />
              Pilot ID / Incharge ID
            </Label>
            <Input
              id="pilotId"
              placeholder="Enter pilot or incharge ID"
              value={accessData.pilotId}
              onChange={(e) => onAccessDataChange({ ...accessData, pilotId: e.target.value })}
            />
          </div>

          <Button onClick={onSubmit} className="w-full">
            Continue
          </Button>

          {accessData.vehicleNumber && accessData.pilotId && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">Select Action</h3>
                <p className="text-sm text-gray-600">Choose to start or end a charging session</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={onStartFlow} className="bg-green-600 hover:bg-green-700">
                  🔋 Start Charging
                </Button>
                <Button onClick={onEndFlow} className="bg-red-600 hover:bg-red-700">
                  🔌 End Charging
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
