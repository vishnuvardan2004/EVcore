
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
import { SidebarProvider } from '@/components/ui/sidebar';
import { NavigationSidebar } from './components/NavigationSidebar';
import { MainLayout } from './components/MainLayout';
import SmartWidgetsDashboard from './pages/SmartWidgetsDashboard';
import GlobalReports from './pages/GlobalReports';
import AdminModuleToggle from './pages/AdminModuleToggle';
import LanguageSelector from './pages/LanguageSelector';
import AuditLogs from './pages/AuditLogs';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <SidebarProvider>
          <div className="min-h-screen flex w-full">
            <NavigationSidebar />
            <MainLayout>
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/smart-widgets" element={<SmartWidgetsDashboard />} />
                <Route path="/global-reports" element={<GlobalReports />} />
                <Route path="/admin-toggle" element={<AdminModuleToggle />} />
                <Route path="/language" element={<LanguageSelector />} />
                <Route path="/audit-logs" element={<AuditLogs />} />
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
            </MainLayout>
          </div>
          <Toaster />
        </SidebarProvider>
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
