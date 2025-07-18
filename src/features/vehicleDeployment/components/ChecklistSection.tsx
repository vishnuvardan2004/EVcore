
import React from 'react';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { DriverChecklist, VehicleChecklist } from '../../../types/vehicle';

interface ChecklistSectionProps {
  type: 'driver' | 'vehicle';
  checklist: DriverChecklist | VehicleChecklist;
  onChange: (checklist: DriverChecklist | VehicleChecklist) => void;
  mismatches?: string[];
  showMismatches?: boolean;
}

const driverChecklistItems = [
  { key: 'idCard', label: 'ID Card' },
  { key: 'uniform', label: 'Uniform' },
  { key: 'shoes', label: 'Shoes' },
  { key: 'groomed', label: 'Groomed' },
];

const vehicleChecklistItems = [
  { key: 'fireExtinguisher', label: 'Fire Extinguisher' },
  { key: 'stepney', label: 'Stepney' },
  { key: 'carFreshener', label: 'Car Freshener' },
  { key: 'cleaningCloth', label: 'Cleaning Cloth' },
  { key: 'umbrella', label: 'Umbrella' },
  { key: 'torch', label: 'Torch' },
  { key: 'toolkit', label: 'Toolkit' },
  { key: 'spanner', label: 'Spanner' },
  { key: 'medicalKit', label: 'Medical Kit' },
  { key: 'carCharger', label: 'Car Charger' },
  { key: 'jack', label: 'Jack' },
  { key: 'lightsWorking', label: 'Lights Working' },
  { key: 'tyrePressure', label: 'Tyre Pressure' },
  { key: 'wheelCaps', label: 'Wheel Caps' },
  { key: 'wiperWater', label: 'Wiper Water' },
  { key: 'cleanliness', label: 'Cleanliness' },
  { key: 'antenna', label: 'Antenna' },
  { key: 'acWorking', label: 'AC Working' },
  { key: 'mobileCable', label: 'Mobile Cable' },
  { key: 'mobileAdapter', label: 'Mobile Adapter' },
  { key: 'phoneStand', label: 'Phone Stand' },
  { key: 'hornWorking', label: 'Horn Working' },
];

export const ChecklistSection: React.FC<ChecklistSectionProps> = ({
  type,
  checklist,
  onChange,
  mismatches = [],
  showMismatches = false
}) => {
  const items = type === 'driver' ? driverChecklistItems : vehicleChecklistItems;
  const isVehicleChecklist = type === 'vehicle';

  const handleCheckboxChange = (key: string, checked: boolean) => {
    onChange({
      ...checklist,
      [key]: checked
    });
  };

  const handleDamagesChange = (damages: string) => {
    if (isVehicleChecklist) {
      onChange({
        ...checklist,
        damages
      });
    }
  };

  const getMismatchIcon = (key: string) => {
    if (showMismatches && mismatches.includes(key)) {
      return <span className="text-red-500 ml-2">⚠️</span>;
    }
    return null;
  };

  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold mb-4 capitalize">
        {type} Checklist
        {showMismatches && mismatches.length > 0 && (
          <span className="text-red-500 ml-2">({mismatches.length} mismatches)</span>
        )}
      </h3>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {items.map(({ key, label }) => (
          <div key={key} className="flex items-center space-x-2">
            <Checkbox
              id={key}
              checked={(checklist as any)[key] || false}
              onCheckedChange={(checked) => handleCheckboxChange(key, checked as boolean)}
            />
            <Label htmlFor={key} className="flex-1 cursor-pointer">
              {label}
              {getMismatchIcon(key)}
            </Label>
          </div>
        ))}
      </div>

      {isVehicleChecklist && (
        <div className="mt-6 space-y-2">
          <Label htmlFor="damages">Damages (if any)</Label>
          <Textarea
            id="damages"
            placeholder="Describe any damages or issues..."
            value={(checklist as VehicleChecklist).damages || ''}
            onChange={(e) => handleDamagesChange(e.target.value)}
            rows={3}
          />
        </div>
      )}

      {showMismatches && mismatches.length > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-red-800 font-medium text-sm">
            ⚠️ Mismatch Detected – Review before submission
          </p>
        </div>
      )}
    </Card>
  );
};
