
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plane } from 'lucide-react';

const airportBookingSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerPhone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  pickupDateTime: z.string().min(1, 'Pickup date and time is required'),
  pickupPilot: z.string().min(1, 'Pickup pilot is required'),
  pickupVehicle: z.string().min(1, 'Pickup vehicle is required'),
  pickupCost: z.string().min(1, 'Pickup cost is required'),
  pickupPaymentMode: z.enum(['UPI', 'Cash']),
  dropDateTime: z.string().min(1, 'Drop date and time is required'),
  dropPilot: z.string().min(1, 'Drop pilot is required'),
  dropVehicle: z.string().min(1, 'Drop vehicle is required'),
  dropCost: z.string().min(1, 'Drop cost is required'),
  dropPaymentMode: z.enum(['UPI', 'Cash']),
});

type AirportBookingFormData = z.infer<typeof airportBookingSchema>;

const pilots = ['John Doe', 'Jane Smith', 'Mike Johnson', 'Sarah Wilson'];
const vehicles = ['KA01AB1234', 'KA02CD5678', 'KA03EF9012', 'KA04GH3456'];

export const AirportBookingForm = () => {
  const { toast } = useToast();
  
  const form = useForm<AirportBookingFormData>({
    resolver: zodResolver(airportBookingSchema),
    defaultValues: {
      pickupPaymentMode: 'UPI',
      dropPaymentMode: 'UPI',
    },
  });

  const onSubmit = (data: AirportBookingFormData) => {
    console.log('Airport booking submitted:', data);
    
    // Save to localStorage
    const existingBookings = JSON.parse(localStorage.getItem('airportBookings') || '[]');
    const newBooking = {
      id: Date.now(),
      type: 'Airport',
      ...data,
      createdAt: new Date().toISOString(),
    };
    localStorage.setItem('airportBookings', JSON.stringify([...existingBookings, newBooking]));

    toast({
      title: "Airport Booking Created",
      description: `Booking for ${data.customerName} has been successfully created.`,
    });

    form.reset();
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Plane className="w-6 h-6 text-blue-600" />
          <CardTitle className="text-xl">Create Airport Booking</CardTitle>
        </div>
        <CardDescription>
          Record pickup and drop bookings for airport transfers
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

            {/* Pickup Details */}
            <Card className="border-green-200 bg-green-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  📍 Pickup Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="pickupDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Date & Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Cost (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="pickupPilot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Pilot</FormLabel>
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
                    name="pickupVehicle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Pickup Vehicle</FormLabel>
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
                <FormField
                  control={form.control}
                  name="pickupPaymentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Pickup Payment Mode</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="UPI" id="pickup-upi" />
                            <Label htmlFor="pickup-upi">UPI</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Cash" id="pickup-cash" />
                            <Label htmlFor="pickup-cash">Cash</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            {/* Drop Details */}
            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  🎯 Drop Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="dropDateTime"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drop Date & Time</FormLabel>
                        <FormControl>
                          <Input type="datetime-local" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dropCost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drop Cost (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="dropPilot"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drop Pilot</FormLabel>
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
                    name="dropVehicle"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Drop Vehicle</FormLabel>
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
                <FormField
                  control={form.control}
                  name="dropPaymentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Drop Payment Mode</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="UPI" id="drop-upi" />
                            <Label htmlFor="drop-upi">UPI</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Cash" id="drop-cash" />
                            <Label htmlFor="drop-cash">Cash</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>

            <div className="flex justify-end pt-4">
              <Button type="submit" size="lg" className="min-w-32">
                Create Booking
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
