import React, { useState } from 'react';
import { Shield, MapPin, AlertTriangle, Clock, Users, CheckCircle, XCircle } from 'lucide-react';
import { useData } from '../../contexts/DataContext';
import { useAuth } from '../../contexts/AuthContext';
import { Incident } from '../../types';

export function PoliceDashboard() {
  const { user } = useAuth();
  const { incidents, tourists, safetyMetrics, updateIncident } = useData();
  const [selectedIncident, setSelectedIncident] = useState<Incident | null>(null);

  const handleIncidentAction = (incidentId: string, action: 'assign' | 'resolve' | 'close') => {
    let updates: Partial<Incident> = {};
    
    switch (action) {
      case 'assign':
        updates = { 
          status: 'investigating',
          assignedOfficer: user?.name || 'Unknown Officer'
        };
        break;
      case 'resolve':
        updates = { status: 'resolved' };
        break;
      case 'close':
        updates = { status: 'closed' };
        break;
    }
    
    updateIncident(incidentId, updates);
    setSelectedIncident(null);
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'yellow';
      case 'low': return 'green';
      default: return 'gray';
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'open': return 'red';
      case 'investigating': return 'yellow';
      case 'resolved': return 'green';
      case 'closed': return 'gray';
      default: return 'gray';
    }
  };

  const criticalIncidents = incidents.filter(i => i.severity === 'critical' && i.status !== 'closed');
  const assignedIncidents = incidents.filter(i => i.assignedOfficer === user?.name);

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-lg p-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Police Control Center</h1>
            <p className="text-gray-600">Officer: {user?.name} | Badge: {user?.badge}</p>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-600">Department</p>
            <p className="font-medium">{user?.department}</p>
          </div>
        </div>
      </div>

      {/* Metrics Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-blue-100 p-3 rounded-full">
              <Users className="h-6 w-6 text-blue-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Tourists</p>
              <p className="text-2xl font-bold text-gray-900">{safetyMetrics.activeTourists}</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-red-100 p-3 rounded-full">
              <AlertTriangle className="h-6 w-6 text-red-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Open Incidents</p>
              <p className="text-2xl font-bold text-gray-900">
                {incidents.filter(i => i.status === 'open').length}
              </p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-yellow-100 p-3 rounded-full">
              <Clock className="h-6 w-6 text-yellow-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Avg Response Time</p>
              <p className="text-2xl font-bold text-gray-900">{safetyMetrics.responseTime}min</p>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center">
            <div className="bg-green-100 p-3 rounded-full">
              <CheckCircle className="h-6 w-6 text-green-600" />
            </div>
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Resolved Today</p>
              <p className="text-2xl font-bold text-gray-900">
                {incidents.filter(i => i.status === 'resolved' && 
                  new Date(i.updatedAt).toDateString() === new Date().toDateString()).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Critical Incidents */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <AlertTriangle className="h-6 w-6 text-red-600 mr-2" />
            <h2 className="text-xl font-semibold">Critical Incidents</h2>
            <span className="ml-auto bg-red-100 text-red-800 px-2 py-1 rounded-full text-sm">
              {criticalIncidents.length}
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {criticalIncidents.map((incident) => {
              const tourist = tourists.find(t => t.id === incident.touristId);
              return (
                <div key={incident.id} className="border border-red-200 rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedIncident(incident)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {tourist?.name || 'Unknown Tourist'}
                      </h3>
                      <p className="text-sm text-gray-600">{incident.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getSeverityColor(incident.severity)}-100 text-${getSeverityColor(incident.severity)}-800`}>
                      {incident.severity.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>
                      <MapPin className="h-4 w-4 inline mr-1" />
                      {incident.location.latitude.toFixed(4)}, {incident.location.longitude.toFixed(4)}
                    </span>
                    <span>
                      <Clock className="h-4 w-4 inline mr-1" />
                      {new Date(incident.createdAt).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              );
            })}
            {criticalIncidents.length === 0 && (
              <p className="text-gray-500 text-center py-8">No critical incidents at the moment</p>
            )}
          </div>
        </div>

        {/* My Cases */}
        <div className="bg-white rounded-xl shadow-lg p-6">
          <div className="flex items-center mb-4">
            <Shield className="h-6 w-6 text-blue-600 mr-2" />
            <h2 className="text-xl font-semibold">My Assigned Cases</h2>
            <span className="ml-auto bg-blue-100 text-blue-800 px-2 py-1 rounded-full text-sm">
              {assignedIncidents.length}
            </span>
          </div>

          <div className="space-y-3 max-h-96 overflow-y-auto">
            {assignedIncidents.map((incident) => {
              const tourist = tourists.find(t => t.id === incident.touristId);
              return (
                <div key={incident.id} className="border rounded-lg p-4 hover:shadow-md transition-shadow cursor-pointer"
                     onClick={() => setSelectedIncident(incident)}>
                  <div className="flex justify-between items-start mb-2">
                    <div>
                      <h3 className="font-medium text-gray-900">
                        {tourist?.name || 'Unknown Tourist'}
                      </h3>
                      <p className="text-sm text-gray-600">{incident.description}</p>
                    </div>
                    <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getStatusColor(incident.status)}-100 text-${getStatusColor(incident.status)}-800`}>
                      {incident.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="flex justify-between items-center text-sm text-gray-500">
                    <span>ID: {tourist?.digitalId}</span>
                    <span>
                      <Clock className="h-4 w-4 inline mr-1" />
                      {new Date(incident.updatedAt).toLocaleString()}
                    </span>
                  </div>
                </div>
              );
            })}
            {assignedIncidents.length === 0 && (
              <p className="text-gray-500 text-center py-8">No assigned cases</p>
            )}
          </div>
        </div>
      </div>

      {/* Incident Detail Modal */}
      {selectedIncident && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b">
              <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold">Incident Details</h2>
                <button
                  onClick={() => setSelectedIncident(null)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <XCircle className="h-6 w-6" />
                </button>
              </div>
            </div>
            
            <div className="p-6 space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Tourist</p>
                  <p className="font-medium">
                    {tourists.find(t => t.id === selectedIncident.touristId)?.name || 'Unknown'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Digital ID</p>
                  <p className="font-medium">
                    {tourists.find(t => t.id === selectedIncident.touristId)?.digitalId || 'N/A'}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Incident Type</p>
                  <p className="font-medium capitalize">{selectedIncident.type}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Severity</p>
                  <span className={`px-2 py-1 rounded-full text-xs font-medium bg-${getSeverityColor(selectedIncident.severity)}-100 text-${getSeverityColor(selectedIncident.severity)}-800`}>
                    {selectedIncident.severity.toUpperCase()}
                  </span>
                </div>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Description</p>
                <p className="font-medium">{selectedIncident.description}</p>
              </div>

              <div>
                <p className="text-sm text-gray-600 mb-1">Location</p>
                <p className="font-medium font-mono text-sm">
                  {selectedIncident.location.latitude.toFixed(6)}, {selectedIncident.location.longitude.toFixed(6)}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Created</p>
                  <p className="font-medium">{new Date(selectedIncident.createdAt).toLocaleString()}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Last Updated</p>
                  <p className="font-medium">{new Date(selectedIncident.updatedAt).toLocaleString()}</p>
                </div>
              </div>

              {selectedIncident.assignedOfficer && (
                <div>
                  <p className="text-sm text-gray-600">Assigned Officer</p>
                  <p className="font-medium">{selectedIncident.assignedOfficer}</p>
                </div>
              )}
            </div>

            <div className="p-6 border-t bg-gray-50 flex space-x-3">
              {selectedIncident.status === 'open' && (
                <button
                  onClick={() => handleIncidentAction(selectedIncident.id, 'assign')}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Assign to Me
                </button>
              )}
              {selectedIncident.status === 'investigating' && selectedIncident.assignedOfficer === user?.name && (
                <button
                  onClick={() => handleIncidentAction(selectedIncident.id, 'resolve')}
                  className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Mark Resolved
                </button>
              )}
              {selectedIncident.status === 'resolved' && (
                <button
                  onClick={() => handleIncidentAction(selectedIncident.id, 'close')}
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                >
                  Close Case
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}