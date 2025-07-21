import React, { useState } from 'react';
import { DatabaseLayout } from '../components/DatabaseLayout';
import { DataTable, DataTableColumn } from '../components/shared/DataTable';
import { SearchAndFilter, FilterOption } from '../components/shared/SearchAndFilter';
import { EmptyState } from '../components/shared/EmptyState';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Building2, Users, Shield, UserCog } from 'lucide-react';

// Staff data interfaces
interface BaseStaff {
  id: string;
  name: string;
  email: string;
  phone: string;
  department: string;
  hireDate: string;
  status: 'Active' | 'Inactive' | 'On Leave';
  employeeId: string;
}

interface GeneralStaff extends BaseStaff {
  position: string;
  supervisor: string;
  shift: 'Morning' | 'Evening' | 'Night';
}

interface AdminStaff extends BaseStaff {
  role: 'HR Admin' | 'Finance Admin' | 'Operations Admin' | 'IT Admin';
  permissions: string[];
  lastLogin: string;
}

interface Supervisor extends BaseStaff {
  team: string;
  teamSize: number;
  reportingTo: string;
  region: string;
}

const StaffManagement = () => {
  const [activeTab, setActiveTab] = useState('general');
  const [searchValue, setSearchValue] = useState('');
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  // Mock data
  const generalStaff: GeneralStaff[] = [
    {
      id: '1',
      name: 'John Smith',
      email: 'john.smith@evcore.com',
      phone: '+1-555-0101',
      department: 'Operations',
      hireDate: '2023-01-15',
      status: 'Active',
      employeeId: 'EMP001',
      position: 'Operations Coordinator',
      supervisor: 'Sarah Johnson',
      shift: 'Morning'
    },
    {
      id: '2',
      name: 'Emily Davis',
      email: 'emily.davis@evcore.com',
      phone: '+1-555-0102',
      department: 'Customer Service',
      hireDate: '2023-03-20',
      status: 'Active',
      employeeId: 'EMP002',
      position: 'Customer Support Specialist',
      supervisor: 'Mike Wilson',
      shift: 'Evening'
    }
  ];

  const adminStaff: AdminStaff[] = [
    {
      id: '1',
      name: 'Sarah Johnson',
      email: 'sarah.johnson@evcore.com',
      phone: '+1-555-0201',
      department: 'Administration',
      hireDate: '2022-06-01',
      status: 'Active',
      employeeId: 'ADM001',
      role: 'Operations Admin',
      permissions: ['User Management', 'System Config', 'Reports'],
      lastLogin: '2024-12-20'
    },
    {
      id: '2',
      name: 'Mike Wilson',
      email: 'mike.wilson@evcore.com',
      phone: '+1-555-0202',
      department: 'IT',
      hireDate: '2022-08-15',
      status: 'Active',
      employeeId: 'ADM002',
      role: 'IT Admin',
      permissions: ['Full System Access', 'Database Admin', 'Security'],
      lastLogin: '2024-12-20'
    }
  ];

  const supervisors: Supervisor[] = [
    {
      id: '1',
      name: 'David Brown',
      email: 'david.brown@evcore.com',
      phone: '+1-555-0301',
      department: 'Operations',
      hireDate: '2021-03-10',
      status: 'Active',
      employeeId: 'SUP001',
      team: 'North Operations',
      teamSize: 12,
      reportingTo: 'CEO',
      region: 'North'
    },
    {
      id: '2',
      name: 'Lisa Anderson',
      email: 'lisa.anderson@evcore.com',
      phone: '+1-555-0302',
      department: 'Customer Service',
      hireDate: '2021-07-22',
      status: 'Active',
      employeeId: 'SUP002',
      team: 'Customer Experience',
      teamSize: 8,
      reportingTo: 'COO',
      region: 'Central'
    }
  ];

  // Column configurations for each staff type
  const generalStaffColumns: DataTableColumn[] = [
    { key: 'employeeId', label: 'ID', render: (value) => <span className="font-mono">{value}</span> },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'position', label: 'Position' },
    { key: 'department', label: 'Department' },
    { key: 'supervisor', label: 'Supervisor' },
    { key: 'shift', label: 'Shift', render: (value) => <Badge variant="outline">{value}</Badge> },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => {
        const colors = {
          Active: 'bg-green-100 text-green-800',
          Inactive: 'bg-gray-100 text-gray-800',
          'On Leave': 'bg-yellow-100 text-yellow-800'
        };
        return <Badge className={colors[value as keyof typeof colors]}>{value}</Badge>;
      }
    }
  ];

  const adminStaffColumns: DataTableColumn[] = [
    { key: 'employeeId', label: 'ID', render: (value) => <span className="font-mono">{value}</span> },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'role', label: 'Role' },
    { key: 'department', label: 'Department' },
    { 
      key: 'permissions', 
      label: 'Permissions',
      render: (value: string[]) => (
        <div className="space-x-1">
          {value.slice(0, 2).map((perm, index) => (
            <Badge key={index} variant="secondary" className="text-xs">{perm}</Badge>
          ))}
          {value.length > 2 && <Badge variant="outline" className="text-xs">+{value.length - 2}</Badge>}
        </div>
      )
    },
    { key: 'lastLogin', label: 'Last Login' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => {
        const colors = {
          Active: 'bg-green-100 text-green-800',
          Inactive: 'bg-gray-100 text-gray-800',
          'On Leave': 'bg-yellow-100 text-yellow-800'
        };
        return <Badge className={colors[value as keyof typeof colors]}>{value}</Badge>;
      }
    }
  ];

  const supervisorColumns: DataTableColumn[] = [
    { key: 'employeeId', label: 'ID', render: (value) => <span className="font-mono">{value}</span> },
    { key: 'name', label: 'Name', sortable: true },
    { key: 'team', label: 'Team' },
    { key: 'teamSize', label: 'Team Size', render: (value) => `${value} members` },
    { key: 'region', label: 'Region', render: (value) => <Badge variant="outline">{value}</Badge> },
    { key: 'reportingTo', label: 'Reports To' },
    { 
      key: 'status', 
      label: 'Status',
      render: (value) => {
        const colors = {
          Active: 'bg-green-100 text-green-800',
          Inactive: 'bg-gray-100 text-gray-800',
          'On Leave': 'bg-yellow-100 text-yellow-800'
        };
        return <Badge className={colors[value as keyof typeof colors]}>{value}</Badge>;
      }
    }
  ];

  // Filter options for each staff type
  const getFilterOptions = (staffType: string): FilterOption[] => {
    const baseFilters = [
      {
        key: 'status',
        label: 'Status',
        type: 'select' as const,
        options: [
          { value: 'Active', label: 'Active' },
          { value: 'Inactive', label: 'Inactive' },
          { value: 'On Leave', label: 'On Leave' }
        ]
      },
      {
        key: 'department',
        label: 'Department',
        type: 'select' as const,
        options: [
          { value: 'Operations', label: 'Operations' },
          { value: 'Customer Service', label: 'Customer Service' },
          { value: 'Administration', label: 'Administration' },
          { value: 'IT', label: 'IT' }
        ]
      }
    ];

    if (staffType === 'general') {
      return [
        ...baseFilters,
        {
          key: 'shift',
          label: 'Shift',
          type: 'select' as const,
          options: [
            { value: 'Morning', label: 'Morning' },
            { value: 'Evening', label: 'Evening' },
            { value: 'Night', label: 'Night' }
          ]
        }
      ];
    }

    return baseFilters;
  };

  const getCurrentData = () => {
    switch (activeTab) {
      case 'admin': return adminStaff;
      case 'supervisors': return supervisors;
      default: return generalStaff;
    }
  };

  const getCurrentColumns = () => {
    switch (activeTab) {
      case 'admin': return adminStaffColumns;
      case 'supervisors': return supervisorColumns;
      default: return generalStaffColumns;
    }
  };

  const handleAddNew = () => {
    console.log(`Add new ${activeTab} staff`);
  };

  const handleFilterChange = (key: string, value: string) => {
    setFilterValues(prev => ({ ...prev, [key]: value }));
  };

  const handleClearFilters = () => {
    setFilterValues({});
  };

  return (
    <DatabaseLayout 
      title="👥 Staff Management" 
      subtitle="Manage staff members across all categories and departments"
    >
      <div className="max-w-7xl mx-auto space-y-6">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="general" className="gap-2">
              <Users className="w-4 h-4" />
              General Staff
            </TabsTrigger>
            <TabsTrigger value="admin" className="gap-2">
              <UserCog className="w-4 h-4" />
              Admin Staff
            </TabsTrigger>
            <TabsTrigger value="supervisors" className="gap-2">
              <Shield className="w-4 h-4" />
              Supervisors
            </TabsTrigger>
          </TabsList>

          <TabsContent value="general" className="space-y-4">
            <SearchAndFilter
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filters={getFilterOptions('general')}
              filterValues={filterValues}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onAddNew={handleAddNew}
              addNewLabel="Add General Staff"
              placeholder="Search general staff..."
            />
            
            {generalStaff.length > 0 ? (
              <DataTable
                columns={getCurrentColumns()}
                data={getCurrentData()}
                emptyMessage="No general staff found"
              />
            ) : (
              <EmptyState
                icon={Users}
                title="No General Staff Added"
                description="Start by adding general staff members to track their information and assignments."
                actionLabel="Add First Staff Member"
                onAction={handleAddNew}
              />
            )}
          </TabsContent>

          <TabsContent value="admin" className="space-y-4">
            <SearchAndFilter
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filters={getFilterOptions('admin')}
              filterValues={filterValues}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onAddNew={handleAddNew}
              addNewLabel="Add Admin Staff"
              placeholder="Search admin staff..."
            />
            
            {adminStaff.length > 0 ? (
              <DataTable
                columns={getCurrentColumns()}
                data={getCurrentData()}
                emptyMessage="No admin staff found"
              />
            ) : (
              <EmptyState
                icon={UserCog}
                title="No Admin Staff Added"
                description="Add administrative staff members to manage system access and permissions."
                actionLabel="Add First Admin"
                onAction={handleAddNew}
              />
            )}
          </TabsContent>

          <TabsContent value="supervisors" className="space-y-4">
            <SearchAndFilter
              searchValue={searchValue}
              onSearchChange={setSearchValue}
              filters={getFilterOptions('supervisors')}
              filterValues={filterValues}
              onFilterChange={handleFilterChange}
              onClearFilters={handleClearFilters}
              onAddNew={handleAddNew}
              addNewLabel="Add Supervisor"
              placeholder="Search supervisors..."
            />
            
            {supervisors.length > 0 ? (
              <DataTable
                columns={getCurrentColumns()}
                data={getCurrentData()}
                emptyMessage="No supervisors found"
              />
            ) : (
              <EmptyState
                icon={Shield}
                title="No Supervisors Added"
                description="Add supervisors to manage teams and oversee operations across different regions."
                actionLabel="Add First Supervisor"
                onAction={handleAddNew}
              />
            )}
          </TabsContent>
        </Tabs>

        {/* Summary Stats */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-blue-600">{generalStaff.length}</div>
                <div className="text-sm font-medium text-gray-600">General Staff</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-purple-600">{adminStaff.length}</div>
                <div className="text-sm font-medium text-gray-600">Admin Staff</div>
              </div>
            </CardContent>
          </Card>
          <Card className="border border-gray-200">
            <CardContent className="p-6">
              <div className="text-center space-y-2">
                <div className="text-3xl font-bold text-green-600">{supervisors.length}</div>
                <div className="text-sm font-medium text-gray-600">Supervisors</div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </DatabaseLayout>
  );
};

export default StaffManagement;
