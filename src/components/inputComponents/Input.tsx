import React from "react";

interface InputProps {
  id: string;
  name: string;
  label: string;
  type?: "text" | "email" | "password";
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  size?: "small" | "regular" | "large";
  disabled?: boolean;
  error?: boolean;
}

const Input: React.FC<InputProps> = ({
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
      />
    </div>
  );
};

export default Input;
