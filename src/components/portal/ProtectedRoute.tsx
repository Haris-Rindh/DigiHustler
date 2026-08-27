import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useApp } from '../../context/AppContext';

interface ProtectedRouteProps {
  children: React.ReactNode;
}

/**
 * ProtectedRoute — wraps portal pages and redirects unauthenticated
 * visitors to the portal login page, preserving the intended destination
 * so they are automatically redirected after a successful login.
 */
export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated } = useApp();
  const location = useLocation();

  if (!isAuthenticated) {
    // Preserve the path the user tried to visit so we can redirect after login
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};
