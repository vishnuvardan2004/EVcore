import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Search, Download, FileText, AlertTriangle, Paperclip } from 'lucide-react';
import { vehicleService } from '../services/database';
import { Deployment } from '../types/vehicle';
import { calculateDuration } from '../utils/reportGenerator';
import { RideDetailModal } from '../components/RideDetailModal';
import { ExportDialog } from '../components/ExportDialog';
import { useToast } from '../hooks/use-toast';

const RideHistory = () => {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [filteredDeployments, setFilteredDeployments] = useState<Deployment[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRide, setSelectedRide] = useState<Deployment | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);
  const { toast } = useToast();

  // Filter states
  const [vehicleNumberFilter, setVehicleNumberFilter] = useState('');
  const [driverNameFilter, setDriverNameFilter] = useState('');
  const [dateFromFilter, setDateFromFilter] = useState('');
  const [dateToFilter, setDateToFilter] = useState('');
  const [purposeFilter, setPurposeFilter] = useState<string>('');
  const [supervisorFilter, setSupervisorFilter] = useState('');

  useEffect(() => {
    loadDeployments();
  }, []);

  useEffect(() => {
    applyFilters();
  }, [deployments, vehicleNumberFilter, driverNameFilter, dateFromFilter, dateToFilter, purposeFilter, supervisorFilter]);

  const loadDeployments = async () => {
    try {
      const allDeployments = await vehicleService.getDeploymentHistory();
      // Only show completed deployments (those with both OUT and IN data)
      const completedDeployments = allDeployments.filter(d => d.inTimestamp && d.outTimestamp);
      setDeployments(completedDeployments);
    } catch (error) {
      console.error('Error loading deployments:', error);
      toast({
        title: "Error",
        description: "Failed to load ride history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const applyFilters = () => {
    let filtered = deployments.filter(deployment => {
      // Vehicle number filter
      if (vehicleNumberFilter && !deployment.vehicleNumber.toLowerCase().includes(vehicleNumberFilter.toLowerCase())) {
        return false;
      }

      // Driver name filter
      if (driverNameFilter) {
        const driverName = deployment.outData?.driverName || deployment.outData?.employeeName || '';
        if (!driverName.toLowerCase().includes(driverNameFilter.toLowerCase())) {
          return false;
        }
      }

      // Date range filter
      if (dateFromFilter && deployment.outTimestamp) {
        const outDate = new Date(deployment.outTimestamp).toISOString().split('T')[0];
        if (outDate < dateFromFilter) {
          return false;
        }
      }

      if (dateToFilter && deployment.outTimestamp) {
        const outDate = new Date(deployment.outTimestamp).toISOString().split('T')[0];
        if (outDate > dateToFilter) {
          return false;
        }
      }

      // Purpose filter
      if (purposeFilter && deployment.purpose !== purposeFilter) {
        return false;
      }

      // Supervisor filter
      if (supervisorFilter) {
        const outSupervisor = deployment.outData?.supervisorName || '';
        const inSupervisor = deployment.inData?.inSupervisorName || '';
        if (!outSupervisor.toLowerCase().includes(supervisorFilter.toLowerCase()) &&
            !inSupervisor.toLowerCase().includes(supervisorFilter.toLowerCase())) {
          return false;
        }
      }

      return true;
    });

    setFilteredDeployments(filtered);
  };

  const clearFilters = () => {
    setVehicleNumberFilter('');
    setDriverNameFilter('');
    setDateFromFilter('');
    setDateToFilter('');
    setPurposeFilter('');
    setSupervisorFilter('');
  };

  const hasChecklistMismatches = (deployment: Deployment): boolean => {
    return (deployment.inData?.checklistMismatches || []).length > 0;
  };

  const hasAttachments = (deployment: Deployment): boolean => {
    return Boolean(deployment.outData?.vehiclePhotos?.length || deployment.inData?.vehiclePhotos?.length);
  };

  const formatDateTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };

  const toggleRowSelection = (deploymentId: string) => {
    setSelectedRows(prev => 
      prev.includes(deploymentId) 
        ? prev.filter(id => id !== deploymentId)
        : [...prev, deploymentId]
    );
  };

  const selectAllRows = () => {
    if (selectedRows.length === filteredDeployments.length) {
      setSelectedRows([]);
    } else {
      setSelectedRows(filteredDeployments.map(d => d.id));
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-6 max-w-7xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            📋 Ride History & Export Report
          </h1>
          <p className="text-gray-600">
            Search, view, and export historical vehicle deployment records
          </p>
        </div>

        {/* Filters */}
        <Card className="p-6 mb-6">
          <h2 className="text-lg font-semibold mb-4">Search & Filter</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Vehicle Number</label>
              <Input
                placeholder="Search vehicle..."
                value={vehicleNumberFilter}
                onChange={(e) => setVehicleNumberFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Driver Name</label>
              <Input
                placeholder="Search driver..."
                value={driverNameFilter}
                onChange={(e) => setDriverNameFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">From Date</label>
              <Input
                type="date"
                value={dateFromFilter}
                onChange={(e) => setDateFromFilter(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">To Date</label>
              <Input
                type="date"
                value={dateToFilter}
                onChange={(e) => setDateToFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block text-sm font-medium mb-1">Purpose</label>
              <Select value={purposeFilter} onValueChange={setPurposeFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="All purposes" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">All purposes</SelectItem>
                  <SelectItem value="Office">Office</SelectItem>
                  <SelectItem value="Pilot">Pilot</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Supervisor Name</label>
              <Input
                placeholder="Search supervisor..."
                value={supervisorFilter}
                onChange={(e) => setSupervisorFilter(e.target.value)}
              />
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={clearFilters}>
              Clear Filters
            </Button>
            <Button 
              variant="outline" 
              onClick={() => setShowExportDialog(true)}
              disabled={selectedRows.length === 0}
            >
              <Download className="w-4 h-4 mr-2" />
              Export Selected ({selectedRows.length})
            </Button>
          </div>
        </Card>

        {/* Results */}
        <Card className="p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-lg font-semibold">
              Deployment Records ({filteredDeployments.length})
            </h2>
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm"
                onClick={selectAllRows}
              >
                {selectedRows.length === filteredDeployments.length ? 'Deselect All' : 'Select All'}
              </Button>
            </div>
          </div>

          {loading ? (
            <div className="text-center py-8">
              <p>Loading ride history...</p>
            </div>
          ) : filteredDeployments.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No rides found matching your criteria</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-12">
                      <input
                        type="checkbox"
                        checked={selectedRows.length === filteredDeployments.length && filteredDeployments.length > 0}
                        onChange={selectAllRows}
                      />
                    </TableHead>
                    <TableHead>Vehicle</TableHead>
                    <TableHead>OUT Date & Time</TableHead>
                    <TableHead>IN Date & Time</TableHead>
                    <TableHead>Driver</TableHead>
                    <TableHead>Purpose</TableHead>
                    <TableHead>Duration</TableHead>
                    <TableHead>KMs</TableHead>
                    <TableHead>Supervisors</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredDeployments.map((deployment) => (
                    <TableRow key={deployment.id} className="cursor-pointer hover:bg-gray-50">
                      <TableCell>
                        <input
                          type="checkbox"
                          checked={selectedRows.includes(deployment.id)}
                          onChange={() => toggleRowSelection(deployment.id)}
                          onClick={(e) => e.stopPropagation()}
                        />
                      </TableCell>
                      <TableCell className="font-medium">{deployment.vehicleNumber}</TableCell>
                      <TableCell>{deployment.outTimestamp ? formatDateTime(deployment.outTimestamp) : 'N/A'}</TableCell>
                      <TableCell>{deployment.inTimestamp ? formatDateTime(deployment.inTimestamp) : 'N/A'}</TableCell>
                      <TableCell>{deployment.outData?.driverName || deployment.outData?.employeeName || 'N/A'}</TableCell>
                      <TableCell>
                        <Badge variant={deployment.purpose === 'Pilot' ? 'default' : 'secondary'}>
                          {deployment.purpose}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        {deployment.outTimestamp && deployment.inTimestamp 
                          ? calculateDuration(deployment.outTimestamp, deployment.inTimestamp)
                          : 'N/A'}
                      </TableCell>
                      <TableCell>{deployment.totalKms || 'N/A'} km</TableCell>
                      <TableCell className="text-sm">
                        <div>OUT: {deployment.outData?.supervisorName || 'N/A'}</div>
                        <div>IN: {deployment.inData?.inSupervisorName || 'N/A'}</div>
                      </TableCell>
                      <TableCell>
                        <div className="flex gap-1">
                          {hasChecklistMismatches(deployment) && (
                            <AlertTriangle className="w-4 h-4 text-red-500" />
                          )}
                          {hasAttachments(deployment) && (
                            <Paperclip className="w-4 h-4 text-blue-500" />
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={(e) => {
                            e.stopPropagation();
                            setSelectedRide(deployment);
                          }}
                        >
                          <FileText className="w-4 h-4 mr-1" />
                          View
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </Card>

        {/* Modals */}
        {selectedRide && (
          <RideDetailModal
            deployment={selectedRide}
            open={Boolean(selectedRide)}
            onClose={() => setSelectedRide(null)}
          />
        )}

        {showExportDialog && (
          <ExportDialog
            deployments={filteredDeployments.filter(d => selectedRows.includes(d.id))}
            open={showExportDialog}
            onClose={() => setShowExportDialog(false)}
          />
        )}
      </div>
    </div>
  );
};

export default RideHistory;
