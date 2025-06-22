
import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { AirportBookingForm } from '../components/AirportBookingForm';
import { RentalPackageForm } from '../components/RentalPackageForm';
import { SubscriptionBookingForm } from '../components/SubscriptionBookingForm';
import { BookingsView } from '../components/BookingsView';
import { Button } from '@/components/ui/button';
import { Eye, Plus } from 'lucide-react';

const OfflineBookings = () => {
  const [showBookings, setShowBookings] = useState(false);

  return (
    <PageLayout 
      title="📝 Offline Bookings" 
      subtitle="Record manual/offline ride bookings"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <h2 className="text-2xl font-bold text-gray-900">Booking Management</h2>
          <Button 
            onClick={() => setShowBookings(!showBookings)}
            variant="outline"
            className="gap-2"
          >
            {showBookings ? <Plus className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            {showBookings ? 'Create New Booking' : 'View All Bookings'}
          </Button>
        </div>

        {showBookings ? (
          <BookingsView />
        ) : (
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
        )}
      </div>
    </PageLayout>
  );
};

export default OfflineBookings;
