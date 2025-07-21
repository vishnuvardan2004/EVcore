import React, { useState } from 'react';
import { DatabaseLayout } from '../components/DatabaseLayout';
import { DataTable, DataTableColumn } from '../components/shared/DataTable';
import { SearchAndFilter, FilterOption } from '../components/shared/SearchAndFilter';
import { EmptyState } from '../components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Users, Building, User, Star } from 'lucide-react';

interface Customer {
  id: string;
  customerId: string;
  name: string;
  type: 'Individual' | 'Corporate' | 'Government';
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Pending';
  registrationDate: string;
  totalBookings: number;
  totalRevenue: number;
  lastBooking: string;
  rating: number;
  paymentMethod: 'Credit Card' | 'Bank Transfer' | 'Cash' | 'Corporate Account';
  emergencyContact?: string;
  emergencyPhone?: string;
  notes: string;
}

const CustomerManagement = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Mock customer data
  const customers: Customer[] = [
    {
      id: '1',
      customerId: 'CUST001',
      name: 'Acme Corporation',
      type: 'Corporate',
      email: 'contact@acmecorp.com',
      phone: '+1-555-2001',
      address: '123 Business Ave',
      city: 'New York',
      state: 'NY',
      zipCode: '10001',
      status: 'Active',
      registrationDate: '2023-01-15',
      totalBookings: 45,
      totalRevenue: 125000,
      lastBooking: '2024-12-18',
      rating: 4.8,
      paymentMethod: 'Corporate Account',
      notes: 'VIP corporate client with monthly service contract'
    },
    {
      id: '2',
      customerId: 'CUST002',
      name: 'John Smith',
      type: 'Individual',
      email: 'john.smith@email.com',
      phone: '+1-555-2002',
      address: '456 Residential St',
      city: 'Los Angeles',
      state: 'CA',
      zipCode: '90210',
      status: 'Active',
      registrationDate: '2023-03-20',
      totalBookings: 12,
      totalRevenue: 8500,
      lastBooking: '2024-12-15',
      rating: 4.5,
      paymentMethod: 'Credit Card',
      emergencyContact: 'Jane Smith',
      emergencyPhone: '+1-555-2003',
      notes: 'Frequent leisure traveler'
    },
    {
      id: '3',
      customerId: 'CUST003',
      name: 'City of Springfield',
      type: 'Government',
      email: 'transport@springfield.gov',
      phone: '+1-555-2004',
      address: '789 Government Plaza',
      city: 'Springfield',
      state: 'IL',
      zipCode: '62701',
      status: 'Active',
      registrationDate: '2022-11-10',
      totalBookings: 28,
      totalRevenue: 95000,
      lastBooking: '2024-12-10',
      rating: 4.9,
      paymentMethod: 'Bank Transfer',
      notes: 'Government contract for official transportation'
    },
    {
      id: '4',
      customerId: 'CUST004',
      name: 'Tech Startup Inc',
      type: 'Corporate',
      email: 'admin@techstartup.com',
      phone: '+1-555-2005',
      address: '321 Innovation Dr',
      city: 'San Francisco',
      state: 'CA',
      zipCode: '94105',
      status: 'Pending',
      registrationDate: '2024-12-01',
      totalBookings: 0,
      totalRevenue: 0,
      lastBooking: '',
      rating: 0,
      paymentMethod: 'Credit Card',
      notes: 'New customer pending verification'
    }
  ];

  const columns: DataTableColumn[] = [
    {
      key: 'customerId',
      label: 'Customer ID',
      render: (value) => <span className="font-mono font-medium">{value}</span>
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => {
        const colors = {
          Individual: 'bg-blue-100 text-blue-800',
          Corporate: 'bg-purple-100 text-purple-800',
          Government: 'bg-green-100 text-green-800'
        };
        const icons = {
          Individual: User,
          Corporate: Building,
          Government: Building
        };
        const Icon = icons[value as keyof typeof icons];
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            <Icon className="w-3 h-3 mr-1" />
            {value}
          </Badge>
        );
      }
    },
    {
      key: 'email',
      label: 'Email',
      render: (value) => <span className="text-sm">{value}</span>
    },
    {
      key: 'city',
      label: 'Location',
      render: (value, row) => `${value}, ${row.state}`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          Active: 'bg-green-100 text-green-800',
          Inactive: 'bg-gray-100 text-gray-800',
          Suspended: 'bg-red-100 text-red-800',
          Pending: 'bg-yellow-100 text-yellow-800'
        };
        return <Badge className={colors[value as keyof typeof colors]}>{value}</Badge>;
      }
    },
    {
      key: 'totalBookings',
      label: 'Bookings',
      render: (value) => value.toLocaleString()
    },
    {
      key: 'totalRevenue',
      label: 'Revenue',
      render: (value) => `$${value.toLocaleString()}`
    },
    {
      key: 'rating',
      label: 'Rating',
      render: (value) => (
        <div className="flex items-center gap-1">
          <Star className="w-4 h-4 text-yellow-500 fill-current" />
          <span className="text-sm">{value || 'N/A'}</span>
        </div>
      )
    },
    {
      key: 'lastBooking',
      label: 'Last Booking',
      render: (value) => value || 'Never'
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      key: 'type',
      label: 'Customer Type',
      type: 'select',
      options: [
        { value: 'Individual', label: 'Individual' },
        { value: 'Corporate', label: 'Corporate' },
        { value: 'Government', label: 'Government' }
      ]
    },
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Suspended', label: 'Suspended' },
        { value: 'Pending', label: 'Pending' }
      ]
    },
    {
      key: 'state',
      label: 'State',
      type: 'select',
      options: [
        { value: 'NY', label: 'New York' },
        { value: 'CA', label: 'California' },
        { value: 'IL', label: 'Illinois' },
        { value: 'TX', label: 'Texas' },
        { value: 'FL', label: 'Florida' }
      ]
    },
    {
      key: 'paymentMethod',
      label: 'Payment Method',
      type: 'select',
      options: [
        { value: 'Credit Card', label: 'Credit Card' },
        { value: 'Bank Transfer', label: 'Bank Transfer' },
        { value: 'Cash', label: 'Cash' },
        { value: 'Corporate Account', label: 'Corporate Account' }
      ]
    }
  ];

  // Filter and search logic
  const filteredCustomers = customers.filter(customer => {
    const matchesSearch = searchValue === '' || 
      Object.values(customer).some(value => 
        value?.toString().toLowerCase().includes(searchValue.toLowerCase())
      );

    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true;
      return customer[key as keyof Customer]?.toString() === value;
    });

    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
  };

  const handleAddNew = () => {
    console.log('Add new customer');
  };

  // Calculate summary statistics
  const totalRevenue = customers.reduce((sum, customer) => sum + customer.totalRevenue, 0);
  const totalBookings = customers.reduce((sum, customer) => sum + customer.totalBookings, 0);
  const averageRating = customers.filter(c => c.rating > 0).reduce((sum, customer) => sum + customer.rating, 0) / customers.filter(c => c.rating > 0).length;

  return (
    <DatabaseLayout 
      title="👥 Customer Management" 
      subtitle="Manage customer profiles, bookings, and relationship data"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Search and Filters */}
        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filterOptions}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onAddNew={handleAddNew}
          addNewLabel="Add Customer"
          placeholder="Search customers by name, email, ID, location..."
        />

        {/* Data Table */}
        {filteredCustomers.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredCustomers}
            emptyMessage="No customers found matching your criteria"
          />
        ) : customers.length === 0 ? (
          <EmptyState
            icon={Users}
            title="No Customers Added Yet"
            description="Start by adding customer profiles to track bookings, preferences, and relationship history."
            actionLabel="Add First Customer"
            onAction={handleAddNew}
          />
        ) : (
          <EmptyState
            icon={Users}
            title="No Matching Customers"
            description="No customers found matching your search criteria. Try adjusting your filters or search terms."
          />
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gray-900">{customers.length}</div>
                <div className="text-sm font-medium text-gray-600">Total Customers</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {customers.filter(c => c.status === 'Active').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Active Customers</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">{totalBookings}</div>
                <div className="text-sm font-medium text-gray-600">Total Bookings</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">${totalRevenue.toLocaleString()}</div>
                <div className="text-sm font-medium text-gray-600">Total Revenue</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Customer Type Distribution */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <User className="w-5 h-5 text-blue-600" />
                <span className="font-medium">Individual</span>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {customers.filter(c => c.type === 'Individual').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Personal customers</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-purple-600" />
                <span className="font-medium">Corporate</span>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">
                  {customers.filter(c => c.type === 'Corporate').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Business customers</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="flex items-center gap-2 mb-4">
                <Building className="w-5 h-5 text-green-600" />
                <span className="font-medium">Government</span>
              </div>
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {customers.filter(c => c.type === 'Government').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Government entities</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DatabaseLayout>
  );
};

export default CustomerManagement;
