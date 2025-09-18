import React, { useState } from 'react';
import { Shield, UserCheck, Users, Settings } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';

export function LoginPage() {
  const [selectedRole, setSelectedRole] = useState<string>('tourist');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  
  const { login } = useAuth();

  const roles = [
    {
      id: 'tourist',
      label: 'Tourist',
      icon: UserCheck,
      color: 'blue',
      description: 'Access your Digital Tourist ID and safety features'
    },
    {
      id: 'police',
      label: 'Police Officer',
      icon: Shield,
      color: 'red',
      description: 'Monitor incidents and manage tourist safety'
    },
    {
      id: 'tourism_dept',
      label: 'Tourism Department',
      icon: Users,
      color: 'green',
      description: 'Oversee tourist analytics and geo-fencing'
    },
    {
      id: 'admin',
      label: 'System Admin',
      icon: Settings,
      color: 'purple',
      description: 'Full system access and configuration'
    }
  ];

  const demoCredentials = {
    tourist: 'aman@tourist.com',
    police: 'police@demo.com',
    tourism_dept: 'tourism@demo.com',
    admin: 'admin@demo.com'
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const success = await login(email, password, selectedRole);
      if (!success) {
        setError('Invalid credentials. Please try again.');
      }
    } catch (err) {
      setError('Login failed. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRoleSelect = (roleId: string) => {
    setSelectedRole(roleId);
    setEmail(demoCredentials[roleId as keyof typeof demoCredentials]);
    if (roleId === 'tourist') {
      setPassword('Aman@123');
    } else {
      setPassword('demo123');
    }
  };

  const selectedRoleData = roles.find(role => role.id === selectedRole);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="flex justify-center items-center mb-6">
            <div className="bg-gradient-to-r from-blue-600 to-green-600 p-3 rounded-full">
              <Shield className="h-8 w-8 text-white" />
            </div>
          </div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Smart Tourist Safety System
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Enhancing tourist safety in North Eastern India through AI, blockchain, and real-time monitoring
          </p>
        </div>

        <div className="max-w-6xl mx-auto">
          {/* Role Selection */}
          <div className="mb-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Select Your Role
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {roles.map((role) => {
                const Icon = role.icon;
                const isSelected = selectedRole === role.id;
                
                return (
                  <button
                    key={role.id}
                    onClick={() => handleRoleSelect(role.id)}
                    className={`p-6 rounded-xl border-2 transition-all duration-200 text-left hover:shadow-lg ${
                      isSelected
                        ? `border-${role.color}-500 bg-${role.color}-50 shadow-lg`
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <Icon className={`h-8 w-8 mb-4 ${
                      isSelected ? `text-${role.color}-600` : 'text-gray-600'
                    }`} />
                    <h3 className={`font-semibold mb-2 ${
                      isSelected ? `text-${role.color}-800` : 'text-gray-800'
                    }`}>
                      {role.label}
                    </h3>
                    <p className="text-sm text-gray-600">{role.description}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Login Form */}
          <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg p-8">
            <div className="text-center mb-6">
              {selectedRoleData && (
                <div className={`inline-flex items-center px-4 py-2 rounded-full bg-${selectedRoleData.color}-100 mb-4`}>
                  <selectedRoleData.icon className={`h-5 w-5 text-${selectedRoleData.color}-600 mr-2`} />
                  <span className={`font-medium text-${selectedRoleData.color}-800`}>
                    {selectedRoleData.label} Login
                  </span>
                </div>
              )}
              <h3 className="text-xl font-semibold text-gray-800">
                Sign In to Continue
              </h3>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Password
                </label>
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
              </div>

              {error && (
                <div className="text-red-600 text-sm text-center bg-red-50 py-2 px-3 rounded-lg">
                  {error}
                </div>
              )}

              <button
                type="submit"
                disabled={isLoading}
                className="w-full bg-gradient-to-r from-blue-600 to-green-600 text-white py-2 px-4 rounded-lg font-medium hover:shadow-lg transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isLoading ? 'Signing In...' : 'Sign In'}
              </button>
            </form>

            <div className="mt-6 text-center">
              <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                <p className="font-medium mb-1">Demo Credentials:</p>
                <p>Tourist (Aman Kumar): aman@tourist.com / Aman@123</p>
                <p>Other roles: Auto-filled email / demo123</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}