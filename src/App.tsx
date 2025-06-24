
import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import VehicleTracker from './pages/VehicleTracker';
import ChargingTracker from './pages/ChargingTracker';
import ChargingHistory from './pages/ChargingHistory';
import ChargingSummary from './pages/ChargingSummary';
import DriverInduction from './pages/DriverInduction';
import TripDetails from './pages/TripDetails';
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
