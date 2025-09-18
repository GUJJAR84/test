import React, { useState } from 'react';
import { Users, Shield, Settings, Plus, Edit, Trash2, Save, X } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Tourist, GeoFence, Location } from '../../types';

export function AdminDashboard() {
  const { user } = useAuth();
  const { tourists, geoFences, addTourist } = useData();
  const [activeTab, setActiveTab] = useState<'tourists' | 'geofences' | 'system'>('tourists');
  const [showAddTourist, setShowAddTourist] = useState(false);
  const [showAddGeofence, setShowAddGeofence] = useState(false);
  const [newTourist, setNewTourist] = useState({
    name: '',
    phone: '',
    nationality: '',
    startDate: '',
    endDate: '',
    destinations: '',
    plannedRoutes: '',
    emergencyContactName: '',
    emergencyContactPhone: '',
    emergencyContactRelation: ''
  });

  const handleAddTourist = () => {
    const tourist: Omit<Tourist, 'id' | 'createdAt'> = {
      digitalId: `DTID-${new Date().getFullYear()}-NE-${String(tourists.length + 1).padStart(3, '0')}`,
      name: newTourist.name,
      phone: newTourist.phone,
      nationality: newTourist.nationality,
      kycHash: `hash_${Date.now()}`,
      itinerary: {
        startDate: new Date(newTourist.startDate),
        endDate: new Date(newTourist.endDate),
        plannedRoutes: newTourist.plannedRoutes.split(',').map(r => r.trim()),
        destinations: newTourist.destinations.split(',').map(d => d.trim()),
        routeHash: `route_hash_${Date.now()}`
      },
      emergencyContacts: [{
        name: newTourist.emergencyContactName,
        phone: newTourist.emergencyContactPhone,
        relationship: newTourist.emergencyContactRelation,
        encryptedDetails: `enc_${Date.now()}`
      }],
      currentLocation: {
        latitude: 25.5788 + (Math.random() - 0.5) * 0.1,
        longitude: 91.8933 + (Math.random() - 0.5) * 0.1,
        accuracy: 10,
        timestamp: new Date()
      },
      safetyScore: Math.floor(Math.random() * 40) + 60, // 60-100
      status: 'safe',
      expiryDate: new Date(newTourist.endDate)
    };

    addTourist(tourist);
    setShowAddTourist(false);
    setNewTourist({
      name: '',
      phone: '',
      nationality: '',
      startDate: '',
      endDate: '',
      destinations: '',
      plannedRoutes: '',
      emergencyContactName: '',
      emergencyContactPhone: '',
      emergencyContactRelation: ''
    });
  };

  const tabs = [
    { id: 'tourists', label: 'Tourist Management', icon: Users },
    { id: 'geofences', label: 'Geofence Management', icon: Shield },
    { id: 'system', label: 'System Settings', icon: Settings }
  ];

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">System Administration</h1>
            <p className="text-gray-600">Admin: {user?.name} | {user?.department}</p>
          </div>
          <div className="flex space-x-2">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center px-4 py-2 rounded-lg font-medium transition-colors ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Icon className="h-4 w-4 mr-2" />
                  {tab.label}
                </button>
              );
            })}
          </div>
        </div>
      </div>

      {/* Tourist Management */}
      {activeTab === 'tourists' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Digital Tourist ID Management</h2>
            <button
              onClick={() => setShowAddTourist(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Tourist
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Digital ID</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Name</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Nationality</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Status</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Safety Score</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Expiry</th>
                  <th className="text-left py-3 px-2 font-medium text-gray-700">Actions</th>
                </tr>
              </thead>
              <tbody>
                {tourists.map((tourist) => (
                  <tr key={tourist.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-2 font-mono text-sm">{tourist.digitalId}</td>
                    <td className="py-3 px-2 font-medium">{tourist.name}</td>
                    <td className="py-3 px-2">{tourist.nationality}</td>
                    <td className="py-3 px-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        tourist.status === 'safe' 
                          ? 'bg-green-100 text-green-800'
                          : tourist.status === 'caution'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {tourist.status.toUpperCase()}
                      </span>
                    </td>
                    <td className="py-3 px-2">{tourist.safetyScore}/100</td>
                    <td className="py-3 px-2">{tourist.expiryDate.toLocaleDateString()}</td>
                    <td className="py-3 px-2">
                      <div className="flex space-x-2">
                        <button className="text-blue-600 hover:text-blue-700">
                          <Edit className="h-4 w-4" />
                        </button>
                        <button className="text-red-600 hover:text-red-700">
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Geofence Management */}
      {activeTab === 'geofences' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold">Geofence & Risk Zone Management</h2>
            <button
              onClick={() => setShowAddGeofence(true)}
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Geofence
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {geoFences.map((fence) => (
              <div key={fence.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-medium text-gray-900">{fence.name}</h3>
                  <div className="flex space-x-2">
                    <button className="text-blue-600 hover:text-blue-700">
                      <Edit className="h-4 w-4" />
                    </button>
                    <button className="text-red-600 hover:text-red-700">
                      <Trash2 className="h-4 w-4" />
                    </button>
                  </div>
                </div>
                <div className="mb-2">
                  <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                    fence.type === 'danger' 
                      ? 'bg-red-100 text-red-800'
                      : fence.type === 'restricted'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-green-100 text-green-800'
                  }`}>
                    {fence.type.toUpperCase()}
                  </span>
                  <span className={`ml-2 px-2 py-1 rounded-full text-xs font-medium ${
                    fence.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'
                  }`}>
                    {fence.isActive ? 'ACTIVE' : 'INACTIVE'}
                  </span>
                </div>
                <p className="text-sm text-gray-600 mb-2">{fence.alertMessage}</p>
                <p className="text-xs text-gray-500">
                  {fence.coordinates.length} coordinate points
                </p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* System Settings */}
      {activeTab === 'system' && (
        <div className="bg-white rounded-xl shadow-lg p-6">
          <h2 className="text-xl font-semibold mb-6">System Configuration</h2>
          
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium text-gray-900 mb-3">AI Model Settings</h3>
                <div className="space-y-3">
                  <div>
                    <label className="block text-sm text-gray-600">Anomaly Detection Threshold</label>
                    <input type="range" min="10" max="90" defaultValue="50" className="w-full" />
                  </div>
                  <div>
                    <label className="block text-sm text-gray-600">Safety Score Update Interval (seconds)</label>
                    <input type="number" defaultValue="30" className="w-full px-3 py-2 border rounded-lg" />
                  </div>
                </div>
              </div>

              <div>
                <h3 className="font-medium text-gray-900 mb-3">Alert Settings</h3>
                <div className="space-y-3">
                  <div className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <label className="text-sm text-gray-700">Enable SMS Alerts</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <label className="text-sm text-gray-700">Enable Email Notifications</label>
                  </div>
                  <div className="flex items-center">
                    <input type="checkbox" defaultChecked className="mr-2" />
                    <label className="text-sm text-gray-700">Real-time Dashboard Updates</label>
                  </div>
                </div>
              </div>
            </div>

            <div>
              <h3 className="font-medium text-gray-900 mb-3">Blockchain Settings</h3>
              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <p className="text-gray-600">Network Status</p>
                    <p className="font-medium text-green-600">Connected</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Total DTIDs Issued</p>
                    <p className="font-medium">{tourists.length}</p>
                  </div>
                  <div>
                    <p className="text-gray-600">Last Block</p>
                    <p className="font-medium font-mono">#12,847</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="flex justify-end">
              <button className="flex items-center px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors">
                <Save className="h-4 w-4 mr-2" />
                Save Settings
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add Tourist Modal */}
      {showAddTourist && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-center">
                <h2 className="text-xl font-semibold">Add New Tourist</h2>
                <button
                  onClick={() => setShowAddTourist(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                  <input
                    type="text"
                    value={newTourist.name}
                    onChange={(e) => setNewTourist({...newTourist, name: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                  <input
                    type="tel"
                    value={newTourist.phone}
                    onChange={(e) => setNewTourist({...newTourist, phone: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Nationality</label>
                  <input
                    type="text"
                    value={newTourist.nationality}
                    onChange={(e) => setNewTourist({...newTourist, nationality: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Start Date</label>
                  <input
                    type="date"
                    value={newTourist.startDate}
                    onChange={(e) => setNewTourist({...newTourist, startDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">End Date</label>
                  <input
                    type="date"
                    value={newTourist.endDate}
                    onChange={(e) => setNewTourist({...newTourist, endDate: e.target.value})}
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Destinations (comma-separated)</label>
                  <input
                    type="text"
                    value={newTourist.destinations}
                    onChange={(e) => setNewTourist({...newTourist, destinations: e.target.value})}
                    placeholder="Meghalaya, Assam"
                    className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Planned Routes (comma-separated)</label>
                <input
                  type="text"
                  value={newTourist.plannedRoutes}
                  onChange={(e) => setNewTourist({...newTourist, plannedRoutes: e.target.value})}
                  placeholder="Guwahati, Shillong, Cherrapunji"
                  className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="border-t pt-4">
                <h3 className="font-medium text-gray-900 mb-3">Emergency Contact</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                    <input
                      type="text"
                      value={newTourist.emergencyContactName}
                      onChange={(e) => setNewTourist({...newTourist, emergencyContactName: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                    <input
                      type="tel"
                      value={newTourist.emergencyContactPhone}
                      onChange={(e) => setNewTourist({...newTourist, emergencyContactPhone: e.target.value})}
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Relationship</label>
                    <input
                      type="text"
                      value={newTourist.emergencyContactRelation}
                      onChange={(e) => setNewTourist({...newTourist, emergencyContactRelation: e.target.value})}
                      placeholder="Spouse, Parent, etc."
                      className="w-full px-3 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="p-6 border-t bg-gray-50 flex justify-end space-x-3">
              <button
                onClick={() => setShowAddTourist(false)}
                className="px-4 py-2 text-gray-700 bg-gray-200 rounded-lg hover:bg-gray-300 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleAddTourist}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                disabled={!newTourist.name || !newTourist.phone || !newTourist.nationality}
              >
                Create Tourist ID
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}