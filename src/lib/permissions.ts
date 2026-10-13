export const PERMISSIONS = {
  TOURNAMENT_CREATE: 'org:tournament:create',
  TOURNAMENT_UPDATE: 'org:tournament:update',
  TOURNAMENT_PUBLISH: 'org:tournament:publish',
  REGISTRATION_REVIEW: 'org:registration:review',
  ROSTER_MANAGE: 'org:roster:manage',
  MATCH_REPORT: 'org:match:report',
  SYS_MEMBERSHIPS_READ: 'org:sys_memberships:read',
  SYS_MEMBERSHIPS_MANAGE: 'org:sys_memberships:manage',
  SYS_PROFILE_MANAGE: 'org:sys_profile:manage',
} as const;

export type PermissionKey = keyof typeof PERMISSIONS;
export type PermissionValue = typeof PERMISSIONS[PermissionKey];
