import React, { useState, useEffect } from "react";

export type ToggleValue = "yes" | "no" | "";

interface ToggleProps {
  id: string;
  name: string;
  label: string;
  question?: string;
  value: ToggleValue;
  onChange: (value: ToggleValue) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  yesLabel?: string;
  noLabel?: string;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
  // New props for dynamic customization
  size?: "small" | "regular" | "large";
  showLabelsBelow?: boolean;
  colorScheme?: "default" | "success-danger" | "primary-secondary";
  helpText?: string;
  className?: string;
}

const Toggle: React.FC<ToggleProps> = ({
  id,
  name,
  label,
  question,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  yesLabel = "Yes",
  noLabel = "No",
  onValidationChange,
  size = "regular",
  showLabelsBelow = true,
  colorScheme = "default",
  helpText,
  className = "",
}) => {
  const [internalError, setInternalError] = useState("");

  // Validation
  useEffect(() => {
    let isValid = true;
    let errorMessage = "";

    if (required && !value) {
      isValid = false;
      errorMessage = `${label} is required`;
    }

    setInternalError(errorMessage);
    onValidationChange?.(isValid, errorMessage);
  }, [value, required, label, onValidationChange]);

  const handleToggleChange = () => {
    if (disabled) return;
    const newValue: ToggleValue = value === "yes" ? "no" : "yes";
    onChange(newValue);
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;
  const displayQuestion = question || label;

  const getToggleClass = () => {
    let baseClass = "yes-no-toggle";
    if (size === "small") baseClass += " yes-no-toggle--small";
    if (size === "large") baseClass += " yes-no-toggle--large";
    if (colorScheme === "success-danger")
      baseClass += " yes-no-toggle--success-danger";
    if (colorScheme === "primary-secondary")
      baseClass += " yes-no-toggle--primary-secondary";
    if (hasError) baseClass += " yes-no-toggle--error";
    if (disabled) baseClass += " yes-no-toggle--disabled";
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {displayQuestion}
        {required && <span className="required-asterisk">*</span>}
      </label>

      {helpText && <div className="help-text">{helpText}</div>}

      <div className={getToggleClass()}>
        <div className="yes-no-toggle__track" onClick={handleToggleChange}>
          <div
            className={`yes-no-toggle__slider ${
              value === "yes" ? "yes-no-toggle__slider--yes" : ""
            } ${value === "no" ? "yes-no-toggle__slider--no" : ""} ${
              hasError ? "yes-no-toggle__slider--error" : ""
            } ${disabled ? "yes-no-toggle__slider--disabled" : ""}`}
          >
            {/* Removed the label span - just empty slider */}
          </div>
        </div>

        {showLabelsBelow && (
          <div className="yes-no-toggle__labels">
            <span
              className={`yes-no-toggle__option yes-no-toggle__option--no ${
                value === "no" ? "yes-no-toggle__option--active" : ""
              }`}
            >
              {noLabel}
            </span>
            <span
              className={`yes-no-toggle__option yes-no-toggle__option--yes ${
                value === "yes" ? "yes-no-toggle__option--active" : ""
              }`}
            >
              {yesLabel}
            </span>
          </div>
        )}
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Toggle;

// Helper functions for external use
export const getToggleLabel = (value: ToggleValue): string => {
  switch (value) {
    case "yes":
      return "Yes";
    case "no":
      return "No";
    default:
      return "";
  }
};

export const isYesSelected = (value: ToggleValue): boolean => value === "yes";
export const isNoSelected = (value: ToggleValue): boolean => value === "no";

// Factory function to create Toggle configurations
export const createToggleConfig = (config: {
  id: string;
  name: string;
  label: string;
  yesLabel?: string;
  noLabel?: string;
  question?: string;
  required?: boolean;
  helpText?: string;
  size?: "small" | "regular" | "large";
  colorScheme?: "default" | "success-danger" | "primary-secondary";
}) => ({
  id: config.id,
  name: config.name,
  label: config.label,
  question: config.question || config.label,
  yesLabel: config.yesLabel || "Yes",
  noLabel: config.noLabel || "No",
  required: config.required || false,
  helpText: config.helpText,
  size: config.size || "regular",
  colorScheme: config.colorScheme || "default",
});
