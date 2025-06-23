import React, { useState, useEffect } from "react";
import {
  alevelGrades,
  getALevelGradeLabel,
  getUCASPoints,
} from "../../../data/alevelGrades";
import {
  alevelSubjects,
  getALevelSubjectLabel,
} from "../../../data/alevelSubjects";

export interface ALevelGradeValue {
  subject: string;
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

    if (required && !gradeValue.subject) {
      return "A-Level subject is required";
    }

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
    const selectedSubject = alevelSubjects.find(
      (subject) => subject.value === value.subject
    );
    return selectedSubject;
  };

  const getSelectedGradeInfo = () => {
    if (!value.grade) return null;
    const selectedGrade = alevelGrades.find(
      (grade) => grade.value === value.grade
    );
    return selectedGrade;
  };

  const selectedSubjectInfo = getSelectedSubjectInfo();
  const selectedGradeInfo = getSelectedGradeInfo();
  const ucasPoints = value.grade ? getUCASPoints(value.grade) : 0;

  // Group subjects by category for better organization
  const subjectsByCategory = alevelSubjects.reduce((acc, subject) => {
    if (subject.value === "") return acc; // Skip the placeholder
    if (!acc[subject.category]) {
      acc[subject.category] = [];
    }
    acc[subject.category].push(subject);
    return acc;
  }, {} as Record<string, typeof alevelSubjects>);

  const categoryLabels = {
    sciences: "Sciences",
    mathematics: "Mathematics",
    humanities: "Humanities",
    languages: "Languages",
    "social-sciences": "Social Sciences",
    arts: "Arts & Creative",
    business: "Business & Economics",
    practical: "Practical & Applied",
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="alevel-grade-container">
        {/* Subject Selection */}
        <div className="alevel-grade__subject">
          <label htmlFor={`${id}-subject`} className="alevel-grade__label">
            A-Level Subject
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
            <option value="">Select A-Level Subject</option>
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
