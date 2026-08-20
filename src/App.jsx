import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAppContext } from './context/AppContext';

// Auth Pages
import CustomerAuth from './pages/Auth/CustomerAuth';
import AdminAuth from './pages/Auth/AdminAuth';

// Portals
import CustomerDashboard from './pages/Customer/CustomerDashboard';
import KDSDashboard from './pages/KDS/KDSDashboard';
import AdminDashboard from './pages/Dashboard/AdminDashboard';
import HomeLanding from './pages/HomeLanding';

// Simple Route Protection
const ProtectedRoute = ({ children, role }) => {
  const { user } = useAppContext();
  if (!user) return <Navigate to="/" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;
  return children;
};

function App() {
  return (
    <Router>
      <div className="app-container">
        <Routes>
          <Route path="/" element={<HomeLanding />} />
          
          {/* Auth Routes */}
          <Route path="/auth/customer" element={<CustomerAuth />} />
          <Route path="/auth/admin" element={<AdminAuth />} />
          
          {/* Customer Portal */}
          <Route path="/customer/*" element={
            <ProtectedRoute role="customer">
              <CustomerDashboard />
            </ProtectedRoute>
          } />
          
          {/* Admin Portals */}
          <Route path="/admin/kds" element={
            <ProtectedRoute role="admin">
              <KDSDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/dashboard/*" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
