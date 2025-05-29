import React from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { useForm } from "../../hooks/useForm";
import { usePasswordVisibility } from "../../hooks/usePasswordVisibility";
import type { LoginRequest } from "../../types/auth";
import AuthCard from "../../components/AuthCard";
import FormInput from "../../components/FormInput";
import SubmitButton from "../../components/SubmitButton";
import Alert from "../../components/Alert";

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
  const { login } = useAuth();
  const { showPassword, togglePassword } = usePasswordVisibility();

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
      const success = await login(formData);

      if (success) {
        navigate("/components");
      } else {
        setFieldError("submit", "Login failed");
      }
    } catch (error) {
      setFieldError("submit", "Login failed. Please try again.");
    }
  };

  return (
    <AuthCard
      title="Sign In"
      subtitle="Welcome back to SylphScope"
      footerText="Don't have an account?"
      footerLinkText="Sign up here"
      footerLinkTo="/signup"
    >
      {errors.submit && <Alert message={errors.submit} />}

      <form onSubmit={(e) => handleSubmit(e, onSubmit)}>
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
    </AuthCard>
  );
};

export default Signin;
