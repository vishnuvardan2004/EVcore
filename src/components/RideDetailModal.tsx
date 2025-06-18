
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Download, FileText, AlertTriangle, Camera } from 'lucide-react';
import { Deployment, TripSummary } from '../types/vehicle';
import { calculateDuration, generateTripReport } from '../utils/reportGenerator';
import { exportDeploymentToCSV } from '../utils/csvExporter';

interface RideDetailModalProps {
  deployment: Deployment;
  open: boolean;
  onClose: () => void;
}

export const RideDetailModal: React.FC<RideDetailModalProps> = ({
  deployment,
  open,
  onClose,
}) => {
  const hasChecklistMismatches = (deployment.inData?.checklistMismatches || []).length > 0;

  const exportToPDF = () => {
    const summary: TripSummary = {
      vehicleNumber: deployment.vehicleNumber,
      outDateTime: deployment.outTimestamp ? new Date(deployment.outTimestamp).toLocaleString() : 'N/A',
      inDateTime: deployment.inTimestamp ? new Date(deployment.inTimestamp).toLocaleString() : 'N/A',
      totalDuration: deployment.outTimestamp && deployment.inTimestamp 
        ? calculateDuration(deployment.outTimestamp, deployment.inTimestamp)
        : 'N/A',
      totalKms: deployment.totalKms || 0,
      mismatches: deployment.inData?.checklistMismatches || [],
      outSupervisor: deployment.outData?.supervisorName || '',
      inSupervisor: deployment.inData?.inSupervisorName || '',
      purpose: deployment.purpose,
    };
    
    generateTripReport(summary);
  };

  const exportToCSV = () => {
    exportDeploymentToCSV([deployment]);
  };

  return (
    <Dialog open={open} onOpenChange={() => onClose()}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="w-5 h-5" />
            Ride Details - {deployment.vehicleNumber}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Trip Overview */}
          <Card className="p-4">
            <h3 className="font-semibold text-lg mb-4">Trip Overview</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <div className="space-y-2">
                  <div><span className="font-medium">Vehicle Number:</span> {deployment.vehicleNumber}</div>
                  <div><span className="font-medium">Purpose:</span> 
                    <Badge className="ml-2" variant={deployment.purpose === 'Pilot' ? 'default' : 'secondary'}>
                      {deployment.purpose}
                    </Badge>
                  </div>
                  <div><span className="font-medium">OUT Date & Time:</span> {deployment.outTimestamp ? new Date(deployment.outTimestamp).toLocaleString() : 'N/A'}</div>
                  <div><span className="font-medium">IN Date & Time:</span> {deployment.inTimestamp ? new Date(deployment.inTimestamp).toLocaleString() : 'N/A'}</div>
                </div>
              </div>
              <div>
                <div className="space-y-2">
                  <div><span className="font-medium">Total Duration:</span> {deployment.outTimestamp && deployment.inTimestamp ? calculateDuration(deployment.outTimestamp, deployment.inTimestamp) : 'N/A'}</div>
                  <div><span className="font-medium">Total KMs:</span> {deployment.totalKms || 'N/A'} km</div>
                  <div><span className="font-medium">OUT Supervisor:</span> {deployment.outData?.supervisorName || 'N/A'}</div>
                  <div><span className="font-medium">IN Supervisor:</span> {deployment.inData?.inSupervisorName || 'N/A'}</div>
                </div>
              </div>
            </div>
          </Card>

          {/* OUT Data */}
          {deployment.outData && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">OUT Information</h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  {deployment.purpose === 'Pilot' && deployment.outData.driverName && (
                    <div><span className="font-medium">Driver Name:</span> {deployment.outData.driverName}</div>
                  )}
                  {deployment.purpose === 'Office' && deployment.outData.employeeName && (
                    <div><span className="font-medium">Employee Name:</span> {deployment.outData.employeeName}</div>
                  )}
                  {deployment.outData.pilotId && (
                    <div><span className="font-medium">Pilot ID:</span> {deployment.outData.pilotId}</div>
                  )}
                  {deployment.outData.location && (
                    <div><span className="font-medium">Location:</span> {deployment.outData.location}</div>
                  )}
                </div>
                <div className="space-y-2">
                  <div><span className="font-medium">Odometer:</span> {deployment.outData.odometer} km</div>
                  <div><span className="font-medium">Battery Charge:</span> {deployment.outData.batteryCharge}%</div>
                  <div><span className="font-medium">Range:</span> {deployment.outData.range} km</div>
                  {deployment.outData.notes && (
                    <div><span className="font-medium">Notes:</span> {deployment.outData.notes}</div>
                  )}
                </div>
              </div>
              
              {deployment.outData.vehiclePhotos && deployment.outData.vehiclePhotos.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    OUT Vehicle Photos ({deployment.outData.vehiclePhotos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {deployment.outData.vehiclePhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`OUT photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* IN Data */}
          {deployment.inData && (
            <Card className="p-4">
              <h3 className="font-semibold text-lg mb-4">IN Information</h3>
              <div className="space-y-2">
                <div><span className="font-medium">Return Odometer:</span> {deployment.inData.returnOdometer} km</div>
              </div>
              
              {deployment.inData.vehiclePhotos && deployment.inData.vehiclePhotos.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2 flex items-center gap-2">
                    <Camera className="w-4 h-4" />
                    IN Vehicle Photos ({deployment.inData.vehiclePhotos.length})
                  </h4>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {deployment.inData.vehiclePhotos.map((photo, index) => (
                      <img
                        key={index}
                        src={photo}
                        alt={`IN photo ${index + 1}`}
                        className="w-full h-20 object-cover rounded border"
                      />
                    ))}
                  </div>
                </div>
              )}
            </Card>
          )}

          {/* Checklist Mismatches */}
          {hasChecklistMismatches && (
            <Card className="p-4 border-red-200">
              <h3 className="font-semibold text-lg mb-4 flex items-center gap-2 text-red-700">
                <AlertTriangle className="w-5 h-5" />
                Checklist Mismatches
              </h3>
              <div className="space-y-2">
                {deployment.inData!.checklistMismatches!.map((mismatch, index) => (
                  <div key={index} className="text-red-600 text-sm">
                    • {mismatch}
                  </div>
                ))}
              </div>
            </Card>
          )}

          <Separator />

          {/* Export Actions */}
          <div className="flex gap-4 justify-end">
            <Button variant="outline" onClick={exportToCSV}>
              <Download className="w-4 h-4 mr-2" />
              Export CSV
            </Button>
            <Button onClick={exportToPDF}>
              <FileText className="w-4 h-4 mr-2" />
              Export PDF Report
            </Button>
            <Button variant="outline" onClick={onClose}>
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
