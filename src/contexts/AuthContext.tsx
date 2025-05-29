import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import { useToast } from "./ToastContext";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (credentials: any) => Promise<boolean>;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | null>(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

interface AuthProviderProps {
  children: React.ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const { showSuccess, showError } = useToast();

  // Initialize auth state on app load
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (AuthService.isAuthenticated()) {
          // Get user from storage first (fast)
          const storedUser = AuthService.getCurrentUser();
          if (storedUser) {
            setUser(storedUser);
            setIsAuthenticated(true);
          }

          // Then validate token in background (slower)
          const isValid = await AuthService.validateSession();
          if (!isValid) {
            // Token was invalid, clear state
            setUser(null);
            setIsAuthenticated(false);
          }
        }
      } catch (error) {
        console.error("Auth initialization failed:", error);
        setUser(null);
        setIsAuthenticated(false);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();

    // Listen for auth events from AuthService
    const handleLogin = (event: CustomEvent) => {
      setUser(event.detail.user);
      setIsAuthenticated(true);
      setIsLoading(false);
      showSuccess(
        `Welcome back, ${event.detail.user.username}!`,
        "Login Successful"
      );
    };

    const handleLogout = () => {
      setUser(null);
      setIsAuthenticated(false);
      setIsLoading(false);
      showSuccess("You have been logged out successfully", "Goodbye!");
    };

    window.addEventListener("auth:login", handleLogin as EventListener);
    window.addEventListener("auth:logout", handleLogout);

    return () => {
      window.removeEventListener("auth:login", handleLogin as EventListener);
      window.removeEventListener("auth:logout", handleLogout);
    };
  }, [showSuccess]);

  // Periodically validate token in background (every 60 minutes)
  useEffect(() => {
    if (!isAuthenticated) return;

    const validateInterval = setInterval(async () => {
      console.log("🔄 Background token validation...");
      const isValid = await AuthService.validateSession();
      if (!isValid) {
        setUser(null);
        setIsAuthenticated(false);
        showError(
          "Your session has expired. Please login again.",
          "Session Expired"
        );
      }
    }, 60 * 60 * 1000); // 60 minutes

    return () => clearInterval(validateInterval);
  }, [isAuthenticated, showError]);

  const login = async (credentials: any): Promise<boolean> => {
    try {
      setIsLoading(true);
      const response = await AuthService.login(credentials);

      if (!response.success && response.message) {
        showError(response.message, "Login Failed");
      }

      return response.success;
    } catch (error) {
      console.error("Login failed:", error);
      showError(
        "An unexpected error occurred. Please try again.",
        "Login Failed"
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = async (): Promise<void> => {
    setIsLoading(true);
    await AuthService.logout();
    // State will be updated by the event listener
  };

  const refreshUser = async (): Promise<void> => {
    if (!isAuthenticated) return;

    try {
      const isValid = await AuthService.validateSession();
      if (isValid) {
        const updatedUser = AuthService.getCurrentUser();
        if (updatedUser) {
          setUser(updatedUser);
        }
      }
    } catch (error) {
      console.error("Failed to refresh user:", error);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
        login,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
