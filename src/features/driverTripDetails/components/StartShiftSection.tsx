import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/card';
import { Input } from '../../../shared/components/ui/input';
import { Button } from '../../../shared/components/ui/button';
import { Label } from '../../../shared/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Calendar } from '../../../shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shared/components/ui/popover';
import { CalendarIcon, Clock } from 'lucide-react';
import { format } from 'date-fns';
import { useTripDetails } from '../../../contexts/TripDetailsContext';
import { cn } from '../../../shared/utils/cn';

export const StartShiftSection: React.FC = () => {
  const { state, startShift } = useTripDetails();
  const [formData, setFormData] = useState({
    vehicleNumber: '',
    shiftType: '',
    vehicleCategory: '',
    startTime: new Date(),
    totalTripsPlanned: 0,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateForm = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.vehicleNumber.trim()) newErrors.vehicleNumber = 'Vehicle number is required';
    if (!formData.shiftType) newErrors.shiftType = 'Shift type is required';
    if (!formData.vehicleCategory) newErrors.vehicleCategory = 'Vehicle category is required';
    if (!formData.startTime) newErrors.startTime = 'Start time is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (validateForm()) {
      startShift(formData);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
          <Clock className="w-6 h-6 text-green-600" />
        </div>
        <CardTitle className="text-2xl">Start Your Shift</CardTitle>
        <p className="text-gray-600">Employee ID: {state.employeeId}</p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="vehicleNumber">
                Vehicle Number <span className="text-red-500">*</span>
              </Label>
              <Input
                id="vehicleNumber"
                placeholder="e.g., KA01AB1234"
                value={formData.vehicleNumber}
                onChange={(e) => setFormData(prev => ({ ...prev, vehicleNumber: e.target.value }))}
                className={errors.vehicleNumber ? 'border-red-500' : ''}
              />
              {errors.vehicleNumber && <p className="text-sm text-red-500">{errors.vehicleNumber}</p>}
            </div>

            <div className="space-y-2">
              <Label>
                Shift Type <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.shiftType} onValueChange={(value) => setFormData(prev => ({ ...prev, shiftType: value }))}>
                <SelectTrigger className={errors.shiftType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select shift type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="day">Day Shift</SelectItem>
                  <SelectItem value="night">Night Shift</SelectItem>
                  <SelectItem value="evening">Evening Shift</SelectItem>
                </SelectContent>
              </Select>
              {errors.shiftType && <p className="text-sm text-red-500">{errors.shiftType}</p>}
            </div>

            <div className="space-y-2">
              <Label>
                Vehicle Category <span className="text-red-500">*</span>
              </Label>
              <Select value={formData.vehicleCategory} onValueChange={(value) => setFormData(prev => ({ ...prev, vehicleCategory: value }))}>
                <SelectTrigger className={errors.vehicleCategory ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select vehicle category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2W">2 Wheeler</SelectItem>
                  <SelectItem value="3W">3 Wheeler</SelectItem>
                  <SelectItem value="4W">4 Wheeler</SelectItem>
                  <SelectItem value="6W">6 Wheeler</SelectItem>
                </SelectContent>
              </Select>
              {errors.vehicleCategory && <p className="text-sm text-red-500">{errors.vehicleCategory}</p>}
            </div>

            <div className="space-y-2">
              <Label>
                Start Time <span className="text-red-500">*</span>
              </Label>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.startTime && "text-muted-foreground",
                      errors.startTime && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.startTime instanceof Date ? format(formData.startTime, "PPP p") : "Pick start time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formData.startTime}
                    onSelect={(date) => date && setFormData(prev => ({ ...prev, startTime: date }))}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.startTime && <p className="text-sm text-red-500">{errors.startTime}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="totalTripsPlanned">
              Total Trips Planned (Optional)
            </Label>
            <Input
              id="totalTripsPlanned"
              type="number"
              placeholder="Enter planned number of trips"
              value={formData.totalTripsPlanned || ''}
              onChange={(e) => setFormData(prev => ({ ...prev, totalTripsPlanned: parseInt(e.target.value) || 0 }))}
            />
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            🟢 Start Shift
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
