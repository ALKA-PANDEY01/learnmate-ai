import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { GraduationCap } from 'lucide-react';

export const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-4">
        <div className="flex items-center justify-center w-16 h-16 rounded-2xl bg-primary text-white shadow-xl shadow-primary/20 animate-bounce">
          <GraduationCap size={32} />
        </div>
        <p className="text-sm font-medium text-muted animate-pulse">
          Setting up your learning environment...
        </p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Save the location the user tried to access so we can redirect them back after logging in
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return children;
};
