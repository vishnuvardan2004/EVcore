
import React, { useEffect, useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Trash2, Phone, MapPin, Clock, User, Car, CreditCard } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

interface Booking {
  id: number;
  type: string;
  customerName: string;
  customerPhone: string;
  createdAt: string;
  [key: string]: any;
}

export const BookingsView = () => {
  const [airportBookings, setAirportBookings] = useState<Booking[]>([]);
  const [rentalBookings, setRentalBookings] = useState<Booking[]>([]);
  const [subscriptionBookings, setSubscriptionBookings] = useState<Booking[]>([]);
  const { toast } = useToast();

  useEffect(() => {
    // Load bookings from localStorage
    const loadBookings = () => {
      setAirportBookings(JSON.parse(localStorage.getItem('airportBookings') || '[]'));
      setRentalBookings(JSON.parse(localStorage.getItem('rentalBookings') || '[]'));
      setSubscriptionBookings(JSON.parse(localStorage.getItem('subscriptionBookings') || '[]'));
    };

    loadBookings();
  }, []);

  const deleteBooking = (id: number, type: string) => {
    const storageKey = type === 'Airport' ? 'airportBookings' : 
                      type === 'Rental Package' ? 'rentalBookings' : 'subscriptionBookings';
    
    const currentBookings = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const updatedBookings = currentBookings.filter((booking: Booking) => booking.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(updatedBookings));

    // Update state
    if (type === 'Airport') {
      setAirportBookings(updatedBookings);
    } else if (type === 'Rental Package') {
      setRentalBookings(updatedBookings);
    } else {
      setSubscriptionBookings(updatedBookings);
    }

    toast({
      title: "Booking Deleted",
      description: "The booking has been successfully removed.",
      variant: "destructive",
    });
  };

  const formatDateTime = (dateTime: string) => {
    return new Date(dateTime).toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const AirportBookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-4 h-4" />
              {booking.customerName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Phone className="w-3 h-3" />
              {booking.customerPhone}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">✈️ Airport</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteBooking(booking.id, booking.type)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Pickup Details */}
          <div className="space-y-2 p-3 bg-green-50 rounded-lg border border-green-200">
            <h4 className="font-semibold text-green-800 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Pickup Details
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>Time:</strong> {formatDateTime(booking.pickupDateTime)}</p>
              <p><strong>Pilot:</strong> {booking.pickupPilot}</p>
              <p><strong>Vehicle:</strong> {booking.pickupVehicle}</p>
              <p><strong>Cost:</strong> ₹{booking.pickupCost}</p>
              <p><strong>Payment:</strong> {booking.pickupPaymentMode}</p>
            </div>
          </div>
          
          {/* Drop Details */}
          <div className="space-y-2 p-3 bg-blue-50 rounded-lg border border-blue-200">
            <h4 className="font-semibold text-blue-800 flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Drop Details
            </h4>
            <div className="text-sm space-y-1">
              <p><strong>Time:</strong> {formatDateTime(booking.dropDateTime)}</p>
              <p><strong>Pilot:</strong> {booking.dropPilot}</p>
              <p><strong>Vehicle:</strong> {booking.dropVehicle}</p>
              <p><strong>Cost:</strong> ₹{booking.dropCost}</p>
              <p><strong>Payment:</strong> {booking.dropPaymentMode}</p>
            </div>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-3">
          Created: {formatDateTime(booking.createdAt)}
        </div>
      </CardContent>
    </Card>
  );

  const RentalBookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-4 h-4" />
              {booking.customerName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Phone className="w-3 h-3" />
              {booking.customerPhone}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">🚕 Rental</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteBooking(booking.id, booking.type)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-orange-600" />
              <strong>Location:</strong> {booking.pickupLocation}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-orange-600" />
              <strong>Time:</strong> {formatDateTime(booking.pickupDateTime)}
            </p>
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-orange-600" />
              <strong>Pilot:</strong> {booking.pilotName}
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <Car className="w-4 h-4 text-orange-600" />
              <strong>Vehicle:</strong> {booking.vehicleNumber}
            </p>
            <p className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-600" />
              <strong>Cost:</strong> ₹{booking.cost}
            </p>
            <p className="flex items-center gap-2">
              <CreditCard className="w-4 h-4 text-orange-600" />
              <strong>Payment:</strong> {booking.paymentMode}
            </p>
          </div>
        </div>
        <div className="text-xs text-gray-500 mt-3">
          Created: {formatDateTime(booking.createdAt)}
        </div>
      </CardContent>
    </Card>
  );

  const SubscriptionBookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-4 h-4" />
              {booking.customerName}
            </CardTitle>
            <CardDescription className="flex items-center gap-2 mt-1">
              <Phone className="w-3 h-3" />
              {booking.customerPhone}
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="outline">📝 Subscription</Badge>
            <Button
              variant="outline"
              size="sm"
              onClick={() => deleteBooking(booking.id, booking.type)}
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-purple-600" />
              <strong>Location:</strong> {booking.pickupLocation}
            </p>
            <p className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600" />
              <strong>Time:</strong> {booking.pickupTime}
            </p>
          </div>
          <div className="space-y-2">
            <p className="flex items-center gap-2">
              <User className="w-4 h-4 text-purple-600" />
              <strong>Pilot:</strong> {booking.pilotName}
            </p>
            <p className="flex items-center gap-2">
              <Car className="w-4 h-4 text-purple-600" />
              <strong>Vehicle:</strong> {booking.vehicleNumber}
            </p>
          </div>
        </div>
        <div className="bg-purple-100 p-2 rounded mt-3">
          <p className="text-xs text-purple-800">🔄 Recurring booking - Payment handled per trip</p>
        </div>
        <div className="text-xs text-gray-500 mt-2">
          Created: {formatDateTime(booking.createdAt)}
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl">All Bookings</CardTitle>
          <CardDescription>
            View and manage all offline bookings across different categories
          </CardDescription>
        </CardHeader>
      </Card>

      <Tabs defaultValue="airport" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="airport">
            ✈️ Airport ({airportBookings.length})
          </TabsTrigger>
          <TabsTrigger value="rental">
            🚕 Rental ({rentalBookings.length})
          </TabsTrigger>
          <TabsTrigger value="subscription">
            📝 Subscription ({subscriptionBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="airport" className="mt-6">
          {airportBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No airport bookings found</p>
              </CardContent>
            </Card>
          ) : (
            airportBookings.map((booking) => (
              <AirportBookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="rental" className="mt-6">
          {rentalBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No rental bookings found</p>
              </CardContent>
            </Card>
          ) : (
            rentalBookings.map((booking) => (
              <RentalBookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          {subscriptionBookings.length === 0 ? (
            <Card>
              <CardContent className="text-center py-8">
                <p className="text-gray-500">No subscription bookings found</p>
              </CardContent>
            </Card>
          ) : (
            subscriptionBookings.map((booking) => (
              <SubscriptionBookingCard key={booking.id} booking={booking} />
            ))
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
