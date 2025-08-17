// Update src/contexts/AuthContext.tsx
import React, { createContext, useContext, useState, useEffect } from "react";
import AuthService from "../services/AuthService";
import type { User } from "../types/user";

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  mfaRequired: boolean;
  isAuthenticated: boolean;
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
  const [isLoading, setIsLoading] = useState(true);
  const [mfaRequired, setMfaRequired] = useState(false);
  const [hasInitialized, setHasInitialized] = useState(false);
  // Derived state for authentication
  const isAuthenticated = !!user && !mfaRequired;

  useEffect(() => {
    if (hasInitialized) return;
    const initializeAuth = async () => {
      const authStatus = await AuthService.initializeAuth();

      switch (authStatus) {
        case "authenticated":
          const currentUser = AuthService.getCurrentUser();
          setUser(currentUser);
          setMfaRequired(false);
          break;
        case "mfa_required":
          setMfaRequired(true);
          setUser(null);
          // Redirect to MFA verification page
          if (window.location.pathname !== "/mfa-verification") {
            window.location.href = "/mfa-verification";
          }
          break;
        case "unauthenticated":
          setUser(null);
          setMfaRequired(false);
          break;
      }
      setIsLoading(false);
      setHasInitialized(true);
    };

    initializeAuth();
  }, [hasInitialized]);

  useEffect(() => {
    const handleAuthLogin = (event: CustomEvent) => {
      const { user } = event.detail;
      console.log("🔊 Auth login event received:", user);
      setUser(user);
      setMfaRequired(false); // Clear MFA requirement
    };

    const handleAuthLogout = () => {
      console.log("🔊 Auth logout event received");
      setUser(null);
      setMfaRequired(false);
    };

    // Add event listeners
    window.addEventListener("auth:login", handleAuthLogin as EventListener);
    window.addEventListener("auth:logout", handleAuthLogout);

    // Cleanup
    return () => {
      window.removeEventListener(
        "auth:login",
        handleAuthLogin as EventListener
      );
      window.removeEventListener("auth:logout", handleAuthLogout);
    };
  }, []);

  const contextValue: AuthContextType = {
    user,
    isLoading,
    mfaRequired,
    isAuthenticated,
    refreshUser: async () => {
      const validationResult = await AuthService.validateSession();

      if (validationResult === true) {
        const currentUser = AuthService.getCurrentUser();
        setUser(currentUser);
        setMfaRequired(false);
      } else if (validationResult === "mfa_required") {
        setMfaRequired(true);
        setUser(null);
        // Redirect to MFA verification
        if (window.location.pathname !== "/mfa-verification") {
          window.location.href = "/mfa-verification";
        }
      } else {
        setUser(null);
        setMfaRequired(false);
      }
    },
  };

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
