import React from "react";

interface SelectOption {
  value: string;
  label: string;
}

interface SelectOptGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  id: string;
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  optGroups?: SelectOptGroup[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean | string;
  size?: "small" | "regular" | "large";
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  optGroups = [],
  placeholder = "Choose an option...",
  disabled = false,
  required = false,
  error = false,
  size = "regular",
  className = "",
}) => {
  const getSelectClass = () => {
    let baseClass = "select";
    if (size === "small") baseClass += " select--small";
    if (size === "large") baseClass += " select--large";
    if (error) baseClass += " select--error";
    if (disabled) baseClass += " select--disabled";
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  const hasError = error;
  const errorMessage = typeof error === "string" ? error : "";

  return (
    <div className="form-group">
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}
      <select
        id={id}
        name={name}
        className={getSelectClass()}
        value={value}
        onChange={onChange}
        disabled={disabled}
        required={required}
      >
        <option value="">{placeholder}</option>

        {/* Render optgroups if provided */}
        {optGroups.length > 0
          ? optGroups.map((group) => (
              <optgroup key={group.label} label={group.label}>
                {group.options.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </optgroup>
            ))
          : /* Render flat options if no optgroups */
            options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
      </select>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Select;
export type { SelectOption, SelectOptGroup };
