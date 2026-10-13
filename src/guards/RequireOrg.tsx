import { useAuth } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

export default function RequireOrg() {
  const { isLoaded, orgId } = useAuth();

  if (!isLoaded) return <div>Loading...</div>;

  if (!orgId) {
    // If no org is active, redirect to dashboard root or prompt to create one
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
