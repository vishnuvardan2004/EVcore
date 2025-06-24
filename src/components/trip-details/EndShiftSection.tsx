
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CheckCircle, Download, RotateCcw } from 'lucide-react';
import { useTripDetails } from '../../contexts/TripDetailsContext';
import { format } from 'date-fns';

export const EndShiftSection: React.FC = () => {
  const { state, resetState } = useTripDetails();

  const totalAmount = state.trips.reduce((total, trip) => total + trip.amount, 0);
  const totalTips = state.trips.reduce((total, trip) => total + trip.tip, 0);
  const totalEarnings = totalAmount + totalTips;

  const paymentSummary = state.trips.reduce((summary, trip) => {
    const mode = trip.paymentMode;
    if (!summary[mode]) summary[mode] = 0;
    summary[mode] += trip.amount + trip.tip;
    return summary;
  }, {} as Record<string, number>);

  const exportData = () => {
    const data = {
      employeeId: state.employeeId,
      shiftData: state.shiftData,
      trips: state.trips,
      summary: {
        totalTrips: state.trips.length,
        totalAmount,
        totalTips,
        totalEarnings,
        paymentSummary,
      },
    };
    
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `shift-report-${state.employeeId}-${format(new Date(), 'yyyy-MM-dd')}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="text-center">
          <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="w-6 h-6 text-green-600" />
          </div>
          <CardTitle className="text-2xl text-green-600">Shift Completed! 🎉</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{state.trips.length}</div>
              <div className="text-sm text-blue-800">Total Trips</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">₹{totalEarnings}</div>
              <div className="text-sm text-green-800">Total Earnings</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">₹{totalTips}</div>
              <div className="text-sm text-purple-800">Tips Earned</div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-semibold">Payment Mode Breakdown:</h3>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(paymentSummary).map(([mode, amount]) => (
                <div key={mode} className="flex justify-between p-2 bg-gray-50 rounded">
                  <span>{mode}:</span>
                  <span className="font-medium">₹{amount}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-6 space-y-4">
            <h3 className="font-semibold">Shift Details:</h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="text-gray-600">Employee ID:</span>
                <span className="ml-2 font-medium">{state.employeeId}</span>
              </div>
              <div>
                <span className="text-gray-600">Vehicle:</span>
                <span className="ml-2 font-medium">{state.shiftData.vehicleNumber}</span>
              </div>
              <div>
                <span className="text-gray-600">Shift Type:</span>
                <span className="ml-2 font-medium">{state.shiftData.shiftType}</span>
              </div>
              <div>
                <span className="text-gray-600">Started:</span>
                <span className="ml-2 font-medium">
                  {state.shiftData.startTime ? format(state.shiftData.startTime, 'PPP p') : 'N/A'}
                </span>
              </div>
            </div>
          </div>

          <div className="flex gap-4 mt-6">
            <Button onClick={exportData} className="flex-1 gap-2">
              <Download className="w-4 h-4" />
              Export Report
            </Button>
            <Button onClick={resetState} variant="outline" className="gap-2">
              <RotateCcw className="w-4 h-4" />
              New Shift
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
