import React, { useState, useEffect } from "react";
import {
  getUKUniversityGradesByCategory,
  getUKUniversityGradeLabel,
  type UKUniversityGrade,
} from "../../../data/ukuniversityGrades";

export type UniversityGradeCategory = "honours" | "ordinary" | "postgraduate";

export interface UKUniversityGradeValue {
  category: UniversityGradeCategory;
  grade: string;
}

interface UniversityGradeProps {
  id: string;
  name: string;
  label: string;
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
      return getUKUniversityGradesByCategory(value.category);
    }
    return [
      {
        value: "",
        label: "Select Degree Type First",
        category: "honours" as const,
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

  const getSelectClass = () => {
    let baseClass = "select";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  const getSelectedGradeInfo = () => {
    if (!value.grade || !value.category) return null;
    const gradeOptions = getCurrentGradeOptions();
    const selectedGrade = gradeOptions.find(
      (grade) => grade.value === value.grade
    );
    return selectedGrade as UKUniversityGrade;
  };

  const selectedGradeInfo = getSelectedGradeInfo();

  const getCategoryDisplayName = (
    category: UniversityGradeCategory
  ): string => {
    switch (category) {
      case "honours":
        return "Honours Degree";
      case "ordinary":
        return "Ordinary Degree";
      case "postgraduate":
        return "Postgraduate";
      default:
        return "";
    }
  };

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
          <label
            htmlFor={`${id}-category`}
            className="uk-university-grade__label"
          >
            Degree Type
            {required && <span className="required-asterisk">*</span>}
          </label>
          <select
            id={`${id}-category`}
            name={`${name}-category`}
            className={getSelectClass()}
            value={value.category || ""}
            onChange={handleCategoryChange}
            disabled={disabled}
            required={required}
          >
            <option value="">Select Degree Type</option>
            <option value="honours">Honours Degree</option>
            <option value="ordinary">Ordinary Degree</option>
            <option value="postgraduate">Postgraduate</option>
          </select>
        </div>

        {/* Grade Selection */}
        {value.category && (
          <div className="uk-university-grade__grade">
            <label
              htmlFor={`${id}-grade`}
              className="uk-university-grade__label"
            >
              University Classification
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
              {getCurrentGradeOptions().map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
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
