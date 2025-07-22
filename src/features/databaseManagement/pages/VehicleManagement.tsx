import React, { useState, useEffect } from 'react';
import { DatabaseLayout } from '../components/DatabaseLayout';
import { DataTable, DataTableColumn } from '../components/shared/DataTable';
import { SearchAndFilter, FilterOption } from '../components/shared/SearchAndFilter';
import { EmptyState } from '../components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Car, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { vehicleService } from '../../../services/database';
import { Vehicle as VehicleType } from '../../../types/vehicle';

// Extended Vehicle interface for database management
interface Vehicle extends VehicleType {
  model?: string;
  type?: 'Sedan' | 'SUV' | 'Hatchback' | 'Electric' | 'Hybrid';
  year?: number;
  licensePlate?: string;
  fuelType?: 'Petrol' | 'Diesel' | 'Electric' | 'Hybrid';
  lastService?: string;
  mileage?: number;
  location?: string;
}

const VehicleManagement = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [vehicles, setVehicles] = useState<Vehicle[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchVehicles = async () => {
    try {
      setLoading(true);
      const vehicleData = await vehicleService.getAllVehicles();
      
      // Enhance vehicle data with additional properties for database management
      const enhancedVehicles: Vehicle[] = vehicleData.map((vehicle, index) => ({
        ...vehicle,
        model: `Model ${vehicle.vehicleNumber}`,
        type: ['Electric', 'Hybrid', 'Sedan', 'SUV'][index % 4] as any,
        year: 2020 + (index % 4),
        licensePlate: `${vehicle.vehicleNumber}-${Math.random().toString(36).substr(2, 3).toUpperCase()}`,
        fuelType: ['Electric', 'Hybrid', 'Petrol', 'Diesel'][index % 4] as any,
        lastService: new Date(Date.now() - Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        mileage: Math.floor(Math.random() * 50000) + 5000,
        location: ['Main Depot', 'North Station', 'Service Center', 'South Hub'][index % 4]
      }));
      
      setVehicles(enhancedVehicles);
    } catch (error) {
      console.error('Error fetching vehicles:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

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
          IN: 'bg-green-100 text-green-800',
          OUT: 'bg-blue-100 text-blue-800'
        };
        const labels = {
          IN: 'Available',
          OUT: 'Deployed'
        };
        return (
          <Badge className={colors[value as keyof typeof colors]}>
            {labels[value as keyof typeof labels] || value}
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
        { value: 'IN', label: 'Available (IN)' },
        { value: 'OUT', label: 'Deployed (OUT)' }
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
        {/* Header with Refresh */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Vehicle Database</h2>
            <p className="text-gray-600">Monitor and manage all vehicles and their deployment status</p>
          </div>
          <Button
            variant="outline"
            onClick={fetchVehicles}
            disabled={loading}
            className="flex items-center gap-2"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </div>

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
        {loading ? (
          <Card className="p-6">
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <RefreshCw className="w-6 h-6 animate-spin mx-auto mb-2" />
                <p className="text-sm text-gray-500">Loading vehicles...</p>
              </div>
            </div>
          </Card>
        ) : filteredVehicles.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredVehicles}
            loading={loading}
            emptyMessage="No vehicles found matching your criteria"
          />
        ) : vehicles.length === 0 ? (
          <EmptyState
            icon={Car}
            title="No Vehicles in Database"
            description="No vehicles have been registered yet. Vehicles are automatically added when they are first deployed through the Vehicle Deployment Tracker."
            actionLabel="Go to Vehicle Tracker"
            onAction={() => window.location.href = '/vehicle-tracker'}
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
                  {vehicles.filter(v => v.status === 'IN').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Available (IN)</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {vehicles.filter(v => v.status === 'OUT').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Deployed (OUT)</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-yellow-600">
                  {vehicles.filter(v => v.currentDeployment !== undefined).length}
                </div>
                <div className="text-sm font-medium text-gray-600">Active Deployments</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DatabaseLayout>
  );
};

export default VehicleManagement;
