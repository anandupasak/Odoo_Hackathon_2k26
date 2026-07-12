import React, { useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { useStore } from './store/useStore';
import { seedDatabase } from './services/db';

import AppLayout from './layouts/AppLayout';
import Login from './pages/Login';
import OrganizationSetup from './pages/OrganizationSetup';
import Dashboard from './pages/Dashboard';
import AssetDirectory from './pages/AssetDirectory';
import Allocations from './pages/Allocations';
import Bookings from './pages/Bookings';
import Maintenance from './pages/Maintenance';
import Audit from './pages/Audit';
import Reports from './pages/Reports';
import Notifications from './pages/Notifications';

// Protected Route Component
const ProtectedRoute = ({ children, allowedRoles = [] }: { children: React.ReactNode, allowedRoles?: string[] }) => {
  const currentUser = useStore(state => state.currentUser);
  
  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRoles.length > 0 && !allowedRoles.includes(currentUser.role)) {
    return <Navigate to="/" replace />; // Redirect to dashboard if unauthorized
  }

  return <>{children}</>;
};

function App() {
  const { loadData, currentUser } = useStore();

  useEffect(() => {
    // Seed and load initial mock data on app start
    seedDatabase();
    loadData();
    
    // Auto-login logic (for dev convenience) if a user is stored in localStorage
    const savedUserStr = localStorage.getItem('af_current_user');
    if (savedUserStr && !currentUser) {
      const savedUser = JSON.parse(savedUserStr);
      useStore.setState({ currentUser: savedUser });
    }
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<ProtectedRoute><AppLayout /></ProtectedRoute>}>
          <Route index element={<Dashboard />} />
          <Route path="setup" element={<ProtectedRoute allowedRoles={['Admin']}><OrganizationSetup /></ProtectedRoute>} />
          <Route path="assets" element={<AssetDirectory />} />
          <Route path="allocations" element={<Allocations />} />
          <Route path="bookings" element={<Bookings />} />
          <Route path="maintenance" element={<Maintenance />} />
          <Route path="audit" element={<ProtectedRoute allowedRoles={['Admin', 'Asset Manager']}><Audit /></ProtectedRoute>} />
          <Route path="reports" element={<ProtectedRoute allowedRoles={['Admin', 'Asset Manager', 'Department Head']}><Reports /></ProtectedRoute>} />
          <Route path="logs" element={<Notifications />} />
        </Route>
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
