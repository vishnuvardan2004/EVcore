
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';
import { Calendar } from 'lucide-react';

const subscriptionBookingSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerPhone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  pickupLocation: z.string().min(2, 'Pickup location must be at least 2 characters'),
  pickupTime: z.string().min(1, 'Pickup time is required'),
  pilotName: z.string().min(1, 'Pilot is required'),
  vehicleNumber: z.string().min(1, 'Vehicle is required'),
});

type SubscriptionBookingFormData = z.infer<typeof subscriptionBookingSchema>;

const pilots = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];
const vehicles = ['KA01AB1234', 'KA02CD5678', 'KA03EF9012', 'KA04GH3456'];

export const SubscriptionBookingForm = () => {
  const { toast } = useToast();
  
  const form = useForm<SubscriptionBookingFormData>({
    resolver: zodResolver(subscriptionBookingSchema),
  });

  const onSubmit = (data: SubscriptionBookingFormData) => {
    console.log('Subscription booking submitted:', data);
    
    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('subscriptionBookings') || '[]');
    const newBooking = {
      id: Date.now(),
      type: 'Subscription',
      ...data,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('subscriptionBookings', JSON.stringify([...existingBookings, newBooking]));

    toast({
      title: "Subscription Booking Created",
      description: `Recurring booking for ${data.customerName} has been successfully created.`,
    });

    form.reset();
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Calendar className="w-6 h-6 text-purple-600" />
          <CardTitle className="text-xl">Create Subscription Booking</CardTitle>
        </div>
        <CardDescription>
          Set up recurring bookings for regular customers
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Customer Information */}
            <Card className="border-gray-200">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  👤 Customer Information
                </CardTitle>
              </CardHeader>
              <CardContent className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="customerName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Customer Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Enter customer name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="customerPhone"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Phone Number</FormLabel>
                      <FormControl>
                        <Input placeholder="10-digit phone number" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Subscription Details */}
            <Card className="border-purple-200 bg-purple-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  📝 Subscription Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pickupLocation"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Location</FormLabel>
                        <FormControl>
                          <Input placeholder="Enter pickup address" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Time</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pilotName"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pilot Name</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select pilot" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {pilots.map((pilot) => (
                              <SelectItem key={pilot} value={pilot}>
                                {pilot}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="vehicleNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehicle Number</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select vehicle" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {vehicles.map((vehicle) => (
                              <SelectItem key={vehicle} value={vehicle}>
                                {vehicle}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="bg-purple-100 p-4 rounded-lg">
                  <p className="text-sm text-purple-800">
                    <strong>Note:</strong> This is a recurring booking setup. Payment will be handled separately for each trip.
                  </p>
                </div>
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="min-w-32">
                Create Subscription
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
