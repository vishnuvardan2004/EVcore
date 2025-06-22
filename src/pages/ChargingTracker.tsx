
import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Car, User, Battery, MapPin, Zap, DollarSign } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

type FlowType = 'access' | 'start' | 'end';

interface AccessData {
  vehicleNumber: string;
  pilotId: string;
}

interface StartChargingData {
  odoReading: string;
  chargePercent: string;
  range: string;
  location: 'HUB' | 'Outside';
  brand: string;
  locationName: string;
}

interface EndChargingData {
  chargePercent: string;
  range: string;
  cost: string;
  paymentMode: 'UPI' | 'Cash';
  units: string;
}

const ChargingTracker = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const [currentFlow, setCurrentFlow] = useState<FlowType>('access');
  const [accessData, setAccessData] = useState<AccessData>({
    vehicleNumber: '',
    pilotId: ''
  });
  
  const [startData, setStartData] = useState<StartChargingData>({
    odoReading: '',
    chargePercent: '',
    range: '',
    location: 'HUB',
    brand: '',
    locationName: ''
  });
  
  const [endData, setEndData] = useState<EndChargingData>({
    chargePercent: '',
    range: '',
    cost: '',
    paymentMode: 'UPI',
    units: ''
  });

  const handleAccessSubmit = () => {
    if (!accessData.vehicleNumber || !accessData.pilotId) {
      toast({
        title: "Missing Information",
        description: "Please enter both Vehicle Number and Pilot ID",
        variant: "destructive"
      });
      return;
    }
    // Access data is valid, show Start/End buttons (stay in access flow but enable buttons)
  };

  const handleStartFlow = () => {
    if (!accessData.vehicleNumber || !accessData.pilotId) {
      toast({
        title: "Access Required",
        description: "Please enter Vehicle Number and Pilot ID first",
        variant: "destructive"
      });
      return;
    }
    setCurrentFlow('start');
  };

  const handleEndFlow = () => {
    if (!accessData.vehicleNumber || !accessData.pilotId) {
      toast({
        title: "Access Required",
        description: "Please enter Vehicle Number and Pilot ID first",
        variant: "destructive"
      });
      return;
    }
    setCurrentFlow('end');
  };

  const handleStartSubmit = () => {
    if (!startData.odoReading || !startData.chargePercent || !startData.range) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    if (startData.location === 'Outside' && (!startData.brand || !startData.locationName)) {
      toast({
        title: "Missing Location Details",
        description: "Please provide brand and location name for outside charging",
        variant: "destructive"
      });
      return;
    }

    console.log('Start Charging Data:', { ...accessData, ...startData });
    toast({
      title: "Charging Session Started",
      description: `Started charging for vehicle ${accessData.vehicleNumber}`,
    });
    
    // Reset form and go back to access
    setStartData({
      odoReading: '',
      chargePercent: '',
      range: '',
      location: 'HUB',
      brand: '',
      locationName: ''
    });
    setCurrentFlow('access');
  };

  const handleEndSubmit = () => {
    if (!endData.chargePercent || !endData.range || !endData.cost || !endData.units) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields",
        variant: "destructive"
      });
      return;
    }

    console.log('End Charging Data:', { ...accessData, ...endData });
    toast({
      title: "Charging Session Ended",
      description: `Ended charging for vehicle ${accessData.vehicleNumber}`,
    });
    
    // Reset form and go back to access
    setEndData({
      chargePercent: '',
      range: '',
      cost: '',
      paymentMode: 'UPI',
      units: ''
    });
    setCurrentFlow('access');
  };

  const renderAccessForm = () => (
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
              onChange={(e) => setAccessData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
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
              onChange={(e) => setAccessData(prev => ({ ...prev, pilotId: e.target.value }))}
            />
          </div>

          <Button onClick={handleAccessSubmit} className="w-full">
            Continue
          </Button>

          {accessData.vehicleNumber && accessData.pilotId && (
            <div className="mt-6 pt-6 border-t">
              <div className="text-center mb-4">
                <h3 className="font-semibold text-lg">Select Action</h3>
                <p className="text-sm text-gray-600">Choose to start or end a charging session</p>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <Button onClick={handleStartFlow} className="bg-green-600 hover:bg-green-700">
                  🔋 Start Charging
                </Button>
                <Button onClick={handleEndFlow} className="bg-red-600 hover:bg-red-700">
                  🔌 End Charging
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const renderStartForm = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Vehicle: {accessData.vehicleNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Pilot: {accessData.pilotId}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
                onChange={(e) => setStartData(prev => ({ ...prev, odoReading: e.target.value }))}
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
                onChange={(e) => setStartData(prev => ({ ...prev, chargePercent: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="startRange">Range (km)</Label>
              <Input
                id="startRange"
                type="number"
                placeholder="Enter range"
                value={startData.range}
                onChange={(e) => setStartData(prev => ({ ...prev, range: e.target.value }))}
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
              onValueChange={(value: 'HUB' | 'Outside') => setStartData(prev => ({ ...prev, location: value }))}
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
                  onChange={(e) => setStartData(prev => ({ ...prev, brand: e.target.value }))}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="locationName">Location Name</Label>
                <Input
                  id="locationName"
                  placeholder="Enter location name"
                  value={startData.locationName}
                  onChange={(e) => setStartData(prev => ({ ...prev, locationName: e.target.value }))}
                />
              </div>
            </div>
          )}

          <div className="flex gap-3 pt-4">
            <Button onClick={() => setCurrentFlow('access')} variant="outline" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleStartSubmit} className="flex-1 bg-green-600 hover:bg-green-700">
              Start Charging Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  const renderEndForm = () => (
    <div className="max-w-2xl mx-auto space-y-6">
      {/* Info Box */}
      <Card className="bg-blue-50 border-blue-200">
        <CardContent className="pt-6">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <Car className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Vehicle: {accessData.vehicleNumber}</span>
            </div>
            <div className="flex items-center gap-2">
              <User className="w-4 h-4 text-blue-600" />
              <span className="font-medium">Pilot: {accessData.pilotId}</span>
            </div>
          </div>
        </CardContent>
      </Card>

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
                onChange={(e) => setEndData(prev => ({ ...prev, chargePercent: e.target.value }))}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="endRange">Range (km)</Label>
              <Input
                id="endRange"
                type="number"
                placeholder="Enter range"
                value={endData.range}
                onChange={(e) => setEndData(prev => ({ ...prev, range: e.target.value }))}
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
                onChange={(e) => setEndData(prev => ({ ...prev, cost: e.target.value }))}
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
                onChange={(e) => setEndData(prev => ({ ...prev, units: e.target.value }))}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="flex items-center gap-2">
              💰 Payment Mode
            </Label>
            <Select value={endData.paymentMode} onValueChange={(value: 'UPI' | 'Cash') => setEndData(prev => ({ ...prev, paymentMode: value }))}>
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
            <Button onClick={() => setCurrentFlow('access')} variant="outline" className="flex-1">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <Button onClick={handleEndSubmit} className="flex-1 bg-red-600 hover:bg-red-700">
              End Charging Session
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );

  return (
    <PageLayout 
      title="⚡ Vehicle Charging Tracker" 
      subtitle="Monitor and track EV charging sessions"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <Button onClick={() => navigate('/')} variant="outline" className="gap-2">
            <ArrowLeft className="w-4 h-4" />
            Back to Dashboard
          </Button>
        </div>

        {currentFlow === 'access' && renderAccessForm()}
        {currentFlow === 'start' && renderStartForm()}
        {currentFlow === 'end' && renderEndForm()}
      </div>
    </PageLayout>
  );
};

export default ChargingTracker;
