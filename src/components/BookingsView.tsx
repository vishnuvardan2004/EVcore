
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Eye, Trash2, Calendar, User, Phone, MapPin, Car, IndianRupee } from 'lucide-react';

interface Booking {
  id: number;
  type: 'Airport' | 'Rental Package' | 'Subscription';
  customerName: string;
  customerPhone: string;
  createdAt: string;
  [key: string]: any;
}

export const BookingsView = () => {
  const [airportBookings, setAirportBookings] = useState<Booking[]>([]);
  const [rentalBookings, setRentalBookings] = useState<Booking[]>([]);
  const [subscriptionBookings, setSubscriptionBookings] = useState<Booking[]>([]);

  useEffect(() => {
    // Load bookings from localStorage
    const loadBookings = () => {
      const airport = JSON.parse(localStorage.getItem('airportBookings') || '[]');
      const rental = JSON.parse(localStorage.getItem('rentalBookings') || '[]');
      const subscription = JSON.parse(localStorage.getItem('subscriptionBookings') || '[]');
      
      setAirportBookings(airport);
      setRentalBookings(rental);
      setSubscriptionBookings(subscription);
    };

    loadBookings();
    
    // Set up interval to refresh data every 2 seconds
    const interval = setInterval(loadBookings, 2000);
    return () => clearInterval(interval);
  }, []);

  const deleteBooking = (id: number, type: string) => {
    const storageKey = type === 'Airport' ? 'airportBookings' : 
                     type === 'Rental Package' ? 'rentalBookings' : 'subscriptionBookings';
    
    const bookings = JSON.parse(localStorage.getItem(storageKey) || '[]');
    const filtered = bookings.filter((booking: Booking) => booking.id !== id);
    localStorage.setItem(storageKey, JSON.stringify(filtered));
    
    if (type === 'Airport') setAirportBookings(filtered);
    else if (type === 'Rental Package') setRentalBookings(filtered);
    else setSubscriptionBookings(filtered);
  };

  const BookingCard = ({ booking }: { booking: Booking }) => (
    <Card className="mb-4">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-lg flex items-center gap-2">
              <User className="w-4 h-4" />
              {booking.customerName}
            </CardTitle>
            <CardDescription className="flex items-center gap-4 mt-2">
              <span className="flex items-center gap-1">
                <Phone className="w-3 h-3" />
                {booking.customerPhone}
              </span>
              <span className="flex items-center gap-1">
                <Calendar className="w-3 h-3" />
                {new Date(booking.createdAt).toLocaleDateString()}
              </span>
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Badge variant="secondary">{booking.type}</Badge>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => deleteBooking(booking.id, booking.type)}
              className="text-red-600 hover:text-red-700"
            >
              <Trash2 className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {booking.type === 'Airport' && (
          <div className="space-y-3">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="bg-green-50 p-3 rounded-lg">
                <h4 className="font-semibold text-green-800 mb-2">📍 Pickup</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Date:</strong> {new Date(booking.pickupDateTime).toLocaleString()}</p>
                  <p><strong>Pilot:</strong> {booking.pickupPilot}</p>
                  <p><strong>Vehicle:</strong> {booking.pickupVehicle}</p>
                  <p><strong>Cost:</strong> ₹{booking.pickupCost}</p>
                  <p><strong>Payment:</strong> {booking.pickupPaymentMode}</p>
                </div>
              </div>
              <div className="bg-blue-50 p-3 rounded-lg">
                <h4 className="font-semibold text-blue-800 mb-2">🎯 Drop</h4>
                <div className="text-sm space-y-1">
                  <p><strong>Date:</strong> {new Date(booking.dropDateTime).toLocaleString()}</p>
                  <p><strong>Pilot:</strong> {booking.dropPilot}</p>
                  <p><strong>Vehicle:</strong> {booking.dropVehicle}</p>
                  <p><strong>Cost:</strong> ₹{booking.dropCost}</p>
                  <p><strong>Payment:</strong> {booking.dropPaymentMode}</p>
                </div>
              </div>
            </div>
          </div>
        )}
        
        {booking.type === 'Rental Package' && (
          <div className="bg-orange-50 p-3 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <strong>Pickup:</strong> {booking.pickupLocation}
                </p>
                <p><strong>Date:</strong> {new Date(booking.pickupDateTime).toLocaleString()}</p>
                <p className="flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  <strong>Vehicle:</strong> {booking.vehicleNumber}
                </p>
              </div>
              <div className="space-y-1">
                <p><strong>Pilot:</strong> {booking.pilotName}</p>
                <p className="flex items-center gap-1">
                  <IndianRupee className="w-3 h-3" />
                  <strong>Cost:</strong> ₹{booking.cost}
                </p>
                <p><strong>Payment:</strong> {booking.paymentMode}</p>
              </div>
            </div>
          </div>
        )}
        
        {booking.type === 'Subscription' && (
          <div className="bg-purple-50 p-3 rounded-lg">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div className="space-y-1">
                <p className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  <strong>Pickup:</strong> {booking.pickupLocation}
                </p>
                <p><strong>Time:</strong> {booking.pickupTime}</p>
              </div>
              <div className="space-y-1">
                <p><strong>Pilot:</strong> {booking.pilotName}</p>
                <p className="flex items-center gap-1">
                  <Car className="w-3 h-3" />
                  <strong>Vehicle:</strong> {booking.vehicleNumber}
                </p>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Eye className="w-5 h-5" />
        <h2 className="text-2xl font-bold">All Bookings</h2>
      </div>

      <Tabs defaultValue="airport" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="airport" className="gap-2">
            ✈️ Airport ({airportBookings.length})
          </TabsTrigger>
          <TabsTrigger value="rental" className="gap-2">
            🚕 Rental ({rentalBookings.length})
          </TabsTrigger>
          <TabsTrigger value="subscription" className="gap-2">
            📝 Subscription ({subscriptionBookings.length})
          </TabsTrigger>
        </TabsList>

        <TabsContent value="airport" className="mt-6">
          {airportBookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No airport bookings found. Create your first booking!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {airportBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="rental" className="mt-6">
          {rentalBookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No rental package bookings found. Create your first booking!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {rentalBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="subscription" className="mt-6">
          {subscriptionBookings.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center text-gray-500">
                No subscription bookings found. Create your first booking!
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {subscriptionBookings.map((booking) => (
                <BookingCard key={booking.id} booking={booking} />
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};
