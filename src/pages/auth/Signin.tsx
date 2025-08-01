import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "../../hooks/useForm";
import { usePasswordVisibility } from "../../hooks/usePasswordVisibility";
import type { LoginRequest } from "../../types/auth";
import AuthCard from "../../components/AuthCard";
import FormInput from "../../components/FormInput";
import SubmitButton from "../../components/SubmitButton";
import GoogleOAuthButton from "../../components/GoogleOAuthButton";
import Alert from "../../components/Alert";
import AuthService from "../../services/AuthService";

const validateSigninForm = (values: LoginRequest): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!values.username.trim()) {
    errors.username = "Username is required";
  }

  if (!values.password) {
    errors.password = "Password is required";
  }

  return errors;
};

const Signin: React.FC = () => {
  const navigate = useNavigate();
  const { user, mfaRequired } = useAuth();
  const { showPassword, togglePassword } = usePasswordVisibility();

  // Redirect if already authenticated
  useEffect(() => {
    if (user) {
      navigate("/components");
    } else if (mfaRequired) {
      navigate("/mfa-verification");
    }
  }, [user, mfaRequired, navigate]);

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
      password: "",
    } as LoginRequest,
    validate: validateSigninForm,
  });

  const onSubmit = async (formData: LoginRequest) => {
    try {
      const response = await AuthService.login(formData);

      if (response.success) {
        // Check session status after login
        const validationResult = await AuthService.validateSession();

        if (validationResult === true) {
          // Fully authenticated - redirect to main app
          if (response.data && response.data.roles && response.data.roles.length > 0) {
            const role = response.data.roles[0];
            if (role === "ROLE_PROVIDER") {
              navigate("/grant-management");
              window.location.replace("/grant-management");
            } else if (role === "ROLE_STUDENT") {
              window.location.replace("/student-dashboard");
            }
          }
        } else if (validationResult === "mfa_required") {
          // MFA required - redirect to verification
          navigate("/mfa-verification");
        } else {
          // Something went wrong
          setFieldError("submit", "Login failed. Please try again.");
        }
      } else {
        const errorMessage = response.message || "Login failed";
        setFieldError("submit", errorMessage);
      }
    } catch (error) {
      console.error("Login error:", error);
      setFieldError("submit", "Login failed. Please try again.");
    }
  };

  return (
    <AuthCard
      title="Sign In"
      footerText="Don't have an account?"
      footerLinkText="Sign up here"
      footerLinkTo="/signup"
    >
      {errors.submit && <Alert message={errors.submit} />}
      <form className="signin-form" onSubmit={(e) => handleSubmit(e, onSubmit)}>
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
          id="password"
          name="password"
          label="Password"
          placeholder="Enter your password"
          value={values.password}
          onChange={handleChange}
          error={errors.password}
          disabled={isSubmitting}
          showPasswordToggle
          showPassword={showPassword}
          onTogglePassword={togglePassword}
        />
        <SubmitButton
          isLoading={isSubmitting}
          loadingText="Signing In..."
          defaultText="Sign In"
        />
      </form>
      <div className="oauth-divider">
        <span>or continue with email</span>
      </div>
      <div className="signup-options">
        <GoogleOAuthButton disabled={isSubmitting} />
        <GoogleOAuthButton disabled={isSubmitting} />
        <GoogleOAuthButton disabled={isSubmitting} />
      </div>
    </AuthCard>
  );
};

export default Signin;
