
import React from 'react';
import { Link } from 'react-router-dom';
import { FileText } from 'lucide-react';

export const AppHeader: React.FC = () => {
  return (
    <div className="text-center mb-4">
      <div className="flex justify-center gap-4">
        <Link 
          to="/history" 
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <FileText className="w-4 h-4" />
          Ride History & Reports
        </Link>
      </div>
    </div>
  );
};
