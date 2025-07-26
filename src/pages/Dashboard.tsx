
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
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-accent/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <div className="text-center mb-16">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="relative">
              <img src="/favicon.ico" alt="EVZIP Logo" className="w-20 h-20" />
              <div className="absolute -top-1 -right-1 w-6 h-6 bg-accent rounded-full animate-pulse"></div>
            </div>
            <div className="text-left">
              <h1 className="text-5xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent mb-2">
                EVZIP
              </h1>
              <p className="text-xl text-accent font-bold tracking-wide">EVCORE Platform</p>
            </div>
          </div>
          <div className="max-w-3xl mx-auto">
            <p className="text-2xl text-primary/80 font-medium mb-4">
              Streamline your electric vehicle operations
            </p>
            <p className="text-lg text-muted-foreground">
              Comprehensive fleet management powered by sustainable technology
            </p>
          </div>
        </div>

        {/* Platform Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {subPlatforms.map((platform) => (
            <Card 
              key={platform.id}
              className={`group relative overflow-hidden transition-all duration-500 hover:scale-[1.02] cursor-pointer border-0 shadow-lg hover:shadow-2xl ${
                platform.isActive 
                  ? 'bg-white/80 backdrop-blur-sm hover:bg-white/90' 
                  : 'bg-white/40 opacity-75 cursor-not-allowed hover:scale-100'
              }`}
              onClick={() => handleCardClick(platform)}
            >
              {/* Gradient Background */}
              <div className="absolute inset-0 bg-gradient-to-br from-accent/10 via-transparent to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Electric Circuit Pattern */}
              <div className="absolute top-0 right-0 w-24 h-24 opacity-5">
                <svg viewBox="0 0 100 100" className="w-full h-full">
                  <path d="M20,20 L80,20 L80,40 L60,40 L60,60 L80,60 L80,80" 
                        stroke="currentColor" 
                        strokeWidth="2" 
                        fill="none" 
                        className="text-accent"/>
                </svg>
              </div>

              <CardHeader className="relative z-10 text-center pb-4">
                <div className="relative mb-6">
                  <div className={`text-6xl transition-transform duration-300 group-hover:scale-110 ${
                    platform.isActive ? 'filter drop-shadow-lg' : 'grayscale'
                  }`}>
                    {platform.icon}
                  </div>
                  {platform.isActive && (
                    <div className="absolute -top-2 -right-2 w-4 h-4 bg-accent rounded-full animate-pulse"></div>
                  )}
                </div>
                <CardTitle className={`text-xl font-bold transition-colors duration-300 ${
                  platform.isActive 
                    ? 'text-primary group-hover:text-accent' 
                    : 'text-muted-foreground'
                }`}>
                  {platform.title}
                </CardTitle>
              </CardHeader>
              
              <CardContent className="relative z-10 text-center pb-6">
                <CardDescription className={`text-base mb-6 leading-relaxed ${
                  platform.isActive 
                    ? 'text-primary/70' 
                    : 'text-muted-foreground/70'
                }`}>
                  {platform.description}
                </CardDescription>
                
                {platform.isActive ? (
                  <div className="flex items-center justify-center gap-2">
                    <Badge className="bg-gradient-to-r from-accent to-accent/90 text-white border-0 font-bold px-4 py-1 shadow-lg">
                      <div className="w-2 h-2 bg-white rounded-full mr-2 animate-pulse"></div>
                      Active
                    </Badge>
                  </div>
                ) : (
                  <Badge variant="outline" className="bg-amber-50 text-amber-600 border-amber-200 font-semibold">
                    Coming Soon
                  </Badge>
                )}
              </CardContent>
              
              {/* Bottom accent line */}
              {platform.isActive && (
                <div className="absolute bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-accent via-accent/80 to-transparent"></div>
              )}
            </Card>
          ))}
        </div>

        {/* Footer Info */}
        <div className="mt-20 text-center">
          <div className="relative bg-white/60 backdrop-blur-sm rounded-3xl p-10 shadow-xl border border-accent/20 overflow-hidden">
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div className="absolute top-0 left-0 w-full h-full">
                <svg viewBox="0 0 400 200" className="w-full h-full">
                  <defs>
                    <pattern id="circuit" patternUnits="userSpaceOnUse" width="40" height="40">
                      <path d="M0,20 L40,20 M20,0 L20,40" stroke="currentColor" strokeWidth="1" className="text-accent"/>
                      <circle cx="20" cy="20" r="2" fill="currentColor" className="text-accent"/>
                    </pattern>
                  </defs>
                  <rect width="100%" height="100%" fill="url(#circuit)"/>
                </svg>
              </div>
            </div>
            
            <div className="relative z-10">
              <div className="flex items-center justify-center gap-3 mb-4">
                <div className="w-8 h-8 bg-gradient-to-br from-accent to-accent/80 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold">⚡</span>
                </div>
                <h3 className="text-2xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                  EVZIP EVCORE Platform
                </h3>
              </div>
              <p className="text-lg text-primary/80 font-medium mb-6">
                Powering sustainable transportation through intelligent fleet management
              </p>
              
              {/* Feature Highlights */}
              <div className="flex flex-wrap justify-center gap-6 text-sm">
                <div className="flex items-center gap-2 text-primary/70">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="font-medium">Real-time Tracking</span>
                </div>
                <div className="flex items-center gap-2 text-primary/70">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="font-medium">Smart Analytics</span>
                </div>
                <div className="flex items-center gap-2 text-primary/70">
                  <div className="w-2 h-2 bg-accent rounded-full"></div>
                  <span className="font-medium">Sustainable Operations</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
