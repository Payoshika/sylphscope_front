// User-related types
export interface User {
  id: number;
  username: string;
  email: string; 
  roles: string[];
  mfaEnabled?: boolean; // Optional, if MFA is not always enabled
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}
export interface ProfileUpdateRequest {
  username: string;
  email: string;
}
export interface UpdateMfaRequest {
  enableMfa: boolean;
}