
import React, { useState } from 'react';
import { Deployment } from '../types/vehicle';
import { RideDetailModal } from '../components/RideDetailModal';
import { ExportDialog } from '../components/ExportDialog';
import { RideHistoryFilters } from '../components/RideHistoryFilters';
import { RideHistoryTable } from '../components/RideHistoryTable';
import { useRideHistoryData } from '../hooks/useRideHistoryData';
import { useRideHistoryFilters } from '../hooks/useRideHistoryFilters';

const RideHistory = () => {
  const { deployments, loading } = useRideHistoryData();
  const { filters, filteredDeployments, updateFilter, clearFilters } = useRideHistoryFilters(deployments);
  
  const [selectedRide, setSelectedRide] = useState<Deployment | null>(null);
  const [showExportDialog, setShowExportDialog] = useState(false);
  const [selectedRows, setSelectedRows] = useState<string[]>([]);

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

  const handleExport = () => {
    setShowExportDialog(true);
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

        <RideHistoryFilters
          filters={filters}
          onFilterChange={updateFilter}
          onClearFilters={clearFilters}
          onExport={handleExport}
          selectedCount={selectedRows.length}
        />

        <RideHistoryTable
          deployments={filteredDeployments}
          selectedRows={selectedRows}
          onRowSelect={toggleRowSelection}
          onSelectAll={selectAllRows}
          onViewDetails={setSelectedRide}
          loading={loading}
        />

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
