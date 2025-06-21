import React from "react";

interface TextInputProps {
  id: string;
  name: string;
  label: string;
  type?: "text"; // Remove email and password types
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "small" | "regular" | "large";
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  autoComplete?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  id,
  name,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  size = "regular",
  disabled = false,
  error = false,
  required = false,
  autoComplete,
}) => {
  const getInputClass = () => {
    let baseClass = "input";
    if (size === "small") baseClass += " input--small";
    if (size === "large") baseClass += " input--large";
    if (error) baseClass += " input--error";
    return baseClass;
  };

  return (
    <div className="form-group">
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <input
        type={type}
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
      {error && typeof error === "string" && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
};

export default TextInput;
