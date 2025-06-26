import React, { useState, useEffect } from "react";
import { alevelGrades, getUCASPoints } from "../../../data/alevelGrades";
import { alevelSubjects } from "../../../data/alevelSubjects";
import Select, { type SelectOptGroup } from "../Select";

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
  showUCASPoints = false,
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
  const gradeOptions = alevelGrades.map((grade) => ({
    value: grade.value,
    label: grade.label,
  }));

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="alevel-grade-container">
        {/* Subject Selection */}
        <div className="alevel-grade__subject">
          <Select
            id={`${id}-subject`}
            name={`${name}-subject`}
            label="A-Level Subject"
            value={value.subject}
            onChange={handleSubjectChange}
            optGroups={subjectOptGroups}
            placeholder="Select A-Level Subject"
            disabled={disabled}
            required={required}
            error={hasError}
          />
        </div>

        {/* Grade Selection */}
        <div className="alevel-grade__grade">
          <Select
            id={`${id}-grade`}
            name={`${name}-grade`}
            label="A-Level Grade (A*-U)"
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

      {/* Display UCAS Points if enabled and grade is selected */}
      {showUCASPoints && value.grade && (
        <div className="alevel-grade__ucas-points">
          <strong>UCAS Points: {ucasPoints}</strong>
        </div>
      )}

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default ALevelGrade;
