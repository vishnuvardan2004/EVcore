
import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { vehicleService } from '../../../services/database';
import { Deployment } from '../../../types/vehicle';

interface LiveDeployment {
  vehicleNumber: string;
  outTime: string;
  purpose: 'Office' | 'Pilot';
  driverName?: string;
  outSupervisor: string;
  deploymentId: string;
  duration: string;
}

export const LiveDeploymentStatus: React.FC = () => {
  const [liveDeployments, setLiveDeployments] = useState<LiveDeployment[]>([]);
  const [loading, setLoading] = useState(true);

  const calculateDuration = (outTimestamp: string): string => {
    const outTime = new Date(outTimestamp);
    const now = new Date();
    const diffMs = now.getTime() - outTime.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffMinutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));
    
    if (diffHours > 0) {
      return `${diffHours}h ${diffMinutes}m`;
    }
    return `${diffMinutes}m`;
  };

  const fetchLiveDeployments = async () => {
    try {
      setLoading(true);
      const deployments = await vehicleService.getDeploymentHistory();
      
      // Filter for active deployments (OUT but no IN)
      const activeDeployments = deployments.filter((deployment: Deployment) => 
        deployment.outTimestamp && !deployment.inTimestamp
      );
      
      // Convert to LiveDeployment format
      const liveData: LiveDeployment[] = activeDeployments.map((deployment: Deployment) => ({
        vehicleNumber: deployment.vehicleNumber,
        outTime: new Date(deployment.outTimestamp!).toLocaleString(),
        purpose: deployment.purpose,
        driverName: deployment.outData?.driverName || undefined,
        outSupervisor: deployment.outData?.supervisorName || 'Unknown',
        deploymentId: deployment.id,
        duration: calculateDuration(deployment.outTimestamp!)
      }));
      
      // Sort by most recent OUT time
      const sortedDeployments = liveData.sort((a, b) => 
        new Date(b.outTime).getTime() - new Date(a.outTime).getTime()
      );
      
      setLiveDeployments(sortedDeployments);
    } catch (error) {
      console.error('Error fetching live deployments:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveDeployments();
    
    // Auto-refresh every 30 seconds to update durations
    const interval = setInterval(fetchLiveDeployments, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2 justify-between">
          <div className="flex items-center gap-2">
            <ArrowUp className="w-5 h-5 text-green-600" />
            Live Deployment Status
            {liveDeployments.length > 0 && (
              <Badge variant="secondary" className="bg-green-100 text-green-700">
                {liveDeployments.length} Active
              </Badge>
            )}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={fetchLiveDeployments}
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
              <p className="text-sm text-gray-500">Loading live deployments...</p>
            </div>
          </div>
        ) : liveDeployments.length === 0 ? (
          <div className="text-center py-8">
            <p className="text-gray-500">No vehicles currently deployed</p>
            <p className="text-sm text-gray-400 mt-1">All vehicles are available for deployment</p>
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>OUT Time</TableHead>
                  <TableHead>Duration</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Supervisor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveDeployments.map((deployment, index) => (
                  <TableRow key={`${deployment.deploymentId}-${index}`}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700">
                          🟢 Active
                        </Badge>
                        {deployment.vehicleNumber}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{deployment.outTime}</TableCell>
                    <TableCell className="text-sm font-medium text-blue-600">{deployment.duration}</TableCell>
                    <TableCell>
                      <Badge variant={deployment.purpose === 'Office' ? 'default' : 'secondary'}>
                        {deployment.purpose}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-sm">{deployment.driverName || 'N/A'}</TableCell>
                    <TableCell className="text-sm">{deployment.outSupervisor}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
