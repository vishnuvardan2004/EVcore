import React from 'react';
import { DatabaseLayout } from '../components/DatabaseLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  BarChart3, 
  TrendingUp, 
  Users, 
  Car, 
  DollarSign, 
  Calendar,
  Database,
  PieChart,
  Activity
} from 'lucide-react';

const DataAnalytics = () => {
  // Mock analytics data
  const keyMetrics = [
    {
      title: 'Total Database Records',
      value: '2,659',
      change: '+12.5%',
      trend: 'up',
      icon: Database,
      color: 'blue'
    },
    {
      title: 'Active Customers',
      value: '2,347',
      change: '+8.2%',
      trend: 'up',
      icon: Users,
      color: 'green'
    },
    {
      title: 'Vehicle Fleet Size',
      value: '156',
      change: '+7.7%',
      trend: 'up',
      icon: Car,
      color: 'purple'
    },
    {
      title: 'Monthly Revenue',
      value: '$1.2M',
      change: '+15.3%',
      trend: 'up',
      icon: DollarSign,
      color: 'orange'
    }
  ];

  const dataQualityMetrics = [
    { category: 'Vehicle Records', completeness: 98, accuracy: 96, lastUpdated: '2 hours ago' },
    { category: 'Pilot Profiles', completeness: 94, accuracy: 99, lastUpdated: '4 hours ago' },
    { category: 'Customer Data', completeness: 89, accuracy: 92, lastUpdated: '1 hour ago' },
    { category: 'Staff Records', completeness: 96, accuracy: 98, lastUpdated: '3 hours ago' }
  ];

  const recentActivity = [
    { action: 'Vehicle Added', details: 'VH-157 Tesla Model Y', timestamp: '2 hours ago', type: 'create' },
    { action: 'Customer Updated', details: 'Acme Corp profile modified', timestamp: '3 hours ago', type: 'update' },
    { action: 'Pilot Certification', details: 'John Williams - IFR renewed', timestamp: '5 hours ago', type: 'update' },
    { action: 'Staff Promotion', details: 'Sarah Johnson promoted to Admin', timestamp: '1 day ago', type: 'update' },
    { action: 'Data Export', details: 'Customer report generated', timestamp: '1 day ago', type: 'export' }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600',
      green: 'bg-green-100 text-green-600',
      purple: 'bg-purple-100 text-purple-600',
      orange: 'bg-orange-100 text-orange-600'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  const getQualityColor = (value: number) => {
    if (value >= 95) return 'bg-green-100 text-green-800';
    if (value >= 85) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'create': return 'bg-green-100 text-green-600';
      case 'update': return 'bg-blue-100 text-blue-600';
      case 'export': return 'bg-purple-100 text-purple-600';
      default: return 'bg-gray-100 text-gray-600';
    }
  };

  return (
    <DatabaseLayout 
      title="📊 Data Analytics" 
      subtitle="Database insights, metrics, and performance analytics"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Database Analytics</h2>
            <p className="text-gray-600">Real-time insights and performance metrics</p>
          </div>
          <Badge variant="outline" className="gap-2">
            <Activity className="w-4 h-4" />
            Live Data
          </Badge>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {keyMetrics.map((metric) => {
            const Icon = metric.icon;
            return (
              <Card key={metric.title}>
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-sm text-gray-600">{metric.title}</p>
                      <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
                      <div className="flex items-center gap-1 mt-1">
                        <TrendingUp className="w-3 h-3 text-green-600" />
                        <span className="text-xs text-green-600">{metric.change}</span>
                        <span className="text-xs text-gray-500">vs last month</span>
                      </div>
                    </div>
                    <div className={`p-3 rounded-lg ${getColorClasses(metric.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Data Quality Dashboard */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Data Quality Metrics
            </CardTitle>
            <CardDescription>
              Monitor data completeness and accuracy across all database categories
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {dataQualityMetrics.map((metric, index) => (
                <div key={index} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{metric.category}</h3>
                    <p className="text-sm text-gray-600">Last updated: {metric.lastUpdated}</p>
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Completeness</div>
                      <Badge className={getQualityColor(metric.completeness)}>
                        {metric.completeness}%
                      </Badge>
                    </div>
                    <div className="text-center">
                      <div className="text-sm text-gray-600">Accuracy</div>
                      <Badge className={getQualityColor(metric.accuracy)}>
                        {metric.accuracy}%
                      </Badge>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Database Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <PieChart className="w-5 h-5" />
                Database Distribution
              </CardTitle>
              <CardDescription>Records by category</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {[
                  { category: 'Customers', count: 2347, percentage: 88.3, color: 'bg-blue-500' },
                  { category: 'Vehicles', count: 156, percentage: 5.9, color: 'bg-green-500' },
                  { category: 'Pilots', count: 89, percentage: 3.3, color: 'bg-purple-500' },
                  { category: 'Staff', count: 67, percentage: 2.5, color: 'bg-orange-500' }
                ].map((item, index) => (
                  <div key={index} className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className={`w-3 h-3 rounded-full ${item.color}`}></div>
                      <span className="text-sm font-medium">{item.category}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{item.count.toLocaleString()}</span>
                      <span className="text-xs text-gray-500">({item.percentage}%)</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Calendar className="w-5 h-5" />
                Growth Trends
              </CardTitle>
              <CardDescription>Monthly growth statistics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {[
                  { month: 'December 2024', customers: '+89', vehicles: '+12', pilots: '+5', staff: '+3' },
                  { month: 'November 2024', customers: '+67', vehicles: '+8', pilots: '+3', staff: '+2' },
                  { month: 'October 2024', customers: '+45', vehicles: '+6', pilots: '+2', staff: '+1' }
                ].map((trend, index) => (
                  <div key={index} className="border-b pb-3 last:border-b-0">
                    <div className="font-medium text-sm text-gray-900 mb-2">{trend.month}</div>
                    <div className="grid grid-cols-4 gap-2 text-xs">
                      <div className="text-center">
                        <div className="text-blue-600 font-medium">{trend.customers}</div>
                        <div className="text-gray-600">Customers</div>
                      </div>
                      <div className="text-center">
                        <div className="text-green-600 font-medium">{trend.vehicles}</div>
                        <div className="text-gray-600">Vehicles</div>
                      </div>
                      <div className="text-center">
                        <div className="text-purple-600 font-medium">{trend.pilots}</div>
                        <div className="text-gray-600">Pilots</div>
                      </div>
                      <div className="text-center">
                        <div className="text-orange-600 font-medium">{trend.staff}</div>
                        <div className="text-gray-600">Staff</div>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Activity className="w-5 h-5" />
              Recent Database Activity
            </CardTitle>
            <CardDescription>Latest changes and updates to database records</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {recentActivity.map((activity, index) => (
                <div key={index} className="flex items-center gap-4 p-3 border rounded-lg">
                  <div className={`w-2 h-2 rounded-full ${getActivityIcon(activity.type)}`}></div>
                  <div className="flex-1">
                    <div className="font-medium text-sm text-gray-900">{activity.action}</div>
                    <div className="text-sm text-gray-600">{activity.details}</div>
                  </div>
                  <div className="text-xs text-gray-500">{activity.timestamp}</div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Performance Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">99.8%</div>
                <div className="text-sm font-medium text-gray-600">Database Uptime</div>
                <div className="text-xs text-gray-500 mt-1">Last 30 days</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">1.2s</div>
                <div className="text-sm font-medium text-gray-600">Avg Query Time</div>
                <div className="text-xs text-gray-500 mt-1">Real-time performance</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">15.6GB</div>
                <div className="text-sm font-medium text-gray-600">Storage Used</div>
                <div className="text-xs text-gray-500 mt-1">78% of allocated space</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DatabaseLayout>
  );
};

export default DataAnalytics;
