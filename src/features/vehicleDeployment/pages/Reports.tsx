import React from 'react';
import { VehicleTrackerLayout } from '../components/VehicleTrackerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BarChart3, FileText, Download, Calendar } from 'lucide-react';

const Reports = () => {
  const handleGenerateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report...`);
    // Report generation logic will be implemented here
  };

  const reportTypes = [
    {
      title: 'Daily Deployment Report',
      description: 'Summary of all vehicle deployments for a specific day',
      icon: Calendar,
      type: 'daily'
    },
    {
      title: 'Weekly Analytics',
      description: 'Comprehensive analysis of deployment patterns and trends',
      icon: BarChart3,
      type: 'weekly'
    },
    {
      title: 'Vehicle Utilization Report',
      description: 'Detailed breakdown of vehicle usage and efficiency metrics',
      icon: FileText,
      type: 'utilization'
    },
    {
      title: 'Checklist Mismatch Summary',
      description: 'Analysis of discrepancies and operational issues',
      icon: FileText,
      type: 'mismatches'
    }
  ];

  return (
    <VehicleTrackerLayout 
      title="📊 Deployment Reports" 
      subtitle="Generate analytics and insights from vehicle deployment data"
    >
      <div className="space-y-6">
        {/* Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">42</p>
                <p className="text-sm text-gray-600">Total Deployments This Week</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-green-600">38</p>
                <p className="text-sm text-gray-600">Successful Returns</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-yellow-600">3</p>
                <p className="text-sm text-gray-600">Pending Returns</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-6">
              <div className="text-center">
                <p className="text-2xl font-bold text-red-600">1</p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Report Generation */}
        <Card>
          <CardHeader>
            <CardTitle>Generate Reports</CardTitle>
            <CardDescription>
              Create detailed reports and analytics for vehicle deployment operations
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {reportTypes.map((report) => (
                <Card key={report.type} className="border border-gray-200 hover:border-blue-300 transition-colors">
                  <CardContent className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="p-3 bg-blue-50 rounded-lg">
                        <report.icon className="w-6 h-6 text-blue-600" />
                      </div>
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg mb-2">{report.title}</h3>
                        <p className="text-gray-600 text-sm mb-4">{report.description}</p>
                        <Button 
                          onClick={() => handleGenerateReport(report.type)}
                          className="w-full"
                          variant="outline"
                        >
                          <Download className="w-4 h-4 mr-2" />
                          Generate Report
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Recent Reports */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Previously generated reports available for download
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Daily Report - July 20, 2025</p>
                  <p className="text-sm text-gray-600">Generated 2 hours ago</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Weekly Analytics - July 14-20, 2025</p>
                  <p className="text-sm text-gray-600">Generated yesterday</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
              
              <div className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <p className="font-medium">Vehicle Utilization - July 2025</p>
                  <p className="text-sm text-gray-600">Generated 3 days ago</p>
                </div>
                <Button size="sm" variant="outline">
                  <Download className="w-4 h-4 mr-2" />
                  Download
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </VehicleTrackerLayout>
  );
};

export default Reports;
