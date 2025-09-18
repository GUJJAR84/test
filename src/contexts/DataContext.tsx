import React, { createContext, useContext, useState, useEffect } from 'react';
import { Tourist, Incident, GeoFence, SafetyMetrics, Location } from '../types';

interface DataContextType {
  tourists: Tourist[];
  incidents: Incident[];
  geoFences: GeoFence[];
  safetyMetrics: SafetyMetrics;
  addTourist: (tourist: Omit<Tourist, 'id' | 'createdAt'>) => string;
  updateTourist: (id: string, updates: Partial<Tourist>) => void;
  deleteTourist: (id: string) => void;
  updateTouristLocation: (id: string, location: Location) => void;
  createIncident: (incident: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateIncident: (id: string, updates: Partial<Incident>) => void;
  triggerPanicButton: (touristId: string, location: Location) => void;
  addGeoFence: (geoFence: Omit<GeoFence, 'id'>) => string;
  updateGeoFence: (id: string, updates: Partial<GeoFence>) => void;
  deleteGeoFence: (id: string) => void;
}

const DataContext = createContext<DataContextType | undefined>(undefined);

// Mock data
const mockTourists: Tourist[] = [
  {
    id: '1',
    digitalId: 'DTID-2024-NE-001',
    name: 'Aman Kumar',
    phone: '+91-9876543210',
    nationality: 'India',
    kycHash: 'hash_abc123',
    itinerary: {
      startDate: new Date('2025-09-23'),
      endDate: new Date('2025-10-03'),
      plannedRoutes: ['Guwahati', 'Shillong', 'Cherrapunji'],
      destinations: ['Meghalaya', 'Assam'],
      routeHash: 'route_hash_xyz'
    },
    emergencyContacts: [
      { name: 'Sunita Kumar', phone: '+91-9876543211', relationship: 'Mother', encryptedDetails: 'enc_contact1' }
    ],
    currentLocation: { latitude: 25.5788, longitude: 91.8933, accuracy: 10, timestamp: new Date() },
    safetyScore: 85,
    status: 'safe',
    createdAt: new Date(),
    expiryDate: new Date('2025-10-03')
  },
  {
    id: '2',
    digitalId: 'DTID-2024-NE-002',
    name: 'Priya Singh',
    phone: '+91-9876543220',
    nationality: 'India',
    kycHash: 'hash_def456',
    itinerary: {
      startDate: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000), // 5 days from now
      endDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000), // 12 days from now
      plannedRoutes: ['Kohima', 'Dimapur', 'Imphal'],
      destinations: ['Nagaland', 'Manipur'],
      routeHash: 'route_hash_abc'
    },
    emergencyContacts: [
      { name: 'Raj Singh', phone: '+91-9876543221', relationship: 'Father', encryptedDetails: 'enc_contact2' }
    ],
    currentLocation: { latitude: 25.6751, longitude: 94.1086, accuracy: 15, timestamp: new Date() },
    safetyScore: 45,
    status: 'caution',
    createdAt: new Date(),
    expiryDate: new Date(Date.now() + 12 * 24 * 60 * 60 * 1000)
  },
  {
    id: '3',
    digitalId: 'DTID-2024-NE-003',
    name: 'Vikram Patel',
    phone: '+91-9876543230',
    nationality: 'India',
    kycHash: 'hash_ghi789',
    itinerary: {
      startDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000), // 10 days from now
      endDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000), // 17 days from now
      plannedRoutes: ['Aizawl', 'Lunglei', 'Champhai'],
      destinations: ['Mizoram'],
      routeHash: 'route_hash_def'
    },
    emergencyContacts: [
      { name: 'Meera Patel', phone: '+91-9876543231', relationship: 'Wife', encryptedDetails: 'enc_contact3' }
    ],
    currentLocation: { latitude: 23.7271, longitude: 92.7176, accuracy: 12, timestamp: new Date() },
    safetyScore: 92,
    status: 'safe',
    createdAt: new Date(),
    expiryDate: new Date(Date.now() + 17 * 24 * 60 * 60 * 1000)
  },
  {
    id: '4',
    digitalId: 'DTID-2024-NE-004',
    name: 'Rohit Sharma',
    phone: '+91-9876543240',
    nationality: 'India',
    kycHash: 'hash_jkl012',
    itinerary: {
      startDate: new Date('2025-07-01'),
      endDate: new Date('2025-07-10'),
      plannedRoutes: ['Itanagar', 'Ziro', 'Tawang'],
      destinations: ['Arunachal Pradesh'],
      routeHash: 'route_hash_ghi'
    },
    emergencyContacts: [
      { name: 'Kavita Sharma', phone: '+91-9876543241', relationship: 'Sister', encryptedDetails: 'enc_contact4' }
    ],
    currentLocation: { latitude: 27.0844, longitude: 93.6053, accuracy: 8, timestamp: new Date('2025-07-10') },
    safetyScore: 100,
    status: 'safe',
    createdAt: new Date('2025-07-01'),
    expiryDate: new Date('2025-07-10')
  }
];

const mockIncidents: Incident[] = [
  {
    id: '1',
    touristId: '2',
    type: 'anomaly',
    severity: 'medium',
    location: { latitude: 25.6751, longitude: 94.1086, accuracy: 15, timestamp: new Date() },
    description: 'Tourist deviated significantly from planned route',
    status: 'investigating',
    assignedOfficer: 'Inspector Priya Das',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000),
    updatedAt: new Date(Date.now() - 1 * 60 * 60 * 1000)
  }
];

