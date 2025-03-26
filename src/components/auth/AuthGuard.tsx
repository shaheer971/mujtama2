
import React, { useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

const AuthGuard = ({ redirectTo = '/login', children }: AuthGuardProps) => {
  const { user, isLoading, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Debug logging
  console.log('AuthGuard rendering with state:', { 
    isAuthenticated, 
    userId: user?.id || null, 
    isLoading 
  });

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      console.log('Not authenticated, redirecting to', redirectTo);
    }
  }, [isLoading, isAuthenticated, redirectTo]);

  // If authentication is still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Checking authentication...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to the specified route
  if (!isAuthenticated) {
    console.log('User is not authenticated, redirecting to login');
    return <Navigate to={redirectTo} replace />;
  }

  // If authenticated, render children or outlet
  console.log('User is authenticated, rendering protected content');
  return <>{children || <Outlet />}</>;
};

export default AuthGuard;
