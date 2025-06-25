
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import { VehicleTracker } from './features/vehicleDeployment';
import { ChargingTracker, ChargingHistory, ChargingSummary } from './features/vehicleChargingTracker';
import { DriverInduction } from './features/driverInduction';
import { TripDetails } from './features/driverTripDetails';
import { OfflineBookings } from './features/offlineBookings';
import { AuthProvider } from './contexts/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { Toaster } from '@/components/ui/toaster';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Dashboard />} />
          <Route path="/vehicle-tracker" element={<VehicleTracker />} />
          <Route path="/charging-tracker" element={<ChargingTracker />} />
          <Route path="/charging-history" element={<ChargingHistory />} />
          <Route path="/charging-summary" element={<ChargingSummary />} />
          <Route path="/trip-details" element={<TripDetails />} />
          <Route path="/offline-bookings" element={<OfflineBookings />} />
          <Route 
            path="/driver-induction" 
            element={
              <ProtectedRoute>
                <DriverInduction />
              </ProtectedRoute>
            } 
          />
        </Routes>
        <Toaster />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
