import React, { useState, useEffect } from 'react';
import { VehicleTrackerLayout } from '../components/VehicleTrackerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { BarChart3, FileText, Download, Calendar, Users, TrendingUp, AlertTriangle, CheckCircle } from 'lucide-react';
import { vehicleService } from '../../../services/database';
import { Deployment } from '../../../types/vehicle';
import { useToast } from '../../../hooks/use-toast';

interface ReportStats {
  totalDeploymentsThisWeek: number;
  successfulReturns: number;
  pendingReturns: number;
  overdue: number;
  totalVehiclesUsed: number;
  avgDeploymentTime: string;
  checklistMismatches: number;
  totalKmsThisWeek: number;
}

const Reports = () => {
  const [stats, setStats] = useState<ReportStats>({
    totalDeploymentsThisWeek: 0,
    successfulReturns: 0,
    pendingReturns: 0,
    overdue: 0,
    totalVehiclesUsed: 0,
    avgDeploymentTime: '0h 0m',
    checklistMismatches: 0,
    totalKmsThisWeek: 0
  });
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  const fetchReportStats = async () => {
    try {
      setLoading(true);
      const deployments = await vehicleService.getDeploymentHistory();
      
      // Calculate this week's range
      const now = new Date();
      const startOfWeek = new Date(now.getFullYear(), now.getMonth(), now.getDate() - now.getDay());
      const endOfWeek = new Date(startOfWeek.getTime() + 7 * 24 * 60 * 60 * 1000);
      
      // Filter deployments for this week
      const thisWeekDeployments = deployments.filter(d => {
        const outDate = d.outTimestamp ? new Date(d.outTimestamp) : null;
        return outDate && outDate >= startOfWeek && outDate < endOfWeek;
      });
      
      // Calculate stats
      const totalDeploymentsThisWeek = thisWeekDeployments.length;
      const successfulReturns = thisWeekDeployments.filter(d => d.inTimestamp).length;
      const pendingReturns = thisWeekDeployments.filter(d => d.outTimestamp && !d.inTimestamp).length;
      
      // Calculate overdue (more than 8 hours)
      const overdue = deployments.filter(d => {
        if (!d.outTimestamp || d.inTimestamp) return false;
        const outTime = new Date(d.outTimestamp);
        const hoursOut = (new Date().getTime() - outTime.getTime()) / (1000 * 60 * 60);
        return hoursOut > 8;
      }).length;
      
      // Calculate unique vehicles used this week
      const uniqueVehicles = new Set(thisWeekDeployments.map(d => d.vehicleNumber));
      const totalVehiclesUsed = uniqueVehicles.size;
      
      // Calculate average deployment time for completed trips this week
      const completedThisWeek = thisWeekDeployments.filter(d => d.outTimestamp && d.inTimestamp);
      let avgDeploymentTime = '0h 0m';
      if (completedThisWeek.length > 0) {
        const totalTime = completedThisWeek.reduce((sum, trip) => {
          const outTime = new Date(trip.outTimestamp!).getTime();
          const inTime = new Date(trip.inTimestamp!).getTime();
          return sum + (inTime - outTime);
        }, 0);
        const avgTime = totalTime / completedThisWeek.length;
        const avgHours = Math.floor(avgTime / (1000 * 60 * 60));
        const avgMinutes = Math.floor((avgTime % (1000 * 60 * 60)) / (1000 * 60));
        avgDeploymentTime = `${avgHours}h ${avgMinutes}m`;
      }
      
      // Calculate checklist mismatches
      const checklistMismatches = deployments.reduce((total, d) => {
        return total + (d.inData?.checklistMismatches?.length || 0);
      }, 0);
      
      // Calculate total KMs this week
      const totalKmsThisWeek = thisWeekDeployments.reduce((total, d) => {
        return total + (d.totalKms || 0);
      }, 0);
      
      setStats({
        totalDeploymentsThisWeek,
        successfulReturns,
        pendingReturns,
        overdue,
        totalVehiclesUsed,
        avgDeploymentTime,
        checklistMismatches,
        totalKmsThisWeek
      });
    } catch (error) {
      console.error('Error fetching report stats:', error);
      toast({
        title: "Error",
        description: "Failed to load report statistics",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchReportStats();
  }, []);

  const handleGenerateReport = (reportType: string) => {
    console.log(`Generating ${reportType} report...`);
    toast({
      title: "Generating Report",
      description: `${reportType} report generation started`,
    });
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
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <TrendingUp className="w-5 h-5 text-blue-600 mr-2" />
                </div>
                <p className="text-2xl font-bold text-blue-600">
                  {loading ? '...' : stats.totalDeploymentsThisWeek}
                </p>
                <p className="text-sm text-gray-600">Total Deployments This Week</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-green-50 border-green-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <CheckCircle className="w-5 h-5 text-green-600 mr-2" />
                </div>
                <p className="text-2xl font-bold text-green-600">
                  {loading ? '...' : stats.successfulReturns}
                </p>
                <p className="text-sm text-gray-600">Successful Returns</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-yellow-50 border-yellow-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <Users className="w-5 h-5 text-yellow-600 mr-2" />
                </div>
                <p className="text-2xl font-bold text-yellow-600">
                  {loading ? '...' : stats.pendingReturns}
                </p>
                <p className="text-sm text-gray-600">Pending Returns</p>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-red-50 border-red-200">
            <CardContent className="p-6">
              <div className="text-center">
                <div className="flex items-center justify-center mb-2">
                  <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                </div>
                <p className="text-2xl font-bold text-red-600">
                  {loading ? '...' : stats.overdue}
                </p>
                <p className="text-sm text-gray-600">Overdue</p>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Additional Stats Row */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xl font-bold text-purple-600">
                  {loading ? '...' : stats.totalVehiclesUsed}
                </p>
                <p className="text-xs text-gray-600">Vehicles Used This Week</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xl font-bold text-indigo-600">
                  {loading ? '...' : stats.avgDeploymentTime}
                </p>
                <p className="text-xs text-gray-600">Avg Deployment Time</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xl font-bold text-orange-600">
                  {loading ? '...' : stats.checklistMismatches}
                </p>
                <p className="text-xs text-gray-600">Checklist Mismatches</p>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="text-center">
                <p className="text-xl font-bold text-teal-600">
                  {loading ? '...' : `${stats.totalKmsThisWeek} km`}
                </p>
                <p className="text-xs text-gray-600">Total KMs This Week</p>
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
