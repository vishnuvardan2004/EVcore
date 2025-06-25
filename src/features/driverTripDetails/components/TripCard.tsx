
import React from 'react';
import { Card, CardContent } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Trash2, MapPin, CreditCard } from 'lucide-react';
import { useTripDetails } from '../../../contexts/TripDetailsContext';

interface Trip {
  id: string;
  mode: string;
  amount: number;
  tip: number;
  paymentMode: string;
  partPayment?: {
    enabled: boolean;
    amount1: number;
    amount1Mode: string;
    amount2: number;
    amount2Mode: string;
  };
}

interface TripCardProps {
  trip: Trip;
}

export const TripCard: React.FC<TripCardProps> = ({ trip }) => {
  const { deleteTrip } = useTripDetails();

  return (
    <Card className="border-l-4 border-l-blue-500">
      <CardContent className="p-4">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-2">
              <MapPin className="w-4 h-4 text-blue-600" />
              <span className="font-medium">{trip.mode}</span>
            </div>
            
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Amount:</span>
                <span className="ml-1 font-medium">₹{trip.amount}</span>
              </div>
              
              {trip.tip > 0 && (
                <div>
                  <span className="text-gray-600">Tip:</span>
                  <span className="ml-1 font-medium text-green-600">₹{trip.tip}</span>
                </div>
              )}
              
              <div className="flex items-center gap-1">
                <CreditCard className="w-3 h-3 text-gray-400" />
                <span className="text-gray-600">{trip.paymentMode}</span>
              </div>
              
              <div>
                <span className="text-gray-600">Total:</span>
                <span className="ml-1 font-bold text-green-600">₹{trip.amount + trip.tip}</span>
              </div>
            </div>

            {trip.partPayment?.enabled && (
              <div className="mt-2 p-2 bg-yellow-50 rounded text-xs">
                <div className="font-medium text-yellow-800 mb-1">Part Payment:</div>
                <div className="flex gap-4">
                  <span>₹{trip.partPayment.amount1} ({trip.partPayment.amount1Mode})</span>
                  <span>₹{trip.partPayment.amount2} ({trip.partPayment.amount2Mode})</span>
                </div>
              </div>
            )}
          </div>
          
          <Button
            variant="outline"
            size="sm"
            onClick={() => deleteTrip(trip.id)}
            className="text-red-600 hover:text-red-700 hover:bg-red-50"
          >
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
