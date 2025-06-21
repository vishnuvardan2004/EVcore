
import React from 'react';
import { PageLayout } from '../components/PageLayout';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

const DriverInduction = () => {
  const navigate = useNavigate();

  return (
    <PageLayout 
      title="📋 Driver Induction" 
      subtitle="Enter and manage full driver profiles"
    >
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader className="text-center">
            <div className="text-6xl mb-4">📋</div>
            <CardTitle className="text-2xl">Driver Induction</CardTitle>
            <CardDescription>
              Comprehensive driver onboarding and profile management system
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              Features coming soon:
            </p>
            <ul className="text-left text-gray-600 space-y-2 max-w-md mx-auto">
              <li>• Driver registration forms</li>
              <li>• License verification</li>
              <li>• Training records</li>
              <li>• Background checks</li>
              <li>• Certification management</li>
            </ul>
            <div className="pt-6">
              <Button onClick={() => navigate('/')} className="gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back to Dashboard
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </PageLayout>
  );
};

export default DriverInduction;
