
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <div className="text-center mb-8">
      <h1 className="text-3xl font-bold text-gray-900 mb-2">
        🚗 Vehicle Deployment Tracker
      </h1>
      <p className="text-gray-600">
        Track vehicle IN/OUT movements with comprehensive logging
      </p>
      
      {/* Navigation */}
      <div className="mt-4 flex justify-center gap-4">
        <Link 
          to="/ride-history" 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Ride History & Reports
        </Link>
      </div>
    </div>
  );
};
