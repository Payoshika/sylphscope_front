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
  roles: string[];
}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}