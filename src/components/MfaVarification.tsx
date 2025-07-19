// Update src/components/MfaVarification.tsx
import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useToast } from "../contexts/ToastContext";
import FormInput from "./FormInput";
import SubmitButton from "./SubmitButton";
import AuthService from "../services/AuthService";

const MfaVerification: React.FC = () => {
  const navigate = useNavigate();
  const { showError, showSuccess } = useToast();
  const [code, setCode] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasSentCode, setHasSentCode] = useState(false);

  // Request MFA code when component mounts
  useEffect(() => {
    const requestInitialCode = async () => {
      if (!hasSentCode) {
        try {
          await AuthService.requestMfaCode();
          setHasSentCode(true);
          showSuccess("Verification code sent to your email", "Code Sent");
        } catch (error) {
          showError("Failed to send verification code", "Send Failed");
        }
      }
    };

    requestInitialCode();
  }, [hasSentCode, showError, showSuccess]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!code.trim()) {
      showError("Please enter the verification code", "Code Required");
      return;
    }
    setIsSubmitting(true);
    try {
      const response = await AuthService.verifyMfaCode(code);
      if (response.success) {
        showSuccess("MFA verification successful!", "Welcome!");
        navigate("/components"); // Redirect to main app
      } else {
        showError(
          "Invalid verification code. Please try again.",
          "Verification Failed"
        );
      }
    } catch (error) {
      showError("Verification failed. Please try again.", "Error");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    try {
      setIsSubmitting(true);
      // Call API to resend MFA code
      await AuthService.requestMfaCode();
      showSuccess("Verification code resent to your email", "Code Sent");
    } catch (error) {
      showError("Failed to resend code. Please try again.", "Resend Failed");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="grid">
      <div className="signin-container">
        <div className="card">
          <div className="card__header">
            <h2>Two-Factor Authentication Required</h2>
            <p className="caption">
              We've sent a verification code to your email. Please enter it
              below to continue.
            </p>
          </div>
          <div className="card__body">
            <form onSubmit={handleSubmit}>
              <FormInput
                id="mfaCode"
                name="mfaCode"
                type="text"
                label="Verification Code"
                placeholder="Enter 6-digit code"
                value={code}
                onChange={(e) => setCode(e.target.value)}
                disabled={isSubmitting}
              />

              <div
                className="form-actions"
                style={{
                  display: "flex",
                  gap: "1rem",
                  flexDirection: "column",
                }}
              >
                <SubmitButton
                  isLoading={isSubmitting}
                  loadingText="Verifying..."
                  defaultText="Verify Code"
                />

                <button
                  type="button"
                  className="btn btn--ghost"
                  onClick={handleResendCode}
                  disabled={isSubmitting}
                >
                  Resend Code
                </button>
              </div>
            </form>
          </div>
          <div className="card__footer">
            <p className="text-center">
              Need help?{" "}
              <button
                type="button"
                className="link"
                style={{
                  background: "none",
                  border: "none",
                  cursor: "pointer",
                }}
                onClick={() => navigate("/signin")}
              >
                Back to Sign In
              </button>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MfaVerification;
