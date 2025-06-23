
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ArrowLeft, Zap, DollarSign } from 'lucide-react';
import { VehicleInfoCard } from './VehicleInfoCard';

interface EndChargingData {
  chargePercent: string;
  range: string;
  cost: string;
  paymentMode: 'UPI' | 'Cash';
  units: string;
}

interface EndChargingFormProps {
  vehicleNumber: string;
  pilotId: string;
  endData: EndChargingData;
  onEndDataChange: (data: EndChargingData) => void;
  onSubmit: () => void;
  onBack: () => void;
}

export const EndChargingForm: React.FC<EndChargingFormProps> = ({
  vehicleNumber,
  pilotId,
  endData,
  onEndDataChange,
  onSubmit,
  onBack
}) => {
  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <VehicleInfoCard vehicleNumber={vehicleNumber} pilotId={pilotId} />

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-red-600" />
            End Charging Session
          </CardTitle>
          <CardDescription>
            Record final readings and payment details after charging completion
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="endChargePercent">Charge %</Label>
              <Input
                id="endChargePercent"
                type="number"
                min="0"
                max="100"
                placeholder="0-100%"
                value={endData.chargePercent}
                onChange={(e) => onEndDataChange({ ...endData, chargePercent: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endRange">Range (km)</Label>
              <Input
                id="endRange"
                type="number"
                placeholder="Enter range"
                value={endData.range}
                onChange={(e) => onEndDataChange({ ...endData, range: e.target.value })}
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="cost" className="flex items-center gap-2">
                <DollarSign className="w-4 h-4" />
                Cost (₹)
              </Label>
              <Input
                id="cost"
                type="number"
                placeholder="Enter cost"
                value={endData.cost}
                onChange={(e) => onEndDataChange({ ...endData, cost: e.target.value })}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="units" className="flex items-center gap-2">
                <Zap className="w-4 h-4" />
                Units (kWh)
              </Label>
              <Input
                id="units"
                type="number"
                step="0.1"
                placeholder="Enter units"
                value={endData.units}
                onChange={(e) => onEndDataChange({ ...endData, units: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              💰 Payment Mode
            </Label>
            <Select value={endData.paymentMode} onValueChange={(value: 'UPI' | 'Cash') => onEndDataChange({ ...endData, paymentMode: value })}>
              <SelectTrigger>
                <SelectValue placeholder="Select payment mode" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="UPI">📱 UPI</SelectItem>
                <SelectItem value="Cash">💵 Cash</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="flex gap-3 pt-4">
            <Button onClick={onBack} variant="outline" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={onSubmit} className="flex-1 bg-red-600 hover:bg-red-700">
              End Charging Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
