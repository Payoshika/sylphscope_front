import { useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import { tokenManager } from "../utility/TokenManager";
import type { User } from "../types/user";

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  isLoading: boolean;
}

export const useAuth = () => {
  const [authState, setAuthState] = useState<AuthState>({
    isAuthenticated: false,
    user: null,
    isLoading: true,
  });

  useEffect(() => {
    const checkAuth = () => {
      try {
        if (AuthService.isAuthenticated()) {
          const user = tokenManager.getUser(); // Get from storage, not API
          setAuthState({
            isAuthenticated: true,
            user,
            isLoading: false,
          });
        } else {
          setAuthState({
            isAuthenticated: false,
            user: null,
            isLoading: false,
          });
        }
      } catch (error) {
        console.error("Auth check failed:", error);
        setAuthState({
          isAuthenticated: false,
          user: null,
          isLoading: false,
        });
      }
    };

    checkAuth();

    // Listen for auth events
    const handleLogin = (event: CustomEvent) => {
      setAuthState({
        isAuthenticated: true,
        user: event.detail.user,
        isLoading: false,
      });
    };

    const handleLogout = () => {
      setAuthState({
        isAuthenticated: false,
        user: null,
        isLoading: false,
      });
    };

    window.addEventListener("auth:login", handleLogin as EventListener);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:login", handleLogin as EventListener);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, []);

  return authState;
};
