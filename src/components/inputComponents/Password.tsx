import React, { useState } from "react";
import { EyeIcon, EyeOffIcon } from "../icons";

interface PasswordProps {
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
  showToggle?: boolean;
}

const Password: React.FC<PasswordProps> = ({
  id,
  name,
  label,
  placeholder = "Enter your password",
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  autoComplete = "current-password",
  showToggle = true,
}) => {
  const [showPassword, setShowPassword] = useState(false);

  const getInputClass = () => {
    let baseClass = "input";
    if (error) baseClass += " input--error";
    return baseClass;
  };

  const togglePassword = () => setShowPassword(!showPassword);

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      {showToggle ? (
        <div className="input-group">
          <input
            type={showPassword ? "text" : "password"}
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
          <button
            type="button"
            className="password-toggle"
            onClick={togglePassword}
            disabled={disabled}
            aria-label={showPassword ? "Hide password" : "Show password"}
          >
            {showPassword ? <EyeIcon /> : <EyeOffIcon />}
          </button>
        </div>
      ) : (
        <input
          type="password"
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
      )}
      {error && typeof error === "string" && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
};

export default Password;
