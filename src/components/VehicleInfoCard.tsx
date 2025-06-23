
import React from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Car, User } from 'lucide-react';

interface VehicleInfoCardProps {
  vehicleNumber: string;
  pilotId: string;
}

export const VehicleInfoCard: React.FC<VehicleInfoCardProps> = ({ 
  vehicleNumber, 
  pilotId 
}) => {
  return (
    <Card className="bg-blue-50 border-blue-200">
      <CardContent className="pt-6">
        <div className="flex items-center justify-between text-sm">
          <div className="flex items-center gap-2">
            <Car className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Vehicle: {vehicleNumber}</span>
          </div>
          <div className="flex items-center gap-2">
            <User className="w-4 h-4 text-blue-600" />
            <span className="font-medium">Pilot: {pilotId}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
