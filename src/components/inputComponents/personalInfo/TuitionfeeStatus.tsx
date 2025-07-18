import React, { useState, useEffect } from "react";
import Radio from "../Radio";

export type TuitionfeeStatusValue = "uk" | "eu" | "international" | "";

export interface TuitionfeeStatusOption {
  value: TuitionfeeStatusValue;
  label: string;
  description: string;
}

interface TuitionfeeStatusProps {
  id: string;
  name: string;
  label: string;
  value: TuitionfeeStatusValue;
  onChange: (value: TuitionfeeStatusValue) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  showDescriptions?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const tuitionfeeStatusOptions: TuitionfeeStatusOption[] = [
  {
    value: "uk",
    label: "UK Student",
    description:
      "UK citizens and those with settled status (eligible for home fee rates)",
  },
  {
    value: "eu",
    label: "EU Student",
    description:
      "EU/EEA citizens (fee status may vary depending on residency and course start date)",
  },
  {
    value: "international",
    label: "International Student",
    description:
      "Students from outside the UK/EU (subject to international fee rates)",
  },
];

const TuitionfeeStatus: React.FC<TuitionfeeStatusProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  showDescriptions = true,
  onValidationChange,
}) => {
  const [internalError, setInternalError] = useState("");

  // Validation
  useEffect(() => {
    let isValid = true;
    let errorMessage = "";

    if (required && !value) {
      isValid = false;
      errorMessage = "Tuition fee status is required";
    }

    setInternalError(errorMessage);
    onValidationChange?.(isValid, errorMessage);
  }, [value, required, onValidationChange]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value as TuitionfeeStatusValue);
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="radio-group">
        {tuitionfeeStatusOptions.map((option) => (
          <Radio
            key={option.value}
            id={`${id}-${option.value}`}
            name={name}
            value={option.value}
            label={option.label}
            description={showDescriptions ? option.description : undefined}
            checked={value === option.value}
            onChange={handleChange}
            disabled={disabled}
            variant="default"
          />
        ))}
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default TuitionfeeStatus;

// Helper functions for external use
export const getTuitionfeeStatusLabel = (
  value: TuitionfeeStatusValue
): string => {
  const option = tuitionfeeStatusOptions.find((opt) => opt.value === value);
  return option ? option.label : "";
};

export const getTuitionfeeStatusDescription = (
  value: TuitionfeeStatusValue
): string => {
  const option = tuitionfeeStatusOptions.find((opt) => opt.value === value);
  return option ? option.description : "";
};

export const getTuitionfeeStatusByValue = (
  value: TuitionfeeStatusValue
): TuitionfeeStatusOption | undefined => {
  return tuitionfeeStatusOptions.find((opt) => opt.value === value);
};

export { tuitionfeeStatusOptions };
