
import React from 'react';
import { ChargingTrackerLayout } from '../components/ChargingTrackerLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Badge } from '../../../shared/components/ui/badge';
import { Button } from '../../../shared/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Input } from '../../../shared/components/ui/input';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Search, MapPin, Battery, Clock, User, Car } from 'lucide-react';
import { format } from 'date-fns';

interface ChargingSession {
  id: string;
  vehicleNumber: string;
  pilotId: string;
  startTime: Date;
  endTime: Date;
  duration: number; // in minutes
  startCharge: number;
  endCharge: number;
  unitsConsumed: number;
  cost: number;
  location: 'HUB' | 'Outside';
  locationName?: string;
  brand?: string;
  paymentMode: 'UPI' | 'Cash';
  status: 'Completed' | 'In Progress' | 'Failed';
}

// Mock data - replace with actual data fetching
const mockSessions: ChargingSession[] = [
  {
    id: '1',
    vehicleNumber: 'KA01AB1234',
    pilotId: 'P001',
    startTime: new Date('2024-01-15T09:30:00'),
    endTime: new Date('2024-01-15T11:45:00'),
    duration: 135,
    startCharge: 25,
    endCharge: 85,
    unitsConsumed: 45.5,
    cost: 320,
    location: 'HUB',
    paymentMode: 'UPI',
    status: 'Completed'
  },
  {
    id: '2',
    vehicleNumber: 'KA02CD5678',
    pilotId: 'P002',
    startTime: new Date('2024-01-15T14:20:00'),
    endTime: new Date('2024-01-15T16:50:00'),
    duration: 150,
    startCharge: 15,
    endCharge: 90,
    unitsConsumed: 52.0,
    cost: 450,
    location: 'Outside',
    locationName: 'Mall Charging Station',
    brand: 'Tata Power',
    paymentMode: 'Cash',
    status: 'Completed'
  },
  {
    id: '3',
    vehicleNumber: 'KA03EF9012',
    pilotId: 'P001',
    startTime: new Date('2024-01-16T08:15:00'),
    endTime: new Date('2024-01-16T10:30:00'),
    duration: 135,
    startCharge: 30,
    endCharge: 80,
    unitsConsumed: 38.2,
    cost: 275,
    location: 'HUB',
    paymentMode: 'UPI',
    status: 'Completed'
  }
];

const ChargingHistory = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = React.useState('');
  const [filterStatus, setFilterStatus] = React.useState('all');
  const [filterLocation, setFilterLocation] = React.useState('all');

  const filteredSessions = mockSessions.filter(session => {
    const matchesSearch = session.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         session.pilotId.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || session.status.toLowerCase() === filterStatus;
    const matchesLocation = filterLocation === 'all' || session.location === filterLocation;
    
    return matchesSearch && matchesStatus && matchesLocation;
  });

  const totalSessions = filteredSessions.length;
  const totalUnits = filteredSessions.reduce((sum, session) => sum + session.unitsConsumed, 0);
  const totalCost = filteredSessions.reduce((sum, session) => sum + session.cost, 0);
  const averageCost = totalSessions > 0 ? totalCost / totalUnits : 0;

  return (
    <ChargingTrackerLayout 
      title="📊 Charging History" 
      subtitle="View all charging sessions and records"
    >
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div></div>
        </div>

        {/* Summary Cards */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Battery className="h-8 w-8 text-blue-600" />
                <div>
                  <p className="text-2xl font-bold">{totalSessions}</p>
                  <p className="text-sm text-gray-600">Total Sessions</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="text-2xl">⚡</div>
                <div>
                  <p className="text-2xl font-bold">{totalUnits.toFixed(1)}</p>
                  <p className="text-sm text-gray-600">Total kWh</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="text-2xl">💰</div>
                <div>
                  <p className="text-2xl font-bold">₹{totalCost.toLocaleString()}</p>
                  <p className="text-sm text-gray-600">Total Cost</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <div className="text-2xl">📊</div>
                <div>
                  <p className="text-2xl font-bold">₹{averageCost.toFixed(2)}</p>
                  <p className="text-sm text-gray-600">Avg. Cost/kWh</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Filters */}
        <Card>
          <CardHeader>
            <CardTitle>Filter Sessions</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-2 min-w-[250px]">
                <Search className="w-4 h-4 text-gray-500" />
                <Input
                  placeholder="Search by vehicle or pilot ID..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="in progress">In Progress</SelectItem>
                  <SelectItem value="failed">Failed</SelectItem>
                </SelectContent>
              </Select>
              
              <Select value={filterLocation} onValueChange={setFilterLocation}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Locations</SelectItem>
                  <SelectItem value="HUB">HUB</SelectItem>
                  <SelectItem value="Outside">Outside</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Sessions List */}
        <Card>
          <CardHeader>
            <CardTitle>Charging Sessions ({filteredSessions.length})</CardTitle>
            <CardDescription>
              Complete history of all charging sessions
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {filteredSessions.map((session) => (
                <Card key={session.id} className="border-l-4 border-l-blue-500">
                  <CardContent className="pt-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1 space-y-2">
                        <div className="flex items-center gap-4 flex-wrap">
                          <div className="flex items-center gap-2">
                            <Car className="w-4 h-4 text-blue-600" />
                            <span className="font-medium">{session.vehicleNumber}</span>
                          </div>
                          <div className="flex items-center gap-2">
                            <User className="w-4 h-4 text-green-600" />
                            <span className="text-sm">{session.pilotId}</span>
                          </div>
                          <Badge variant={session.status === 'Completed' ? 'default' : session.status === 'In Progress' ? 'secondary' : 'destructive'}>
                            {session.status}
                          </Badge>
                        </div>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <Clock className="w-3 h-3 text-gray-400" />
                            <div>
                              <p className="text-gray-600">Duration</p>
                              <p className="font-medium">{Math.floor(session.duration / 60)}h {session.duration % 60}m</p>
                            </div>
                          </div>
                          
                          <div className="flex items-center gap-2">
                            <Battery className="w-3 h-3 text-gray-400" />
                            <div>
                              <p className="text-gray-600">Charge</p>
                              <p className="font-medium">{session.startCharge}% → {session.endCharge}%</p>
                            </div>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Units</p>
                            <p className="font-medium">{session.unitsConsumed} kWh</p>
                          </div>
                          
                          <div>
                            <p className="text-gray-600">Cost</p>
                            <p className="font-medium text-green-600">₹{session.cost}</p>
                          </div>
                        </div>
                        
                        <div className="flex items-center gap-4 text-sm">
                          <div className="flex items-center gap-2">
                            <MapPin className="w-3 h-3 text-gray-400" />
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                              session.location === 'HUB' 
                                ? 'bg-purple-100 text-purple-800' 
                                : 'bg-orange-100 text-orange-800'
                            }`}>
                              {session.location === 'HUB' ? '🏢' : '🌍'} {session.location}
                              {session.location === 'Outside' && session.locationName && ` - ${session.locationName}`}
                            </span>
                          </div>
                          
                          <span className="text-gray-600">
                            {format(session.startTime, 'PPP p')} - {format(session.endTime, 'p')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
              
              {filteredSessions.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No charging sessions found matching your criteria.
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </ChargingTrackerLayout>
  );
};

export default ChargingHistory;
