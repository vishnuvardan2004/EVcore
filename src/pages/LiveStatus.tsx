
import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Users, Clock, RefreshCw } from 'lucide-react';

const LiveStatus = () => {
  // Mock data for currently deployed vehicles
  const liveDeployments = [
    {
      id: 1,
      vehicleNumber: 'VH001',
      outTime: '2025-06-20T08:30:00',
      supervisor: 'John Doe',
      purpose: 'Client Meeting',
      duration: '2h 15m',
      status: 'active'
    },
    {
      id: 2,
      vehicleNumber: 'VH003',
      outTime: '2025-06-20T10:15:00',
      supervisor: 'Jane Smith',
      purpose: 'Site Inspection',
      duration: '45m',
      status: 'active'
    },
    {
      id: 3,
      vehicleNumber: 'VH005',
      outTime: '2025-06-20T07:00:00',
      supervisor: 'Mike Johnson',
      purpose: 'Emergency Response',
      duration: '4h 45m',
      status: 'overdue'
    }
  ];

  const handleRefresh = () => {
    console.log('Refreshing live status...');
    // Refresh logic will be implemented here
  };

  return (
    <PageLayout 
      title="🟢 Live Deployment Status" 
      subtitle="Real-time tracking of currently deployed vehicles"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2">
              <Users className="w-5 h-5 text-green-600" />
              <span className="font-medium">{liveDeployments.length} vehicles currently deployed</span>
            </div>
          </div>
          <Button onClick={handleRefresh} variant="outline" className="flex items-center gap-2">
            <RefreshCw className="w-4 h-4" />
            Refresh
          </Button>
        </div>

        <div className="grid gap-4">
          {liveDeployments.map((deployment) => (
            <Card key={deployment.id} className="hover:shadow-md transition-shadow">
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-6">
                    <div>
                      <h3 className="text-lg font-semibold">{deployment.vehicleNumber}</h3>
                      <p className="text-sm text-gray-600">Supervisor: {deployment.supervisor}</p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-gray-500" />
                      <span className="text-sm">Out since {new Date(deployment.outTime).toLocaleTimeString()}</span>
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium">Purpose:</p>
                      <p className="text-sm text-gray-600">{deployment.purpose}</p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    <div className="text-right">
                      <p className="text-lg font-semibold text-gray-900">{deployment.duration}</p>
                      <p className="text-xs text-gray-500">Duration</p>
                    </div>
                    
                    <Badge 
                      variant={deployment.status === 'overdue' ? 'destructive' : 'default'}
                      className={deployment.status === 'active' ? 'bg-green-100 text-green-800' : ''}
                    >
                      {deployment.status === 'overdue' ? '⚠️ Overdue' : '🟢 Active'}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {liveDeployments.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Deployments</h3>
              <p className="text-gray-600">All vehicles are currently checked in.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </PageLayout>
  );
};

export default LiveStatus;
