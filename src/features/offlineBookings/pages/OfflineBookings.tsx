import React, { useState } from 'react';
import { PageLayout } from '../../../components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../shared/components/ui/tabs';
import { AirportBookingForm } from '../components/AirportBookingForm';
import { RentalPackageForm } from '../components/RentalPackageForm';
import { SubscriptionBookingForm } from '../components/SubscriptionBookingForm';
import { BookingsView } from '../components/BookingsView';
import { ScheduledRides, CompletedRides, ExportBookings } from '../components';
import { Button } from '../../../shared/components/ui/button';
import { Card, CardContent } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { 
  Eye, 
  Plus, 
  Calendar, 
  CheckCircle, 
  Download, 
  Clock, 
  Car,
  Users,
  TrendingUp
} from 'lucide-react';

const OfflineBookings = () => {
  const [activeView, setActiveView] = useState<'create' | 'scheduled' | 'completed' | 'export'>('create');

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
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="airport" className="gap-2">
                ✈️ Airport Bookings
              </TabsTrigger>
              <TabsTrigger value="rental" className="gap-2">
                🚕 Rental Package
              </TabsTrigger>
              <TabsTrigger value="subscription" className="gap-2">
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
    <PageLayout 
      title="📝 Offline Bookings" 
      subtitle="Complete booking management system"
    >
      <div className="flex h-full">
        {/* Sidebar Navigation */}
        <div className="w-80 bg-white border-r border-gray-200 p-6 space-y-6">
          {/* Dashboard Stats */}
          <div className="grid grid-cols-2 gap-4">
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-orange-100 rounded-lg flex items-center justify-center">
                  <Clock className="w-5 h-5 text-orange-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.scheduledRides}</p>
                  <p className="text-xs text-gray-600">Scheduled</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.completedToday}</p>
                  <p className="text-xs text-gray-600">Today</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-blue-600" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                  <p className="text-xs text-gray-600">Revenue</p>
                </div>
              </div>
            </Card>
            
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Car className="w-5 h-5 text-purple-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold text-gray-900">{stats.activeVehicles}</p>
                  <p className="text-xs text-gray-600">Active</p>
                </div>
              </div>
            </Card>
          </div>

          {/* Navigation Menu */}
          <div className="space-y-2">
            <h3 className="text-sm font-semibold text-gray-900 mb-4">Booking Management</h3>
            {sidebarItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeView === item.id;
              
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveView(item.id as any)}
                  className={`w-full flex items-center gap-3 p-3 rounded-lg transition-all duration-200 ${
                    isActive 
                      ? 'bg-blue-50 border-l-4 border-blue-500 text-blue-700' 
                      : 'hover:bg-gray-50 text-gray-700'
                  }`}
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${
                    isActive ? 'bg-blue-100' : 'bg-gray-100'
                  }`}>
                    <Icon className={`w-5 h-5 ${isActive ? 'text-blue-600' : 'text-gray-600'}`} />
                  </div>
                  <div className="flex-1 text-left">
                    <div className="flex items-center justify-between">
                      <p className="font-medium">{item.label}</p>
                      {item.count && (
                        <Badge variant="secondary" className="text-xs">
                          {item.count}
                        </Badge>
                      )}
                    </div>
                    <p className="text-xs text-gray-500">{item.description}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 p-6">
          <div className="max-w-6xl mx-auto">
            {renderContent()}
          </div>
        </div>
      </div>
    </PageLayout>
  );
};

export default OfflineBookings;
