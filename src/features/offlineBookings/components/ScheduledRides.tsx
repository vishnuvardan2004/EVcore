import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../shared/components/ui/card';
import { Button } from '../../../shared/components/ui/button';
import { Input } from '../../../shared/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../../../shared/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../../../components/ui/table';
import { Badge } from '../../../shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../../../components/ui/dialog';
import { Calendar } from '../../../shared/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '../../../shared/components/ui/popover';
import { 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Calendar as CalendarIcon, 
  Clock, 
  User, 
  Car,
  MapPin,
  Phone,
  MoreVertical,
  AlertTriangle
} from 'lucide-react';
import { format, addDays, isToday, isTomorrow } from 'date-fns';

interface ScheduledRide {
  id: string;
  customerName: string;
  customerPhone: string;
  pickupLocation: string;
  dropLocation: string;
  scheduledDate: Date;
  scheduledTime: string;
  rideType: 'airport' | 'rental' | 'subscription';
  vehicleNumber?: string;
  driverName?: string;
  estimatedFare: number;
  status: 'confirmed' | 'assigned' | 'pending' | 'cancelled';
  specialRequirements?: string;
  paymentStatus: 'pending' | 'paid' | 'partial';
}

// Mock data for scheduled rides
const mockScheduledRides: ScheduledRide[] = [
  {
    id: 'SR001',
    customerName: 'Rajesh Kumar',
    customerPhone: '+91 9876543210',
    pickupLocation: 'Sector 18, Gurgaon',
    dropLocation: 'IGI Airport Terminal 3',
    scheduledDate: new Date(),
    scheduledTime: '18:30',
    rideType: 'airport',
    vehicleNumber: 'EV001',
    driverName: 'Suresh Sharma',
    estimatedFare: 850,
    status: 'assigned',
    paymentStatus: 'paid'
  },
  {
    id: 'SR002',
    customerName: 'Priya Singh',
    customerPhone: '+91 9123456789',
    pickupLocation: 'DLF Phase 1',
    dropLocation: 'Cyber City',
    scheduledDate: addDays(new Date(), 1),
    scheduledTime: '09:00',
    rideType: 'rental',
    estimatedFare: 450,
    status: 'confirmed',
    paymentStatus: 'pending',
    specialRequirements: 'Child seat required'
  },
  {
    id: 'SR003',
    customerName: 'Amit Patel',
    customerPhone: '+91 9876512345',
    pickupLocation: 'MG Road Metro',
    dropLocation: 'IGI Airport Terminal 1',
    scheduledDate: addDays(new Date(), 2),
    scheduledTime: '06:00',
    rideType: 'airport',
    estimatedFare: 750,
    status: 'pending',
    paymentStatus: 'pending'
  }
];

export const ScheduledRides: React.FC = () => {
  const [rides, setRides] = useState<ScheduledRide[]>(mockScheduledRides);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterRideType, setFilterRideType] = useState<string>('all');
  const [dateRange, setDateRange] = useState<{from?: Date; to?: Date}>({});
  const [selectedRide, setSelectedRide] = useState<ScheduledRide | null>(null);
  const [showRescheduleDialog, setShowRescheduleDialog] = useState(false);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'confirmed': return 'bg-blue-100 text-blue-800';
      case 'assigned': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'cancelled': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRideTypeColor = (type: string) => {
    switch (type) {
      case 'airport': return 'bg-purple-100 text-purple-800';
      case 'rental': return 'bg-orange-100 text-orange-800';
      case 'subscription': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDateDisplay = (date: Date) => {
    if (isToday(date)) return 'Today';
    if (isTomorrow(date)) return 'Tomorrow';
    return format(date, 'MMM dd, yyyy');
  };

  const filteredRides = rides.filter(ride => {
    const matchesSearch = 
      ride.customerName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.customerPhone.includes(searchTerm) ||
      ride.vehicleNumber?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      ride.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = filterStatus === 'all' || ride.status === filterStatus;
    const matchesRideType = filterRideType === 'all' || ride.rideType === filterRideType;
    
    return matchesSearch && matchesStatus && matchesRideType;
  });

  const handleDeleteRide = (rideId: string) => {
    setRides(rides.filter(ride => ride.id !== rideId));
  };

  const handleReschedule = (ride: ScheduledRide) => {
    setSelectedRide(ride);
    setShowRescheduleDialog(true);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Scheduled Rides</h2>
          <p className="text-gray-600">Manage future bookings and assignments</p>
        </div>
        <Badge variant="outline" className="text-lg px-3 py-1">
          {filteredRides.length} rides scheduled
        </Badge>
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
            
            <Select value={filterStatus} onValueChange={setFilterStatus}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="confirmed">Confirmed</SelectItem>
                <SelectItem value="assigned">Assigned</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="cancelled">Cancelled</SelectItem>
              </SelectContent>
            </Select>

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

      {/* Rides Table */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Upcoming Rides
          </CardTitle>
          <CardDescription>
            All scheduled rides sorted by date and time
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Booking ID</TableHead>
                <TableHead>Customer</TableHead>
                <TableHead>Route</TableHead>
                <TableHead>Schedule</TableHead>
                <TableHead>Type</TableHead>
                <TableHead>Vehicle</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Fare</TableHead>
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
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">{getDateDisplay(ride.scheduledDate)}</p>
                      <p className="text-sm text-gray-500">{ride.scheduledTime}</p>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getRideTypeColor(ride.rideType)}>
                      {ride.rideType}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    {ride.vehicleNumber ? (
                      <div>
                        <p className="font-medium">{ride.vehicleNumber}</p>
                        <p className="text-sm text-gray-500">{ride.driverName}</p>
                      </div>
                    ) : (
                      <Badge variant="outline">Unassigned</Badge>
                    )}
                  </TableCell>
                  
                  <TableCell>
                    <Badge className={getStatusColor(ride.status)}>
                      {ride.status}
                    </Badge>
                  </TableCell>
                  
                  <TableCell>
                    <div>
                      <p className="font-medium">₹{ride.estimatedFare}</p>
                      <Badge 
                        variant={ride.paymentStatus === 'paid' ? 'default' : 'outline'}
                        className="text-xs"
                      >
                        {ride.paymentStatus}
                      </Badge>
                    </div>
                  </TableCell>
                  
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReschedule(ride)}
                        className="h-8 w-8 p-0"
                      >
                        <Edit className="w-3 h-3" />
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleDeleteRide(ride.id)}
                        className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                      >
                        <Trash2 className="w-3 h-3" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
          
          {filteredRides.length === 0 && (
            <div className="text-center py-8">
              <Clock className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-500">No scheduled rides found</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Reschedule Dialog */}
      <Dialog open={showRescheduleDialog} onOpenChange={setShowRescheduleDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reschedule Ride</DialogTitle>
            <DialogDescription>
              Update the date and time for booking {selectedRide?.id}
            </DialogDescription>
          </DialogHeader>
          
          {selectedRide && (
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium">Customer</label>
                <p className="text-sm text-gray-600">{selectedRide.customerName}</p>
              </div>
              
              <div>
                <label className="text-sm font-medium">New Date</label>
                <Input type="date" className="mt-1" />
              </div>
              
              <div>
                <label className="text-sm font-medium">New Time</label>
                <Input type="time" className="mt-1" defaultValue={selectedRide.scheduledTime} />
              </div>
              
              <div className="flex gap-2 justify-end">
                <Button variant="outline" onClick={() => setShowRescheduleDialog(false)}>
                  Cancel
                </Button>
                <Button onClick={() => setShowRescheduleDialog(false)}>
                  Reschedule
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default ScheduledRides;
