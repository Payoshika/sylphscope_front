import React, { useState, useEffect } from "react";
import {
  degreeCategories,
  degreeLevels,
  getDegreeCategoryLabel,
  getDegreeLevelLabel,
} from "../../../data/degreecategories";
import TextInput from "../TextInput";
import Select, { type SelectOptGroup } from "../Select";

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

  // Prepare optgroups for level select
  const levelOptGroups: SelectOptGroup[] = Object.entries(levelTypeLabels)
    .map(([type, typeLabel]) => ({
      label: typeLabel,
      options: levelsByType[type as keyof typeof levelsByType].map((level) => ({
        value: level.value,
        label: level.label,
      })),
    }))
    .filter((group) => group.options.length > 0);

  // Prepare options for category select
  const categoryOptions = degreeCategories.map((category) => ({
    value: category.value,
    label: category.label,
  }));

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="university-major-container">
        {/* Degree Name Input */}
        <div className="university-major__degree">
          <TextInput
            id={`${id}-degree`}
            name={`${name}-degree`}
            label="Degree Name"
            placeholder="e.g., Computer Science, History, Business Administration"
            value={value.degreeName}
            onChange={handleDegreeNameChange}
            disabled={disabled}
            required={required}
            error={hasError}
          />
        </div>

        {/* Degree Level Selection */}
        <div className="university-major__level">
          <Select
            id={`${id}-level`}
            name={`${name}-level`}
            label="Degree Level"
            value={value.level}
            onChange={handleLevelChange}
            optGroups={levelOptGroups}
            placeholder="Select Degree Level"
            disabled={disabled}
            required={required}
            error={hasError}
          />
          {selectedLevelInfo && (
            <div className="level-description">
              {selectedLevelInfo.description}
            </div>
          )}
        </div>

        {/* Category Selection */}
        <div className="university-major__category">
          <Select
            id={`${id}-category`}
            name={`${name}-category`}
            label="Degree Category"
            value={value.category}
            onChange={handleCategoryChange}
            options={categoryOptions}
            placeholder="Select Degree Category"
            disabled={disabled}
            required={required}
            error={hasError}
          />
        </div>
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default UniversityMajor;
