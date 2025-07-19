import React from "react";
import { useAuth } from "../../contexts/AuthContext";
import { useToast } from "../../contexts/ToastContext";
import { useForm } from "../../hooks/useForm";
import FormInput from "../../components/FormInput";
import SubmitButton from "../../components/SubmitButton";
import Alert from "../../components/Alert";
import type { ProfileUpdateRequest } from "../../types/user";
import AuthService from "../../services/AuthService";

const validateProfileForm = (
  values: ProfileUpdateRequest
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.username.trim()) {
    errors.username = "Username is required";
  } else if (values.username.length < 3) {
    errors.username = "Username must be at least 3 characters";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email is invalid";
  }
  return errors;
};

const ProfileSettings: React.FC = () => {
  const { user, refreshUser } = useAuth();
  const { showSuccess, showError } = useToast();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError,
  } = useForm({
    initialValues: {
      username: user?.username || "",
      email: user?.email || "",
    } as ProfileUpdateRequest,
    validate: validateProfileForm,
  });

  const onSubmitProfile = async (formData: ProfileUpdateRequest) => {
    try {
      const response = await AuthService.updateProfile(formData);
      if (response.success) {
        showSuccess("Profile updated successfully!", "Success");
        // Refresh user context to get updated data
        await refreshUser();
      } else {
        const errorMessage =
          response.message || "Failed to update profile. Please try again.";
        showError(errorMessage, "Update Failed");
        setFieldError("submit", errorMessage);
      }
    } catch (error) {
      console.error("Profile update error:", error);
      const errorMessage = "Failed to update profile. Please try again.";
      showError(errorMessage, "Update Failed");
      setFieldError("submit", errorMessage);
    }
  };

  if (!user) {
    return (
      <div className="grid">
        <div className="profile-container">
          <div className="card">
            <div className="card__body">
              <p className="text-center">No user data available</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="tab-content">
      <div className="card">
        <div className="card__body">
          {errors.submit && <Alert message={errors.submit} />}
          <form onSubmit={(e) => handleSubmit(e, onSubmitProfile)}>
            <div className="settings-section">
              <h3>Basic Information</h3>
              <FormInput
                id="username"
                name="username"
                type="text"
                label="Username"
                placeholder="Enter your username"
                value={values.username}
                onChange={handleChange}
                error={errors.username}
                disabled={isSubmitting}
              />

              <FormInput
                id="email"
                name="email"
                type="email"
                label="Email Address"
                placeholder="Enter your email"
                value={values.email}
                onChange={handleChange}
                error={errors.email}
                disabled={isSubmitting}
              />

              {/* User Role Display (Read-only) */}
              <div className="form-group">
                <label>Account Type</label>
                <div className="user-roles">
                  {user.roles && user.roles.length > 0 ? (
                    user.roles.map((role, index) => (
                      <span key={index} className="badge">
                        {role.replace("ROLE_", "")}
                      </span>
                    ))
                  ) : (
                    <span className="badge badge--outline">Standard User</span>
                  )}
                </div>
              </div>
            </div>
            <SubmitButton
              isLoading={isSubmitting}
              loadingText="Saving Changes..."
              defaultText="Save Profile"
            />
          </form>
        </div>
      </div>
    </div>
  );
};

export default ProfileSettings;
