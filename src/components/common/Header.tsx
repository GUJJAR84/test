import React from 'react';
import { Shield, LogOut, Bell, User } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';

export function Header() {
  const { user, logout } = useAuth();

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'tourist': return 'blue';
      case 'police': return 'red';
      case 'tourism_dept': return 'green';
      case 'admin': return 'purple';
      default: return 'gray';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'tourist': return 'Tourist';
      case 'police': return 'Police Officer';
      case 'tourism_dept': return 'Tourism Dept';
      case 'admin': return 'System Admin';
      default: return 'User';
    }
  };

  return (
    <header className="bg-white border-b border-gray-200 px-6 py-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="flex items-center">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-2 rounded-lg">
              <Shield className="h-6 w-6 text-white" />
            </div>
            <div className="ml-3">
              <h1 className="text-lg font-bold text-gray-900">
                Smart Tourist Safety System
              </h1>
              <p className="text-xs text-gray-500">North Eastern India</p>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-4">
          <button className="relative p-2 text-gray-600 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors">
            <Bell className="h-5 w-5" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          <div className="flex items-center space-x-3">
            <div className="text-right">
              <p className="text-sm font-medium text-gray-900">{user?.name}</p>
              <div className="flex items-center space-x-2">
                <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getRoleColor(user?.role || '')}-100 text-${getRoleColor(user?.role || '')}-800`}>
                  {getRoleLabel(user?.role || '')}
                </span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              <div className="bg-gray-200 p-2 rounded-full">
                <User className="h-4 w-4 text-gray-600" />
              </div>
              
              <button
                onClick={logout}
                className="p-2 text-gray-600 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                title="Logout"
              >
                <LogOut className="h-5 w-5" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}