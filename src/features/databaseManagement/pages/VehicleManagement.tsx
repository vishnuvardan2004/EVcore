import React, { useState } from 'react';
import { DatabaseLayout } from '../components/DatabaseLayout';
import { DataTable, DataTableColumn } from '../components/shared/DataTable';
import { SearchAndFilter, FilterOption } from '../components/shared/SearchAndFilter';
import { EmptyState } from '../components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car } from 'lucide-react';

// Mock data structure for vehicles
interface Vehicle {
  id: string;
  vehicleNumber: string;
  model: string;
  type: 'Sedan' | 'SUV' | 'Hatchback' | 'Electric' | 'Hybrid';
  status: 'Active' | 'Maintenance' | 'Inactive' | 'Deployed';
  year: number;
  licensePlate: string;
  fuelType: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  lastService: string;
  mileage: number;
  location: string;
}

const VehicleManagement = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Mock data - replace with API call
  const vehicles: Vehicle[] = [
    {
      id: '1',
      vehicleNumber: 'VH001',
      model: 'Toyota Camry',
      type: 'Sedan',
      status: 'Active',
      year: 2022,
      licensePlate: 'ABC-1234',
      fuelType: 'Petrol',
      lastService: '2024-12-15',
      mileage: 15000,
      location: 'Main Depot'
    },
    {
      id: '2',
      vehicleNumber: 'VH002',
      model: 'Honda CR-V',
      type: 'SUV',
      status: 'Deployed',
      year: 2023,
      licensePlate: 'XYZ-5678',
      fuelType: 'Hybrid',
      lastService: '2024-11-20',
      mileage: 8000,
      location: 'North Station'
    },
    {
      id: '3',
      vehicleNumber: 'VH003',
      model: 'Tesla Model 3',
      type: 'Electric',
      status: 'Maintenance',
      year: 2023,
      licensePlate: 'ELE-9012',
      fuelType: 'Electric',
      lastService: '2024-12-01',
      mileage: 12000,
      location: 'Service Center'
    }
  ];

  // Table columns configuration
  const columns: DataTableColumn[] = [
    {
      key: 'vehicleNumber',
      label: 'Vehicle #',
      sortable: true,
      render: (value) => (
        <span className="font-mono font-medium">{value}</span>
      )
    },
    {
      key: 'model',
      label: 'Model',
      sortable: true
    },
    {
      key: 'type',
      label: 'Type',
      render: (value) => (
        <Badge variant="outline">{value}</Badge>
      )
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          Active: 'bg-green-100 text-green-800',
          Deployed: 'bg-blue-100 text-blue-800',
          Maintenance: 'bg-yellow-100 text-yellow-800',
          Inactive: 'bg-gray-100 text-gray-800'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {value}
          </Badge>
        );
      }
    },
    {
      key: 'licensePlate',
      label: 'License Plate',
      render: (value) => (
        <span className="font-mono">{value}</span>
      )
    },
    {
      key: 'fuelType',
      label: 'Fuel Type',
      render: (value) => (
        <Badge variant="secondary">{value}</Badge>
      )
    },
    {
      key: 'mileage',
      label: 'Mileage',
      render: (value) => `${value.toLocaleString()} km`
    },
    {
      key: 'location',
      label: 'Location'
    }
  ];

  // Filter options
  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Deployed', label: 'Deployed' },
        { value: 'Maintenance', label: 'Maintenance' },
        { value: 'Inactive', label: 'Inactive' }
      ]
    },
    {
      key: 'type',
      label: 'Vehicle Type',
      type: 'select',
      options: [
        { value: 'Sedan', label: 'Sedan' },
        { value: 'SUV', label: 'SUV' },
        { value: 'Hatchback', label: 'Hatchback' },
        { value: 'Electric', label: 'Electric' },
        { value: 'Hybrid', label: 'Hybrid' }
      ]
    },
    {
      key: 'fuelType',
      label: 'Fuel Type',
      type: 'select',
      options: [
        { value: 'Petrol', label: 'Petrol' },
        { value: 'Diesel', label: 'Diesel' },
        { value: 'Electric', label: 'Electric' },
        { value: 'Hybrid', label: 'Hybrid' }
      ]
    }
  ];

  // Filter and search logic
  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = searchValue === '' || 
      Object.values(vehicle).some(value => 
        value.toString().toLowerCase().includes(searchValue.toLowerCase())
      );

    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true;
      return vehicle[key as keyof Vehicle]?.toString() === value;
    });

    return matchesSearch && matchesFilters;
  });

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
  };

  const handleAddNew = () => {
    console.log('Add new vehicle');
    // TODO: Open add vehicle modal/form
  };

  return (
    <DatabaseLayout 
      title="🚗 Vehicle Management" 
      subtitle="Manage vehicle registry, specifications, and status"
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
          addNewLabel="Add Vehicle"
          placeholder="Search vehicles by number, model, license plate..."
        />

        {/* Data Table */}
        {filteredVehicles.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredVehicles}
            emptyMessage="No vehicles found matching your criteria"
          />
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No Vehicles Added Yet"
            description="Start by adding your first vehicle to the database. You can track specifications, status, and maintenance history."
            actionLabel="Add First Vehicle"
            onAction={handleAddNew}
          />
        ) : (
          <EmptyState
            icon={Car}
            title="No Matching Vehicles"
            description="No vehicles found matching your search criteria. Try adjusting your filters or search terms."
          />
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mt-6">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gray-900">{vehicles.length}</div>
                <div className="text-sm font-medium text-gray-600">Total Vehicles</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {vehicles.filter(v => v.status === 'Active').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Active</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {vehicles.filter(v => v.status === 'Deployed').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Deployed</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-yellow-600">
                  {vehicles.filter(v => v.status === 'Maintenance').length}
                </div>
                <div className="text-sm font-medium text-gray-600">In Maintenance</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DatabaseLayout>
  );
};

export default VehicleManagement;
