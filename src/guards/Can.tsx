import { Protect } from '@clerk/clerk-react';
import { PropsWithChildren, ReactNode } from 'react';

interface CanProps extends PropsWithChildren {
  permission: string;
  fallback?: ReactNode;
}

export default function Can({ permission, children, fallback }: CanProps) {
  // We use Clerk's Protect component directly. The permission should match the format org:<feature>:<action>
  return (
    <Protect permission={permission} fallback={fallback ?? <></>}>
      {children}
    </Protect>
  );
}
