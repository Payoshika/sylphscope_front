// User-related types
export interface User {
  id: number;
  username: string;
  email: string;
  roles: Array<'ROLE_ADMIN' | 'ROLE_ISSUER' | 'ROLE_RECEIVER' | 'ROLE_VERIFIER'>;
}

export interface CreateUserRequest {
  username: string;
  email: string;
  password: string;
  passwordConfirmation: string;
}

export interface UpdateUserRequest {
  username?: string;
  email?: string;
  roles?: Array<'ROLE_ADMIN' | 'ROLE_ISSUER' | 'ROLE_RECEIVER' | 'ROLE_VERIFIER'>;  
}