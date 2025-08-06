
import React, { useState, useEffect } from 'react';
import { VehicleTrackerLayout } from '../components/VehicleTrackerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { AlertTriangle, Eye, Clock } from 'lucide-react';
import { vehicleService } from '../../../services/database';
import { Deployment } from '../../../types/vehicle';

interface AlertData {
  id: string;
  vehicleNumber: string;
  timestamp: string;
  type: 'checklist_mismatch' | 'overdue_return' | 'other';
  severity: 'major' | 'minor';
  description: string;
  status: 'resolved' | 'acknowledged' | 'unresolved';
}

const Alerts = () => {
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchAlerts = async () => {
    try {
      setLoading(true);
      const deployments = await vehicleService.getDeploymentHistory();
      
      const alertData: AlertData[] = [];
      
      deployments.forEach((deployment: Deployment) => {
        // Check for checklist mismatches
        if (deployment.inData?.checklistMismatches && deployment.inData.checklistMismatches.length > 0) {
          deployment.inData.checklistMismatches.forEach((issue, index) => {
            alertData.push({
              id: `${deployment.id}-mismatch-${index}`,
              vehicleNumber: deployment.vehicleNumber,
              timestamp: deployment.inTimestamp || deployment.outTimestamp || new Date().toISOString(),
              type: 'checklist_mismatch',
              severity: 'major',
              description: `Checklist mismatch: ${issue}`,
              status: 'unresolved'
            });
          });
        }
        
        // Check for overdue vehicles (still out for more than 8 hours)
        if (deployment.outTimestamp && !deployment.inTimestamp) {
          const outTime = new Date(deployment.outTimestamp);
          const now = new Date();
          const hoursOut = (now.getTime() - outTime.getTime()) / (1000 * 60 * 60);
          
          if (hoursOut > 8) {
            alertData.push({
              id: `${deployment.id}-overdue`,
              vehicleNumber: deployment.vehicleNumber,
              timestamp: deployment.outTimestamp,
              type: 'overdue_return',
              severity: 'major',
              description: `Vehicle overdue for return by ${Math.floor(hoursOut - 8)} hours`,
              status: 'unresolved'
            });
          }
        }
      });
      
      // Sort by most recent
      const sortedAlerts = alertData.sort((a, b) => 
        new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime()
      );
      
      setAlerts(sortedAlerts);
    } catch (error) {
      console.error('Error fetching alerts:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAlerts();
    
    // Refresh alerts every 30 seconds
    const interval = setInterval(fetchAlerts, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const getSeverityBadge = (severity: string) => {
    if (severity === 'major') {
      return <Badge variant="destructive">🔴 Major</Badge>;
    }
    return <Badge variant="secondary">🟡 Minor</Badge>;
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'resolved':
        return <Badge className="bg-green-100 text-green-800">✅ Resolved</Badge>;
      case 'acknowledged':
        return <Badge variant="outline">👁️ Acknowledged</Badge>;
      default:
        return <Badge variant="destructive">⚠️ Unresolved</Badge>;
    }
  };

  const handleViewDetails = (alertId: string) => {
    console.log('Viewing alert details:', alertId);
    // Navigate to detailed view
  };

  return (
    <VehicleTrackerLayout 
      title="⚠️ Alerts & Mismatches" 
      subtitle="Monitor checklist discrepancies and deployment issues"
    >
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-red-100 rounded-lg">
                  <AlertTriangle className="w-6 h-6 text-red-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : alerts.filter(a => a.status === 'unresolved').length}
                  </p>
                  <p className="text-sm text-gray-600">Unresolved Issues</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-yellow-100 rounded-lg">
                  <Eye className="w-6 h-6 text-yellow-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : alerts.filter(a => a.status === 'acknowledged').length}
                  </p>
                  <p className="text-sm text-gray-600">Acknowledged</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-6">
              <div className="flex items-center gap-4">
                <div className="p-3 bg-green-100 rounded-lg">
                  <Clock className="w-6 h-6 text-green-600" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {loading ? '...' : alerts.filter(a => a.status === 'resolved').length}
                  </p>
                  <p className="text-sm text-gray-600">Resolved Today</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Alerts List */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Alerts</CardTitle>
            <CardDescription>
              Checklist mismatches and deployment issues requiring attention
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {alerts.map((alert) => (
                <div key={alert.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="font-semibold text-lg">{alert.vehicleNumber}</div>
                    <div className="flex flex-col">
                      <p className="font-medium">{alert.description}</p>
                      <p className="text-sm text-gray-600">
                        {new Date(alert.timestamp).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {getSeverityBadge(alert.severity)}
                    {getStatusBadge(alert.status)}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => handleViewDetails(alert.id)}
                      className="flex items-center gap-2"
                    >
                      <Eye className="w-4 h-4" />
                      View Details
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {alerts.length === 0 && (
          <Card>
            <CardContent className="p-12 text-center">
              <AlertTriangle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No Active Alerts</h3>
              <p className="text-gray-600">All deployments are running smoothly.</p>
            </CardContent>
          </Card>
        )}
      </div>
    </VehicleTrackerLayout>
  );
};

export default Alerts;
