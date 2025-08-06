import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
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
  UserX,
  CreditCard,
  Building2,
  Shield,
  Camera,
  FileText,
  User,
  Briefcase,
  Clock,
  DollarSign,
  Eye
} from 'lucide-react';
import { databaseService } from '../services/databaseSimple';
import { Employee, UserRole } from '../types';
import { useAuth } from '@/contexts/AuthContext';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';

type EmployeeStatus = 'Active' | 'On Leave' | 'Terminated';

export const EmployeeManagement: React.FC = () => {
  console.log('EmployeeManagement component is rendering...');
  
  const { user } = useAuth();
  const { toast } = useToast();
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [filteredEmployees, setFilteredEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<EmployeeStatus | 'all'>('all');
  const [departmentFilter, setDepartmentFilter] = useState<string>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);
  const [formData, setFormData] = useState<Partial<Employee>>({});
  const [deleteLoading, setDeleteLoading] = useState<string | null>(null);

  const canEdit = user?.role && ['super_admin', 'admin', 'leadership', 'hr'].includes(user.role);
  const canDelete = user?.role && ['super_admin', 'admin'].includes(user.role);

  const fetchEmployees = async () => {
    try {
      setLoading(true);
      console.log('Fetching employees...');
      const data = await databaseService.getEmployees();
      console.log('Fetched employees:', data);
      setEmployees(data);
      setFilteredEmployees(data);
    } catch (error) {
      console.error('Error fetching employees:', error);
      toast({
        title: "Error",
        description: "Failed to load employees data",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEmployees();
  }, []);

  useEffect(() => {
    if (!employees.length) return;
    
    const filtered = employees.filter(employee => {
      const matchesSearch = searchTerm === '' || 
        employee.employeeId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.emailId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        employee.contactNumber.includes(searchTerm) ||
        employee.designation.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesStatus = statusFilter === 'all' || employee.employeeStatus === statusFilter;
      const matchesDepartment = departmentFilter === 'all' || employee.department === departmentFilter;
      
      return matchesSearch && matchesStatus && matchesDepartment;
    });
    
    setFilteredEmployees(filtered);
  }, [searchTerm, statusFilter, departmentFilter, employees]);

  const departments = Array.from(new Set(employees.map(emp => emp.department).filter(Boolean)));

  const handleSave = async () => {
    try {
      // Validate required fields
      if (!formData.employeeId || !formData.fullName || !formData.emailId || !formData.contactNumber) {
        toast({
          title: "Validation Error",
          description: "Please fill in all required fields",
          variant: "destructive",
        });
        return;
      }

      if (editingEmployee) {
        await databaseService.updateEmployee(editingEmployee.id, formData, user?.email || 'unknown');
        toast({
          title: "Success",
          description: "Employee updated successfully",
        });
      } else {
        await databaseService.createEmployee(formData as Omit<Employee, 'id' | 'createdAt' | 'updatedAt'>, user?.email || 'unknown');
        toast({
          title: "Success", 
          description: "Employee added successfully",
        });
      }
      
      await fetchEmployees();
      setIsAddDialogOpen(false);
      setEditingEmployee(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving employee:', error);
      toast({
        title: "Error",
        description: "Failed to save employee",
        variant: "destructive",
      });
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) return;
    
    try {
      setDeleteLoading(id);
      await databaseService.deleteEmployee(id, user?.email || 'unknown');
      await fetchEmployees();
      toast({
        title: "Success",
        description: "Employee deleted successfully",
      });
    } catch (error) {
      console.error('Error deleting employee:', error);
      toast({
        title: "Error",
        description: "Failed to delete employee",
        variant: "destructive",
      });
    } finally {
      setDeleteLoading(null);
    }
  };

  const getStatusBadge = (status: EmployeeStatus) => {
    const statusConfig = {
      'Active': { color: 'bg-green-100 text-green-800 border-green-200', icon: UserCheck },
      'On Leave': { color: 'bg-yellow-100 text-yellow-800 border-yellow-200', icon: Calendar },
      'Terminated': { color: 'bg-red-100 text-red-800 border-red-200', icon: UserX }
    };
    const config = statusConfig[status];
    const Icon = config.icon;
    return (
      <Badge className={`${config.color} flex items-center gap-1`}>
        <Icon className="w-3 h-3" />
        {status}
      </Badge>
    );
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      minimumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric'
    });
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

  if (loading) {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold">Employee Management</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {[1, 2, 3].map(i => (
            <Card key={i} className="animate-pulse">
              <CardHeader>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-3 bg-gray-200 rounded w-1/2"></div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="h-3 bg-gray-200 rounded"></div>
                  <div className="h-3 bg-gray-200 rounded w-5/6"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Users className="w-6 h-6 text-blue-600" />
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
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
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
          <div className="flex justify-between items-center">
            <div>
              <CardTitle>Employees ({filteredEmployees.length})</CardTitle>
              <CardDescription>Staff directory and personnel records</CardDescription>
            </div>
            <Badge variant="outline" className="text-sm">
              {filteredEmployees.length} employee{filteredEmployees.length !== 1 ? 's' : ''}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {filteredEmployees.length === 0 ? (
            <div className="text-center py-8">
              <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">
                {searchTerm || statusFilter !== 'all' || departmentFilter !== 'all' 
                  ? 'No employees found matching your filters' 
                  : 'No employees found'}
              </p>
              {!searchTerm && statusFilter === 'all' && departmentFilter === 'all' && canEdit && (
                <Button onClick={openAddDialog} className="mt-4">
                  <Plus className="w-4 h-4 mr-2" />
                  Add First Employee
                </Button>
              )}
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredEmployees.map((employee) => (
                <Card key={employee.id} className="border hover:shadow-lg transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <h3 className="font-semibold text-lg text-gray-900">{employee.fullName}</h3>
                        <p className="text-gray-600 font-mono text-sm">ID: {employee.employeeId}</p>
                        <p className="text-gray-600 text-sm">{employee.designation}</p>
                      </div>
                      {getStatusBadge(employee.employeeStatus)}
                    </div>
                    
                    <div className="space-y-3 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Building2 className="w-4 h-4" />
                        <span>{employee.department}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Mail className="w-4 h-4" />
                        <span className="truncate">{employee.emailId}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Phone className="w-4 h-4" />
                        <span>{employee.contactNumber}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{employee.city}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Joined: {formatDate(employee.dateOfJoining)}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <DollarSign className="w-4 h-4" />
                        <span>{formatCurrency(employee.monthlySalary)} ({employee.salaryMode})</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Shield className="w-4 h-4" />
                        <span>Background: {employee.backgroundCheckStatus}</span>
                      </div>
                    </div>

                    {(canEdit || canDelete) && (
                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        <Button variant="outline" size="sm" className="flex-1">
                          <Eye className="w-4 h-4 mr-1" />
                          View
                        </Button>
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
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button 
                                variant="outline" 
                                size="sm"
                                className="text-red-600 hover:text-red-700 hover:bg-red-50"
                                disabled={deleteLoading === employee.id}
                              >
                                {deleteLoading === employee.id ? (
                                  <div className="w-3 h-3 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle className="flex items-center gap-2">
                                  <Trash2 className="w-5 h-5 text-red-600" />
                                  Delete Employee
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to delete <strong>{employee.fullName}</strong> ({employee.employeeId})?
                                  This action cannot be undone and will permanently remove all employee data.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction 
                                  onClick={() => handleDelete(employee.id)}
                                  className="bg-red-600 hover:bg-red-700"
                                >
                                  Delete Employee
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
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
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <User className="w-5 h-5" />
              {editingEmployee ? 'Edit Employee' : 'Add New Employee'}
            </DialogTitle>
            <DialogDescription>
              {editingEmployee ? 'Update employee information' : 'Enter comprehensive employee details'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Basic Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                  <Label htmlFor="fullName">Full Name *</Label>
                  <Input
                    id="fullName"
                    value={formData.fullName || ''}
                    onChange={(e) => setFormData({...formData, fullName: e.target.value})}
                    placeholder="Enter full legal name"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="gender">Gender *</Label>
                  <Select value={formData.gender || ''} onValueChange={(value) => setFormData({...formData, gender: value as 'Male' | 'Female' | 'Other'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Male">Male</SelectItem>
                      <SelectItem value="Female">Female</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dateOfBirth">Date of Birth *</Label>
                  <Input
                    id="dateOfBirth"
                    type="date"
                    value={formData.dateOfBirth ? new Date(formData.dateOfBirth).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({...formData, dateOfBirth: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="maritalStatus">Marital Status *</Label>
                  <Select value={formData.maritalStatus || ''} onValueChange={(value) => setFormData({...formData, maritalStatus: value as 'Single' | 'Married' | 'Divorced'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Single">Single</SelectItem>
                      <SelectItem value="Married">Married</SelectItem>
                      <SelectItem value="Divorced">Divorced</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Contact Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="contactNumber">Contact Number *</Label>
                  <Input
                    id="contactNumber"
                    value={formData.contactNumber || ''}
                    onChange={(e) => setFormData({...formData, contactNumber: e.target.value})}
                    placeholder="Enter mobile number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emailId">Email ID *</Label>
                  <Input
                    id="emailId"
                    type="email"
                    value={formData.emailId || ''}
                    onChange={(e) => setFormData({...formData, emailId: e.target.value})}
                    placeholder="Enter email address"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Textarea
                    id="address"
                    value={formData.address || ''}
                    onChange={(e) => setFormData({...formData, address: e.target.value})}
                    placeholder="Enter residential address"
                    rows={2}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    value={formData.city || ''}
                    onChange={(e) => setFormData({...formData, city: e.target.value})}
                    placeholder="Enter city"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="emergencyContact">Emergency Contact *</Label>
                  <Input
                    id="emergencyContact"
                    value={formData.emergencyContact || ''}
                    onChange={(e) => setFormData({...formData, emergencyContact: e.target.value})}
                    placeholder="Name and contact number"
                  />
                </div>
              </div>
            </div>

            {/* Identity Documents */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Identity Documents</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="aadharNumber">Aadhar Number *</Label>
                  <Input
                    id="aadharNumber"
                    value={formData.aadharNumber || ''}
                    onChange={(e) => setFormData({...formData, aadharNumber: e.target.value})}
                    placeholder="Enter Aadhar number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="panNumber">PAN Number *</Label>
                  <Input
                    id="panNumber"
                    value={formData.panNumber || ''}
                    onChange={(e) => setFormData({...formData, panNumber: e.target.value})}
                    placeholder="Enter PAN number"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="backgroundCheckStatus">Background Check Status *</Label>
                  <Select value={formData.backgroundCheckStatus || ''} onValueChange={(value) => setFormData({...formData, backgroundCheckStatus: value as 'Pending' | 'Cleared' | 'Rejected'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Pending">Pending</SelectItem>
                      <SelectItem value="Cleared">Cleared</SelectItem>
                      <SelectItem value="Rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Employment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Employment Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="dateOfJoining">Date of Joining *</Label>
                  <Input
                    id="dateOfJoining"
                    type="date"
                    value={formData.dateOfJoining ? new Date(formData.dateOfJoining).toISOString().split('T')[0] : ''}
                    onChange={(e) => setFormData({...formData, dateOfJoining: e.target.value})}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employmentType">Employment Type *</Label>
                  <Select value={formData.employmentType || ''} onValueChange={(value) => setFormData({...formData, employmentType: value as 'Full-Time' | 'Part-Time' | 'Contract' | 'Intern'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Full-Time">Full-Time</SelectItem>
                      <SelectItem value="Part-Time">Part-Time</SelectItem>
                      <SelectItem value="Contract">Contract</SelectItem>
                      <SelectItem value="Intern">Intern</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="designation">Designation *</Label>
                  <Input
                    id="designation"
                    value={formData.designation || ''}
                    onChange={(e) => setFormData({...formData, designation: e.target.value})}
                    placeholder="Job title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="department">Department *</Label>
                  <Select value={formData.department || ''} onValueChange={(value) => setFormData({...formData, department: value as 'Operations' | 'Marketing' | 'Tech' | 'HR' | 'Finance' | 'Other'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select department" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Operations">Operations</SelectItem>
                      <SelectItem value="Marketing">Marketing</SelectItem>
                      <SelectItem value="Tech">Tech</SelectItem>
                      <SelectItem value="HR">HR</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="reportingManagerId">Reporting Manager ID</Label>
                  <Input
                    id="reportingManagerId"
                    value={formData.reportingManagerId || ''}
                    onChange={(e) => setFormData({...formData, reportingManagerId: e.target.value})}
                    placeholder="Manager's employee ID"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="shiftType">Shift Type *</Label>
                  <Select value={formData.shiftType || ''} onValueChange={(value) => setFormData({...formData, shiftType: value as 'Morning' | 'Evening' | 'Rotational'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select shift" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Morning">Morning</SelectItem>
                      <SelectItem value="Evening">Evening</SelectItem>
                      <SelectItem value="Rotational">Rotational</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="workLocation">Work Location *</Label>
                  <Input
                    id="workLocation"
                    value={formData.workLocation || ''}
                    onChange={(e) => setFormData({...formData, workLocation: e.target.value})}
                    placeholder="Office or hub location"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="employeeStatus">Employee Status *</Label>
                  <Select value={formData.employeeStatus || ''} onValueChange={(value) => setFormData({...formData, employeeStatus: value as 'Active' | 'On Leave' | 'Terminated'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Active">Active</SelectItem>
                      <SelectItem value="On Leave">On Leave</SelectItem>
                      <SelectItem value="Terminated">Terminated</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Salary Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Salary Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="monthlySalary">Monthly Salary *</Label>
                  <Input
                    id="monthlySalary"
                    type="number"
                    value={formData.monthlySalary || ''}
                    onChange={(e) => setFormData({...formData, monthlySalary: parseFloat(e.target.value) || 0})}
                    placeholder="Gross amount"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="salaryMode">Salary Mode *</Label>
                  <Select value={formData.salaryMode || ''} onValueChange={(value) => setFormData({...formData, salaryMode: value as 'Bank' | 'UPI' | 'Cash'})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select mode" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Bank">Bank</SelectItem>
                      <SelectItem value="UPI">UPI</SelectItem>
                      <SelectItem value="Cash">Cash</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="bankAccountNumber">Bank Account Number</Label>
                  <Input
                    id="bankAccountNumber"
                    value={formData.bankAccountNumber || ''}
                    onChange={(e) => setFormData({...formData, bankAccountNumber: e.target.value})}
                    placeholder="For salary credit"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="ifscCode">IFSC Code</Label>
                  <Input
                    id="ifscCode"
                    value={formData.ifscCode || ''}
                    onChange={(e) => setFormData({...formData, ifscCode: e.target.value})}
                    placeholder="Bank IFSC code"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="uanNumber">UAN Number</Label>
                  <Input
                    id="uanNumber"
                    value={formData.uanNumber || ''}
                    onChange={(e) => setFormData({...formData, uanNumber: e.target.value})}
                    placeholder="For EPF"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="esicNumber">ESIC Number</Label>
                  <Input
                    id="esicNumber"
                    value={formData.esicNumber || ''}
                    onChange={(e) => setFormData({...formData, esicNumber: e.target.value})}
                    placeholder="For insurance"
                  />
                </div>

                <div className="flex items-center space-x-2">
                  <Checkbox 
                    id="pfEligible"
                    checked={formData.pfEligible || false}
                    onCheckedChange={(checked) => setFormData({...formData, pfEligible: checked === true})}
                  />
                  <Label htmlFor="pfEligible">PF Eligible</Label>
                </div>
              </div>
            </div>

            {/* Document URLs */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-900 border-b pb-2">Document Management</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="photoUrl">Profile Photo URL</Label>
                  <Input
                    id="photoUrl"
                    value={formData.photoUrl || ''}
                    onChange={(e) => setFormData({...formData, photoUrl: e.target.value})}
                    placeholder="Profile photo path"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="dlCopyUrl">DL Copy URL</Label>
                  <Input
                    id="dlCopyUrl"
                    value={formData.dlCopyUrl || ''}
                    onChange={(e) => setFormData({...formData, dlCopyUrl: e.target.value})}
                    placeholder="Driving license document path"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter className="flex gap-2">
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={!formData.employeeId || !formData.fullName || !formData.emailId || !formData.contactNumber}>
              <User className="w-4 h-4 mr-2" />
              {editingEmployee ? 'Update' : 'Add'} Employee
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default EmployeeManagement;
