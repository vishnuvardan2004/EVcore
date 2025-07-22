import React, { useState, useEffect } from 'react';
import { DatabaseLayout } from '../components/DatabaseLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { 
  Car, 
  UserCheck, 
  Users, 
  Building2, 
  Database,
  TrendingUp,
  ArrowRight,
  RefreshCw
} from 'lucide-react';
import { vehicleService } from '../../../services/database';
import { Vehicle } from '../../../types/vehicle';

const DatabaseDashboard = () => {
  const navigate = useNavigate();
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    try {
      setLoading(true);
      const vehicleData = await vehicleService.getAllVehicles();
      setVehicles(vehicleData);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  // Calculate real stats from vehicle data
  const stats = [
    {
      label: 'Total Vehicles',
      value: loading ? '...' : vehicles.length.toString(),
      change: '+Real data',
      icon: Car,
      color: 'blue',
      href: '/database/vehicles'
    },
    {
      label: 'Available Vehicles',
      value: loading ? '...' : vehicles.filter(v => v.status === 'IN').length.toString(),
      change: 'Ready for deployment',
      icon: UserCheck,
      color: 'green',
      href: '/database/vehicles'
    },
    {
      label: 'Deployed Vehicles',
      value: loading ? '...' : vehicles.filter(v => v.status === 'OUT').length.toString(),
      change: 'Currently active',
      icon: Users,
      color: 'purple',
      href: '/database/vehicles'
    },
    {
      label: 'Active Deployments',
      value: loading ? '...' : vehicles.filter(v => v.currentDeployment).length.toString(),
      change: 'With deployment data',
      icon: Building2,
      color: 'orange',
      href: '/database/vehicles'
    }
  ];

  const quickActions = [
    {
      title: 'Manage Vehicles',
      description: 'Add, edit, or view vehicle registry',
      icon: Car,
      href: '/database/vehicles',
      color: 'blue'
    },
    {
      title: 'Pilot Management',
      description: 'Handle pilot certifications and profiles',
      icon: UserCheck,
      href: '/database/pilots',
      color: 'green'
    },
    {
      title: 'Customer Database',
      description: 'Access customer information and history',
      icon: Users,
      href: '/database/customers',
      color: 'purple'
    },
    {
      title: 'Staff Directory',
      description: 'Manage staff, admins, and supervisors',
      icon: Building2,
      href: '/database/staff',
      color: 'orange'
    }
  ];

  const getColorClasses = (color: string) => {
    const colors = {
      blue: 'bg-blue-100 text-blue-600 border-blue-200',
      green: 'bg-green-100 text-green-600 border-green-200',
      purple: 'bg-purple-100 text-purple-600 border-purple-200',
      orange: 'bg-orange-100 text-orange-600 border-orange-200'
    };
    return colors[color as keyof typeof colors] || colors.blue;
  };

  return (
    <DatabaseLayout 
      title="🗂️ Database Overview" 
      subtitle="Centralized management for all database operations"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Database Management</h2>
            <p className="text-gray-600">Monitor and manage all organizational data</p>
          </div>
          <div className="flex gap-2">
            <Button 
              variant="outline"
              onClick={fetchDashboardData}
              disabled={loading}
              className="gap-2"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
              Refresh
            </Button>
            <Button 
              onClick={() => navigate('/database/analytics')}
              className="gap-2"
            >
              <TrendingUp className="w-4 h-4" />
              View Analytics
            </Button>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <Card 
                key={stat.label}
                className="cursor-pointer hover:shadow-md transition-shadow border border-gray-200"
                onClick={() => navigate(stat.href)}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between mb-4">
                    <div className={`p-3 rounded-lg ${getColorClasses(stat.color)}`}>
                      <Icon className="w-6 h-6" />
                    </div>
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm font-medium text-gray-600">{stat.label}</p>
                    <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
                    <p className="text-sm text-green-600 font-medium">{stat.change}</p>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Database className="w-5 h-5" />
              Quick Actions
            </CardTitle>
            <CardDescription>
              Access key database management functions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <div
                    key={action.title}
                    className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 cursor-pointer transition-colors"
                    onClick={() => navigate(action.href)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-lg ${getColorClasses(action.color)}`}>
                        <Icon className="w-5 h-5" />
                      </div>
                      <div>
                        <h3 className="font-medium text-gray-900">{action.title}</h3>
                        <p className="text-sm text-gray-600">{action.description}</p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-gray-400" />
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        {/* Recent Activity */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Database Activity</CardTitle>
            <CardDescription>Latest vehicle deployment activities</CardDescription>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <RefreshCw className="w-6 h-6 animate-spin" />
                <span className="ml-2 text-gray-500">Loading activities...</span>
              </div>
            ) : (
              <div className="space-y-3">
                {vehicles.slice(0, 4).map((vehicle, index) => (
                  <div key={vehicle.id} className="flex items-center justify-between py-2">
                    <div className="flex items-center gap-3">
                      <div className={`w-2 h-2 rounded-full ${
                        vehicle.status === 'OUT' ? 'bg-blue-500' : 'bg-green-500'
                      }`}></div>
                      <span className="text-sm text-gray-900">
                        Vehicle {vehicle.status === 'OUT' ? 'deployed' : 'returned'}
                      </span>
                      <span className="text-sm font-medium text-gray-700">{vehicle.vehicleNumber}</span>
                      {vehicle.currentDeployment && (
                        <span className="text-xs text-gray-500">({vehicle.currentDeployment.purpose})</span>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {vehicle.currentDeployment?.outTimestamp ? 
                        new Date(vehicle.currentDeployment.outTimestamp).toLocaleDateString() : 
                        'Recently'
                      }
                    </span>
                  </div>
                ))}
                {vehicles.length === 0 && (
                  <div className="text-center py-4 text-gray-500">
                    No recent activities. Start deploying vehicles to see activity here.
                  </div>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </DatabaseLayout>
  );
};

export default DatabaseDashboard;
