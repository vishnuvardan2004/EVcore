
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { User } from 'lucide-react';
import { useTripDetails } from '../../contexts/TripDetailsContext';

export const EmployeeIdSection: React.FC = () => {
  const { setEmployeeId } = useTripDetails();
  const [employeeId, setLocalEmployeeId] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!employeeId.trim()) {
      setError('Employee ID is required');
      return;
    }
    
    setError('');
    setEmployeeId(employeeId.trim());
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="mx-auto w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
          <User className="w-6 h-6 text-blue-600" />
        </div>
        <CardTitle className="text-2xl">Driver Identification</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="employeeId">
              Employee ID <span className="text-red-500">*</span>
            </Label>
            <Input
              id="employeeId"
              placeholder="Enter your employee ID"
              value={employeeId}
              onChange={(e) => setLocalEmployeeId(e.target.value)}
              className={error ? 'border-red-500' : ''}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </div>
          
          <Button type="submit" className="w-full" size="lg">
            Continue to Shift Details
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};
