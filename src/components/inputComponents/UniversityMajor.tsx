import React, { useState, useEffect } from "react";
import {
  degreeCategories,
  degreeLevels,
  getDegreeCategoryLabel,
  getDegreeLevelLabel,
} from "../../data/degreecategories";

export interface UniversityMajorValue {
  degreeName: string;
  level: string;
  category: string;
}

interface UniversityMajorProps {
  id: string;
  name: string;
  label: string;
  value: UniversityMajorValue;
  onChange: (value: UniversityMajorValue) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  validate?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const UniversityMajor: React.FC<UniversityMajorProps> = ({
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
  const validateMajor = (majorValue: UniversityMajorValue): string => {
    if (!validate) return "";

    if (required && !majorValue.degreeName.trim()) {
      return "Degree name is required";
    }

    if (required && !majorValue.level) {
      return "Degree level is required";
    }

    if (required && !majorValue.category) {
      return "Degree category is required";
    }

    return "";
  };

  // Update validation when value changes
  useEffect(() => {
    if (validate) {
      const errorMessage = validateMajor(value);
      setInternalError(errorMessage);
      onValidationChange?.(errorMessage === "", errorMessage);
    }
  }, [value, validate, required, onValidationChange]);

  // Handle degree name change
  const handleDegreeNameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange({
      ...value,
      degreeName: e.target.value,
    });
  };

  // Handle level change
  const handleLevelChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      level: e.target.value,
    });
  };

  // Handle category change
  const handleCategoryChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      category: e.target.value,
    });
  };

  const getInputClass = () => {
    let baseClass = "input";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const getSelectClass = () => {
    let baseClass = "select";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  const getSelectedLevelInfo = () => {
    if (!value.level) return null;
    const selectedLevel = degreeLevels.find(
      (level) => level.value === value.level
    );
    return selectedLevel;
  };

  const getSelectedCategoryInfo = () => {
    if (!value.category) return null;
    const selectedCategory = degreeCategories.find(
      (category) => category.value === value.category
    );
    return selectedCategory;
  };

  const selectedLevelInfo = getSelectedLevelInfo();
  const selectedCategoryInfo = getSelectedCategoryInfo();

  // Group degree levels by type for better organization
  const levelsByType = {
    undergraduate: degreeLevels.filter((level) =>
      ["certificate", "diploma", "associate", "bachelor"].includes(level.value)
    ),
    graduate: degreeLevels.filter((level) =>
      ["graduate-certificate", "graduate-diploma", "master"].includes(
        level.value
      )
    ),
    doctoral: degreeLevels.filter((level) =>
      ["doctorate", "professional-doctorate"].includes(level.value)
    ),
    professional: degreeLevels.filter(
      (level) => level.value === "professional"
    ),
  };

  const levelTypeLabels = {
    undergraduate: "Undergraduate",
    graduate: "Graduate/Postgraduate",
    doctoral: "Doctoral",
    professional: "Professional",
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="university-major-container">
        {/* Degree Name Input */}
        <div className="university-major__degree">
          <label htmlFor={`${id}-degree`} className="university-major__label">
            Degree Name
            {required && <span className="required-asterisk">*</span>}
          </label>
          <input
            type="text"
            id={`${id}-degree`}
            name={`${name}-degree`}
            className={getInputClass()}
            placeholder="e.g., Computer Science, History, Business Administration"
            value={value.degreeName}
            onChange={handleDegreeNameChange}
            disabled={disabled}
            required={required}
          />
        </div>

        {/* Degree Level Selection */}
        <div className="university-major__level">
          <label htmlFor={`${id}-level`} className="university-major__label">
            Degree Level
            {required && <span className="required-asterisk">*</span>}
          </label>
          <select
            id={`${id}-level`}
            name={`${name}-level`}
            className={getSelectClass()}
            value={value.level}
            onChange={handleLevelChange}
            disabled={disabled}
            required={required}
          >
            <option value="">Select Degree Level</option>
            {Object.entries(levelTypeLabels).map(
              ([type, typeLabel]) =>
                levelsByType[type as keyof typeof levelsByType].length > 0 && (
                  <optgroup key={type} label={typeLabel}>
                    {levelsByType[type as keyof typeof levelsByType].map(
                      (level) => (
                        <option key={level.value} value={level.value}>
                          {level.label}
                        </option>
                      )
                    )}
                  </optgroup>
                )
            )}
          </select>
        </div>

        {/* Category Selection */}
        <div className="university-major__category">
          <label htmlFor={`${id}-category`} className="university-major__label">
            Degree Category
            {required && <span className="required-asterisk">*</span>}
          </label>
          <select
            id={`${id}-category`}
            name={`${name}-category`}
            className={getSelectClass()}
            value={value.category}
            onChange={handleCategoryChange}
            disabled={disabled}
            required={required}
          >
            {degreeCategories.map((option) => (
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

export default UniversityMajor;
