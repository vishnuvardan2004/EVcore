
import React, { createContext, useContext, useState, ReactNode } from 'react';
import { useToast } from '../hooks/use-toast';

interface User {
  email: string;
  role: 'admin' | 'supervisor' | 'pilot';
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Mock user data
const mockUsers = [
  { email: "admin@example.com", password: "admin123", role: "admin" as const },
  { email: "supervisor@example.com", password: "super123", role: "supervisor" as const },
  { email: "pilot@example.com", password: "pilot123", role: "pilot" as const }
];

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const { toast } = useToast();

  const login = async (email: string, password: string): Promise<boolean> => {
    // Simulate API call delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    const foundUser = mockUsers.find(u => u.email === email && u.password === password);
    
    if (foundUser && (foundUser.role === 'admin' || foundUser.role === 'supervisor')) {
      setUser({ email: foundUser.email, role: foundUser.role });
      console.log('Login successful:', foundUser.email, foundUser.role);
      
      toast({
        title: "Welcome back!",
        description: `Successfully logged in as ${foundUser.role}`,
      });
      
      return true;
    }
    
    console.log('Login failed: Invalid credentials or insufficient permissions');
    
    toast({
      title: "Login Failed",
      description: "Incorrect credentials or insufficient permissions. Please try again.",
      variant: "destructive",
    });
    
    return false;
  };

  const logout = () => {
    setUser(null);
    console.log('User logged out');
    
    toast({
      title: "👋 Logged Out",
      description: "You have been successfully logged out.",
    });
  };

  const isAuthenticated = user !== null;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
