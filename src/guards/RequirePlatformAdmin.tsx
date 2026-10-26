import { useUser } from '@clerk/clerk-react';
import { Navigate, Outlet } from 'react-router-dom';
import { LoadingScreen } from '@/components/custom/loading-screen';

export default function RequirePlatformAdmin() {
  const { isLoaded, user } = useUser();

  if (!isLoaded) {
    return (
      <LoadingScreen
        message="AUTHENTICATING PLATFORM ADMIN"
        subMessage="CHECKING SYSTEM CREDENTIALS..."
      />
    );
  }

  const isPlatformAdmin = user?.publicMetadata?.role === 'platform_admin';

  if (!isPlatformAdmin) {
    return <Navigate to="/dashboard" replace />;
  }

  return <Outlet />;
}
