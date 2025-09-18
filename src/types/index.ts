export interface Tourist {
  id: string;
  digitalId: string;
  name: string;
  phone: string;
  nationality: string;
  kycHash: string;
  itinerary: TravelItinerary;
  emergencyContacts: EmergencyContact[];
  currentLocation: Location;
  safetyScore: number;
  status: 'safe' | 'caution' | 'danger' | 'missing';
  createdAt: Date;
  expiryDate: Date;
}

export interface TravelItinerary {
  startDate: Date;
  endDate: Date;
  plannedRoutes: string[];
  destinations: string[];
  routeHash: string;
}

export interface EmergencyContact {
  name: string;
  phone: string;
  relationship: string;
  encryptedDetails: string;
}

export interface Location {
  latitude: number;
  longitude: number;
  accuracy: number;
  timestamp: Date;
  address?: string;
}

export interface Incident {
  id: string;
  touristId: string;
  type: 'panic' | 'anomaly' | 'geofence' | 'missing';
  severity: 'low' | 'medium' | 'high' | 'critical';
  location: Location;
  description: string;
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  assignedOfficer?: string;
  createdAt: Date;
  updatedAt: Date;
  evidence?: Evidence[];
}

export interface Evidence {
  id: string;
  type: 'audio' | 'video' | 'image' | 'location';
  url: string;
  uploadedAt: Date;
}

export interface GeoFence {
  id: string;
  name: string;
  type: 'danger' | 'restricted' | 'safe';
  coordinates: Location[];
  isActive: boolean;
  alertMessage: string;
}

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'tourist' | 'police' | 'tourism_dept' | 'admin';
  permissions: string[];
  badge?: string;
  department?: string;
}

export interface SafetyMetrics {
  totalTourists: number;
  activeTourists: number;
  safeCount: number;
  cautionCount: number;
  dangerCount: number;
  incidentsToday: number;
  responseTime: number;
}