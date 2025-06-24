
import React from 'react';
import { useTripDetails } from '../../contexts/TripDetailsContext';
import { EmployeeIdSection } from './EmployeeIdSection';
import { StartShiftSection } from './StartShiftSection';
import { ActiveShiftSection } from './ActiveShiftSection';
import { EndShiftSection } from './EndShiftSection';
import { Card } from '@/components/ui/card';

export const TripDetailsForm: React.FC = () => {
  const { state } = useTripDetails();

  return (
    <div className="space-y-6">
      {/* Progress Indicator */}
      <Card className="p-4">
        <div className="flex items-center justify-between">
          <div className={`flex items-center space-x-2 ${state.currentStep === 'employee-id' ? 'text-blue-600' : state.employeeId ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${state.employeeId ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
              1
            </div>
            <span className="font-medium">Employee ID</span>
          </div>
          
          <div className={`flex items-center space-x-2 ${state.currentStep === 'start-shift' ? 'text-blue-600' : state.isShiftStarted ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${state.isShiftStarted ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
              2
            </div>
            <span className="font-medium">Start Shift</span>
          </div>
          
          <div className={`flex items-center space-x-2 ${state.currentStep === 'active-shift' ? 'text-blue-600' : state.trips.length > 0 ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${state.trips.length > 0 ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
              3
            </div>
            <span className="font-medium">Trip Details</span>
          </div>
          
          <div className={`flex items-center space-x-2 ${state.currentStep === 'end-shift' ? 'text-blue-600' : state.isShiftEnded ? 'text-green-600' : 'text-gray-400'}`}>
            <div className={`w-8 h-8 rounded-full flex items-center justify-center ${state.isShiftEnded ? 'bg-green-500 text-white' : 'bg-gray-200'}`}>
              4
            </div>
            <span className="font-medium">End Shift</span>
          </div>
        </div>
      </Card>

      {/* Step Content */}
      {state.currentStep === 'employee-id' && <EmployeeIdSection />}
      {(state.currentStep === 'start-shift' && state.employeeId) && <StartShiftSection />}
      {(state.currentStep === 'active-shift' && state.isShiftStarted) && <ActiveShiftSection />}
      {(state.currentStep === 'end-shift' && state.isShiftEnded) && <EndShiftSection />}
    </div>
  );
};
