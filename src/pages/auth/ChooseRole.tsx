import React from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "../../hooks/useForm";
import { useToast } from "../../contexts/ToastContext";
import { useAuth } from "../../contexts/AuthContext";
import AuthCard from "../../components/AuthCard";
import Select from "../../components/inputComponents/Select";
import SubmitButton from "../../components/SubmitButton";
import AuthService from "../../services/AuthService";
import type { Role } from "../../types/user";

const ChooseRole: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const { user, refreshUser } = useAuth();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError,
  } = useForm({
    initialValues: {
      userRole: (user?.roles && user.roles.length > 0 ? user.roles[0] : "") as string,
    },
    validate: () => ({} as Record<string, string>),
  });

  const onSubmit = async (formData: { userRole: string }) => {
    try {
      const payload = {
        username: user?.username || "",
        email: user?.email || "",
        userRoles: [formData.userRole as unknown as Role],
      };
      const response = await AuthService.updateProfile(payload);
      if (response.success) {
        // refresh user data from context and navigate home
        console.log("Role updated successfully");
        console.log(response);
        try {
          await refreshUser();
        } catch {
          // ignore refresh errors but continue
        }
        showSuccess("Role saved", "Success");
        navigate("/");
      } else {
        const errorMessage = response.message || "Failed to save role";
        showError(errorMessage, "Error");
        setFieldError("submit", errorMessage);
      }
    } catch (err) {
      const errorMessage = "Failed to save role. Please try again.";
      showError(errorMessage, "Error");
      setFieldError("submit", errorMessage);
    }
  };

  return (
    <AuthCard
      title="Choose Account Role"
      footerText=""
      footerLinkText=""
      footerLinkTo="/"
    >
      {errors.submit && <div className="error-message">{errors.submit}</div>}
      <form className="signup-form" onSubmit={(e) => handleSubmit(e, onSubmit)}>
        <Select
          id="user-role"
          name="userRole"
          label="Choose your role"
          value={values.userRole}
          onChange={handleChange}
          options={[
            { value: "STUDENT", label: "Student" },
            { value: "PROVIDER", label: "Provider" },
          ]}
          placeholder="Select your role"
          disabled={isSubmitting}
          required
          error={errors.userRole}
        />
        <SubmitButton
          isLoading={isSubmitting}
          loadingText="Saving..."
          defaultText="Save"
        />
      </form>
    </AuthCard>
  );
};

export default ChooseRole;