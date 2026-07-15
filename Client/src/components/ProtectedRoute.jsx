import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-slate-200 border-t-primary-600"></div>
      </div>
    );
  }

  // If user is not logged in, redirect to login page
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If route is adminOnly but user is not admin, redirect to home page
  if (adminOnly && user.role !== 'admin') {
    alert('Access Denied: Admin authorization required');
    return <Navigate to="/" replace />;
  }

  // Render children routes
  return <Outlet />;
};

export default ProtectedRoute;
