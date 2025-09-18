import React, { useState } from 'react';
import { BarChart3, MapPin, Users, TrendingUp, AlertTriangle, Calendar } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';

export function TourismDashboard() {
  const { user } = useAuth();
  const { tourists, safetyMetrics, geoFences } = useData();
  const [selectedTimeframe, setSelectedTimeframe] = useState<'today' | 'week' | 'month'>('today');

  // Calculate analytics
  const touristsByRegion = tourists.reduce((acc, tourist) => {
    tourist.itinerary.destinations.forEach(dest => {
      acc[dest] = (acc[dest] || 0) + 1;
    });
    return acc;
  }, {} as Record<string, number>);

  const safetyDistribution = [
    { label: 'Safe (70-100)', count: safetyMetrics.safeCount, color: 'green' },
    { label: 'Caution (40-69)', count: safetyMetrics.cautionCount, color: 'yellow' },
    { label: 'High Risk (0-39)', count: safetyMetrics.dangerCount, color: 'red' }
  ];

  const upcomingArrivals = tourists.filter(t => 
    new Date(t.itinerary.startDate) > new Date() && 
    new Date(t.itinerary.startDate) <= new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
  );

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Tourism Analytics Dashboard</h1>
            <p className="text-gray-600">Department: {user?.department}</p>
          </div>
          <div className="flex space-x-2">
            {(['today', 'week', 'month'] as const).map(timeframe => (
              <button
                key={timeframe}
                onClick={() => setSelectedTimeframe(timeframe)}
                className={`px-4 py-2 rounded-lg font-medium transition-colors capitalize ${
                  selectedTimeframe === timeframe
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {timeframe}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Tourists</p>
              <p className="text-2xl font-bold text-gray-900">{safetyMetrics.totalTourists}</p>
              <p className="text-sm text-green-600">+12% from last month</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <TrendingUp className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Safety Score</p>
              <p className="text-2xl font-bold text-gray-900">
                {Math.round(tourists.reduce((sum, t) => sum + t.safetyScore, 0) / tourists.length)}
              </p>
              <p className="text-sm text-green-600">+5% from last week</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Geofences</p>
              <p className="text-2xl font-bold text-gray-900">
                {geoFences.filter(g => g.isActive).length}
              </p>
              <p className="text-sm text-gray-600">Risk zones monitored</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-purple-100 p-3 rounded-full">
              <Calendar className="h-6 w-6 text-purple-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Upcoming Arrivals</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingArrivals.length}</p>
              <p className="text-sm text-gray-600">Next 7 days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Tourist Distribution by Region */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <BarChart3 className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Tourist Distribution by Region</h2>
          </div>

          <div className="space-y-4">
            {Object.entries(touristsByRegion).map(([region, count]) => (
              <div key={region}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">{region}</span>
                  <span className="text-gray-900">{count} tourists</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all duration-300"
                    style={{ width: `${(count / safetyMetrics.totalTourists) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Safety Score Distribution */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-6">
            <Users className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold">Safety Score Distribution</h2>
          </div>

          <div className="space-y-4">
            {safetyDistribution.map((item) => (
              <div key={item.label}>
                <div className="flex justify-between mb-2">
                  <span className="font-medium text-gray-700">{item.label}</span>
                  <span className="text-gray-900">{item.count} tourists</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className={`h-2 rounded-full transition-all duration-300 ${
                      item.color === 'green' ? 'bg-green-500' :
                      item.color === 'yellow' ? 'bg-yellow-500' : 'bg-red-500'
                    }`}
                    style={{ width: `${(item.count / safetyMetrics.totalTourists) * 100}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Active Geofences */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <MapPin className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-xl font-semibold">Active Geofences & Risk Zones</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {geoFences.filter(g => g.isActive).map((fence) => (
            <div key={fence.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-medium text-gray-900">{fence.name}</h3>
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  fence.type === 'danger' 
                    ? 'bg-red-100 text-red-800'
                    : fence.type === 'restricted'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-green-100 text-green-800'
                }`}>
                  {fence.type.toUpperCase()}
                </span>
              </div>
              <p className="text-sm text-gray-600 mb-2">{fence.alertMessage}</p>
              <p className="text-xs text-gray-500">
                Coordinates: {fence.coordinates.length} points defined
              </p>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming Tourist Arrivals */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-6">
          <Calendar className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold">Upcoming Tourist Arrivals</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b">
                <th className="text-left py-3 px-2 font-medium text-gray-700">Tourist Name</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Nationality</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Arrival Date</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Destinations</th>
                <th className="text-left py-3 px-2 font-medium text-gray-700">Duration</th>
              </tr>
            </thead>
            <tbody>
              {upcomingArrivals.map((tourist) => (
                <tr key={tourist.id} className="border-b hover:bg-gray-50">
                  <td className="py-3 px-2 font-medium text-gray-900">{tourist.name}</td>
                  <td className="py-3 px-2 text-gray-600">{tourist.nationality}</td>
                  <td className="py-3 px-2 text-gray-600">
                    {tourist.itinerary.startDate.toLocaleDateString()}
                  </td>
                  <td className="py-3 px-2 text-gray-600">
                    {tourist.itinerary.destinations.join(', ')}
                  </td>
                  <td className="py-3 px-2 text-gray-600">
                    {Math.ceil((tourist.itinerary.endDate.getTime() - tourist.itinerary.startDate.getTime()) / (1000 * 60 * 60 * 24))} days
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {upcomingArrivals.length === 0 && (
            <p className="text-gray-500 text-center py-8">No upcoming arrivals in the next 7 days</p>
          )}
        </div>
      </div>
    </div>
  );
}