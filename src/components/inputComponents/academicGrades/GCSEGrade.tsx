import React, { useState, useEffect } from "react";
import { gcseGrades, getGCSEGradeLabel } from "../../../data/gcseGrades";

export interface GCSEGradeValue {
  grade: string;
}

interface GCSEGradeProps {
  id: string;
  name: string;
  label: string;
  value: GCSEGradeValue;
  onChange: (value: GCSEGradeValue) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  validate?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const GCSEGrade: React.FC<GCSEGradeProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  validate = true,
  onValidationChange,
}) => {
  const [internalError, setInternalError] = useState("");

  // Validation
  const validateGrade = (gradeValue: GCSEGradeValue): string => {
    if (!validate) return "";

    if (required && !gradeValue.grade) {
      return "GCSE grade is required";
    }

    return "";
  };

  // Update validation when value changes
  useEffect(() => {
    if (validate) {
      const errorMessage = validateGrade(value);
      setInternalError(errorMessage);
      onValidationChange?.(errorMessage === "", errorMessage);
    }
  }, [value, validate, required, onValidationChange]);

  // Handle grade change
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      grade: e.target.value,
    });
  };

  const getSelectClass = () => {
    let baseClass = "select";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  const getSelectedGradeInfo = () => {
    if (!value.grade) return null;
    const selectedGrade = gcseGrades.find(
      (grade) => grade.value === value.grade
    );
    return selectedGrade;
  };

  const selectedGradeInfo = getSelectedGradeInfo();

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="gcse-grade-container">
        {/* Grade Selection */}
        <div className="gcse-grade__grade">
          <label htmlFor={`${id}-grade`} className="gcse-grade__label">
            GCSE Grade (9-1 Scale)
            {required && <span className="required-asterisk">*</span>}
          </label>
          <select
            id={`${id}-grade`}
            name={`${name}-grade`}
            className={getSelectClass()}
            value={value.grade}
            onChange={handleGradeChange}
            disabled={disabled}
            required={required}
          >
            {gcseGrades.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default GCSEGrade;
