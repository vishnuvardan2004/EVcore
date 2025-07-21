
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

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
    isActive: true
  },
  {
    id: 'database',
    title: 'Database',
    icon: '🗂️',
    description: 'Manage staff, pilots, and customer records',
    route: '/database',
    isActive: true
  },
  {
    id: 'driver-induction',
    title: 'Driver Induction',
    icon: '📋',
    description: 'Enter and manage full driver profiles',
    route: '/driver-induction',
    isActive: true
  },
  {
    id: 'trip-details',
    title: 'Driver Trip Details',
    icon: '🚘',
    description: 'View and log trip records for each driver',
    route: '/trip-details',
    isActive: true
  },
  {
    id: 'offline-bookings',
    title: 'Offline Bookings',
    icon: '📝',
    description: 'Record manual/offline ride bookings',
    route: '/offline-bookings',
    isActive: true
  },
  {
    id: 'charging-tracker',
    title: 'Vehicle Charging Tracker',
    icon: '⚡',
    description: 'Monitor charging status of vehicles',
    route: '/charging-tracker',
    isActive: true
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
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-accent-foreground"><img src="favicon.ico" alt="" /></span>
            </div>
            <div className="text-left">
              <h1 className="text-4xl font-bold text-foreground">EVZIP</h1>
              <p className="text-lg text-muted-foreground font-medium">EVCORE Platform</p>
            </div>
          </div>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Streamline your electric vehicle operations with our comprehensive management platform
          </p>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subPlatforms.map((platform) => (
            <Card 
              key={platform.id}
              className={`evzip-card transition-all duration-300 hover:scale-105 cursor-pointer border-2 ${
                platform.isActive 
                  ? 'hover:border-accent bg-card shadow-lg' 
                  : 'bg-muted/30 opacity-75 cursor-not-allowed hover:scale-100'
              }`}
              onClick={() => handleCardClick(platform)}
            >
              <CardHeader className="text-center pb-4">
                <div className="text-5xl mb-4">{platform.icon}</div>
                <CardTitle className={`text-xl ${platform.isActive ? 'text-foreground' : 'text-muted-foreground'}`}>
                  {platform.title}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center">
                <CardDescription className={`text-base mb-4 ${platform.isActive ? 'text-muted-foreground' : 'text-muted-foreground/70'}`}>
                  {platform.description}
                </CardDescription>
                {platform.isActive ? (
                  <Badge variant="secondary" className="bg-accent/10 text-accent border-accent/20 font-semibold">
                    Active
                  </Badge>
                ) : (
                  <Badge variant="outline" className="bg-yellow-50 text-yellow-600 border-yellow-200 font-semibold">
                    Coming Soon
                  </Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-16 text-center">
          <div className="bg-card rounded-2xl p-8 shadow-sm border border-border/50">
            <h3 className="text-lg font-bold text-foreground mb-2">EVZIP EVCORE Platform</h3>
            <p className="text-muted-foreground">
              Powering sustainable transportation through intelligent fleet management
            </p>
            <div className="flex justify-center gap-4 mt-4 text-sm text-muted-foreground">
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
