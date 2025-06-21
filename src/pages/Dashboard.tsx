
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Menu } from 'lucide-react';

interface SubPlatform {
  id: string;
  title: string;
  icon: string;
  description: string;
  route: string;
  isActive: boolean;
}

const subPlatforms: SubPlatform[] = [
  {
    id: 'vehicle-tracker',
    title: 'Vehicle Deployment Tracker',
    icon: '🚗',
    description: 'Track vehicle IN/OUT operations',
    route: '/vehicle-tracker',
    isActive: true
  },
  {
    id: 'attendance',
    title: 'Attendance',
    icon: '🕒',
    description: 'Track employee & pilot attendance',
    route: '/attendance',
    isActive: false
  },
  {
    id: 'database',
    title: 'Database',
    icon: '🗂️',
    description: 'Manage staff, pilots, and customer records',
    route: '/database',
    isActive: false
  },
  {
    id: 'driver-induction',
    title: 'Driver Induction',
    icon: '📋',
    description: 'Enter and manage full driver profiles',
    route: '/driver-induction',
    isActive: false
  },
  {
    id: 'trip-details',
    title: 'Driver Trip Details',
    icon: '🚘',
    description: 'View and log trip records for each driver',
    route: '/trip-details',
    isActive: false
  },
  {
    id: 'offline-bookings',
    title: 'Offline Bookings',
    icon: '📝',
    description: 'Record manual/offline ride bookings',
    route: '/offline-bookings',
    isActive: false
  },
  {
    id: 'charging-tracker',
    title: 'Vehicle Charging Tracker',
    icon: '⚡',
    description: 'Monitor charging status of vehicles',
    route: '/charging-tracker',
    isActive: false
  }
];

const Dashboard = () => {
  const navigate = useNavigate();

  const handleCardClick = (platform: SubPlatform) => {
    if (platform.isActive) {
      navigate(platform.route);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
              <h1 className="text-2xl font-bold text-gray-900">Welcome to EVCORE</h1>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-2">EVCORE Dashboard</h2>
          <p className="text-gray-600">Select a platform to get started with your operations</p>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {subPlatforms.map((platform) => (
            <Card 
              key={platform.id}
              className={`transition-all duration-200 hover:shadow-lg hover:scale-105 cursor-pointer ${
                platform.isActive 
                  ? 'hover:border-blue-500 bg-white' 
                  : 'bg-gray-50 opacity-75 cursor-not-allowed'
              }`}
              onClick={() => handleCardClick(platform)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-4xl mb-2">{platform.icon}</div>
                <CardTitle className={`text-lg ${platform.isActive ? 'text-gray-900' : 'text-gray-500'}`}>
                  {platform.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className={`${platform.isActive ? 'text-gray-600' : 'text-gray-400'}`}>
                  {platform.description}
                </CardDescription>
                {!platform.isActive && (
                  <div className="mt-3">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                      Coming Soon
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-12 text-center">
          <p className="text-gray-500 text-sm">
            EVCORE Platform - Streamlining Operations Management
          </p>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
