import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import App from '../App';
import AdminLogin from '../pages/AdminLogin';
import AdminDashboard from '../pages/AdminDashboard';
import AdminUsers from '../pages/AdminUsers';
import AdminCards from '../pages/AdminCards';
import AdminLayout from '../components/admin/AdminLayout';

const AppRoutes = () => {
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(false);

  useEffect(() => {
    // Check if admin token exists in localStorage
    const checkAuthStatus = () => {
      const adminToken = localStorage.getItem('adminToken');
      setIsAdminAuthenticated(!!adminToken);
    };

    // Initial check
    checkAuthStatus();

    // Listen for storage changes (when login happens)
    const handleStorageChange = (e: StorageEvent) => {
      if (e.key === 'adminToken') {
        checkAuthStatus();
      }
    };

    // Listen for custom events (for same-tab updates)
    const handleAuthChange = () => {
      checkAuthStatus();
    };

    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('adminAuthChange', handleAuthChange);

    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('adminAuthChange', handleAuthChange);
    };
  }, []);

  // Admin authentication guard
  const AdminRoute = ({ children }: { children: ReactNode }) => {
    return isAdminAuthenticated ? children : <Navigate to="/admin/login" />;
  };

  return (
    <Router>
      <Routes>
        {/* Main App Routes */}
        <Route path="/" element={<App />} />

        {/* Admin Routes */}
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminLayout />
            </AdminRoute>
          }
        >
          <Route index element={<AdminDashboard />} />
          <Route path="dashboard" element={<AdminDashboard />} />
          <Route path="users" element={<AdminUsers />} />
          <Route path="cards" element={<AdminCards />} />
        </Route>

        {/* Fallback route */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
    </Router>
  );
};

export default AppRoutes;