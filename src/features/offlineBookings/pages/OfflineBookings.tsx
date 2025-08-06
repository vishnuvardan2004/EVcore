import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AirportBookingForm } from '../components/AirportBookingForm';
import { RentalPackageForm } from '../components/RentalPackageForm';
import { SubscriptionBookingForm } from '../components/SubscriptionBookingForm';
import { BookingsView } from '../components/BookingsView';
import { ScheduledRides, CompletedRides, ExportBookings } from '../components';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '../../../components/ui/tooltip';
import { 
  Eye, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Download, 
  Clock, 
  Car,
  Users,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  Menu
} from 'lucide-react';
import { cn } from '../../../lib/utils';

const OfflineBookings = () => {
  const [activeView, setActiveView] = useState<'create' | 'scheduled' | 'completed' | 'export'>('create');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Mock data for dashboard stats
  const stats = {
    scheduledRides: 24,
    completedToday: 18,
    totalRevenue: 15680,
    activeVehicles: 12
  };

  const sidebarItems = [
    {
      id: 'create',
      label: 'Create Booking',
      icon: Plus,
      description: 'New ride booking',
      color: 'bg-blue-500'
    },
    {
      id: 'scheduled',
      label: 'Scheduled Rides',
      icon: Calendar,
      description: 'Future bookings',
      color: 'bg-orange-500',
      count: stats.scheduledRides
    },
    {
      id: 'completed',
      label: 'Completed Rides',
      icon: CheckCircle,
      description: 'Ride history',
      color: 'bg-green-500'
    },
    {
      id: 'export',
      label: 'Export Bookings',
      icon: Download,
      description: 'Download reports',
      color: 'bg-purple-500'
    }
  ];

  const renderContent = () => {
    switch (activeView) {
      case 'scheduled':
        return <ScheduledRides />;
      case 'completed':
        return <CompletedRides />;
      case 'export':
        return <ExportBookings />;
      default:
        return (
          <Tabs defaultValue="airport" className="w-full">
            <TabsList className="grid w-full grid-cols-3 bg-blue-50 border border-blue-200">
              <TabsTrigger 
                value="airport" 
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                ✈️ Airport Bookings
              </TabsTrigger>
              <TabsTrigger 
                value="rental" 
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                🚕 Rental Package
              </TabsTrigger>
              <TabsTrigger 
                value="subscription" 
                className="gap-2 data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-500 data-[state=active]:to-blue-600 data-[state=active]:text-white"
              >
                📝 Subscription
              </TabsTrigger>
            </TabsList>

            <TabsContent value="airport" className="mt-6">
              <AirportBookingForm />
            </TabsContent>

            <TabsContent value="rental" className="mt-6">
              <RentalPackageForm />
            </TabsContent>

            <TabsContent value="subscription" className="mt-6">
              <SubscriptionBookingForm />
            </TabsContent>
          </Tabs>
        );
    }
  };

  return (
    <div className="flex h-full">
      {/* Offline Bookings Sidebar */}
      <aside className={cn(
        "bg-white border-r border-gray-200 shadow-sm transition-all duration-300 flex flex-col h-full",
        sidebarCollapsed ? "w-16" : "w-80"
      )}>
        {/* Header */}
        <div className="p-4 border-b border-gray-200">
          {!sidebarCollapsed && (
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-lg">📝</span>
              </div>
              <div>
                <h3 className="font-bold text-lg text-gray-900">Offline Bookings</h3>
                <p className="text-xs text-gray-500">Complete booking management</p>
              </div>
            </div>
          )}
          {sidebarCollapsed && (
            <div className="flex justify-center">
              <span className="text-2xl">📝</span>
            </div>
          )}
        </div>

        {/* Stats Section */}
        <div className={cn("p-4", sidebarCollapsed ? "px-2" : "p-4")}>
          {!sidebarCollapsed ? (
            <div>
              <h3 className="text-sm font-semibold text-blue-800 mb-3 flex items-center gap-2">
                <TrendingUp className="w-4 h-4" />
                Quick Stats
              </h3>
              <div className="grid grid-cols-2 gap-3">
                <Card className="p-3 bg-gradient-to-br from-orange-50 to-orange-100 border-orange-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-orange-500 rounded-lg flex items-center justify-center">
                      <Clock className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-orange-800">{stats.scheduledRides}</p>
                      <p className="text-xs text-orange-600">Scheduled</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3 bg-gradient-to-br from-green-50 to-green-100 border-green-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-green-500 rounded-lg flex items-center justify-center">
                      <CheckCircle className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-green-800">{stats.completedToday}</p>
                      <p className="text-xs text-green-600">Today</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3 bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-lg flex items-center justify-center">
                      <TrendingUp className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-bold text-blue-800">₹{stats.totalRevenue.toLocaleString()}</p>
                      <p className="text-xs text-blue-600">Revenue</p>
                    </div>
                  </div>
                </Card>
                
                <Card className="p-3 bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 hover:shadow-md transition-shadow">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-purple-500 rounded-lg flex items-center justify-center">
                      <Car className="w-4 h-4 text-white" />
                    </div>
                    <div>
                      <p className="text-xl font-bold text-purple-800">{stats.activeVehicles}</p>
                      <p className="text-xs text-purple-600">Active</p>
                    </div>
                  </div>
                </Card>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg mx-auto">
                      <Clock className="w-5 h-5 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{stats.scheduledRides} Scheduled Rides</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg mx-auto">
                      <CheckCircle className="w-5 h-5 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{stats.completedToday} Completed Today</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg mx-auto">
                      <TrendingUp className="w-5 h-5 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>₹{stats.totalRevenue.toLocaleString()} Revenue</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-500 rounded-xl flex items-center justify-center cursor-pointer hover:scale-105 transition-all duration-200 shadow-lg mx-auto">
                      <Car className="w-5 h-5 text-white" />
                    </div>
                  </TooltipTrigger>
                  <TooltipContent side="right">
                    <p>{stats.activeVehicles} Active Vehicles</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          )}
        </div>

        {/* Navigation Menu */}
        <nav className="flex-1 p-2">
          <ul className="space-y-1">
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <li key={item.id}>
                  <Button
                    variant="ghost"
                    onClick={() => setActiveView(item.id as any)}
                    className={cn(
                      "w-full justify-start gap-3 h-auto p-3 transition-all",
                      isActive 
                        ? "bg-blue-50 text-blue-700 border border-blue-200" 
                        : "text-gray-700 hover:bg-gray-50 hover:text-gray-900",
                      sidebarCollapsed ? "px-2 justify-center" : ""
                    )}
                    title={sidebarCollapsed ? item.label : undefined}
                  >
                    <Icon className={cn("shrink-0", sidebarCollapsed ? "w-5 h-5" : "w-5 h-5")} />
                    {!sidebarCollapsed && (
                      <div className="text-left flex-1">
                        <div className="flex items-center justify-between">
                          <div className="font-medium text-sm">{item.label}</div>
                          {item.count && (
                            <Badge variant="secondary" className="text-xs">
                              {item.count}
                            </Badge>
                          )}
                        </div>
                        <div className="text-xs opacity-70">{item.description}</div>
                      </div>
                    )}
                  </Button>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-gray-200">
          {!sidebarCollapsed && (
            <div className="text-center">
              <p className="text-xs text-gray-500">
                Offline Bookings v2.0
              </p>
            </div>
          )}
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col bg-gray-50">
        {/* Header with toggle button */}
        <div className="bg-white border-b border-gray-200 px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setSidebarCollapsed(!sidebarCollapsed)}
              className="text-gray-500 hover:text-gray-700"
            >
              {sidebarCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Offline Bookings</h1>
              <p className="text-gray-600 text-sm">Complete booking management system</p>
            </div>
          </div>
        </div>
        
        {/* Page Content */}
        <div className="flex-1 p-6 overflow-auto">
          <div className="max-w-6xl mx-auto">
            <div className="bg-white rounded-2xl shadow-sm border border-blue-100 p-6">
              {renderContent()}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OfflineBookings;
