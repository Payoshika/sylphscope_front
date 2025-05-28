import type { User } from "./user";

export interface LoginRequest {
  username: string;
  password: string;
}

export interface LoginResponse {
  user: User; 
  accessToken: string;

}

export interface RegisterRequest {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
}