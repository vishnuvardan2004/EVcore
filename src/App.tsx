import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Dashboard from './pages/Dashboard';
import VehicleTracker from './pages/VehicleTracker';
import ChargingTracker from './pages/ChargingTracker';
import ChargingHistory from './pages/ChargingHistory';
import ChargingSummary from './pages/ChargingSummary';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/vehicle-tracker" element={<VehicleTracker />} />
        <Route path="/charging-tracker" element={<ChargingTracker />} />
        <Route path="/charging-history" element={<ChargingHistory />} />
        <Route path="/charging-summary" element={<ChargingSummary />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
