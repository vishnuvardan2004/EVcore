import React from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { FileText, AlertTriangle, Paperclip } from 'lucide-react';
import { Deployment } from '../../../types/vehicle';
import { calculateDuration } from '../../../utils/reportGenerator';

interface RideHistoryTableProps {
  deployments: Deployment[];
  selectedRows: string[];
  onRowSelect: (deploymentId: string) => void;
  onSelectAll: () => void;
  onViewDetails: (deployment: Deployment) => void;
  loading: boolean;
}

export const RideHistoryTable: React.FC<RideHistoryTableProps> = ({
  deployments,
  selectedRows,
  onRowSelect,
  onSelectAll,
  onViewDetails,
  loading,
}) => {
  const hasChecklistMismatches = (deployment: Deployment): boolean => {
    return (deployment.inData?.checklistMismatches || []).length > 0;
  };

  const hasAttachments = (deployment: Deployment): boolean => {
    return Boolean(deployment.outData?.vehiclePhotos?.length || deployment.inData?.vehiclePhotos?.length);
  };

  const formatDateTime = (timestamp: string): string => {
    return new Date(timestamp).toLocaleString();
  };

  if (loading) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p>Loading ride history...</p>
        </div>
      </Card>
    );
  }

  if (deployments.length === 0) {
    return (
      <Card className="p-6">
        <div className="text-center py-8">
          <p className="text-gray-500">No rides found matching your criteria</p>
        </div>
      </Card>
    );
  }

  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">
          Deployment Records ({deployments.length})
        </h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            size="sm"
            onClick={onSelectAll}
          >
            {selectedRows.length === deployments.length ? 'Deselect All' : 'Select All'}
          </Button>
        </div>
      </div>

      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-12">
                <input
                  type="checkbox"
                  checked={selectedRows.length === deployments.length && deployments.length > 0}
                  onChange={onSelectAll}
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
            {deployments.map((deployment) => (
              <TableRow key={deployment.id} className="cursor-pointer hover:bg-gray-50">
                <TableCell>
                  <input
                    type="checkbox"
                    checked={selectedRows.includes(deployment.id)}
                    onChange={() => onRowSelect(deployment.id)}
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
                      onViewDetails(deployment);
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
    </Card>
  );
};
