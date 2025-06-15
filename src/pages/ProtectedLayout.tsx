// Create src/components/ProtectedLayout.tsx
import React from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const ProtectedLayout: React.FC = () => {
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

  // Render protected content
  return <Outlet />;
};

export default ProtectedLayout;
