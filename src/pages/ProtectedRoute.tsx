// Update src/pages/ProtectedRoute.tsx
import React from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { user, isLoading, mfaRequired } = useAuth();

  if (isLoading) {
    return (
      <div className="grid">
        <div className="card">
          <div className="card__body">
            <p className="text-center">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  // If MFA is required, redirect to MFA verification
  if (mfaRequired) {
    return <Navigate to="/mfa-verification" replace />;
  }

  // If not authenticated at all, redirect to signin
  if (!user) {
    return <Navigate to="/signin" replace />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
