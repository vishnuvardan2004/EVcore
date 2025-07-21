import React, { useState } from 'react';
import { DatabaseLayout } from '../components/DatabaseLayout';
import { DataTable, DataTableColumn } from '../components/shared/DataTable';
import { SearchAndFilter, FilterOption } from '../components/shared/SearchAndFilter';
import { EmptyState } from '../components/shared/EmptyState';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { UserCheck, Award, Calendar } from 'lucide-react';

interface Pilot {
  id: string;
  pilotId: string;
  name: string;
  email: string;
  phone: string;
  licenseNumber: string;
  licenseType: 'Commercial' | 'Private' | 'Multi-Engine' | 'Helicopter';
  licenseExpiry: string;
  medicalCertificateExpiry: string;
  totalFlightHours: number;
  status: 'Active' | 'Inactive' | 'Suspended' | 'Training';
  certifications: string[];
  lastFlight: string;
  emergencyContact: string;
  emergencyPhone: string;
  hireDate: string;
}

const PilotManagement = () => {
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Mock pilot data
  const pilots: Pilot[] = [
    {
      id: '1',
      pilotId: 'PLT001',
      name: 'Captain John Williams',
      email: 'john.williams@evcore.com',
      phone: '+1-555-1001',
      licenseNumber: 'COM-123456',
      licenseType: 'Commercial',
      licenseExpiry: '2025-06-15',
      medicalCertificateExpiry: '2024-12-31',
      totalFlightHours: 2500,
      status: 'Active',
      certifications: ['IFR', 'Multi-Engine', 'Type Rating A320'],
      lastFlight: '2024-12-19',
      emergencyContact: 'Jane Williams',
      emergencyPhone: '+1-555-1002',
      hireDate: '2022-03-15'
    },
    {
      id: '2',
      pilotId: 'PLT002',
      name: 'First Officer Sarah Chen',
      email: 'sarah.chen@evcore.com',
      phone: '+1-555-1003',
      licenseNumber: 'COM-789012',
      licenseType: 'Commercial',
      licenseExpiry: '2025-09-20',
      medicalCertificateExpiry: '2025-03-15',
      totalFlightHours: 1800,
      status: 'Active',
      certifications: ['IFR', 'Multi-Engine'],
      lastFlight: '2024-12-18',
      emergencyContact: 'Michael Chen',
      emergencyPhone: '+1-555-1004',
      hireDate: '2022-08-10'
    },
    {
      id: '3',
      pilotId: 'PLT003',
      name: 'Captain Mike Rodriguez',
      email: 'mike.rodriguez@evcore.com',
      phone: '+1-555-1005',
      licenseNumber: 'HEL-345678',
      licenseType: 'Helicopter',
      licenseExpiry: '2024-12-25',
      medicalCertificateExpiry: '2024-11-30',
      totalFlightHours: 3200,
      status: 'Training',
      certifications: ['Helicopter IFR', 'Night Vision'],
      lastFlight: '2024-12-10',
      emergencyContact: 'Maria Rodriguez',
      emergencyPhone: '+1-555-1006',
      hireDate: '2021-05-20'
    }
  ];

  const columns: DataTableColumn[] = [
    {
      key: 'pilotId',
      label: 'Pilot ID',
      render: (value) => <span className="font-mono font-medium">{value}</span>
    },
    {
      key: 'name',
      label: 'Name',
      sortable: true
    },
    {
      key: 'licenseNumber',
      label: 'License #',
      render: (value) => <span className="font-mono text-sm">{value}</span>
    },
    {
      key: 'licenseType',
      label: 'License Type',
      render: (value) => <Badge variant="outline">{value}</Badge>
    },
    {
      key: 'totalFlightHours',
      label: 'Flight Hours',
      render: (value) => `${value.toLocaleString()} hrs`
    },
    {
      key: 'status',
      label: 'Status',
      render: (value) => {
        const colors = {
          Active: 'bg-green-100 text-green-800',
          Inactive: 'bg-gray-100 text-gray-800',
          Suspended: 'bg-red-100 text-red-800',
          Training: 'bg-blue-100 text-blue-800'
        };
        return <Badge className={colors[value as keyof typeof colors]}>{value}</Badge>;
      }
    },
    {
      key: 'licenseExpiry',
      label: 'License Expiry',
      render: (value) => {
        const expiryDate = new Date(value);
        const now = new Date();
        const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
        
        return (
          <div className="flex flex-col">
            <span className="text-sm">{value}</span>
            {daysUntilExpiry <= 30 && (
              <Badge variant="destructive" className="text-xs">
                Expires in {daysUntilExpiry} days
              </Badge>
            )}
          </div>
        );
      }
    },
    {
      key: 'certifications',
      label: 'Certifications',
      render: (value: string[]) => (
        <div className="space-x-1">
          {value.slice(0, 2).map((cert, index) => (
            <Badge key={index} variant="secondary" className="text-xs">{cert}</Badge>
          ))}
          {value.length > 2 && (
            <Badge variant="outline" className="text-xs">+{value.length - 2}</Badge>
          )}
        </div>
      )
    },
    {
      key: 'lastFlight',
      label: 'Last Flight'
    }
  ];

  const filterOptions: FilterOption[] = [
    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        { value: 'Active', label: 'Active' },
        { value: 'Inactive', label: 'Inactive' },
        { value: 'Suspended', label: 'Suspended' },
        { value: 'Training', label: 'Training' }
      ]
    },
    {
      key: 'licenseType',
      label: 'License Type',
      type: 'select',
      options: [
        { value: 'Commercial', label: 'Commercial' },
        { value: 'Private', label: 'Private' },
        { value: 'Multi-Engine', label: 'Multi-Engine' },
        { value: 'Helicopter', label: 'Helicopter' }
      ]
    }
  ];

  // Filter and search logic
  const filteredPilots = pilots.filter(pilot => {
    const matchesSearch = searchValue === '' || 
      Object.values(pilot).some(value => {
        if (Array.isArray(value)) {
          return value.some(item => item.toLowerCase().includes(searchValue.toLowerCase()));
        }
        return value.toString().toLowerCase().includes(searchValue.toLowerCase());
      });

    const matchesFilters = Object.entries(filterValues).every(([key, value]) => {
      if (!value) return true;
      return pilot[key as keyof Pilot]?.toString() === value;
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
    console.log('Add new pilot');
  };

  // Get pilots with expiring licenses (within 30 days)
  const expiringLicenses = pilots.filter(pilot => {
    const expiryDate = new Date(pilot.licenseExpiry);
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return daysUntilExpiry <= 30 && daysUntilExpiry > 0;
  });

  return (
    <DatabaseLayout 
      title="✈️ Pilot Management" 
      subtitle="Manage pilot profiles, certifications, and flight records"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Alerts for expiring licenses */}
        {expiringLicenses.length > 0 && (
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="flex items-center gap-2 mb-2">
              <Calendar className="w-5 h-5 text-yellow-600" />
              <h3 className="font-medium text-yellow-800">License Expiry Alerts</h3>
            </div>
            <p className="text-yellow-700 text-sm">
              {expiringLicenses.length} pilot license(s) expiring within 30 days. Please review and renew as needed.
            </p>
          </div>
        )}

        {/* Search and Filters */}
        <SearchAndFilter
          searchValue={searchValue}
          onSearchChange={setSearchValue}
          filters={filterOptions}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          onClearFilters={handleClearFilters}
          onAddNew={handleAddNew}
          addNewLabel="Add Pilot"
          placeholder="Search pilots by name, license number, certifications..."
        />

        {/* Data Table */}
        {filteredPilots.length > 0 ? (
          <DataTable
            columns={columns}
            data={filteredPilots}
            emptyMessage="No pilots found matching your criteria"
          />
        ) : pilots.length === 0 ? (
          <EmptyState
            icon={UserCheck}
            title="No Pilots Added Yet"
            description="Start by adding pilot profiles to track certifications, flight hours, and license status."
            actionLabel="Add First Pilot"
            onAction={handleAddNew}
          />
        ) : (
          <EmptyState
            icon={UserCheck}
            title="No Matching Pilots"
            description="No pilots found matching your search criteria. Try adjusting your filters or search terms."
          />
        )}

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-gray-900">{pilots.length}</div>
                <div className="text-sm font-medium text-gray-600">Total Pilots</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">
                  {pilots.filter(p => p.status === 'Active').length}
                </div>
                <div className="text-sm font-medium text-gray-600">Active Pilots</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">
                  {pilots.filter(p => p.status === 'Training').length}
                </div>
                <div className="text-sm font-medium text-gray-600">In Training</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-yellow-600">{expiringLicenses.length}</div>
                <div className="text-sm font-medium text-gray-600">Expiring Soon</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DatabaseLayout>
  );
};

export default PilotManagement;
