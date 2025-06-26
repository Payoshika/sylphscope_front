import React, { useState, useEffect } from "react";
import Checkmark from "../icons/Checkmark";

export type YesNoChoiceValue = "yes" | "no" | "";

interface YesNoChoiceProps {
  id: string;
  name: string;
  question: string;
  value: YesNoChoiceValue;
  onChange: (value: YesNoChoiceValue) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  yesLabel?: string;
  noLabel?: string;
  size?: "small" | "regular" | "large";
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
  className?: string;
}

const YesNoChoice: React.FC<YesNoChoiceProps> = ({
  id,
  name,
  question,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  yesLabel = "Yes",
  noLabel = "No",
  size = "regular",
  onValidationChange,
  className = "",
}) => {
  const [internalError, setInternalError] = useState("");

  // Validation
  useEffect(() => {
    let isValid = true;
    let errorMessage = "";

    if (required && !value) {
      isValid = false;
      errorMessage = `This question is required`;
    }

    setInternalError(errorMessage);
    onValidationChange?.(isValid, errorMessage);
  }, [value, required, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value as YesNoChoiceValue);
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  const getContainerClass = () => {
    let baseClass = "yes-no-choice";
    if (size === "small") baseClass += " yes-no-choice--small";
    if (size === "large") baseClass += " yes-no-choice--large";
    if (hasError) baseClass += " yes-no-choice--error";
    if (disabled) baseClass += " yes-no-choice--disabled";
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  // Get icon size based on component size
  const getCheckmarkSize = () => {
    switch (size) {
      case "small":
        return 14;
      case "large":
        return 18;
      default:
        return 16;
    }
  };

  return (
    <div className="form-group">
      <label className="form-label yes-no-choice__question">
        {question}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className={getContainerClass()}>
        <div className="yes-no-choice__options">
          {/* Yes Option */}
          <label className="yes-no-choice__option">
            <input
              type="radio"
              id={`${id}-yes`}
              name={name}
              value="yes"
              checked={value === "yes"}
              onChange={handleChange}
              disabled={disabled}
              className="yes-no-choice__input"
            />
            <span className="yes-no-choice__checkbox">
              {value === "yes" && (
                <Checkmark
                  size={getCheckmarkSize()}
                  color="currentColor"
                  strokeWidth={2.5}
                  className="yes-no-choice__checkmark-icon"
                />
              )}
            </span>
            <span className="yes-no-choice__label">{yesLabel}</span>
          </label>

          {/* No Option */}
          <label className="yes-no-choice__option">
            <input
              type="radio"
              id={`${id}-no`}
              name={name}
              value="no"
              checked={value === "no"}
              onChange={handleChange}
              disabled={disabled}
              className="yes-no-choice__input"
            />
            <span className="yes-no-choice__checkbox">
              {value === "no" && (
                <Checkmark
                  size={getCheckmarkSize()}
                  color="currentColor"
                  strokeWidth={2.5}
                  className="yes-no-choice__checkmark-icon"
                />
              )}
            </span>
            <span className="yes-no-choice__label">{noLabel}</span>
          </label>
        </div>
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default YesNoChoice;

// Helper functions
export const getYesNoChoiceLabel = (value: YesNoChoiceValue): string => {
  switch (value) {
    case "yes":
      return "Yes";
    case "no":
      return "No";
    default:
      return "";
  }
};

export const isYesChoiceSelected = (value: YesNoChoiceValue): boolean =>
  value === "yes";

export const isNoChoiceSelected = (value: YesNoChoiceValue): boolean =>
  value === "no";

// Factory function for creating YesNoChoice configurations
export const createYesNoChoiceConfig = (config: {
  id: string;
  name: string;
  question: string;
  yesLabel?: string;
  noLabel?: string;
  required?: boolean;
  size?: "small" | "regular" | "large";
}) => ({
  id: config.id,
  name: config.name,
  question: config.question,
  yesLabel: config.yesLabel || "Yes",
  noLabel: config.noLabel || "No",
  required: config.required || false,
  size: config.size || "regular",
});
