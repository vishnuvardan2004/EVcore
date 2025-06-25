import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Plus, MapPin } from 'lucide-react';
import { useTripDetails } from '../../../contexts/TripDetailsContext';
import { TripEntryForm } from './TripEntryForm';
import { TripCard } from './TripCard';
import { format } from 'date-fns';

export const ActiveShiftSection: React.FC = () => {
  const { state, endShift } = useTripDetails();
  const [showTripForm, setShowTripForm] = useState(false);
  const [showEndShiftForm, setShowEndShiftForm] = useState(false);

  const handleEndShift = () => {
    setShowEndShiftForm(true);
  };

  const totalEarnings = state.trips.reduce((total, trip) => total + trip.amount + trip.tip, 0);

  const calculatePaymentTotals = () => {
    const totals = {
      totalCash: 0,
      totalQR: 0,
      totalUberRapido: 0,
      totalWallet: 0,
      totalCard: 0,
    };

    state.trips.forEach(trip => {
      const tripTotal = trip.amount + trip.tip;
      
      if (trip.partPayment?.enabled) {
        // Handle part payments
        const amount1Mode = trip.partPayment.amount1Mode;
        const amount2Mode = trip.partPayment.amount2Mode;
        
        if (amount1Mode === 'Cash') totals.totalCash += trip.partPayment.amount1;
        else if (amount1Mode === 'UPI - QR') totals.totalQR += trip.partPayment.amount1;
        
        if (amount2Mode === 'Cash') totals.totalCash += trip.partPayment.amount2;
        else if (amount2Mode === 'UPI - QR') totals.totalQR += trip.partPayment.amount2;
      } else {
        // Handle single payment mode
        switch (trip.paymentMode) {
          case 'Cash':
            totals.totalCash += tripTotal;
            break;
          case 'UPI - QR':
            totals.totalQR += tripTotal;
            break;
          case 'Uber':
            totals.totalUberRapido += tripTotal;
            break;
          case 'Wallet':
            totals.totalWallet += tripTotal;
            break;
          case 'Card':
            totals.totalCard += tripTotal;
            break;
        }
      }
    });

    return totals;
  };

  const handleConfirmEndShift = () => {
    const paymentTotals = calculatePaymentTotals();
    endShift(paymentTotals);
  };

  return (
    <div className="space-y-6">
      {/* Shift Summary Card */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="text-xl">Active Shift 🟢</CardTitle>
              <p className="text-gray-600">
                Started: {state.shiftData.startTime ? format(state.shiftData.startTime, 'PPP p') : 'N/A'} | 
                Vehicle: {state.shiftData.vehicleNumber} | 
                Type: {state.shiftData.shiftType}
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-green-600">₹{totalEarnings}</div>
              <div className="text-sm text-gray-500">{state.trips.length} trips completed</div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Add Trip Section */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-blue-600" />
              <CardTitle>Trip Entry</CardTitle>
            </div>
            <Button 
              onClick={() => setShowTripForm(!showTripForm)}
              variant={showTripForm ? "outline" : "default"}
              className="gap-2"
            >
              <Plus className="w-4 h-4" />
              {showTripForm ? 'Hide Form' : 'Add Trip'}
            </Button>
          </div>
        </CardHeader>
        {showTripForm && (
          <CardContent>
            <TripEntryForm onSubmit={() => setShowTripForm(false)} />
          </CardContent>
        )}
      </Card>

      {/* Trip List */}
      {state.trips.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Trip History ({state.trips.length})</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {state.trips.map((trip) => (
              <TripCard key={trip.id} trip={trip} />
            ))}
          </CardContent>
        </Card>
      )}

      {/* End Shift Section */}
      {state.trips.length > 0 && (
        <Card>
          <CardContent className="pt-6">
            {!showEndShiftForm ? (
              <Button 
                onClick={handleEndShift}
                variant="destructive"
                size="lg"
                className="w-full"
              >
                🔴 End Shift & Summary
              </Button>
            ) : (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold">Shift Summary</h3>
                <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
                  <div>
                    <p className="text-sm text-gray-600">Total Trips</p>
                    <p className="text-xl font-bold">{state.trips.length}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Earnings</p>
                    <p className="text-xl font-bold text-green-600">₹{totalEarnings}</p>
                  </div>
                </div>
                <Button 
                  onClick={handleConfirmEndShift}
                  className="w-full"
                  size="lg"
                >
                  ✅ Accept & End Shift
                </Button>
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};
