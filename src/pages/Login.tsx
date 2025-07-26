
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { User, AlertCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

const Login = () => {
  const { login } = useAuth();
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    try {
      const success = await login(formData.email, formData.password);
      if (!success) {
        setError('Invalid credentials. Please check your email and password.');
      }
    } catch (err) {
      setError('An error occurred during login. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleCredentialClick = (email: string, password: string) => {
    setFormData({ email, password });
    setError('');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* EVZIP Brand Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-4 mb-6">
            <div className="w-16 h-16 bg-accent rounded-2xl flex items-center justify-center shadow-lg">
              <span className="text-2xl font-bold text-accent-foreground"><img src="favicon.ico" alt="" /></span>
            </div>
            <div className="text-left">
              <h1 className="text-3xl font-bold text-foreground">EVZIP</h1>
              <p className="text-muted-foreground font-medium">EVCORE Platform</p>
            </div>
          </div>
          <p className="text-muted-foreground">
            Secure access for authorized personnel
          </p>
        </div>

        {/* Login Form */}
        <Card className="evzip-card">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-foreground">
              <User className="w-5 h-5 text-accent" />
              Sign In
            </CardTitle>
            <CardDescription>
              Enter your credentials to access the system
            </CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Error Message Area */}
              {error && (
                <Alert variant="destructive" className="border-red-200 bg-red-50">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>{error}</AlertDescription>
                </Alert>
              )}

              {/* Email Input */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-foreground font-semibold">Email</Label>
                <Input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  placeholder="Enter your email address"
                  required
                  disabled={isLoading}
                  className="rounded-xl border-input focus:border-accent focus:ring-accent"
                />
              </div>

              {/* Password Input */}
              <div className="space-y-2">
                <Label htmlFor="password" className="text-foreground font-semibold">Password</Label>
                <Input
                  id="password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  placeholder="Enter your password"
                  required
                  disabled={isLoading}
                  className="rounded-xl border-input focus:border-accent focus:ring-accent"
                />
              </div>

              {/* Login Button */}
              <Button 
                type="submit" 
                className="evzip-button w-full text-base py-3" 
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign In to EVCORE'}
              </Button>
            </form>

            {/* Demo Credentials */}
            <div className="mt-6 p-4 bg-muted/30 rounded-xl border border-border/50">
              <p className="text-sm font-semibold text-foreground mb-3">Demo Credentials:</p>
              <div className="text-xs text-muted-foreground space-y-1.5 max-h-48 overflow-y-auto">
                <div className="grid grid-cols-1 gap-1.5">
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('superadmin@example.com', 'superadmin123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-purple-600">Super Admin:</span>
                    <span>superadmin@example.com / superadmin123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('admin@example.com', 'admin123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-red-600">Admin:</span>
                    <span>admin@example.com / admin123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('leadership@example.com', 'leadership123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-indigo-600">Leadership:</span>
                    <span>leadership@example.com / leadership123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('manager@example.com', 'manager123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-orange-600">Manager:</span>
                    <span>manager@example.com / manager123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('supervisor@example.com', 'super123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-blue-600">Supervisor:</span>
                    <span>supervisor@example.com / super123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('lead@example.com', 'lead123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-teal-600">Lead:</span>
                    <span>lead@example.com / lead123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('security@example.com', 'security123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-yellow-600">Security:</span>
                    <span>security@example.com / security123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('hr@example.com', 'hr123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-pink-600">HR:</span>
                    <span>hr@example.com / hr123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('finance@example.com', 'finance123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-emerald-600">Finance:</span>
                    <span>finance@example.com / finance123</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => handleCredentialClick('pilot@example.com', 'pilot123')}
                    className="flex justify-between items-center hover:bg-muted/50 p-1.5 rounded transition-colors"
                  >
                    <span className="font-medium text-green-600">Pilot:</span>
                    <span>pilot@example.com / pilot123</span>
                  </button>
                </div>
              </div>
              <div className="mt-2 text-xs text-muted-foreground/70 text-center">
                Click any credential to auto-fill and test different role access levels
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-sm text-muted-foreground">
            EVZIP EVCORE Platform • Sustainable Transportation Management
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
