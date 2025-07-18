
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AlertTriangle } from 'lucide-react';

interface ChecklistAlert {
  vehicleNumber: string;
  inDate: string;
  issues: string[];
  inSupervisor: string;
}

export const AlertsWarnings: React.FC = () => {
  // Mock data - replace with actual data from database
  const alerts: ChecklistAlert[] = [
    {
      vehicleNumber: 'V002',
      inDate: '2025-01-20 13:45',
      issues: ['Fire Extinguisher missing', 'Torch not working'],
      inSupervisor: 'Sarah Johnson'
    },
    {
      vehicleNumber: 'V004',
      inDate: '2025-01-20 11:30',
      issues: ['Medical Kit incomplete'],
      inSupervisor: 'Lisa Brown'
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <AlertTriangle className="w-5 h-5 text-yellow-600" />
          Alerts & Warnings
        </CardTitle>
      </CardHeader>
      <CardContent>
        {alerts.length === 0 ? (
          <Alert className="border-green-200 bg-green-50">
            <AlertDescription className="text-green-700">
              ✅ All recent vehicles passed checklist verification.
            </AlertDescription>
          </Alert>
        ) : (
          <div className="space-y-4">
            {alerts.map((alert, index) => (
              <Alert key={index} variant="destructive" className="border-red-200">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  <div className="space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <span className="font-semibold">Vehicle {alert.vehicleNumber}</span>
                        <span className="text-sm text-gray-600 ml-2">({alert.inDate})</span>
                      </div>
                      <span className="text-sm text-gray-600">IN Supervisor: {alert.inSupervisor}</span>
                    </div>
                    <div className="pl-4">
                      <p className="font-medium text-red-700 mb-1">Checklist Issues:</p>
                      <ul className="list-disc list-inside space-y-1">
                        {alert.issues.map((issue, issueIndex) => (
                          <li key={issueIndex} className="text-red-600 text-sm">
                            ⚠️ {issue}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </AlertDescription>
              </Alert>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
