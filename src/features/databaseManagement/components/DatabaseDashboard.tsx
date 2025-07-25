import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
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
  TrendingUp
} from 'lucide-react';
import { databaseService } from '../services/database';
import { DatabaseStats } from '../types';

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

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-l-4 border-l-blue-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Assets</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalAssets || 0}</p>
              </div>
              <div className="p-3 bg-blue-100 rounded-full">
                <Database className="w-6 h-6 text-blue-600" />
              </div>
            </div>
            <p className="text-sm text-blue-600 mt-2">Physical and digital assets</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-green-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Resources</p>
                <p className="text-3xl font-bold text-gray-900">{stats?.totalResources || 0}</p>
              </div>
              <div className="p-3 bg-green-100 rounded-full">
                <Users className="w-6 h-6 text-green-600" />
              </div>
            </div>
            <p className="text-sm text-green-600 mt-2">Human resources and personnel</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-purple-500">
          <CardContent className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Database Health</p>
                <p className="text-3xl font-bold text-gray-900">
                  {stats ? '100%' : '0%'}
                </p>
              </div>
              <div className="p-3 bg-purple-100 rounded-full">
                <TrendingUp className="w-6 h-6 text-purple-600" />
              </div>
            </div>
            <p className="text-sm text-purple-600 mt-2">System operational status</p>
          </CardContent>
        </Card>
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
