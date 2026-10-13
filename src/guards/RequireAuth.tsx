import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

export default function RequireAuth() {
  const { isLoaded, userId } = useAuth();
  const location = useLocation();

  if (!isLoaded) return <div>Loading...</div>;

  if (!userId) {
    return <Navigate to={`/sign-in?redirect_url=${encodeURIComponent(location.pathname)}`} replace />;
  }

  return <Outlet />;
}
