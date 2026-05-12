import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { UserRole } from '../types/auth';

interface ProtectedRouteProps {
  allowedRoles: UserRole[];
  userRole: UserRole;
}

export const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ allowedRoles, userRole }) => {
  if (!allowedRoles.includes(userRole)) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};
