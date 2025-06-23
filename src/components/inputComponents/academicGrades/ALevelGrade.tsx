import React, { useState, useEffect } from "react";
import {
  alevelGrades,
  getALevelGradeLabel,
  getUCASPoints,
} from "../../../data/alevelGrades";

export interface ALevelGradeValue {
  grade: string;
}

interface ALevelGradeProps {
  id: string;
  name: string;
  label: string;
  value: ALevelGradeValue;
  onChange: (value: ALevelGradeValue) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  validate?: boolean;
  showUCASPoints?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const ALevelGrade: React.FC<ALevelGradeProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  validate = true,
  showUCASPoints = true,
  onValidationChange,
}) => {
  const [internalError, setInternalError] = useState("");

  // Validation
  const validateGrade = (gradeValue: ALevelGradeValue): string => {
    if (!validate) return "";

    if (required && !gradeValue.grade) {
      return "A-Level grade is required";
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
    const selectedGrade = alevelGrades.find(
      (grade) => grade.value === value.grade
    );
    return selectedGrade;
  };

  const selectedGradeInfo = getSelectedGradeInfo();
  const ucasPoints = value.grade ? getUCASPoints(value.grade) : 0;

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="alevel-grade-container">
        {/* Grade Selection */}
        <div className="alevel-grade__grade">
          <label htmlFor={`${id}-grade`} className="alevel-grade__label">
            A-Level Grade (A*-U)
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
            {alevelGrades.map((option) => (
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

export default ALevelGrade;
