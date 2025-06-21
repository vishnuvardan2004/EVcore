
import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const ChargingTracker = () => {
  const navigate = useNavigate();

  return (
    <PageLayout 
      title="⚡ Vehicle Charging Tracker" 
      subtitle="Monitor charging status of vehicles"
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">⚡</div>
            <CardTitle className="text-2xl">Vehicle Charging Tracker</CardTitle>
            <CardDescription>
              Real-time monitoring and management of vehicle charging operations
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Features coming soon:
            </p>
            <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
              <li>• Real-time charging status</li>
              <li>• Battery level monitoring</li>
              <li>• Charging schedule management</li>
              <li>• Energy consumption reports</li>
              <li>• Charging station allocation</li>
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

export default ChargingTracker;
