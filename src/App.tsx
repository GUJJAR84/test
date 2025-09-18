import React from 'react';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { DataProvider } from './contexts/DataContext';
import { LoginPage } from './components/LoginPage';
import { Header } from './components/common/Header';
import { TouristDashboard } from './components/tourist/TouristDashboard';
import { PoliceDashboard } from './components/police/PoliceDashboard';
import { TourismDashboard } from './components/tourism/TourismDashboard';
import { AdminDashboard } from './components/admin/AdminDashboard';

function AppContent() {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <LoginPage />;
  }

  const renderDashboard = () => {
    switch (user?.role) {
      case 'tourist':
        return <TouristDashboard />;
      case 'police':
        return <PoliceDashboard />;
      case 'tourism_dept':
        return <TourismDashboard />;
      case 'admin':
        return <AdminDashboard />;
      default:
        return <div className="p-8 text-center">Invalid role</div>;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <main className="py-6">
        {renderDashboard()}
      </main>
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <DataProvider>
        <AppContent />
      </DataProvider>
    </AuthProvider>
  );
}

export default App;