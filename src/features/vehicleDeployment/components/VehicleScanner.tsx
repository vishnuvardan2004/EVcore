
import React, { useState } from 'react';
import { Camera } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCamera } from '../../../hooks/useCamera';

interface VehicleScannerProps {
  onVehicleDetected: (vehicleNumber: string) => void;
}

export const VehicleScanner: React.FC<VehicleScannerProps> = ({ onVehicleDetected }) => {
  const [manualEntry, setManualEntry] = useState('');
  const { isActive, capturedImage, videoRef, canvasRef, startCamera, captureImage, stopCamera, resetCapture } = useCamera();

  const handleSubmit = () => {
    if (manualEntry.trim()) {
      onVehicleDetected(manualEntry.trim().toUpperCase());
      setManualEntry('');
    }
  };

  const handleScanCapture = () => {
    captureImage();
    // Simulate QR/Barcode detection
    setTimeout(() => {
      const mockVehicleNumber = `VH-${Math.floor(Math.random() * 9999).toString().padStart(4, '0')}`;
      onVehicleDetected(mockVehicleNumber);
      resetCapture();
    }, 1000);
  };

  if (isActive) {
    return (
      <div className="space-y-4">
        <div className="relative">
          <video
            ref={videoRef}
            autoPlay
            playsInline
            className="w-full h-64 object-cover rounded-lg border"
          />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-48 h-32 border-2 border-white rounded-lg"></div>
          </div>
        </div>
        <canvas ref={canvasRef} className="hidden" />
        <div className="flex gap-2">
          <Button onClick={handleScanCapture} className="flex-1">
            <Camera className="w-4 h-4 mr-2" />
            Capture & Scan
          </Button>
          <Button variant="outline" onClick={stopCamera}>
            Cancel
          </Button>
        </div>
      </div>
    );
  }

  if (capturedImage) {
    return (
      <div className="space-y-4">
        <img src={capturedImage} alt="Captured" className="w-full h-64 object-cover rounded-lg" />
        <div className="text-center">
          <p className="text-sm text-gray-600 mb-2">Processing image...</p>
          <div className="animate-spin w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full mx-auto"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <div className="text-center">
        <h2 className="text-xl font-semibold mb-2">Enter Vehicle Information</h2>
        <p className="text-gray-600 mb-6">Enter vehicle number manually or scan QR code</p>
      </div>
      
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium mb-2">Vehicle Number</label>
          <div className="relative">
            <Input
              type="text"
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value)}
              placeholder="e.g., VH-1234"
              className="text-lg pr-12"
              autoFocus
            />
            <Button
              type="button"
              size="sm"
              variant="ghost"
              onClick={startCamera}
              className="absolute right-1 top-1/2 -translate-y-1/2 h-8 w-8 p-0 hover:bg-gray-100"
              title="Scan QR Code"
            >
              <Camera className="w-4 h-4" />
            </Button>
          </div>
        </div>
        <Button 
          onClick={() => {
            if (manualEntry.trim()) {
              onVehicleDetected(manualEntry.trim().toUpperCase());
              setManualEntry('');
            }
          }}
          className="w-full" 
          disabled={!manualEntry.trim()}
        >
          Continue
        </Button>
      </div>
    </div>
  );
};
