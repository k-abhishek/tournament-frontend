import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import { LoadingScreen } from '@/components/custom/loading-screen';

export default function RequireAuth() {
  const { isLoaded, userId } = useAuth();
  const location = useLocation();

  if (!isLoaded) {
    return (
      <LoadingScreen
        message="AUTHENTICATING SESSION"
        subMessage="VERIFYING ACCESS PERMISSIONS..."
      />
    );
  }

  if (!userId) {
    return <Navigate to={`/sign-in?redirect_url=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
}
