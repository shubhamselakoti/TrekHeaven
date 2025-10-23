import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import LoadingScreen from '../ui/LoadingScreen';

const AdminRoute = ({ children }) => {
  const { isAuthenticated, user, loading } = useAuth();
  if (loading) {
    return (
      <LoadingScreen message="Checking authentication..." />
    );
  }

  if (!isAuthenticated || !user?.isAdmin) {    
    console.log("user", user);
    
    return <Navigate to="/" replace />;
  }

  return <>{children}</>;
};

export default AdminRoute;