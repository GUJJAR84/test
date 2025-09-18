import React, { createContext, useContext, useState, useEffect } from 'react';
import { User } from '../types';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string, role: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const mockUsers: User[] = [
  {
    id: '1',
    name: 'Rajesh Sharma',
    email: 'tourist@demo.com',
    role: 'tourist',
    permissions: ['view_profile', 'panic_button', 'location_sharing']
  },
  {
    id: '2',
    name: 'Inspector Priya Das',
    email: 'police@demo.com',
    role: 'police',
    permissions: ['view_incidents', 'manage_cases', 'access_tourist_data'],
    badge: 'MP001',
    department: 'Meghalaya Police'
  },
  {
    id: '3',
    name: 'Dr. Amit Kumar',
    email: 'tourism@demo.com',
    role: 'tourism_dept',
    permissions: ['view_analytics', 'manage_geofences', 'tourist_oversight'],
    department: 'Tourism Department, Assam'
  },
  {
    id: '4',
    name: 'System Admin',
    email: 'admin@demo.com',
    role: 'admin',
    permissions: ['full_access', 'system_config', 'user_management'],
    department: 'NE Tourism Safety Board'
  }
];

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Check for stored auth on mount
    const storedUser = localStorage.getItem('auth_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      setIsAuthenticated(true);
    }
  }, []);

  const login = async (email: string, password: string, role: string): Promise<boolean> => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email && u.role === role);
    
    if (foundUser && password === 'demo123') {
      setUser(foundUser);
      setIsAuthenticated(true);
      localStorage.setItem('auth_user', JSON.stringify(foundUser));
      return true;
    }
    
    return false;
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem('auth_user');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}