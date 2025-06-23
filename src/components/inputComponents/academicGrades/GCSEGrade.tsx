import React, { useState, useEffect } from "react";
import { gcseGrades, getGCSEGradeLabel } from "../../../data/gcseGrades";
import { gcseSubjects, getGCSESubjectLabel } from "../../../data/gsceSubjects";

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

  const getSelectClass = () => {
    let baseClass = "select";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  const getSelectedSubjectInfo = () => {
    if (!value.subject) return null;
    const selectedSubject = gcseSubjects.find(
      (subject) => subject.value === value.subject
    );
    return selectedSubject;
  };

  const getSelectedGradeInfo = () => {
    if (!value.grade) return null;
    const selectedGrade = gcseGrades.find(
      (grade) => grade.value === value.grade
    );
    return selectedGrade;
  };

  const selectedSubjectInfo = getSelectedSubjectInfo();
  const selectedGradeInfo = getSelectedGradeInfo();

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
    core: "Core Subjects",
    sciences: "Sciences",
    humanities: "Humanities",
    languages: "Languages",
    arts: "Arts & Creative",
    practical: "Practical & Technical",
    business: "Business & Economics",
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="gcse-grade-container">
        {/* Subject Selection */}
        <div className="gcse-grade__subject">
          <label htmlFor={`${id}-subject`} className="gcse-grade__label">
            GCSE Subject
            {required && <span className="required-asterisk">*</span>}
          </label>
          <select
            id={`${id}-subject`}
            name={`${name}-subject`}
            className={getSelectClass()}
            value={value.subject}
            onChange={handleSubjectChange}
            disabled={disabled}
            required={required}
          >
            <option value="">Select GCSE Subject</option>
            {Object.entries(categoryLabels).map(
              ([category, categoryLabel]) =>
                subjectsByCategory[category] && (
                  <optgroup key={category} label={categoryLabel}>
                    {subjectsByCategory[category].map((subject) => (
                      <option key={subject.value} value={subject.value}>
                        {subject.label}
                      </option>
                    ))}
                  </optgroup>
                )
            )}
          </select>
        </div>

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
