
import React from 'react';
import { Card, CardContent } from '../../../shared/components/ui/card';

interface TripEntryFormProps {
  onSubmit: () => void;
}

export const TripEntryForm: React.FC<TripEntryFormProps> = ({ onSubmit }) => {
  return (
    <Card>
      <CardContent>
        <p className="text-gray-600">Trip entry form coming soon...</p>
      </CardContent>
    </Card>
  );
};
