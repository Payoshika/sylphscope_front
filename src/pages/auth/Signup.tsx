import React from "react";
import { useNavigate } from "react-router-dom";
import AuthService from "../../services/AuthService";
import { useForm } from "../../hooks/useForm";
import { usePasswordVisibility } from "../../hooks/usePasswordVisibility";
import { useToast } from "../../contexts/ToastContext";
import type { RegisterRequest } from "../../types/auth";
import AuthCard from "../../components/AuthCard";
import FormInput from "../../components/FormInput";
import Select from "../../components/inputComponents/Select";

import SubmitButton from "../../components/SubmitButton";
import GoogleOAuthButton from "../../components/GoogleOAuthButton";
import Alert from "../../components/Alert";

const validateSignupForm = (
  values: RegisterRequest
): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.username.trim()) {
    errors.username = "Username is required";
  }

  if (!values.email.trim()) {
    errors.email = "Email is required";
  } else if (!/\S+@\S+\.\S+/.test(values.email)) {
    errors.email = "Email is invalid";
  }

  if (!values.password) {
    errors.password = "Password is required";
  } else if (values.password.length < 6) {
    errors.password = "Password must be at least 6 characters";
  }

  if (!values.confirmPassword) {
    errors.confirmPassword = "Password confirmation is required";
  } else if (values.password !== values.confirmPassword) {
    errors.confirmPassword = "Passwords do not match";
  }

  return errors;
};

const Signup: React.FC = () => {
  const navigate = useNavigate();
  const { showSuccess, showError } = useToast();
  const {
    showPassword,
    showConfirmPassword,
    togglePassword,
    toggleConfirmPassword,
  } = usePasswordVisibility();

  const {
    values,
    errors,
    isSubmitting,
    handleChange,
    handleSubmit,
    setFieldError,
  } = useForm({
    initialValues: {
      username: "",
      email: "",
      password: "",
      confirmPassword: "",
      userRole: "",
    } as RegisterRequest,
    validate: validateSignupForm,
  });

  const onSubmit = async (formData: RegisterRequest) => {
    try {
      const response = await AuthService.register(formData);
      if (response.success) {
        showSuccess(
          "Your account has been created successfully!",
          "Welcome to Figorous"
        );
        navigate("/signin");
      } else {
        const errorMessage = response.message || "Registration failed";
        showError(errorMessage, "Registration Failed");
        setFieldError("submit", errorMessage);
      }
    } catch (error) {
      const errorMessage = "Registration failed. Please try again.";
      showError(errorMessage, "Registration Failed");
      setFieldError("submit", errorMessage);
    }
  };

  return (
    <AuthCard
      title="Create Account"
      footerText="Already have an account?"
      footerLinkText="Sign in here"
      footerLinkTo="/signin"
    >
      {errors.submit && <Alert message={errors.submit} />}
      <form className="signup-form" onSubmit={(e) => handleSubmit(e, onSubmit)}>
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

        <FormInput
          id="password"
          name="password"
          label="Password"
          placeholder="Create a password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isSubmitting}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={togglePassword}
        />

        <FormInput
          id="confirmPassword"
          name="confirmPassword"
          label="Confirm Password"
          placeholder="Confirm your password"
          value={values.confirmPassword}
          onChange={handleChange}
          error={errors.confirmPassword}
          disabled={isSubmitting}
          showPasswordToggle
          showPassword={showConfirmPassword}
          onTogglePassword={toggleConfirmPassword}
        />
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
        {errors.userRole && <div className="error-message">{errors.userRole}</div>}
        <SubmitButton
          isLoading={isSubmitting}
          loadingText="Creating Account..."
          defaultText="Create Account"
        />
      </form>
      <div className="oauth-divider">
        <span>Or sign up with</span>
      </div>
      <div className="signup-options">
        <GoogleOAuthButton disabled={isSubmitting} />
      </div>
    </AuthCard>
  );
};

export default Signup;
