import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { 
  Database, 
  Car, 
  Zap, 
  Cpu, 
  Computer, 
  Building2,
  Users,
  UserCheck,
  BarChart3,
  RefreshCw,
  Plus,
  Search,
  TrendingUp,
  AlertTriangle,
  Clock,
  Activity,
  CheckCircle,
  XCircle,
  Calendar,
  Wrench,
  Battery,
  Shield
} from 'lucide-react';
import { databaseService } from '../services/database';
import { DatabaseStats } from '../types';

// Enhanced Dashboard Widget Components
const RecentActivityWidget: React.FC = () => {
  const recentActivities = [
    { id: 1, action: 'Vehicle Added', item: 'EV-001', user: 'John Doe', time: '2 minutes ago', type: 'success' },
    { id: 2, action: 'Employee Updated', item: 'Alice Smith', user: 'Admin', time: '15 minutes ago', type: 'info' },
    { id: 3, action: 'Maintenance Due', item: 'CHG-005', user: 'System', time: '1 hour ago', type: 'warning' },
    { id: 4, action: 'Pilot Certified', item: 'Bob Johnson', user: 'HR Team', time: '2 hours ago', type: 'success' },
  ];

  const getActivityIcon = (type: string) => {
    switch (type) {
      case 'success': return <CheckCircle className="w-4 h-4 text-green-600" />;
      case 'warning': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'info': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Activity className="w-5 h-5" />
          Recent Activity
        </CardTitle>
        <CardDescription>Latest updates across all systems</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {recentActivities.map((activity) => (
            <div key={activity.id} className="flex items-center gap-3 p-2 rounded-lg hover:bg-gray-50">
              {getActivityIcon(activity.type)}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900">
                  {activity.action} - {activity.item}
                </p>
                <p className="text-xs text-gray-500">by {activity.user} • {activity.time}</p>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4">
          View All Activity
        </Button>
      </CardContent>
    </Card>
  );
};

const SystemHealthWidget: React.FC = () => {
  const healthMetrics = [
    { name: 'Database Performance', value: 95, status: 'excellent' },
    { name: 'System Uptime', value: 99, status: 'excellent' },
    { name: 'Data Integrity', value: 100, status: 'excellent' },
    { name: 'Response Time', value: 87, status: 'good' },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'excellent': return 'text-green-600';
      case 'good': return 'text-blue-600';
      case 'warning': return 'text-yellow-600';
      case 'critical': return 'text-red-600';
      default: return 'text-gray-600';
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <Shield className="w-5 h-5" />
          System Health
        </CardTitle>
        <CardDescription>Real-time system performance metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {healthMetrics.map((metric, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{metric.name}</span>
                <span className={`text-sm font-bold ${getStatusColor(metric.status)}`}>
                  {metric.value}%
                </span>
              </div>
              <Progress value={metric.value} className="h-2" />
            </div>
          ))}
        </div>
        <div className="mt-4 p-3 bg-green-50 rounded-lg">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-sm font-medium text-green-800">All systems operational</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

const AssetStatusWidget: React.FC = () => {
  const assetStatus = [
    { category: 'Vehicles', total: 25, active: 18, maintenance: 3, inactive: 4 },
    { category: 'Charging Equipment', total: 15, active: 12, maintenance: 2, inactive: 1 },
    { category: 'IT Equipment', total: 45, active: 40, maintenance: 3, inactive: 2 },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <BarChart3 className="w-5 h-5" />
          Asset Status Overview
        </CardTitle>
        <CardDescription>Current status of all asset categories</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {assetStatus.map((asset, index) => (
            <div key={index} className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-gray-700">{asset.category}</span>
                <span className="text-sm text-gray-500">{asset.total} total</span>
              </div>
              <div className="flex gap-1 h-2 rounded-full overflow-hidden bg-gray-200">
                <div 
                  className="bg-green-500" 
                  style={{ width: `${(asset.active / asset.total) * 100}%` }}
                />
                <div 
                  className="bg-yellow-500" 
                  style={{ width: `${(asset.maintenance / asset.total) * 100}%` }}
                />
                <div 
                  className="bg-red-500" 
                  style={{ width: `${(asset.inactive / asset.total) * 100}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-gray-600">
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  Active: {asset.active}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                  Maintenance: {asset.maintenance}
                </span>
                <span className="flex items-center gap-1">
                  <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                  Inactive: {asset.inactive}
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

const AlertsWidget: React.FC = () => {
  const alerts = [
    { id: 1, title: 'Vehicle Maintenance Due', message: 'EV-003 scheduled for maintenance tomorrow', priority: 'high', time: '1h ago' },
    { id: 2, title: 'Low Battery Alert', message: 'Charging station CHG-007 battery at 15%', priority: 'medium', time: '3h ago' },
    { id: 3, title: 'License Expiry', message: 'Pilot license for John Doe expires in 30 days', priority: 'low', time: '1d ago' },
  ];

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'border-l-red-500 bg-red-50';
      case 'medium': return 'border-l-yellow-500 bg-yellow-50';
      case 'low': return 'border-l-blue-500 bg-blue-50';
      default: return 'border-l-gray-500 bg-gray-50';
    }
  };

  const getPriorityIcon = (priority: string) => {
    switch (priority) {
      case 'high': return <XCircle className="w-4 h-4 text-red-600" />;
      case 'medium': return <AlertTriangle className="w-4 h-4 text-yellow-600" />;
      case 'low': return <Activity className="w-4 h-4 text-blue-600" />;
      default: return <Clock className="w-4 h-4 text-gray-600" />;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <AlertTriangle className="w-5 h-5" />
          Alerts & Notifications
        </CardTitle>
        <CardDescription>Important updates requiring attention</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {alerts.map((alert) => (
            <div key={alert.id} className={`p-3 rounded-lg border-l-4 ${getPriorityColor(alert.priority)}`}>
              <div className="flex items-start gap-3">
                {getPriorityIcon(alert.priority)}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-gray-900">{alert.title}</p>
                  <p className="text-xs text-gray-600 mt-1">{alert.message}</p>
                  <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
        <Button variant="outline" size="sm" className="w-full mt-4">
          View All Alerts
        </Button>
      </CardContent>
    </Card>
  );
};

const QuickStatsWidget: React.FC<{ stats: DatabaseStats | null }> = ({ stats }) => {
  const quickStats = [
    { 
      label: 'Today\'s Activities', 
      value: '47', 
      change: '+12%', 
      trend: 'up',
      icon: Activity
    },
    { 
      label: 'Active Deployments', 
      value: '8', 
      change: '+2', 
      trend: 'up',
      icon: Car
    },
    { 
      label: 'Maintenance Pending', 
      value: '3', 
      change: '-1', 
      trend: 'down',
      icon: Wrench
    },
    { 
      label: 'System Efficiency', 
      value: '94%', 
      change: '+3%', 
      trend: 'up',
      icon: Battery
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {quickStats.map((stat, index) => {
        const Icon = stat.icon;
        return (
          <Card key={index} className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.trend === 'up' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from yesterday
                </p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Icon className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </Card>
        );
      })}
    </div>
  );
};

export const DatabaseDashboard: React.FC = () => {
  const [stats, setStats] = useState<DatabaseStats | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const data = await databaseService.getDatabaseStats();
      setStats(data);
    } catch (error) {
      console.error('Error fetching database stats:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const assetCategories = [
    {
      title: 'Vehicles',
      value: stats?.vehicles || 0,
      icon: Car,
      color: 'blue',
      description: 'Fleet vehicles and specifications',
      route: '/database/vehicles'
    },
    {
      title: 'Charging Equipment',
      value: stats?.chargingEquipment || 0,
      icon: Zap,
      color: 'green',
      description: 'EV charging infrastructure',
      route: '/database/charging-equipment'
    },
    {
      title: 'Electrical Equipment',
      value: stats?.electricalEquipment || 0,
      icon: Cpu,
      color: 'yellow',
      description: 'Electrical systems and panels',
      route: '/database/electrical-equipment'
    },
    {
      title: 'IT Equipment',
      value: stats?.itEquipment || 0,
      icon: Computer,
      color: 'purple',
      description: 'Computing and network assets',
      route: '/database/it-equipment'
    },
    {
      title: 'Infrastructure & Furniture',
      value: stats?.infraFurniture || 0,
      icon: Building2,
      color: 'orange',
      description: 'Facilities and office equipment',
      route: '/database/infra-furniture'
    }
  ];

  const resourceCategories = [
    {
      title: 'Employees',
      value: stats?.employees || 0,
      icon: Users,
      color: 'indigo',
      description: 'Staff and employee records',
      route: '/database/employees'
    },
    {
      title: 'Pilots',
      value: stats?.pilots || 0,
      icon: UserCheck,
      color: 'pink',
      description: 'Certified pilots and licenses',
      route: '/database/pilots'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-50 text-blue-700 border-blue-200',
      green: 'bg-green-50 text-green-700 border-green-200',
      yellow: 'bg-yellow-50 text-yellow-700 border-yellow-200',
      purple: 'bg-purple-50 text-purple-700 border-purple-200',
      orange: 'bg-orange-50 text-orange-700 border-orange-200',
      indigo: 'bg-indigo-50 text-indigo-700 border-indigo-200',
      pink: 'bg-pink-50 text-pink-700 border-pink-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  if (loading) {
    return (
      <div className="p-8 space-y-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <RefreshCw className="w-8 h-8 animate-spin mx-auto mb-4 text-blue-600" />
            <p className="text-gray-600">Loading database overview...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6 bg-gray-50 min-h-screen">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
            <Database className="w-8 h-8 text-blue-600" />
            Master Database
          </h1>
          <p className="text-gray-600 mt-1">Comprehensive asset and resource management system</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchStats} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Quick Add
          </Button>
        </div>
      </div>

      {/* Enhanced Quick Stats */}
      <QuickStatsWidget stats={stats} />

      {/* Main Dashboard Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - 2/3 width */}
        <div className="lg:col-span-2 space-y-6">
          {/* Asset Status Overview */}
          <AssetStatusWidget />
          
          {/* Recent Activity */}
          <RecentActivityWidget />
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* System Health */}
          <SystemHealthWidget />
          
          {/* Alerts */}
          <AlertsWidget />
        </div>
      </div>

      {/* Asset Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building2 className="w-5 h-5" />
            Asset Management
          </CardTitle>
          <CardDescription>Manage organizational assets and equipment</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {assetCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.title}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                  onClick={() => window.location.href = category.route}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(category.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary">{category.value}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Resource Categories */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="w-5 h-5" />
            Resource Management
          </CardTitle>
          <CardDescription>Manage human resources and personnel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {resourceCategories.map((category) => {
              const Icon = category.icon;
              return (
                <div
                  key={category.title}
                  className="p-4 border rounded-lg hover:shadow-md transition-shadow cursor-pointer bg-white"
                  onClick={() => window.location.href = category.route}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className={`p-2 rounded-lg ${getColorClasses(category.color)}`}>
                      <Icon className="w-5 h-5" />
                    </div>
                    <Badge variant="secondary">{category.value}</Badge>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.title}</h3>
                  <p className="text-sm text-gray-600">{category.description}</p>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BarChart3 className="w-5 h-5" />
            Quick Actions
          </CardTitle>
          <CardDescription>Common database operations and tools</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Search className="w-5 h-5" />
              <span className="text-sm">Global Search</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Plus className="w-5 h-5" />
              <span className="text-sm">Bulk Import</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <BarChart3 className="w-5 h-5" />
              <span className="text-sm">Reports</span>
            </Button>
            <Button variant="outline" className="h-auto p-4 flex flex-col gap-2">
              <Database className="w-5 h-5" />
              <span className="text-sm">Backup</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
