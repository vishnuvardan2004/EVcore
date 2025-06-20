
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { ArrowUp } from 'lucide-react';

interface LiveDeployment {
  vehicleNumber: string;
  outTime: string;
  purpose: 'Office' | 'Pilot';
  driverName?: string;
  outSupervisor: string;
}

export const LiveDeploymentStatus: React.FC = () => {
  // Mock data - replace with actual data from database
  const liveDeployments: LiveDeployment[] = [
    {
      vehicleNumber: 'V001',
      outTime: '2025-01-20 14:30',
      purpose: 'Office',
      driverName: 'Robert Chen',
      outSupervisor: 'John Smith'
    },
    {
      vehicleNumber: 'V003',
      outTime: '2025-01-20 12:15',
      purpose: 'Pilot',
      driverName: 'Amanda Davis',
      outSupervisor: 'Mike Wilson'
    },
    {
      vehicleNumber: 'V005',
      outTime: '2025-01-20 10:45',
      purpose: 'Office',
      driverName: 'Kevin Martinez',
      outSupervisor: 'David Lee'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <ArrowUp className="w-5 h-5 text-green-600" />
          Live Deployment Status
        </CardTitle>
      </CardHeader>
      <CardContent>
        {liveDeployments.length === 0 ? (
          <div className="text-center py-6 text-gray-500">
            No vehicles currently deployed
          </div>
        ) : (
          <div className="max-h-64 overflow-y-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Vehicle</TableHead>
                  <TableHead>OUT Time</TableHead>
                  <TableHead>Purpose</TableHead>
                  <TableHead>Driver</TableHead>
                  <TableHead>Supervisor</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {liveDeployments.map((deployment, index) => (
                  <TableRow key={index}>
                    <TableCell className="font-medium">
                      <div className="flex items-center gap-2">
                        <Badge className="bg-green-100 text-green-700">
                          🟢 Active
                        </Badge>
                        {deployment.vehicleNumber}
                      </div>
                    </TableCell>
                    <TableCell className="text-sm text-gray-600">{deployment.outTime}</TableCell>
                    <TableCell>{deployment.purpose}</TableCell>
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
