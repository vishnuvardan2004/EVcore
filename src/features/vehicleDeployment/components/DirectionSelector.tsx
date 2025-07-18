
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface DirectionSelectorProps {
  vehicleNumber: string;
  canGoOut: boolean;
  canComeIn: boolean;
  onDirectionSelected: (direction: 'OUT' | 'IN') => void;
}

export const DirectionSelector: React.FC<DirectionSelectorProps> = ({
  vehicleNumber,
  canGoOut,
  canComeIn,
  onDirectionSelected
}) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-2">Vehicle: {vehicleNumber}</h2>
        <p className="text-gray-600">Select direction</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">🚗➡️</div>
            <h3 className="text-xl font-semibold">OUT</h3>
            <p className="text-sm text-gray-600">Vehicle leaving the hub</p>
            <Button
              onClick={() => onDirectionSelected('OUT')}
              disabled={!canGoOut}
              className="w-full"
              variant={canGoOut ? 'default' : 'secondary'}
            >
              {canGoOut ? 'Select OUT' : 'Already OUT'}
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">🚗⬅️</div>
            <h3 className="text-xl font-semibold">IN</h3>
            <p className="text-sm text-gray-600">Vehicle returning to hub</p>
            <Button
              onClick={() => onDirectionSelected('IN')}
              disabled={!canComeIn}
              className="w-full"
              variant={canComeIn ? 'default' : 'secondary'}
            >
              {canComeIn ? 'Select IN' : 'Not OUT yet'}
            </Button>
          </div>
        </Card>
      </div>

      {!canGoOut && !canComeIn && (
        <Card className="p-4 bg-yellow-50 border-yellow-200">
          <p className="text-yellow-800 text-center">
            ⚠️ Please check vehicle status. Unable to determine valid direction.
          </p>
        </Card>
      )}
    </div>
  );
};
