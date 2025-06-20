
import React, { useState } from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { User, LogOut, Settings } from 'lucide-react';

const Profile = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(true); // Mock login state
  const [loginForm, setLoginForm] = useState({ username: '', password: '' });

  // Mock user data
  const userData = {
    name: 'John Doe',
    role: 'Supervisor',
    email: 'john.doe@company.com',
    hub: 'Main Office',
    employeeId: 'EMP001',
    permissions: ['Vehicle Deployment', 'Report Generation', 'Alert Management']
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Login attempt:', loginForm);
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setLoginForm({ username: '', password: '' });
  };

  if (!isLoggedIn) {
    return (
      <PageLayout 
        title="👤 Login" 
        subtitle="Access your account to manage vehicle deployments"
      >
        <div className="max-w-md mx-auto">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Sign In
              </CardTitle>
              <CardDescription>
                Enter your credentials to access the system
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleLogin} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="username">Username</Label>
                  <Input
                    id="username"
                    type="text"
                    value={loginForm.username}
                    onChange={(e) => setLoginForm({ ...loginForm, username: e.target.value })}
                    placeholder="Enter your username"
                    required
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginForm.password}
                    onChange={(e) => setLoginForm({ ...loginForm, password: e.target.value })}
                    placeholder="Enter your password"
                    required
                  />
                </div>
                <Button type="submit" className="w-full">
                  Sign In
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </PageLayout>
    );
  }

  return (
    <PageLayout 
      title="👤 Profile" 
      subtitle="Manage your account and preferences"
    >
      <div className="max-w-4xl mx-auto space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              User Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label className="text-sm font-medium text-gray-600">Full Name</Label>
                <p className="text-lg font-semibold">{userData.name}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Employee ID</Label>
                <p className="text-lg font-semibold">{userData.employeeId}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Email</Label>
                <p className="text-lg font-semibold">{userData.email}</p>
              </div>
              <div>
                <Label className="text-sm font-medium text-gray-600">Hub Location</Label>
                <p className="text-lg font-semibold">{userData.hub}</p>
              </div>
            </div>
            
            <div>
              <Label className="text-sm font-medium text-gray-600">Role</Label>
              <div className="mt-2">
                <Badge variant="secondary" className="text-sm px-3 py-1">
                  {userData.role}
                </Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Permissions</CardTitle>
            <CardDescription>
              Your current system permissions and access levels
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {userData.permissions.map((permission, index) => (
                <div key={index} className="flex items-center gap-2">
                  <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                  <span>{permission}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Account Actions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex gap-4">
              <Button variant="outline" className="flex items-center gap-2">
                <Settings className="w-4 h-4" />
                Account Settings
              </Button>
              <Button 
                variant="destructive" 
                onClick={handleLogout}
                className="flex items-center gap-2"
              >
                <LogOut className="w-4 h-4" />
                Sign Out
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default Profile;
