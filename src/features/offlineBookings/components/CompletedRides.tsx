import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../shared/components/ui/badge';
import { Calendar } from '../../../shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shared/components/ui/popover';
import { 
  Search, 
  Filter, 
  CheckCircle, 
  Calendar as CalendarIcon, 
  Clock, 
  Star,
  MapPin,
  Phone,
  Download,
  Eye,
  Receipt
} from 'lucide-react';
import { format, subDays } from 'date-fns';

interface CompletedRide {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropLocation: string;
  startTime: Date;
  endTime: Date;
  actualFare: number;
  distance: number;
  vehicleNumber: string;
  driverName: string;
  rideType: 'airport' | 'rental' | 'subscription';
  paymentMethod: 'cash' | 'card' | 'upi' | 'wallet';
  paymentStatus: 'paid' | 'pending' | 'refunded';
  rating?: number;
  feedback?: string;
  duration: number; // in minutes
}

// Mock data for completed rides
const mockCompletedRides: CompletedRide[] = [
  {
    id: 'CR001',
    customerName: 'Anjali Sharma',
    customerPhone: '+91 9876543210',
    pickupLocation: 'Cyber City, Gurgaon',
    dropLocation: 'IGI Airport Terminal 3',
    startTime: new Date(Date.now() - 24 * 60 * 60 * 1000), // Yesterday
    endTime: new Date(Date.now() - 24 * 60 * 60 * 1000 + 45 * 60 * 1000),
    actualFare: 850,
    distance: 28.5,
    vehicleNumber: 'EV001',
    driverName: 'Suresh Sharma',
    rideType: 'airport',
    paymentMethod: 'upi',
    paymentStatus: 'paid',
    rating: 5,
    feedback: 'Excellent service, clean vehicle',
    duration: 45
  },
  {
    id: 'CR002',
    customerName: 'Rohit Mehta',
    customerPhone: '+91 9123456789',
    pickupLocation: 'DLF Phase 2',
    dropLocation: 'Connaught Place',
    startTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000 + 35 * 60 * 1000),
    actualFare: 420,
    distance: 15.2,
    vehicleNumber: 'EV003',
    driverName: 'Amit Kumar',
    rideType: 'rental',
    paymentMethod: 'cash',
    paymentStatus: 'paid',
    rating: 4,
    duration: 35
  },
  {
    id: 'CR003',
    customerName: 'Priya Singh',
    customerPhone: '+91 9876512345',
    pickupLocation: 'Sector 18 Market',
    dropLocation: 'Golf Course Road',
    startTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000 + 25 * 60 * 1000),
    actualFare: 180,
    distance: 8.7,
    vehicleNumber: 'EV002',
    driverName: 'Raj Patel',
    rideType: 'subscription',
    paymentMethod: 'wallet',
    paymentStatus: 'paid',
    rating: 5,
    feedback: 'Great driver, reached on time',
    duration: 25
  },
  {
    id: 'CR004',
    customerName: 'Vikash Kumar',
    customerPhone: '+91 9345678901',
    pickupLocation: 'IFFCO Chowk Metro',
    dropLocation: 'IGI Airport Terminal 1',
    startTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000),
    endTime: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000 + 50 * 60 * 1000),
    actualFare: 750,
    distance: 32.1,
    vehicleNumber: 'EV001',
    driverName: 'Suresh Sharma',
    rideType: 'airport',
    paymentMethod: 'card',
    paymentStatus: 'paid',
    rating: 4,
    duration: 50
  }
];

