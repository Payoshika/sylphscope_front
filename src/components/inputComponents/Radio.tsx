import React from "react";

interface RadioProps {
  id: string;
  name: string;
  value: string;
  label: string;
  checked: boolean;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: "small" | "regular" | "large";
  variant?: "default" | "card" | "inline";
  description?: string;
  error?: boolean;
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  value,
  label,
  checked,
  onChange,
  disabled = false,
  size = "regular",
  variant = "default",
  description,
  error = false,
  className = "",
}) => {
  const getRadioClass = () => {
    let baseClass = "radio";
    if (size === "small") baseClass += " radio--small";
    if (size === "large") baseClass += " radio--large";
    if (variant === "card") baseClass += " radio--card";
    if (variant === "inline") baseClass += " radio--inline";
    if (error) baseClass += " radio--error";
    if (disabled) baseClass += " radio--disabled";
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  return (
    <label className={getRadioClass()}>
      <input
        type="radio"
        id={id}
        name={name}
        value={value}
        checked={checked}
        onChange={onChange}
        disabled={disabled}
      />
      <span className="radiomark"></span>
      <div className="radio-content">
        <span className="radio-label">{label}</span>
        {description && (
          <span className="radio-description">{description}</span>
        )}
      </div>
    </label>
  );
};

export default Radio;
