import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import LogoLoader from '@/components/common/LogoLoader';

const AdminRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user, loading, initialized } = useAuth();

  if (loading || !initialized) {
    return <LogoLoader fullScreen />;
  }

  if (!user) return <Navigate to="/sign-in" replace />;
  if (!user.isAdmin) return <Navigate to="/dashboard" replace />;

  return <>{children}</>;
};

export default AdminRoute;
