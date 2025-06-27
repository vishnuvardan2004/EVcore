
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download, FileText, BarChart, Users, Car } from 'lucide-react';

const GlobalReports = () => {
  const reports = [
    {
      title: "Vehicle Trip Summary",
      description: "Complete vehicle deployment and trip data",
      icon: Car,
      period: "Last 30 days",
      format: "CSV, PDF"
    },
    {
      title: "Driver Performance Report",
      description: "Driver statistics and performance metrics", 
      icon: Users,
      period: "Last 30 days",
      format: "CSV, PDF"
    },
    {
      title: "Financial Summary",
      description: "Revenue, expenses, and financial analytics",
      icon: BarChart,
      period: "Last 30 days", 
      format: "CSV, PDF, Excel"
    },
    {
      title: "System Activity Log",
      description: "Platform usage and system activity report",
      icon: FileText,
      period: "Last 7 days",
      format: "CSV, PDF"
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Global Reports</h1>
          <p className="text-gray-600">Export and view comprehensive reports across all EVCORE platform modules</p>
        </div>

        {/* Reports Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {reports.map((report, index) => (
            <Card key={index} className="hover:shadow-lg transition-shadow">
              <CardHeader>
                <div className="flex items-center gap-3">
                  <report.icon className="w-8 h-8 text-blue-600" />
                  <div>
                    <CardTitle className="text-lg">{report.title}</CardTitle>
                    <CardDescription>{report.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Period:</span>
                    <span className="font-medium">{report.period}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Formats:</span>
                    <span className="font-medium">{report.format}</span>
                  </div>
                  <div className="flex gap-2 pt-2">
                    <Button size="sm" className="flex-1">
                      <Download className="w-4 h-4 mr-2" />
                      Download CSV
                    </Button>
                    <Button size="sm" variant="outline" className="flex-1">
                      <FileText className="w-4 h-4 mr-2" />
                      View PDF
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Quick Stats */}
        <div className="mt-8">
          <Card>
            <CardHeader>
              <CardTitle>Report Statistics</CardTitle>
              <CardDescription>Overview of generated reports this month</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">47</div>
                  <div className="text-sm text-gray-600">Reports Generated</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">1,234</div>
                  <div className="text-sm text-gray-600">Total Downloads</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">89%</div>
                  <div className="text-sm text-gray-600">Automation Rate</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-orange-600">12</div>
                  <div className="text-sm text-gray-600">Scheduled Reports</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default GlobalReports;
