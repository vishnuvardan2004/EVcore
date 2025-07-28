import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
// EVCORE Platform - Main Application Entry Point
import Dashboard from './pages/Dashboard';
import VehicleTracker from './features/vehicleDeployment/pages/VehicleTracker';
import RideHistory from './features/vehicleDeployment/pages/RideHistory';
import LiveStatus from './features/vehicleDeployment/pages/LiveStatus';
import Alerts from './features/vehicleDeployment/pages/Alerts';
import Reports from './features/vehicleDeployment/pages/Reports';
import { ChargingTracker, ChargingHistory, ChargingSummary } from './features/vehicleChargingTracker';
import { DriverInduction } from './features/driverInduction';
import { TripDetails } from './features/driverTripDetails';
import { OfflineBookings } from './features/offlineBookings';
import { 
  DatabaseLayout,
  DatabaseDashboard,
  VehicleManagement, 
  PilotManagement, 
  CustomerManagement, 
  EmployeeManagement, 
  DataAnalytics 
} from './features/databaseManagement';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './pages/Login';
import { Toaster } from '@/components/ui/toaster';
import { SidebarProvider } from '@/components/ui/sidebar';
import { NavigationSidebar } from './components/NavigationSidebar';
import { MainLayout } from './components/MainLayout';
import SmartWidgetsDashboard from './pages/SmartWidgetsDashboard';
import GlobalReports from './pages/GlobalReports';
import AdminModuleToggle from './pages/AdminModuleToggle';
import LanguageSelector from './pages/LanguageSelector';
import AuditLogs from './pages/AuditLogs';

const AppContent = () => {
  const { isAuthenticated } = useAuth();

  // Show login page if not authenticated
  if (!isAuthenticated) {
    return <Login />;
  }

  // Show main application if authenticated
  return (
    <SidebarProvider defaultOpen={false}>
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
            <Route path="/ride-history" element={<RideHistory />} />
            <Route path="/live-status" element={<LiveStatus />} />
            <Route path="/deployment-alerts" element={<Alerts />} />
            <Route path="/deployment-reports" element={<Reports />} />
            <Route path="/charging-tracker" element={<ChargingTracker />} />
            <Route path="/charging-history" element={<ChargingHistory />} />
            <Route path="/charging-summary" element={<ChargingSummary />} />
            <Route path="/trip-details" element={<TripDetails />} />
            <Route path="/offline-bookings" element={<OfflineBookings />} />
            <Route path="/driver-induction" element={<DriverInduction />} />
            
            {/* Database Management Routes with Sidebar Layout */}
            <Route path="/database/*" element={<DatabaseLayout />}>
              <Route index element={<DatabaseDashboard />} />
              <Route path="vehicles" element={<VehicleManagement />} />
              <Route path="pilots" element={<PilotManagement />} />
              <Route path="customers" element={<CustomerManagement />} />
              <Route path="staff" element={<EmployeeManagement />} />
              <Route path="analytics" element={<DataAnalytics />} />
            </Route>
          </Routes>
        </MainLayout>
      </div>
      <Toaster />
    </SidebarProvider>
  );
};

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <AppContent />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
