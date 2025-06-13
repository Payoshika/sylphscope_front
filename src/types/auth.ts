import type { User } from "./user";

export interface LoginRequest {
  username: string;
  password: string;
}
export interface LoginResponse {
  token: string;        
  type: string;         
  id: string;
  username: string;
  email?: string;       // Optional, if email is not always provided
  roles: string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface MfaSetupInfo {
  qrCodeUrl: string;
  secret: string;
  backupCodes?: string[];
}

export interface MfaToggleRequest {
  verificationCode?: string;
}

export interface MfaRequiredResponse {
  message: string;
  requiresMfa: boolean;
}