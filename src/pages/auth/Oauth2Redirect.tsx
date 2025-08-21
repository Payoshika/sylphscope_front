import React, { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { useToast } from "../../contexts/ToastContext";
import { tokenManager } from "../../utility/TokenManager";
import type { User } from "../../types/user";

const OAuth2Redirect: React.FC = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { showSuccess, showError } = useToast();
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    // Prevent double processing
    if (isProcessing) {
      console.log("🔄 Already processing OAuth2 callback...");
      return;
    }

    const token = searchParams.get("token");
    const error = searchParams.get("error");

    // Only process if we have token or error
    if (!token && !error) {
      console.log("🔄 No token or error in URL, skipping...");
      return;
    }

    const handleOAuth2Callback = async () => {
      setIsProcessing(true);
      console.log("🔍 Starting OAuth2 callback processing...");

      if (error) {
        console.error("OAuth2 error:", error);
        showError(
          "Google authentication failed. Please try again.",
          "Authentication Error"
        );
        navigate("/signin");
        return;
      }

      if (!token) {
        console.error("No token received from OAuth2 provider");
        showError(
          "No authentication token received. Please try again.",
          "Authentication Error"
        );
        navigate("/signin");
        return;
      }

      try {
        console.log("🔍 Processing OAuth2 token...");

        // Validate the token with your backend
        const response = await fetch(
          `${import.meta.env.VITE_API_BASE_URL}/api/public/validate-token`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
              Authorization: `Bearer ${token}`,
            },
          }
        );

        if (!response.ok) {
          const errorText = await response.text();
          console.error("❌ Validation failed:", errorText);
          throw new Error(`Token validation failed: ${response.status}`);
        }

        const userData = await response.json();
        console.log("✅ OAuth2 user data received:", userData);

        // Store the token
        tokenManager.setToken(token);

        // Create user object
        const user: User = {
          id: userData.id || userData.userId,
          username: userData.username || userData.name,
          email: userData.email || "",
          roles: userData.roles || [],
        };

        // Store user info
        tokenManager.setUser(user);

        // Dispatch login event for AuthContext
        window.dispatchEvent(
          new CustomEvent("auth:login", {
            detail: {
              user,
              timestamp: Date.now(),
            },
          })
        );
        console.log("User roles:", userData.roles);
        if (userData.roles && userData.roles[0] === "ROLE_TEMPORARY") {
          navigate("/choose-role");
        }
        else{
          navigate("/");
        }
      } catch (error) {
        console.error("❌ OAuth2 authentication failed:", error);
        showError(
          "Authentication failed. Please try again.",
          "Google Sign-in Failed"
        );
        navigate("/signin");
      }
    };

    handleOAuth2Callback();
  }, [searchParams, navigate, showSuccess, showError, isProcessing]);

  return (
    <div className="grid">
      <div className="signin-container">
        <div className="card">
          <div className="card__body">
            <div className="text-center">
              <h3>Completing Google Sign-in...</h3>
              <p className="caption">
                Please wait while we verify your account.
              </p>
              {isProcessing && (
                <div style={{ marginTop: "1rem" }}>
                  <p className="caption">Processing authentication...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OAuth2Redirect;
