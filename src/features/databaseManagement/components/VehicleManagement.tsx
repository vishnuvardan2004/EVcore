import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Car, 
  Plus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  Download,
  RefreshCw,
  MapPin,
  Calendar,
  Fuel,
  Settings
} from 'lucide-react';
import { apiService } from '../../../services/api';
import { useAPI, useMutation } from '../../../hooks/useAPI';
import { useErrorHandler } from '../../../hooks/useErrorHandler';
import { Vehicle } from '../types';
import { useAuth } from '@/contexts/AuthContext';

type VehicleStatus = 'Available' | 'In Use' | 'Maintenance' | 'Out of Service';
type VehicleStyleClass = 'SUV' | 'Sedan' | 'Hatchback' | 'Coupe' | 'Truck' | 'Van';
type VehicleType = 'Electric' | 'Hybrid' | 'Petrol' | 'Diesel';

export const VehicleManagement: React.FC = () => {
  const { user } = useAuth();
  const { handleSuccess } = useErrorHandler();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<VehicleStatus | 'all'>('all');
  const [typeFilter, setTypeFilter] = useState<VehicleType | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingVehicle, setEditingVehicle] = useState<Vehicle | null>(null);
  const [formData, setFormData] = useState<Partial<Vehicle>>({});

  // API hooks
  const {
    data: vehicles = [],
    loading,
    refetch: fetchVehicles
  } = useAPI(() => apiService.vehicles.getAll({
    search: searchTerm || undefined,
    status: statusFilter !== 'all' ? statusFilter : undefined,
    type: typeFilter !== 'all' ? typeFilter : undefined,
  }));

  const createVehicleMutation = useMutation(
    (data: Partial<Vehicle>) => apiService.vehicles.create(data),
    {
      onSuccess: () => {
        handleSuccess('Vehicle created successfully');
        setIsAddDialogOpen(false);
        resetForm();
        fetchVehicles();
      }
    }
  );

  const updateVehicleMutation = useMutation(
    ({ id, data }: { id: string; data: Partial<Vehicle> }) => 
      apiService.vehicles.update(id, data),
    {
      onSuccess: () => {
        handleSuccess('Vehicle updated successfully');
        setIsAddDialogOpen(false);
        resetForm();
        fetchVehicles();
      }
    }
  );

  const deleteVehicleMutation = useMutation(
    (id: string) => apiService.vehicles.delete(id),
    {
      onSuccess: () => {
        handleSuccess('Vehicle deleted successfully');
        fetchVehicles();
      }
    }
  );

  const canEdit = user?.role && ['super_admin', 'admin', 'leadership'].includes(user.role);
  const canDelete = user?.role && ['super_admin', 'admin'].includes(user.role);

  // Refetch when filters change
  useEffect(() => {
    fetchVehicles();
  }, [searchTerm, statusFilter, typeFilter, fetchVehicles]);

  const filteredVehicles = vehicles.filter(vehicle => {
    const matchesSearch = vehicle.registrationNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         vehicle.brand.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || vehicle.status === statusFilter;
    const matchesType = typeFilter === 'all' || vehicle.type === typeFilter;
    return matchesSearch && matchesStatus && matchesType;
  });

  const handleSave = async () => {
    try {
      if (editingVehicle) {
        await updateVehicleMutation.mutate({ id: editingVehicle.id, data: formData });
      } else {
        await createVehicleMutation.mutate(formData);
      }
    } catch (error) {
      // Error handling is done in the mutation hooks
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) return;
    
    if (confirm('Are you sure you want to delete this vehicle?')) {
      try {
        await deleteVehicleMutation.mutate(id);
      } catch (error) {
        // Error handling is done in the mutation hook
      }
    }
  };

  const getStatusBadge = (status: VehicleStatus) => {
    const statusConfig = {
      active: { color: 'bg-green-100 text-green-800', label: 'Active' },
      maintenance: { color: 'bg-yellow-100 text-yellow-800', label: 'Maintenance' },
      inactive: { color: 'bg-gray-100 text-gray-800', label: 'Inactive' },
      deployed: { color: 'bg-blue-100 text-blue-800', label: 'Deployed' }
    };
    const config = statusConfig[status];
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const resetForm = () => {
    setFormData({});
    setEditingVehicle(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (vehicle: Vehicle) => {
    setFormData(vehicle);
    setEditingVehicle(vehicle);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Car className="w-6 h-6 text-blue-600" />
            Vehicle Management
          </h1>
          <p className="text-gray-600 mt-1">Manage fleet vehicles and specifications</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchVehicles} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {canEdit && (
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Vehicle
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
                placeholder="Search vehicles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as VehicleStatus | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Available">Available</SelectItem>
                <SelectItem value="In Use">In Use</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Out of Service">Out of Service</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={(value) => setTypeFilter(value as VehicleType | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="Electric">Electric</SelectItem>
                <SelectItem value="Hybrid">Hybrid</SelectItem>
                <SelectItem value="Petrol">Petrol</SelectItem>
                <SelectItem value="Diesel">Diesel</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Vehicle List */}
      <Card>
        <CardHeader>
          <CardTitle>Vehicles ({filteredVehicles.length})</CardTitle>
          <CardDescription>Fleet inventory and status tracking</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-6 h-6 animate-spin text-blue-600" />
            </div>
          ) : filteredVehicles.length === 0 ? (
            <div className="text-center py-8">
              <Car className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No vehicles found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredVehicles.map((vehicle) => (
                <Card key={vehicle.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{vehicle.registrationNumber}</h3>
                        <p className="text-gray-600">{vehicle.brand} {vehicle.model}</p>
                      </div>
                      {getStatusBadge(vehicle.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Style: {vehicle.styleClass}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Fuel className="w-4 h-4" />
                        <span>Type: {vehicle.type}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{vehicle.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Purchase: {new Date(vehicle.purchaseDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {(canEdit || canDelete) && (
                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        {canEdit && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDialog(vehicle)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(vehicle.id)}
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
              {editingVehicle ? 'Edit Vehicle' : 'Add New Vehicle'}
            </DialogTitle>
            <DialogDescription>
              {editingVehicle ? 'Update vehicle information' : 'Enter vehicle details to add to the database'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="registrationNumber">Registration Number *</Label>
              <Input
                id="registrationNumber"
                value={formData.registrationNumber || ''}
                onChange={(e) => setFormData({...formData, registrationNumber: e.target.value})}
                placeholder="e.g., MH01AB1234"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="styleClass">Vehicle Style *</Label>
              <Select value={formData.styleClass || ''} onValueChange={(value) => setFormData({...formData, styleClass: value as VehicleStyleClass})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select style" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="SUV">SUV</SelectItem>
                  <SelectItem value="Sedan">Sedan</SelectItem>
                  <SelectItem value="Hatchback">Hatchback</SelectItem>
                  <SelectItem value="Coupe">Coupe</SelectItem>
                  <SelectItem value="Truck">Truck</SelectItem>
                  <SelectItem value="Van">Van</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand || ''}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="e.g., Toyota"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model || ''}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                placeholder="e.g., Corolla"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="vin">VIN Number *</Label>
              <Input
                id="vin"
                value={formData.vin || ''}
                onChange={(e) => setFormData({...formData, vin: e.target.value})}
                placeholder="e.g., 1HGBH41JXMN109186"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="type">Vehicle Type *</Label>
              <Select value={formData.type || ''} onValueChange={(value) => setFormData({...formData, type: value as VehicleType})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select fuel type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Electric">Electric</SelectItem>
                  <SelectItem value="Hybrid">Hybrid</SelectItem>
                  <SelectItem value="Petrol">Petrol</SelectItem>
                  <SelectItem value="Diesel">Diesel</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status || ''} onValueChange={(value) => setFormData({...formData, status: value as VehicleStatus})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Available">Available</SelectItem>
                  <SelectItem value="In Use">In Use</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Mumbai Depot"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="purchaseDate">Purchase Date *</Label>
              <Input
                id="purchaseDate"
                type="date"
                value={formData.purchaseDate ? new Date(formData.purchaseDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, purchaseDate: e.target.value})}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="warrantyExpiry">Warranty Expiry *</Label>
              <Input
                id="warrantyExpiry"
                type="date"
                value={formData.warrantyExpiry ? new Date(formData.warrantyExpiry).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, warrantyExpiry: e.target.value})}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setIsAddDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSave} disabled={createVehicleMutation.loading || updateVehicleMutation.loading}>
              {editingVehicle ? 'Update' : 'Add'} Vehicle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
