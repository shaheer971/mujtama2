
import { Navigate, Outlet } from 'react-router-dom';
import { useAuth } from '@/lib/auth';
import { Loader2 } from 'lucide-react';

interface AuthGuardProps {
  redirectTo?: string;
  children?: React.ReactNode;
}

const AuthGuard = ({ redirectTo = '/login', children }: AuthGuardProps) => {
  const { user, isLoading } = useAuth();

  // If authentication is still loading, show a loading spinner
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-lg font-medium text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, redirect to the specified route
  if (!user) {
    return <Navigate to={redirectTo} replace />;
  }

  // If authenticated, render children or outlet
  return <>{children || <Outlet />}</>;
};

export default AuthGuard;
