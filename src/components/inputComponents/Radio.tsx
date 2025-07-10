import React from "react";
import type { Option } from "../../data/questionEligibilityInfoDto";

interface RadioProps {
  id: string;
  name: string;
  label: string;
  value: string;
  options: Option[];
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  size?: "small" | "regular" | "large";
  variant?: "default" | "card" | "inline";
  error?: boolean;
  className?: string;
}

const Radio: React.FC<RadioProps> = ({
  id,
  name,
  label,
  value,
  options = [],
  onChange,
  disabled = false,
  size = "regular",
  variant = "default",
  error = false,
  className = "",
}) => {
  const getRadioClass = () => {
    let baseClass = "radio-group";
    if (size === "small") baseClass += " radio-group--small";
    if (size === "large") baseClass += " radio-group--large";
    if (variant === "card") baseClass += " radio-group--card";
    if (variant === "inline") baseClass += " radio-group--inline";
    if (error) baseClass += " radio-group--error";
    if (disabled) baseClass += " radio-group--disabled";
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  return (
    <div className={getRadioClass()}>
      <span className="radio-label">{label}</span>
      <div className="radio-options">
        {options.map((opt) => (
          <label key={opt.id} className="radio-option">
            <input
              type="radio"
              id={`${id}-${opt.id}`}
              name={name}
              value={opt.value}
              checked={value === opt.value}
              onChange={onChange}
              disabled={disabled}
            />
            <span className="radiomark"></span>
            <span className="radio-label">{opt.label}</span>
          </label>
        ))}
      </div>
    </div>
  );
};

export default Radio;