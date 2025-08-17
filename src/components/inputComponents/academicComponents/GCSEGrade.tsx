import React, { useState, useEffect } from "react";
import { gcseGrades } from "../../../data/gcseGrades";
import { gcseSubjects } from "../../../data/gcseSubjects";

import Select, { type SelectOptGroup } from "../Select";

export interface GCSEGradeValue {
  subject: string;
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

    if (required && !gradeValue.subject) {
      return "GCSE subject is required";
    }

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

  // Handle subject change
  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      subject: e.target.value,
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

  // Group subjects by category for better organization
  const subjectsByCategory = gcseSubjects.reduce((acc, subject) => {
    if (subject.value === "") return acc; // Skip the placeholder
    if (!acc[subject.category]) {
      acc[subject.category] = [];
    }
    acc[subject.category].push(subject);
    return acc;
  }, {} as Record<string, typeof gcseSubjects>);

  const categoryLabels = {
    sciences: "Sciences",
    mathematics: "Mathematics",
    humanities: "Humanities",
    languages: "Languages",
    arts: "Arts & Creative",
    practical: "Practical & Technical",
    business: "Business & Economics",
  };

  // Prepare optgroups for subject select
  const subjectOptGroups: SelectOptGroup[] = Object.entries(categoryLabels)
    .map(([category, categoryLabel]) => ({
      label: categoryLabel,
      options: (subjectsByCategory[category] || []).map((subject) => ({
        value: subject.value,
        label: subject.label,
      })),
    }))
    .filter((group) => group.options.length > 0);

  // Prepare options for grade select
  const gradeOptions = gcseGrades.map((grade) => ({
    value: grade.value,
    label: grade.label,
  }));

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="gcse-grade-container">
        {/* Subject Selection */}
        <div className="gcse-grade__subject">
          <Select
            id={`${id}-subject`}
            name={`${name}-subject`}
            label="GCSE Subject"
            value={value.subject}
            onChange={handleSubjectChange}
            optGroups={subjectOptGroups}
            placeholder="Select GCSE Subject"
            disabled={disabled}
            required={required}
            error={hasError}
          />
        </div>

        {/* Grade Selection */}
        <div className="gcse-grade__grade">
          <Select
            id={`${id}-grade`}
            name={`${name}-grade`}
            label="GCSE Grade (9-1 Scale)"
            value={value.grade}
            onChange={handleGradeChange}
            options={gradeOptions}
            placeholder="Select Grade"
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

export default GCSEGrade;
