import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { 
  Zap, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Download,
  RefreshCw,
  MapPin,
  Calendar,
  Settings,
  Activity,
  AlertTriangle,
  CheckCircle
} from 'lucide-react';
import { databaseService } from '../services/database';
import { ChargingEquipment } from '../types';
import { useAuth } from '@/contexts/AuthContext';

type ChargingEquipmentStatus = 'Active' | 'Maintenance' | 'Out of Service';
type ConnectorType = 'Type 1' | 'Type 2' | 'CCS' | 'CHAdeMO' | 'Tesla';

export const ChargingEquipmentManagement: React.FC = () => {
  const { user } = useAuth();
  const [equipment, setEquipment] = useState<ChargingEquipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<ChargingEquipmentStatus | 'all'>('all');
  const [connectorFilter, setConnectorFilter] = useState<ConnectorType | 'all'>('all');
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);
  const [editingEquipment, setEditingEquipment] = useState<ChargingEquipment | null>(null);
  const [formData, setFormData] = useState<Partial<ChargingEquipment>>({});

  const canEdit = user?.role && ['super_admin', 'admin', 'leadership'].includes(user.role);
  const canDelete = user?.role && ['super_admin', 'admin'].includes(user.role);

  const fetchEquipment = async () => {
    try {
      setLoading(true);
      const data = await databaseService.getChargingEquipment();
      setEquipment(data);
    } catch (error) {
      console.error('Error fetching charging equipment:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEquipment();
  }, []);

  const filteredEquipment = equipment.filter(item => {
    const matchesSearch = item.equipmentNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.model.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.brand.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         item.location.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || item.status === statusFilter;
    const matchesConnector = connectorFilter === 'all' || item.connectorType === connectorFilter;
    return matchesSearch && matchesStatus && matchesConnector;
  });

  const handleSave = async () => {
    try {
      if (editingEquipment) {
        await databaseService.updateChargingEquipment(editingEquipment.id, formData, user?.email || 'unknown');
      } else {
        await databaseService.createChargingEquipment(formData as Omit<ChargingEquipment, 'id' | 'createdAt' | 'updatedAt'>, user?.email || 'unknown');
      }
      
      await fetchEquipment();
      setIsAddDialogOpen(false);
      setEditingEquipment(null);
      setFormData({});
    } catch (error) {
      console.error('Error saving charging equipment:', error);
    }
  };

  const handleDelete = async (id: string) => {
    if (!canDelete) return;
    
    if (confirm('Are you sure you want to delete this charging equipment?')) {
      try {
        await databaseService.deleteChargingEquipment(id, user?.email || 'unknown');
        await fetchEquipment();
      } catch (error) {
        console.error('Error deleting charging equipment:', error);
      }
    }
  };

  const getStatusBadge = (status: ChargingEquipmentStatus) => {
    const statusConfig = {
      'Active': { color: 'bg-green-100 text-green-800', label: 'Active', icon: CheckCircle },
      'Maintenance': { color: 'bg-yellow-100 text-yellow-800', label: 'Maintenance', icon: Settings },
      'Out of Service': { color: 'bg-red-100 text-red-800', label: 'Out of Service', icon: AlertTriangle }
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
    setEditingEquipment(null);
  };

  const openAddDialog = () => {
    resetForm();
    setIsAddDialogOpen(true);
  };

  const openEditDialog = (equipment: ChargingEquipment) => {
    setFormData(equipment);
    setEditingEquipment(equipment);
    setIsAddDialogOpen(true);
  };

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
            <Zap className="w-6 h-6 text-green-600" />
            Charging Equipment Management
          </h1>
          <p className="text-gray-600 mt-1">Manage EV charging infrastructure and equipment</p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" onClick={fetchEquipment} disabled={loading}>
            <RefreshCw className={`w-4 h-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {canEdit && (
            <Button onClick={openAddDialog}>
              <Plus className="w-4 h-4 mr-2" />
              Add Equipment
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
                placeholder="Search equipment..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <Select value={statusFilter} onValueChange={(value) => setStatusFilter(value as ChargingEquipmentStatus | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Statuses</SelectItem>
                <SelectItem value="Active">Active</SelectItem>
                <SelectItem value="Maintenance">Maintenance</SelectItem>
                <SelectItem value="Out of Service">Out of Service</SelectItem>
              </SelectContent>
            </Select>

            <Select value={connectorFilter} onValueChange={(value) => setConnectorFilter(value as ConnectorType | 'all')}>
              <SelectTrigger>
                <SelectValue placeholder="Filter by connector" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Connectors</SelectItem>
                <SelectItem value="Type 1">Type 1</SelectItem>
                <SelectItem value="Type 2">Type 2</SelectItem>
                <SelectItem value="CCS">CCS</SelectItem>
                <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                <SelectItem value="Tesla">Tesla</SelectItem>
              </SelectContent>
            </Select>

            <Button variant="outline">
              <Download className="w-4 h-4 mr-2" />
              Export
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Equipment List */}
      <Card>
        <CardHeader>
          <CardTitle>Charging Equipment ({filteredEquipment.length})</CardTitle>
          <CardDescription>EV charging infrastructure inventory and monitoring</CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center h-32">
              <RefreshCw className="w-6 h-6 animate-spin text-green-600" />
            </div>
          ) : filteredEquipment.length === 0 ? (
            <div className="text-center py-8">
              <Zap className="w-12 h-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">No charging equipment found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {filteredEquipment.map((item) => (
                <Card key={item.id} className="border hover:shadow-md transition-shadow">
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between mb-3">
                      <div>
                        <h3 className="font-semibold text-lg">{item.equipmentNumber}</h3>
                        <p className="text-gray-600">{item.brand} {item.model}</p>
                      </div>
                      {getStatusBadge(item.status)}
                    </div>
                    
                    <div className="space-y-2 text-sm text-gray-600">
                      <div className="flex items-center gap-2">
                        <Zap className="w-4 h-4" />
                        <span>Connector: {item.connectorType}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Activity className="w-4 h-4" />
                        <span>Power: {item.powerOutput}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin className="w-4 h-4" />
                        <span>{item.location}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4" />
                        <span>Installed: {new Date(item.installationDate).toLocaleDateString()}</span>
                      </div>
                    </div>

                    {(canEdit || canDelete) && (
                      <div className="flex gap-2 mt-4 pt-3 border-t">
                        {canEdit && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => openEditDialog(item)}
                          >
                            <Edit className="w-4 h-4 mr-1" />
                            Edit
                          </Button>
                        )}
                        {canDelete && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => handleDelete(item.id)}
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
              {editingEquipment ? 'Edit Charging Equipment' : 'Add New Charging Equipment'}
            </DialogTitle>
            <DialogDescription>
              {editingEquipment ? 'Update equipment information' : 'Enter equipment details to add to the database'}
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="equipmentNumber">Equipment Number *</Label>
              <Input
                id="equipmentNumber"
                value={formData.equipmentNumber || ''}
                onChange={(e) => setFormData({...formData, equipmentNumber: e.target.value})}
                placeholder="e.g., CHG-001"
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="connectorType">Connector Type *</Label>
              <Select value={formData.connectorType || ''} onValueChange={(value) => setFormData({...formData, connectorType: value as ConnectorType})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select connector type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Type 1">Type 1</SelectItem>
                  <SelectItem value="Type 2">Type 2</SelectItem>
                  <SelectItem value="CCS">CCS</SelectItem>
                  <SelectItem value="CHAdeMO">CHAdeMO</SelectItem>
                  <SelectItem value="Tesla">Tesla</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="brand">Brand *</Label>
              <Input
                id="brand"
                value={formData.brand || ''}
                onChange={(e) => setFormData({...formData, brand: e.target.value})}
                placeholder="e.g., Tesla"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="model">Model *</Label>
              <Input
                id="model"
                value={formData.model || ''}
                onChange={(e) => setFormData({...formData, model: e.target.value})}
                placeholder="e.g., Supercharger V3"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="powerOutput">Power Output *</Label>
              <Input
                id="powerOutput"
                value={formData.powerOutput || ''}
                onChange={(e) => setFormData({...formData, powerOutput: e.target.value})}
                placeholder="e.g., 150kW"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="status">Status *</Label>
              <Select value={formData.status || ''} onValueChange={(value) => setFormData({...formData, status: value as ChargingEquipmentStatus})}>
                <SelectTrigger>
                  <SelectValue placeholder="Select status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Maintenance">Maintenance</SelectItem>
                  <SelectItem value="Out of Service">Out of Service</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="location">Location *</Label>
              <Input
                id="location"
                value={formData.location || ''}
                onChange={(e) => setFormData({...formData, location: e.target.value})}
                placeholder="e.g., Mumbai Depot - Bay 1"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="installationDate">Installation Date *</Label>
              <Input
                id="installationDate"
                type="date"
                value={formData.installationDate ? new Date(formData.installationDate).toISOString().split('T')[0] : ''}
                onChange={(e) => setFormData({...formData, installationDate: e.target.value})}
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
            <Button onClick={handleSave}>
              {editingEquipment ? 'Update' : 'Add'} Equipment
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
