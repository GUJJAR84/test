import React, { useState, useEffect } from 'react';
import { MapPin, AlertTriangle, Shield, Phone, Navigation, AlertCircle } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext';
import { useData } from '../../contexts/DataContext';
import { Location } from '../../types';

export function TouristDashboard() {
  const { user } = useAuth();
  const { tourists, triggerPanicButton } = useData();
  const [currentLocation, setCurrentLocation] = useState<Location | null>(null);
  const [isPanicActive, setIsPanicActive] = useState(false);

  // Find current tourist data
  const currentTourist = tourists.find(t => t.name === user?.name) || tourists[0];

  useEffect(() => {
    // Simulate getting current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
            accuracy: position.coords.accuracy,
            timestamp: new Date()
          });
        },
        () => {
          // Use mock location if geolocation fails
          setCurrentLocation(currentTourist.currentLocation);
        }
      );
    } else {
      setCurrentLocation(currentTourist.currentLocation);
    }
  }, [currentTourist]);

  const handlePanicButton = () => {
    if (currentLocation && !isPanicActive) {
      setIsPanicActive(true);
      triggerPanicButton(currentTourist.id, currentLocation);
      
      // Reset panic state after 30 seconds
      setTimeout(() => {
        setIsPanicActive(false);
      }, 30000);
    }
  };

  const getSafetyStatusColor = (score: number) => {
    if (score >= 70) return 'green';
    if (score >= 40) return 'yellow';
    return 'red';
  };

  const getSafetyStatusText = (score: number) => {
    if (score >= 70) return 'Safe';
    if (score >= 40) return 'Caution';
    return 'High Risk';
  };

  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome, {currentTourist.name}</h1>
            <p className="text-gray-600">Digital Tourist ID: {currentTourist.digitalId}</p>
          </div>
          <div className="text-right">
            <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
              getSafetyStatusColor(currentTourist.safetyScore) === 'green' 
                ? 'bg-green-100 text-green-800'
                : getSafetyStatusColor(currentTourist.safetyScore) === 'yellow'
                ? 'bg-yellow-100 text-yellow-800'
                : 'bg-red-100 text-red-800'
            }`}>
              <Shield className="h-4 w-4 mr-1" />
              {getSafetyStatusText(currentTourist.safetyScore)}
            </div>
            <p className="text-sm text-gray-600 mt-1">Safety Score: {currentTourist.safetyScore}/100</p>
          </div>
        </div>
      </div>

      {/* Safety Score and Status */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">Safety Monitoring</h2>
          </div>
          
          <div className="space-y-4">
            <div>
              <div className="flex justify-between mb-2">
                <span className="text-sm font-medium text-gray-700">Safety Score</span>
                <span className="text-sm font-medium text-gray-900">{currentTourist.safetyScore}/100</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2">
                <div 
                  className={`h-2 rounded-full transition-all duration-300 ${
                    getSafetyStatusColor(currentTourist.safetyScore) === 'green'
                      ? 'bg-green-500'
                      : getSafetyStatusColor(currentTourist.safetyScore) === 'yellow'
                      ? 'bg-yellow-500'
                      : 'bg-red-500'
                  }`}
                  style={{ width: `${currentTourist.safetyScore}%` }}
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <p className="text-gray-600">Current Status</p>
                <p className="font-medium capitalize">{currentTourist.status}</p>
              </div>
              <div>
                <p className="text-gray-600">Trip Duration</p>
                <p className="font-medium">
                  {Math.ceil((currentTourist.expiryDate.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <MapPin className="h-6 w-6 text-green-600 mr-2" />
            <h2 className="text-xl font-semibold">Current Location</h2>
          </div>
          
          <div className="space-y-3">
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600">Coordinates</p>
              <p className="font-mono text-sm">
                {currentTourist.currentLocation.latitude.toFixed(6)}, {currentTourist.currentLocation.longitude.toFixed(6)}
              </p>
            </div>
            <div className="text-sm text-gray-600">
              <p>Last updated: {currentTourist.currentLocation.timestamp.toLocaleTimeString()}</p>
              <p>Accuracy: ±{currentTourist.currentLocation.accuracy}m</p>
            </div>
          </div>
        </div>
      </div>

      {/* Emergency Section */}
      <div className="bg-gradient-to-r from-red-50 to-orange-50 rounded-xl shadow-lg p-6 border border-red-100">
        <div className="flex items-center mb-4">
          <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
          <h2 className="text-xl font-semibold text-red-800">Emergency Response</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <button
              onClick={handlePanicButton}
              disabled={isPanicActive}
              className={`w-full py-4 px-6 rounded-xl font-bold text-lg transition-all duration-200 ${
                isPanicActive
                  ? 'bg-gray-400 text-gray-700 cursor-not-allowed'
                  : 'bg-red-600 text-white hover:bg-red-700 hover:shadow-lg active:scale-95'
              }`}
            >
              {isPanicActive ? (
                <div className="flex items-center justify-center">
                  <div className="animate-pulse mr-2">🚨</div>
                  ALERT SENT
                </div>
              ) : (
                <div className="flex items-center justify-center">
                  <AlertCircle className="h-6 w-6 mr-2" />
                  PANIC BUTTON
                </div>
              )}
            </button>
            <p className="text-sm text-gray-600 mt-2 text-center">
              {isPanicActive ? 'Emergency services notified!' : 'Press for immediate help'}
            </p>
          </div>

          <div className="space-y-3">
            <h3 className="font-semibold text-gray-800">Emergency Contacts</h3>
            {currentTourist.emergencyContacts.map((contact, index) => (
              <div key={index} className="flex items-center justify-between bg-white rounded-lg p-3">
                <div>
                  <p className="font-medium text-gray-900">{contact.name}</p>
                  <p className="text-sm text-gray-600">{contact.relationship}</p>
                </div>
                <button className="flex items-center text-blue-600 hover:text-blue-700">
                  <Phone className="h-4 w-4 mr-1" />
                  Call
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Itinerary */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center mb-4">
          <Navigation className="h-6 w-6 text-purple-600 mr-2" />
          <h2 className="text-xl font-semibold">Travel Itinerary</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div>
            <p className="text-sm text-gray-600">Trip Duration</p>
            <p className="font-medium">
              {currentTourist.itinerary.startDate.toLocaleDateString()} - {currentTourist.itinerary.endDate.toLocaleDateString()}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Destinations</p>
            <p className="font-medium">{currentTourist.itinerary.destinations.join(', ')}</p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Planned Routes</p>
            <p className="font-medium">{currentTourist.itinerary.plannedRoutes.join(' → ')}</p>
          </div>
        </div>
      </div>
    </div>
  );
}