import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';

export default function RequirePlatformAdmin() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) return <div>Loading...</div>;

  const isPlatformAdmin = user?.publicMetadata?.role === 'platform_admin';

  if (!isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
