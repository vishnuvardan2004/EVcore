
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { vehicleService } from '../../../services/database';
import { Deployment } from '../../../types/vehicle';

interface Activity {
  vehicleNumber: string;
  status: 'IN' | 'OUT';
  purpose: 'Office' | 'Pilot';
  timestamp: string;
  supervisorName: string;
  deploymentId: string;
}

export const RecentVehicleActivities: React.FC = () => {
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecentActivities = async () => {
    try {
      setLoading(true);
      const deployments = await vehicleService.getDeploymentHistory();
      
      // Convert deployments to activities and sort by most recent
      const recentActivities: Activity[] = [];
      
      deployments.forEach((deployment: Deployment) => {
        // Add OUT activity
        if (deployment.outTimestamp) {
          recentActivities.push({
            vehicleNumber: deployment.vehicleNumber,
            status: 'OUT',
            purpose: deployment.purpose,
            timestamp: new Date(deployment.outTimestamp).toLocaleString(),
            supervisorName: deployment.outData?.supervisorName || 'Unknown',
            deploymentId: deployment.id
          });
        }
        
        // Add IN activity if exists
        if (deployment.inTimestamp) {
          recentActivities.push({
            vehicleNumber: deployment.vehicleNumber,
            status: 'IN',
            purpose: deployment.purpose,
            timestamp: new Date(deployment.inTimestamp).toLocaleString(),
            supervisorName: deployment.inData?.inSupervisorName || 'Unknown',
            deploymentId: deployment.id
          });
        }
      });
      
      // Sort by timestamp (most recent first) and take last 10
      const sortedActivities = recentActivities
        .sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())
        .slice(0, 10);
      
      setActivities(sortedActivities);
    } catch (error) {
      console.error('Error fetching recent activities:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecentActivities();
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Vehicle Activities
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchRecentActivities}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-center">
              <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
              <p className="text-sm text-gray-500">Loading recent activities...</p>
            </div>
          </div>
        ) : activities.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No recent vehicle activities found.</p>
            <p className="text-sm text-gray-400 mt-1">Deploy a vehicle to see activities here.</p>
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Purpose</TableHead>
                <TableHead>Time</TableHead>
                <TableHead>Supervisor</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {activities.map((activity, index) => (
                <TableRow key={`${activity.deploymentId}-${activity.status}-${index}`}>
                  <TableCell className="font-medium">{activity.vehicleNumber}</TableCell>
                  <TableCell>
                    <Badge 
                      variant={activity.status === 'OUT' ? 'destructive' : 'secondary'}
                      className={activity.status === 'OUT' ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}
                    >
                      {activity.status === 'OUT' ? '🔴' : '🟢'} {activity.status}
                    </Badge>
                  </TableCell>
                  <TableCell>{activity.purpose}</TableCell>
                  <TableCell className="text-sm text-gray-600">{activity.timestamp}</TableCell>
                  <TableCell className="text-sm">{activity.supervisorName}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
    </Card>
  );
};
