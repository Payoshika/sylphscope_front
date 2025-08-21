// User-related types
export interface User {
  id: string;
  username: string;
  email: string; 
  roles: string[];
  mfaEnabled?: boolean; // Optional, if MFA is not always enabled
}

export type Role = 'STUDENT' | 'PROVIDER';
export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}
export interface ProfileUpdateRequest {
  username: string;
  email: string;
  userRoles: Role[];
}
export interface UpdateMfaRequest {
  enableMfa: boolean;
}

export type StaffRole = 'manager' | 'administrator' | 'assessor' | 'volunteer';

export interface ProviderStaff {
  id: string;
  userId: string;
  providerId: string;
  role: StaffRole;
  providerStaffAccessRights?: ProviderStaffAccessRights;
  firstName: string;
  middleName?: string;
  lastName: string;
}

export interface ProviderStaffAccessRights {
  canEditProfile?: boolean;
  canManageUsers?: boolean;
  canCreateGrant?: boolean;
  canEditGrant?: boolean;
  canApproveGrant?: boolean;
  canViewApplications?: boolean;
  canAssessApplications?: boolean;
  canApproveApplications?: boolean;
  canManageStaff?: boolean;
}
