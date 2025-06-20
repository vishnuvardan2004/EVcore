
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Clock } from 'lucide-react';

interface Activity {
  vehicleNumber: string;
  status: 'IN' | 'OUT';
  purpose: 'Office' | 'Pilot';
  timestamp: string;
  supervisorName: string;
}

export const RecentVehicleActivities: React.FC = () => {
  // Mock data - replace with actual data from database
  const activities: Activity[] = [
    {
      vehicleNumber: 'V001',
      status: 'OUT',
      purpose: 'Office',
      timestamp: '2025-01-20 14:30',
      supervisorName: 'John Smith'
    },
    {
      vehicleNumber: 'V002',
      status: 'IN',
      purpose: 'Pilot',
      timestamp: '2025-01-20 13:45',
      supervisorName: 'Sarah Johnson'
    },
    {
      vehicleNumber: 'V003',
      status: 'OUT',
      purpose: 'Pilot',
      timestamp: '2025-01-20 12:15',
      supervisorName: 'Mike Wilson'
    },
    {
      vehicleNumber: 'V004',
      status: 'IN',
      purpose: 'Office',
      timestamp: '2025-01-20 11:30',
      supervisorName: 'Lisa Brown'
    },
    {
      vehicleNumber: 'V005',
      status: 'OUT',
      purpose: 'Office',
      timestamp: '2025-01-20 10:45',
      supervisorName: 'David Lee'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="w-5 h-5" />
          Recent Vehicle Activities
        </CardTitle>
      </CardHeader>
      <CardContent>
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
              <TableRow key={index}>
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
      </CardContent>
    </Card>
  );
};
