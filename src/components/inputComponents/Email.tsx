import React, { useState, useEffect } from "react";

interface EmailProps {
  id: string;
  name: string;
  label: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  autoComplete?: string;
  // Validation props
  validate?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const Email: React.FC<EmailProps> = ({
  id,
  name,
  label,
  placeholder = "Enter your email address",
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  autoComplete = "email",
  validate = true,
  onValidationChange,
}) => {
  const [internalError, setInternalError] = useState("");

  // Email validation regex
  const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

  // Validation function
  const validateEmail = (email: string) => {
    if (!validate) return { isValid: true, errorMessage: "" };

    // Required validation
    if (required && !email.trim()) {
      return { isValid: false, errorMessage: "Email address is required" };
    }

    // If not required and empty, it's valid
    if (!required && !email.trim()) {
      return { isValid: true, errorMessage: "" };
    }

    // Email format validation
    if (!emailRegex.test(email)) {
      return {
        isValid: false,
        errorMessage: "Please enter a valid email address",
      };
    }

    // Additional validations
    if (email.length > 254) {
      return { isValid: false, errorMessage: "Email address is too long" };
    }

    // Check for common typos
    const commonDomains = [
      "gmail.com",
      "yahoo.com",
      "hotmail.com",
      "outlook.com",
    ];
    const domain = email.split("@")[1]?.toLowerCase();

    // You could add domain suggestions here if needed
    // This is just a basic check
    if (domain && domain.includes("..")) {
      return {
        isValid: false,
        errorMessage: "Email address contains invalid characters",
      };
    }

    return { isValid: true, errorMessage: "" };
  };

  // Validate on value change
  useEffect(() => {
    if (value.length === 0) {
      setInternalError("");
      onValidationChange?.(true, "");
      return;
    }
    if (validate && value !== undefined) {
      const { isValid, errorMessage } = validateEmail(value);
      setInternalError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
    }
  }, [value, validate, required]);

  const getInputClass = () => {
    let baseClass = "input";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <input
        type="email"
        id={id}
        name={name}
        className={getInputClass()}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
        autoComplete={autoComplete}
      />
      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Email;
