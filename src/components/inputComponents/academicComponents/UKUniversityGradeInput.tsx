import React, { useState, useEffect } from "react";
import {
  getUKUniversityGradesByCategory,
} from "../../../data/ukuniversityGrades";
import Select from "../Select";

export type UniversityGradeCategory = "honours" | "ordinary" | "postgraduate";

export interface UKUniversityGradeValue {
  category: UniversityGradeCategory | "";
  grade: string;
}

interface UniversityGradeProps {
  id: string;
  name: string;
  label?: string;
  value: UKUniversityGradeValue;
  onChange: (value: UKUniversityGradeValue) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  validate?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const UKUniversityGradeInput: React.FC<UniversityGradeProps> = ({
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

  // Get current grade options based on category
  const getCurrentGradeOptions = () => {
    if (value.category) {
      return getUKUniversityGradesByCategory(value.category).map((grade) => ({
        value: grade.value,
        label: grade.label,
      }));
    }
    return [
      {
        value: "",
        label: "Select Degree Type First",
      },
    ];
  };

  // Validation
  const validateGrade = (gradeValue: UKUniversityGradeValue): string => {
    if (!validate) return "";

    if (required && !gradeValue.category) {
      return "University degree type is required";
    }

    if (required && !gradeValue.grade) {
      return "University grade is required";
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

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newCategory = e.target.value as UniversityGradeCategory;
    onChange({
      category: newCategory,
      grade: "", // Reset grade when category changes
    });
  };

  // Handle grade change
  const handleGradeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      grade: e.target.value,
    });
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;


  // Category options
  const categoryOptions = [
    { value: "honours", label: "Honours Degree" },
    { value: "ordinary", label: "Ordinary Degree" },
    { value: "postgraduate", label: "Postgraduate" },
  ];

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div className="uk-university-grade-container">
        {/* Degree Type Selection */}
        <div className="uk-university-grade__category">
          <Select
            id={`${id}-category`}
            name={`${name}-category`}
            label="Degree Type"
            value={value.category || ""}
            onChange={handleCategoryChange}
            options={categoryOptions}
            placeholder="Select Degree Type"
            disabled={disabled}
            required={required}
            error={hasError}
          />
        </div>

        {/* Grade Selection */}
        {value.category && (
          <div className="uk-university-grade__grade">
            <Select
              id={`${id}-grade`}
              name={`${name}-grade`}
              label="University Classification"
              value={value.grade}
              onChange={handleGradeChange}
              options={getCurrentGradeOptions()}
              placeholder="Select Grade"
              disabled={disabled}
              required={required}
              error={hasError}
            />
          </div>
        )}
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default UKUniversityGradeInput;
