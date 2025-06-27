
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Button } from '@/components/ui/button';
import { Settings, Save, Eye, EyeOff } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';

const AdminModuleToggle = () => {
  const { toast } = useToast();
  const [modules, setModules] = useState([
    { id: 'vehicle-tracker', name: 'Vehicle Deployment Tracker', enabled: true, description: 'Track vehicle IN/OUT operations' },
    { id: 'driver-induction', name: 'Driver Induction', enabled: true, description: 'Driver profile management system' },
    { id: 'trip-details', name: 'Driver Trip Details', enabled: true, description: 'Trip logging and management' },
    { id: 'charging-tracker', name: 'Vehicle Charging Tracker', enabled: true, description: 'Battery and charging monitoring' },
    { id: 'offline-bookings', name: 'Offline Bookings', enabled: true, description: 'Manual booking management' },
    { id: 'attendance', name: 'Attendance System', enabled: false, description: 'Employee attendance tracking' },
    { id: 'database', name: 'Database Management', enabled: false, description: 'Staff and customer records' }
  ]);

  const toggleModule = (moduleId: string) => {
    setModules(prev => 
      prev.map(module => 
        module.id === moduleId 
          ? { ...module, enabled: !module.enabled }
          : module
      )
    );
  };

  const saveChanges = () => {
    toast({
      title: "Settings Saved",
      description: "Module visibility settings have been updated successfully.",
    });
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Admin Module Toggle Panel</h1>
          <p className="text-gray-600">Enable or disable platform modules visibility in the dashboard</p>
        </div>

        <Card>
          <CardHeader>
            <div className="flex items-center gap-3">
              <Settings className="w-6 h-6 text-blue-600" />
              <div>
                <CardTitle>Module Visibility Control</CardTitle>
                <CardDescription>Toggle which modules are visible to users in the main dashboard</CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="space-y-6">
              {modules.map((module) => (
                <div key={module.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center justify-center w-10 h-10 rounded-full bg-blue-100">
                      {module.enabled ? (
                        <Eye className="w-5 h-5 text-blue-600" />
                      ) : (
                        <EyeOff className="w-5 h-5 text-gray-400" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{module.name}</h3>
                      <p className="text-sm text-gray-600">{module.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className={`text-sm font-medium ${module.enabled ? 'text-green-600' : 'text-gray-400'}`}>
                      {module.enabled ? 'Visible' : 'Hidden'}
                    </span>
                    <Switch
                      checked={module.enabled}
                      onCheckedChange={() => toggleModule(module.id)}
                    />
                  </div>
                </div>
              ))}
            </div>

            <div className="mt-8 pt-6 border-t">
              <div className="flex justify-between items-center">
                <div>
                  <p className="text-sm text-gray-600">
                    {modules.filter(m => m.enabled).length} of {modules.length} modules enabled
                  </p>
                </div>
                <Button onClick={saveChanges} className="gap-2">
                  <Save className="w-4 h-4" />
                  Save Changes
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* System Status */}
        <div className="mt-6">
          <Card>
            <CardHeader>
              <CardTitle>System Status</CardTitle>
              <CardDescription>Current platform performance metrics</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-600">99.9%</div>
                  <div className="text-sm text-gray-600">Platform Uptime</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-blue-600">247ms</div>
                  <div className="text-sm text-gray-600">Avg Response Time</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-purple-600">1,420</div>
                  <div className="text-sm text-gray-600">Active Sessions</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default AdminModuleToggle;