const mockGeoFences: GeoFence[] = [
  {
    id: '1',
    name: 'Border Restricted Zone',
    type: 'restricted',
    coordinates: [
      { latitude: 25.5000, longitude: 91.5000, accuracy: 0, timestamp: new Date() },
      { latitude: 25.6000, longitude: 91.5000, accuracy: 0, timestamp: new Date() },
      { latitude: 25.6000, longitude: 91.6000, accuracy: 0, timestamp: new Date() },
      { latitude: 25.5000, longitude: 91.6000, accuracy: 0, timestamp: new Date() }
    ],
    isActive: true,
    alertMessage: 'You are approaching a restricted border area. Please contact local authorities.'
  }
];

export function DataProvider({ children }: { children: React.ReactNode }) {
  const [tourists, setTourists] = useState<Tourist[]>(mockTourists);
  const [incidents, setIncidents] = useState<Incident[]>(mockIncidents);
  const [geoFences] = useState<GeoFence[]>(mockGeoFences);
  const [safetyMetrics, setSafetyMetrics] = useState<SafetyMetrics>({
    totalTourists: 4,
    activeTourists: 3,
    safeCount: 2,
    cautionCount: 1,
    dangerCount: 0,
    incidentsToday: 1,
    responseTime: 15.5
  });

  // Simulate real-time updates
  useEffect(() => {
    const interval = setInterval(() => {
      setTourists(prev => prev.map(tourist => {
        // Simulate location updates and safety score changes
        const newScore = Math.max(10, Math.min(100, tourist.safetyScore + (Math.random() - 0.5) * 10));
        let newStatus: Tourist['status'] = 'safe';
        
        if (newScore < 30) newStatus = 'danger';
        else if (newScore < 60) newStatus = 'caution';
        
        return {
          ...tourist,
          safetyScore: Math.round(newScore),
          status: newStatus,
          currentLocation: {
            ...tourist.currentLocation,
            latitude: tourist.currentLocation.latitude + (Math.random() - 0.5) * 0.01,
            longitude: tourist.currentLocation.longitude + (Math.random() - 0.5) * 0.01,
            timestamp: new Date()
          }
        };
      }));
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  // Update metrics when tourists change
  useEffect(() => {
    setSafetyMetrics(prev => ({
      ...prev,
      totalTourists: tourists.length,
      activeTourists: tourists.filter(t => new Date() < t.expiryDate).length,
      safeCount: tourists.filter(t => t.status === 'safe').length,
      cautionCount: tourists.filter(t => t.status === 'caution').length,
      dangerCount: tourists.filter(t => t.status === 'danger').length
    }));
  }, [tourists]);

  const addTourist = (touristData: Omit<Tourist, 'id' | 'createdAt'>): string => {
    const id = Date.now().toString();
    const newTourist: Tourist = {
      ...touristData,
      id,
      createdAt: new Date()
    };
    setTourists(prev => [...prev, newTourist]);
    return id;
  };

  const updateTourist = (id: string, updates: Partial<Tourist>) => {
    setTourists(prev => prev.map(tourist =>
      tourist.id === id
        ? { ...tourist, ...updates }
        : tourist
    ));
  };

  const deleteTourist = (id: string) => {
    setTourists(prev => prev.filter(tourist => tourist.id !== id));
  };

  const updateTouristLocation = (id: string, location: Location) => {
    setTourists(prev => prev.map(tourist => 
      tourist.id === id 
        ? { ...tourist, currentLocation: location }
        : tourist
    ));
  };

  const createIncident = (incidentData: Omit<Incident, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIncident: Incident = {
      ...incidentData,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    setIncidents(prev => [...prev, newIncident]);
  };

  const updateIncident = (id: string, updates: Partial<Incident>) => {
    setIncidents(prev => prev.map(incident =>
      incident.id === id
        ? { ...incident, ...updates, updatedAt: new Date() }
        : incident
    ));
  };

  const addGeoFence = (geoFenceData: Omit<GeoFence, 'id'>): string => {
    const id = Date.now().toString();
    const newGeoFence: GeoFence = {
      ...geoFenceData,
      id
    };
    setGeoFences(prev => [...prev, newGeoFence]);
    return id;
  };

  const updateGeoFence = (id: string, updates: Partial<GeoFence>) => {
    setGeoFences(prev => prev.map(fence =>
      fence.id === id
        ? { ...fence, ...updates }
        : fence
    ));
  };

  const deleteGeoFence = (id: string) => {
    setGeoFences(prev => prev.filter(fence => fence.id !== id));
  };

  const triggerPanicButton = (touristId: string, location: Location) => {
    // Create panic incident
    createIncident({
      touristId,
      type: 'panic',
      severity: 'critical',
      location,
      description: 'Emergency panic button activated',
      status: 'open'
    });

    // Update tourist status
    setTourists(prev => prev.map(tourist =>
      tourist.id === touristId
        ? { ...tourist, status: 'danger', currentLocation: location }
        : tourist
    ));
  };

  return (
    <DataContext.Provider value={{
      tourists,
      incidents,
      geoFences,
      safetyMetrics,
      addTourist,
      updateTourist,
      deleteTourist,
      updateTouristLocation,
      createIncident,
      updateIncident,
      triggerPanicButton,
      addGeoFence,
      updateGeoFence,
      deleteGeoFence
    }}>
      {children}
    </DataContext.Provider>
  );
}

export function useData() {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
}