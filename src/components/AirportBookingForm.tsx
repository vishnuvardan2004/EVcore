
import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Plane } from 'lucide-react';
import { CustomerInformationSection } from './forms/CustomerInformationSection';
import { PickupDetailsSection } from './forms/PickupDetailsSection';
import { DropDetailsSection } from './forms/DropDetailsSection';

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
            <CustomerInformationSection
              control={form.control}
              customerNameField="customerName"
              customerPhoneField="customerPhone"
            />

            <PickupDetailsSection
              control={form.control}
              pickupDateTimeField="pickupDateTime"
              pickupCostField="pickupCost"
              pickupPilotField="pickupPilot"
              pickupVehicleField="pickupVehicle"
              pickupPaymentModeField="pickupPaymentMode"
              pilots={pilots}
              vehicles={vehicles}
            />

            <DropDetailsSection
              control={form.control}
              dropDateTimeField="dropDateTime"
              dropCostField="dropCost"
              dropPilotField="dropPilot"
              dropVehicleField="dropVehicle"
              dropPaymentModeField="dropPaymentMode"
              pilots={pilots}
              vehicles={vehicles}
            />

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
