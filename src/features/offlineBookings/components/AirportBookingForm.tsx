import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import { useToast } from '@/hooks/use-toast';
import { Plane } from 'lucide-react';
import { CustomerInformationSection } from './forms/CustomerInformationSection';
import { BookingTypeSection } from './forms/BookingTypeSection';
import { ScheduleDetailsSection } from './forms/ScheduleDetailsSection';
import { VehicleDetailsSection } from './forms/VehicleDetailsSection';
import { PaymentDetailsSection } from './forms/PaymentDetailsSection';

const airportBookingSchema = z.object({
  customerName: z.string().min(2, 'Customer name must be at least 2 characters'),
  customerPhone: z.string().min(10, 'Phone number must be at least 10 digits').max(10, 'Phone number must be 10 digits'),
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

interface AirportBookingFormProps {
  onBack?: () => void;
}

export const AirportBookingForm = ({ onBack }: AirportBookingFormProps = {}) => {
  const { toast } = useToast();
  
  const form = useForm<AirportBookingFormData>({
    resolver: zodResolver(airportBookingSchema),
    defaultValues: {
      paymentMode: 'Cash',
    },
  });

  const watchPaymentMode = form.watch('paymentMode');

  // Auto-fill current date only (not time as per requirements)
  useEffect(() => {
    const now = new Date();
    const currentDate = now.toISOString().split('T')[0];
    
    form.setValue('date', currentDate);
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
    
    // Re-apply auto-fill date after reset
    const resetNow = new Date();
    const resetCurrentDate = resetNow.toISOString().split('T')[0];
    
    form.setValue('date', resetCurrentDate);
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

            <BookingTypeSection
              control={form.control}
              bookingTypeField="bookingType"
            />

            <div className="space-y-4">
              <ScheduleDetailsSection
                control={form.control}
                dateField="date"
                timeField="time"
              />
              
              <VehicleDetailsSection
                control={form.control}
                pilotNameField="pilotName"
                vehicleNumberField="vehicleNumber"
                costField="cost"
              />

              <PaymentDetailsSection
                control={form.control}
                paymentModeField="paymentMode"
                partPaymentCashField="partPaymentCash"
                partPaymentUPIField="partPaymentUPI"
                watchPaymentMode={watchPaymentMode}
                formPrefix="airport"
              />
            </div>

            <div className="flex justify-between pt-4">
              {onBack && (
                <Button type="button" variant="outline" onClick={onBack}>
                  ← Back to Home
                </Button>
              )}
              <Button type="submit" size="lg" className="min-w-32 ml-auto">
                Create Booking
              </Button>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};