export const CompletedRides: React.FC = () => {
  const [rides, setRides] = useState<CompletedRide[]>(mockCompletedRides);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRideType, setFilterRideType] = useState<string>('all');
  const [filterPaymentMethod, setFilterPaymentMethod] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});

  const getRideTypeColor = (type: string) => {
    switch (type) {
      case 'airport': return 'bg-purple-100 text-purple-800';
      case 'rental': return 'bg-orange-100 text-orange-800';
      case 'subscription': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentMethodColor = (method: string) => {
    switch (method) {
      case 'cash': return 'bg-green-100 text-green-800';
      case 'card': return 'bg-blue-100 text-blue-800';
      case 'upi': return 'bg-purple-100 text-purple-800';
      case 'wallet': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        className={`w-3 h-3 ${
          i < rating ? 'text-yellow-400 fill-current' : 'text-gray-300'
        }`}
      />
    ));
  };

  const filteredRides = rides.filter(ride => {
    const matchesSearch = 
      ride.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.customerPhone.includes(searchTerm) ||
      ride.vehicleNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.driverName.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesRideType = filterRideType === 'all' || ride.rideType === filterRideType;
    const matchesPaymentMethod = filterPaymentMethod === 'all' || ride.paymentMethod === filterPaymentMethod;
    
    return matchesSearch && matchesRideType && matchesPaymentMethod;
  });

  const totalRevenue = filteredRides.reduce((sum, ride) => sum + ride.actualFare, 0);
  const totalDistance = filteredRides.reduce((sum, ride) => sum + ride.distance, 0);
  const averageRating = filteredRides.reduce((sum, ride) => sum + (ride.rating || 0), 0) / filteredRides.length;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Completed Rides</h2>
          <p className="text-gray-600">Track finished rides and payment history</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" className="gap-2">
            <Download className="w-4 h-4" />
            Export Data
          </Button>
          <Badge variant="outline" className="text-lg px-3 py-1">
            {filteredRides.length} completed rides
          </Badge>
        </div>
      </div>

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-lg flex items-center justify-center">
                <CheckCircle className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{filteredRides.length}</p>
                <p className="text-sm text-gray-600">Total Rides</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-lg flex items-center justify-center">
                <Receipt className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">₹{totalRevenue.toLocaleString()}</p>
                <p className="text-sm text-gray-600">Total Revenue</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-lg flex items-center justify-center">
                <MapPin className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{totalDistance.toFixed(1)} km</p>
                <p className="text-sm text-gray-600">Distance Covered</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-yellow-100 rounded-lg flex items-center justify-center">
                <Star className="w-5 h-5 text-yellow-600" />
              </div>
              <div>
                <p className="text-2xl font-bold text-gray-900">{averageRating.toFixed(1)}</p>
                <p className="text-sm text-gray-600">Avg Rating</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search by name, phone, vehicle..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={filterRideType} onValueChange={setFilterRideType}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="airport">Airport</SelectItem>
                <SelectItem value="rental">Rental</SelectItem>
                <SelectItem value="subscription">Subscription</SelectItem>
              </SelectContent>
            </Select>

            <Select value={filterPaymentMethod} onValueChange={setFilterPaymentMethod}>
              <SelectTrigger>
                <SelectValue placeholder="Payment method" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Methods</SelectItem>
                <SelectItem value="cash">Cash</SelectItem>
                <SelectItem value="card">Card</SelectItem>
                <SelectItem value="upi">UPI</SelectItem>
                <SelectItem value="wallet">Wallet</SelectItem>
              </SelectContent>
            </Select>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="justify-start gap-2">
                  <CalendarIcon className="w-4 h-4" />
                  {dateRange.from ? format(dateRange.from, 'MMM dd') : 'Date Range'}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="range"
                  selected={dateRange.from && dateRange.to ? {from: dateRange.from, to: dateRange.to} : undefined}
                  onSelect={(range) => setDateRange(range || {})}
                  numberOfMonths={2}
                />
              </PopoverContent>
            </Popover>
          </div>
        </CardContent>
      </Card>

      {/* Completed Rides Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="w-5 h-5" />
            Ride History
          </CardTitle>
          <CardDescription>
            Complete record of finished rides with payments and ratings
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Ride ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Duration</TableHead>
                <TableHead>Vehicle & Driver</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Payment</TableHead>
                <TableHead>Rating</TableHead>
                <TableHead>Total</TableHead>
                <TableHead>Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredRides.map((ride) => (
                <TableRow key={ride.id}>
                  <TableCell className="font-mono text-sm">{ride.id}</TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{ride.customerName}</p>
                      <p className="text-sm text-gray-500 flex items-center gap-1">
                        <Phone className="w-3 h-3" />
                        {ride.customerPhone}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <p className="text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-green-500" />
                        {ride.pickupLocation}
                      </p>
                      <p className="text-sm flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-red-500" />
                        {ride.dropLocation}
                      </p>
                      <p className="text-xs text-gray-500">{ride.distance} km</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="text-sm font-medium">{ride.duration} min</p>
                      <p className="text-xs text-gray-500">
                        {format(ride.startTime, 'MMM dd, HH:mm')}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium text-sm">{ride.vehicleNumber}</p>
                      <p className="text-sm text-gray-500">{ride.driverName}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getRideTypeColor(ride.rideType)}>
                      {ride.rideType}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div className="space-y-1">
                      <Badge className={getPaymentMethodColor(ride.paymentMethod)}>
                        {ride.paymentMethod}
                      </Badge>
                      <p className="text-xs text-green-600 font-medium">
                        {ride.paymentStatus}
                      </p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    {ride.rating ? (
                      <div className="space-y-1">
                        <div className="flex gap-1">
                          {renderStars(ride.rating)}
                        </div>
                        <p className="text-xs text-gray-500">{ride.rating}/5</p>
                      </div>
                    ) : (
                      <span className="text-xs text-gray-400">No rating</span>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <p className="font-medium text-green-600">₹{ride.actualFare}</p>
                  </TableCell>
                  
                  <TableCell>
                    <Button
                      size="sm"
                      variant="outline"
                      className="h-8 w-8 p-0"
                    >
                      <Eye className="w-3 h-3" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRides.length === 0 && (
            <div className="text-center py-8">
              <CheckCircle className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No completed rides found</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletedRides;
