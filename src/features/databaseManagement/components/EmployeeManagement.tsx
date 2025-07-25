import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { 
  Users, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download,
  RefreshCw,
  MapPin,
  Calendar,
  Phone,
  Mail,
  UserCheck,
  UserX
} from 'lucide-react';
import { databaseService } from '../services/database';
import { Employee, UserRole } from '../types';
import { useAuth } from '@/contexts/AuthContext';

type EmployeeStatus = 'Active' | 'Inactive' | 'On Leave' | 'Terminated';

export const EmployeeManagement: React.FC = () => {
  const { user } = useAuth();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<UserRole | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});

  const canEdit = user?.role && ['super_admin', 'admin', 'leadership'].includes(user.role);
  const canDelete = user?.role && ['super_admin', 'admin'].includes(user.role);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      const data = await databaseService.getEmployees();
      setEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  const departments = Array.from(new Set(employees.map(emp => emp.department).filter(Boolean)));

  const filteredEmployees = employees.filter(employee => {
    const matchesSearch = employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         employee.email.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || employee.status === statusFilter;
    const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
    const matchesRole = roleFilter === 'all' || employee.role === roleFilter;
    return matchesSearch && matchesStatus && matchesDepartment && matchesRole;
  });

  const handleSave = async () => {
    try {
      if (editingEmployee) {
        await databaseService.updateEmployee(editingEmployee.id, formData, user?.email || 'unknown');
      } else {
        await databaseService.createEmployee(formData as Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>, user?.email || 'unknown');
      }
      
      await fetchEmployees();
      setIsAddDialogOpen(false);
      setEditingEmployee(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving employee:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) return;
    
    if (confirm('Are you sure you want to delete this employee record?')) {
      try {
        await databaseService.deleteEmployee(id, user?.email || 'unknown');
        await fetchEmployees();
      } catch (error) {
        console.error('Error deleting employee:', error);
      }
    }
  };

  const getStatusBadge = (status: EmployeeStatus) => {
    const statusConfig = {
      'Active': { color: 'bg-green-100 text-green-800', label: 'Active', icon: UserCheck },
      'Inactive': { color: 'bg-gray-100 text-gray-800', label: 'Inactive', icon: UserX },
      'On Leave': { color: 'bg-yellow-100 text-yellow-800', label: 'On Leave', icon: Calendar },
      'Terminated': { color: 'bg-red-100 text-red-800', label: 'Terminated', icon: UserX }
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    );
  };

  const resetForm = () => {
    setFormData({});
    setEditingEmployee(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (employee: Employee) => {
    setFormData(employee);
    setEditingEmployee(employee);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-indigo-600" />
            Employee Management
          </h1>
          <p className="text-gray-600 mt-1">Manage staff and employee records</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchEmployees} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {canEdit && (
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Employee
            </Button>
          )}
        </div>
      </div>

      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search employees..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as EmployeeStatus | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Inactive">Inactive</SelectItem>
                <SelectItem value="On Leave">On Leave</SelectItem>
                <SelectItem value="Terminated">Terminated</SelectItem>
              </SelectContent>
            </Select>

            <Select value={departmentFilter} onValueChange={setDepartmentFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by department" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Departments</SelectItem>
                {departments.map((dept) => (
                  <SelectItem key={dept} value={dept}>{dept}</SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={roleFilter} onValueChange={(value) => setRoleFilter(value as UserRole | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by role" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Roles</SelectItem>
                <SelectItem value="super_admin">Super Admin</SelectItem>
                <SelectItem value="admin">Admin</SelectItem>
                <SelectItem value="leadership">Leadership</SelectItem>
                <SelectItem value="manager">Manager</SelectItem>
                <SelectItem value="supervisor">Supervisor</SelectItem>
                <SelectItem value="pilot">Pilot</SelectItem>
                <SelectItem value="lead">Lead</SelectItem>
                <SelectItem value="security">Security</SelectItem>
                <SelectItem value="hr">HR</SelectItem>
                <SelectItem value="finance">Finance</SelectItem>
                <SelectItem value="employee">Employee</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Employee List */}
      <Card>
        <CardHeader>
          <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
          <CardDescription>Staff directory and personnel records</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-6 h-6 animate-spin text-indigo-600" />
            </div>
          ) : filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No employees found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{employee.firstName} {employee.lastName}</h3>
                        <p className="text-gray-600">ID: {employee.employeeId}</p>
                      </div>
                      {getStatusBadge(employee.status as EmployeeStatus)}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <UserCheck className="w-4 h-4" />
                        <span>Position: {employee.position}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Role: {employee.role}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Users className="w-4 h-4" />
                        <span>Department: {employee.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span>{employee.email}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{employee.phone}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined: {new Date(employee.hireDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {(canEdit || canDelete) && (
                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        {canEdit && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDialog(employee)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(employee.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="w-4 h-4 mr-1" />
                            Delete
                          </Button>
                        )}
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      {/* Add/Edit Dialog */}
      <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee ? 'Update employee information' : 'Enter employee details to add to the database'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="employeeId">Employee ID *</Label>
              <Input
                id="employeeId"
                value={formData.employeeId || ''}
                onChange={(e) => setFormData({...formData, employeeId: e.target.value})}
                placeholder="e.g., EMP-001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName || ''}
                onChange={(e) => setFormData({...formData, firstName: e.target.value})}
                placeholder="Enter first name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName || ''}
                onChange={(e) => setFormData({...formData, lastName: e.target.value})}
                placeholder="Enter last name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="email">Email *</Label>
              <Input
                id="email"
                type="email"
                value={formData.email || ''}
                onChange={(e) => setFormData({...formData, email: e.target.value})}
                placeholder="Enter email address"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="phone">Phone *</Label>
              <Input
                id="phone"
                value={formData.phone || ''}
                onChange={(e) => setFormData({...formData, phone: e.target.value})}
                placeholder="Enter phone number"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="position">Position *</Label>
              <Input
                id="position"
                value={formData.position || ''}
                onChange={(e) => setFormData({...formData, position: e.target.value})}
                placeholder="e.g., Software Engineer"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="department">Department *</Label>
              <Input
                id="department"
                value={formData.department || ''}
                onChange={(e) => setFormData({...formData, department: e.target.value})}
                placeholder="e.g., Engineering"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select value={formData.role || ''} onValueChange={(value) => setFormData({...formData, role: value as UserRole})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="super_admin">Super Admin</SelectItem>
                  <SelectItem value="admin">Admin</SelectItem>
                  <SelectItem value="leadership">Leadership</SelectItem>
                  <SelectItem value="manager">Manager</SelectItem>
                  <SelectItem value="supervisor">Supervisor</SelectItem>
                  <SelectItem value="pilot">Pilot</SelectItem>
                  <SelectItem value="lead">Lead</SelectItem>
                  <SelectItem value="security">Security</SelectItem>
                  <SelectItem value="hr">HR</SelectItem>
                  <SelectItem value="finance">Finance</SelectItem>
                  <SelectItem value="employee">Employee</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status || ''} onValueChange={(value) => setFormData({...formData, status: value as EmployeeStatus})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                  <SelectItem value="On Leave">On Leave</SelectItem>
                  <SelectItem value="Terminated">Terminated</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="hireDate">Hire Date *</Label>
              <Input
                id="hireDate"
                type="date"
                value={formData.hireDate ? new Date(formData.hireDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, hireDate: e.target.value})}
              />
            </div>

            <div className="col-span-2 space-y-2">
              <Label htmlFor="address">Address (Street)</Label>
              <Input
                id="address"
                value={typeof formData.address === 'object' ? formData.address?.street || '' : formData.address || ''}
                onChange={(e) => setFormData({
                  ...formData, 
                  address: typeof formData.address === 'object' 
                    ? { ...formData.address, street: e.target.value }
                    : { street: e.target.value, city: '', state: '', zipCode: '', country: '' }
                })}
                placeholder="Enter street address"
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave}>
              {editingEmployee ? 'Update' : 'Add'} Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
