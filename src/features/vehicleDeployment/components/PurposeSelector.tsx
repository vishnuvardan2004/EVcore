
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

interface PurposeSelectorProps {
  onPurposeSelected: (purpose: 'Office' | 'Pilot') => void;
}

export const PurposeSelector: React.FC<PurposeSelectorProps> = ({ onPurposeSelected }) => {
  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Select Purpose</h2>
        <p className="text-gray-600">Choose the purpose for this deployment</p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">🏢</div>
            <h3 className="text-xl font-semibold">Office Purpose</h3>
            <p className="text-sm text-gray-600">Regular office use</p>
            <Button
              onClick={() => onPurposeSelected('Office')}
              className="w-full"
            >
              Select Office
            </Button>
          </div>
        </Card>

        <Card className="p-6">
          <div className="text-center space-y-4">
            <div className="text-4xl">🎯</div>
            <h3 className="text-xl font-semibold">Pilot Purpose</h3>
            <p className="text-sm text-gray-600">Pilot deployment with checklist</p>
            <Button
              onClick={() => onPurposeSelected('Pilot')}
              className="w-full"
            >
              Select Pilot
            </Button>
          </div>
        </Card>
      </div>
    </div>
  );
};
