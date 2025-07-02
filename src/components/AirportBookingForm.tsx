
import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Plane } from 'lucide-react';
import { CustomerInformationSection } from './forms/CustomerInformationSection';

const airportBookingSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerPhone: z.string().regex(/^\d{10}$/, 'Phone number must be 10 digits'),
  bookingType: z.enum(['pickup', 'drop']),
  date: z.string().min(1, 'Date is required'),
  time: z.string().min(1, 'Time is required'),
  pilotName: z.string().min(1, 'Pilot name is required'),
  vehicleNumber: z.string().min(1, 'Vehicle number is required'),
  cost: z.string().min(1, 'Cost is required'),
  paymentMode: z.enum(['Cash', 'UPI', 'Part Payment']),
  partPaymentCash: z.string().optional(),
  partPaymentUPI: z.string().optional(),
}).refine((data) => {
  if (data.paymentMode === 'Part Payment') {
    return data.partPaymentCash && data.partPaymentUPI;
  }
  return true;
}, {
  message: "Both cash and UPI amounts are required for part payment",
  path: ["paymentMode"],
});

type AirportBookingFormData = z.infer<typeof airportBookingSchema>;

export const AirportBookingForm = () => {
  const { toast } = useToast();
  
  const form = useForm<AirportBookingFormData>({
    resolver: zodResolver(airportBookingSchema),
    defaultValues: {
      paymentMode: 'Cash',
    },
  });

  const watchPaymentMode = form.watch('paymentMode');

  // Auto-fill current date and time
  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    const currentTime = now.toTimeString().slice(0, 5);
    
    form.setValue('date', currentDate);
    form.setValue('time', currentTime);
  }, [form]);

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
    
    // Re-apply auto-fill after reset
    const resetNow = new Date();
    const resetCurrentDate = resetNow.toISOString().split('T')[0];
    const resetCurrentTime = resetNow.toTimeString().slice(0, 5);
    
    form.setValue('date', resetCurrentDate);
    form.setValue('time', resetCurrentTime);
    form.setValue('paymentMode', 'Cash');
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <div className="flex items-center justify-center gap-2 mb-2">
          <Plane className="w-6 h-6 text-blue-600" />
          <CardTitle className="text-xl">Create Airport Booking</CardTitle>
        </div>
        <CardDescription>
          Record airport pickup and drop bookings
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <CustomerInformationSection
              control={form.control}
              customerNameField="customerName"
              customerPhoneField="customerPhone"
            />

            <Card className="border-blue-200 bg-blue-50/30">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg flex items-center gap-2">
                  ✈️ Airport Booking Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <FormField
                  control={form.control}
                  name="bookingType"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Booking Type</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="pickup" id="pickup" />
                            <Label htmlFor="pickup">Pickup from Airport</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="drop" id="drop" />
                            <Label htmlFor="drop">Drop at Airport</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            placeholder="HH:MM"
                            pattern="[0-9]{2}:[0-9]{2}"
                            {...field} 
                          />
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
                        <FormControl>
                          <Input placeholder="Enter pilot name" {...field} />
                        </FormControl>
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
                        <FormControl>
                          <Input placeholder="Enter vehicle number" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="cost"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cost (₹)</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="Enter amount" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>

                <FormField
                  control={form.control}
                  name="paymentMode"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Payment Mode</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          className="flex gap-6"
                        >
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Cash" id="airport-cash" />
                            <Label htmlFor="airport-cash">Cash</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="UPI" id="airport-upi" />
                            <Label htmlFor="airport-upi">UPI</Label>
                          </div>
                          <div className="flex items-center space-x-2">
                            <RadioGroupItem value="Part Payment" id="airport-part" />
                            <Label htmlFor="airport-part">Part Payment</Label>
                          </div>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                {watchPaymentMode === 'Part Payment' && (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
                    <FormField
                      control={form.control}
                      name="partPaymentCash"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Cash Amount (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter cash amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name="partPaymentUPI"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>UPI Amount (₹)</FormLabel>
                          <FormControl>
                            <Input type="number" placeholder="Enter UPI amount" {...field} />
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                )}
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
