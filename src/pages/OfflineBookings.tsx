
import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const OfflineBookings = () => {
  const navigate = useNavigate();

  return (
    <PageLayout 
      title="📝 Offline Bookings" 
      subtitle="Record manual/offline ride bookings"
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">📝</div>
            <CardTitle className="text-2xl">Offline Bookings</CardTitle>
            <CardDescription>
              Manual booking system for offline and phone-based ride reservations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Features coming soon:
            </p>
            <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
              <li>• Manual booking forms</li>
              <li>• Customer information capture</li>
              <li>• Ride scheduling</li>
              <li>• Payment tracking</li>
              <li>• Booking confirmations</li>
            </ul>
            <div className="pt-6">
              <Button onClick={() => navigate('/')} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default OfflineBookings;
