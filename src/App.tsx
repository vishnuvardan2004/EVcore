
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/ProtectedRoute";
import Dashboard from "./pages/Dashboard";
import VehicleTracker from "./pages/VehicleTracker";
import RideHistory from "./pages/RideHistory";
import Reports from "./pages/Reports";
import LiveStatus from "./pages/LiveStatus";
import Alerts from "./pages/Alerts";
import Profile from "./pages/Profile";
import Settings from "./pages/Settings";
import Attendance from "./pages/Attendance";
import Database from "./pages/Database";
import DriverInduction from "./pages/DriverInduction";
import TripDetails from "./pages/TripDetails";
import OfflineBookings from "./pages/OfflineBookings";
import ChargingTracker from "./pages/ChargingTracker";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ProtectedRoute>
            <Routes>
              <Route path="/" element={<Dashboard />} />
              <Route path="/vehicle-tracker" element={<VehicleTracker />} />
              <Route path="/history" element={<RideHistory />} />
              <Route path="/ride-history" element={<RideHistory />} />
              <Route path="/reports" element={<Reports />} />
              <Route path="/live-status" element={<LiveStatus />} />
              <Route path="/alerts" element={<Alerts />} />
              <Route path="/profile" element={<Profile />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/attendance" element={<Attendance />} />
              <Route path="/database" element={<Database />} />
              <Route path="/driver-induction" element={<DriverInduction />} />
              <Route path="/trip-details" element={<TripDetails />} />
              <Route path="/offline-bookings" element={<OfflineBookings />} />
              <Route path="/charging-tracker" element={<ChargingTracker />} />
              {/* ADD ALL CUSTOM ROUTES ABOVE THE CATCH-ALL "*" ROUTE */}
              <Route path="*" element={<NotFound />} />
            </Routes>
          </ProtectedRoute>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
