import { useAuth, useUser } from '@clerk/clerk-react';
import { PermissionValue } from './permissions';

export function usePermissions() {
  const { has, isLoaded: authLoaded } = useAuth();
  const { user, isLoaded: userLoaded } = useUser();

  const isPlatformAdmin = user?.publicMetadata?.role === 'platform_admin';

  const checkPermission = (permission: PermissionValue | string) => {
    if (isPlatformAdmin) return true;
    if (!has) return false;
    return has({ permission });
  };

  return {
    isPlatformAdmin,
    checkPermission,
    isLoaded: authLoaded && userLoaded,
  };
}
