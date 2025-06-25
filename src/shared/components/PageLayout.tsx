
import React from 'react';
import { Button } from './ui/button';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Menu } from 'lucide-react';

interface PageLayoutProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  showBackButton?: boolean;
}

export const PageLayout: React.FC<PageLayoutProps> = ({ 
  children, 
  title, 
  subtitle, 
  showBackButton = true 
}) => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-4">
              {showBackButton && (
                <Button 
                  onClick={() => navigate('/')} 
                  variant="ghost" 
                  size="icon"
                >
                  <ArrowLeft className="h-6 w-6" />
                </Button>
              )}
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
              </Button>
              {title && (
                <div>
                  <h1 className="text-2xl font-bold text-gray-900">{title}</h1>
                  {subtitle && (
                    <p className="text-gray-600 text-sm">{subtitle}</p>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {children}
      </main>
    </div>
  );
};
