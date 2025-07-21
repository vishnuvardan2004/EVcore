
import React, { useState } from 'react';
import { Camera, Keyboard } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCamera } from '../../../hooks/useCamera';

interface VehicleScannerProps {
  onVehicleDetected: (vehicleNumber: string) => void;
}

export const VehicleScanner: React.FC<VehicleScannerProps> = ({ onVehicleDetected }) => {
  const [manualEntry, setManualEntry] = useState('');
  const [showManualInput, setShowManualInput] = useState(false);
  const { isActive, capturedImage, videoRef, canvasRef, startCamera, captureImage, stopCamera, resetCapture } = useCamera();

  const handleManualSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (manualEntry.trim()) {
      onVehicleDetected(manualEntry.trim().toUpperCase());
      setManualEntry('');
      setShowManualInput(false);
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

  if (showManualInput) {
    return (
      <div className="space-y-4">
        <form onSubmit={handleManualSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-2">Enter Vehicle Number</label>
            <Input
              type="text"
              value={manualEntry}
              onChange={(e) => setManualEntry(e.target.value)}
              placeholder="e.g., VH-1234"
              className="text-lg"
              autoFocus
            />
          </div>
          <div className="flex gap-2">
            <Button type="submit" className="flex-1" disabled={!manualEntry.trim()}>
              Confirm
            </Button>
            <Button 
              type="button" 
              variant="outline" 
              onClick={() => setShowManualInput(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      </div>
    );
  }

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
        <p className="text-gray-600 mb-6">Scan vehicle QR code or enter manually</p>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <Button
          onClick={startCamera}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <Camera className="w-6 h-6" />
          <span>Scan Vehicle ID</span>
        </Button>
        
        <Button
          onClick={() => setShowManualInput(true)}
          className="h-20 flex flex-col items-center justify-center space-y-2"
          variant="outline"
        >
          <Keyboard className="w-6 h-6" />
          <span>Manual Entry</span>
        </Button>
      </div>
    </div>
  );
};
