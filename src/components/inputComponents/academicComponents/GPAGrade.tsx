import React, { useState, useEffect } from "react";
import {
  gpaScales,
  getGPAScaleByValue,
  validateGPAValue,
  getGradeQuality,
  getGPAScaleDescription,
  getCommonRegions,
} from "../../../data/gpaGrades";
import Select from "../Select"; // Add Select import

export interface GPAGradeValue {
  gpaValue: string;
  gpaScale: string;
}

interface GPAGradeProps {
  id: string;
  name: string;
  label: string;
  value: GPAGradeValue;
  onChange: (value: GPAGradeValue) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  validate?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const GPAGrade: React.FC<GPAGradeProps> = ({
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
  const validateGrade = (gradeValue: GPAGradeValue): string => {
    if (!validate) return "";

    if (required && (!gradeValue.gpaValue || !gradeValue.gpaScale)) {
      return "Both GPA value and scale are required";
    }

    if (gradeValue.gpaValue && gradeValue.gpaScale) {
      const validation = validateGPAValue(
        gradeValue.gpaValue,
        gradeValue.gpaScale
      );
      if (!validation.isValid) {
        return validation.errorMessage;
      }
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

  // Handle GPA value change
  const handleGPAValueChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    // Allow decimal numbers
    if (inputValue === "" || /^\d*\.?\d*$/.test(inputValue)) {
      onChange({
        ...value,
        gpaValue: inputValue,
      });
    }
  };

  // Handle GPA scale change - Updated to work with Select component
  const handleGPAScaleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newScale = e.target.value;
    onChange({
      ...value,
      gpaScale: newScale,
      gpaValue: "", // Reset GPA value when scale changes
    });
  };

  const getInputClass = () => {
    let baseClass = "input";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  const getGradePercentage = (): string | null => {
    if (value.gpaValue && value.gpaScale) {
      const scale = getGPAScaleByValue(value.gpaScale);
      if (scale) {
        const percentage = (parseFloat(value.gpaValue) / scale.maxValue) * 100;
        return `${percentage.toFixed(1)}%`;
      }
    }
    return null;
  };

  const selectedScale = getGPAScaleByValue(value.gpaScale);
  const gradeQuality = getGradeQuality(value.gpaValue, value.gpaScale);
  const scaleDescription = getGPAScaleDescription(value.gpaScale);
  const commonRegions = getCommonRegions(value.gpaScale);

  // Prepare options for Select component
  const scaleOptions = gpaScales.map((scale) => ({
    value: scale.value,
    label: scale.label,
  }));

  return (
    <div className="form-group">
      {label && (
        <label className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div className="gpa-grade-container">
        {/* GPA Scale Selection - Updated to use Select component */}
        <div className="gpa-grade__scale-selection">
          <Select
            id={`${id}-gpa-scale`}
            name={`${name}-gpa-scale`}
            label="GPA Scale"
            value={value.gpaScale}
            onChange={handleGPAScaleChange}
            options={scaleOptions}
            placeholder="Select GPA Scale"
            disabled={disabled}
            required={required}
            error={hasError}
          />

          {/* Display scale description */}
          {scaleDescription && (
            <div className="gpa-scale-description">
              {scaleDescription}
              {commonRegions.length > 0 && (
                <span className="common-regions">
                  {" "}
                  • Common in: {commonRegions.join(", ")}
                </span>
              )}
            </div>
          )}
        </div>

        {/* GPA Value Input */}
        {value.gpaScale && (
          <div className="gpa-grade__value-input">
            <label htmlFor={`${id}-gpa-value`} className="gpa-grade__label">
              GPA Value {selectedScale && `(Max: ${selectedScale.maxValue})`}
              {required && <span className="required-asterisk">*</span>}
            </label>
            <input
              type="text"
              id={`${id}-gpa-value`}
              name={`${name}-gpa-value`}
              className={getInputClass()}
              placeholder={`Enter GPA (0 - ${selectedScale?.maxValue || ""})`}
              value={value.gpaValue}
              onChange={handleGPAValueChange}
              disabled={disabled}
              required={required}
            />

            {/* Display additional GPA information */}
            {value.gpaValue && selectedScale && (
              <div className="gpa-grade__info">
                <div className="grade-system-info">
                  <span className="grade-percentage">
                    Percentage: {getGradePercentage()}
                  </span>
                  {gradeQuality && (
                    <span className="grade-quality">
                      {" "}
                      • Quality: {gradeQuality}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default GPAGrade;
