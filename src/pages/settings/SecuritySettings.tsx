import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useForm } from "../../hooks/useForm";
import { usePasswordVisibility } from "../../hooks/usePasswordVisibility";
import FormInput from "../../components/FormInput";
import SubmitButton from "../../components/SubmitButton";
import Alert from "../../components/Alert";
import { apiClient } from "../../utility/ApiClient";
import AuthService from "../../services/AuthService";
import type { UpdateMfaRequest } from "../../types/user";

interface PasswordChangeRequest {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}

const validatePasswordForm = (
  values: PasswordChangeRequest
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.currentPassword) {
    errors.currentPassword = "Current password is required";
  }

  if (!values.newPassword) {
    errors.newPassword = "New password is required";
  } else if (values.newPassword.length < 6) {
    errors.newPassword = "New password must be at least 6 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Password confirmation is required";
  } else if (values.newPassword !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

const SecuritySettings: React.FC = () => {
  const { user } = useAuth();
  const { showSuccess, showError } = useToast();
  const [mfaEnabled, setMfaEnabled] = useState(user?.mfaEnabled || false);
  const [showPasswordSection, setShowPasswordSection] = useState(false);

  const {
    showPassword: showCurrentPassword,
    showConfirmPassword: showNewPassword,
    togglePassword: toggleCurrentPassword,
    toggleConfirmPassword: toggleNewPassword,
  } = usePasswordVisibility();
  const [showConfirmNewPassword, setShowConfirmNewPassword] = useState(false);

  // Password change form
  const {
    values: passwordValues,
    errors: passwordErrors,
    isSubmitting: isPasswordSubmitting,
    handleChange: handlePasswordChange,
    handleSubmit: handlePasswordSubmit,
    setFieldError: setPasswordFieldError,
    resetForm: resetPasswordForm,
  } = useForm({
    initialValues: {
      currentPassword: "",
      newPassword: "",
      confirmPassword: "",
    } as PasswordChangeRequest,
    validate: validatePasswordForm,
  });

  const handleMfaToggle = async () => {
    const updateRequest: UpdateMfaRequest = {
      enableMfa: !mfaEnabled,
    };
    const response = await AuthService.updateMfa(updateRequest);
    if (response.success) {
      setMfaEnabled(!mfaEnabled);
      showSuccess(
        `Two-factor authentication ${!mfaEnabled ? "enabled" : "disabled"}`,
        "Security Updated"
      );
    } else {
      showError(
        response.message || "Failed to update MFA setting",
        "MFA Update Failed"
      );
    }
  };

  const onPasswordSubmit = async (formData: PasswordChangeRequest) => {
    try {
      const response = await apiClient.post("/api/user/change-password", {
        currentPassword: formData.currentPassword,
        newPassword: formData.newPassword,
        confirmPassword: formData.confirmPassword,
      });

      if (response.success) {
        showSuccess("Password changed successfully!", "Security Updated");
        setShowPasswordSection(false);
        // Reset the form
        resetPasswordForm();
      } else {
        const errorMessage =
          response.message || "Failed to change password. Please try again.";
        showError(errorMessage, "Password Change Failed");
        setPasswordFieldError("submit", errorMessage);
      }
    } catch (error) {
      console.error("Password change error:", error);
      const errorMessage = "Failed to change password. Please try again.";
      showError(errorMessage, "Password Change Failed");
      setPasswordFieldError("submit", errorMessage);
    }
  };

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card__header">
          <h3>Security Settings</h3>
        </div>

        <div className="card__body">
          {/* Password Change Section */}
          <div className="settings-section">
            <div className="settings-section-header">
              <div>
                <h3>Password</h3>
              </div>
              <button
                type="button"
                className="btn btn--small btn--ghost"
                onClick={() => setShowPasswordSection(!showPasswordSection)}
              >
                {showPasswordSection ? "Cancel" : "Change Password"}
              </button>
            </div>

            {showPasswordSection && (
              <div className="password-change-section">
                {passwordErrors.submit && (
                  <Alert message={passwordErrors.submit} />
                )}
                <form
                  onSubmit={(e) => handlePasswordSubmit(e, onPasswordSubmit)}
                >
                  <FormInput
                    id="currentPassword"
                    name="currentPassword"
                    label="Current Password"
                    placeholder="Enter your current password"
                    value={passwordValues.currentPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.currentPassword}
                    disabled={isPasswordSubmitting}
                    showPasswordToggle
                    showPassword={showCurrentPassword}
                    onTogglePassword={toggleCurrentPassword}
                  />

                  <FormInput
                    id="newPassword"
                    name="newPassword"
                    label="New Password"
                    placeholder="Enter your new password"
                    value={passwordValues.newPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.newPassword}
                    disabled={isPasswordSubmitting}
                    showPasswordToggle
                    showPassword={showNewPassword}
                    onTogglePassword={toggleNewPassword}
                  />

                  <FormInput
                    id="confirmPassword"
                    name="confirmPassword"
                    label="Confirm New Password"
                    placeholder="Confirm your new password"
                    value={passwordValues.confirmPassword}
                    onChange={handlePasswordChange}
                    error={passwordErrors.confirmPassword}
                    disabled={isPasswordSubmitting}
                    showPasswordToggle
                    showPassword={showConfirmNewPassword}
                    onTogglePassword={() =>
                      setShowConfirmNewPassword(!showConfirmNewPassword)
                    }
                  />

                  <div className="settings-actions">
                    <button
                      type="button"
                      className="btn btn--outline"
                      onClick={() => setShowPasswordSection(false)}
                      disabled={isPasswordSubmitting}
                    >
                      Cancel
                    </button>
                    <SubmitButton
                      isLoading={isPasswordSubmitting}
                      loadingText="Changing Password..."
                      defaultText="Change Password"
                    />
                  </div>
                </form>
              </div>
            )}
          </div>

          <hr className="divider" />

          {/* Multi-Factor Authentication */}
          <div className="settings-section">
            <div className="security-item">
              <div className="security-item-header">
                <div className="security-item-info">
                  <div>
                    <h3>2 Factor Auth</h3>
                  </div>
                </div>
                <div className="security-toggle">
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={mfaEnabled}
                      onChange={handleMfaToggle}
                    />
                    <span className="switch"></span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySettings;
