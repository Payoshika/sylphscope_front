import React, { useEffect, useState } from "react";
import { months, generateYears, generateDays, validateDate } from "./utils";
import { type DateValue, type DateValidation } from "./types";
import Select from "../Select";

interface DOBPickerProps {
  id: string;
  name: string;
  label: string;
  value: DateValue | null; // allow null value
  onChange: (value: DateValue) => void;
  disabled?: boolean;
  error?: boolean | string;
  validation?: DateValidation;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const DOBPicker: React.FC<DOBPickerProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  validation,
  onValidationChange,
}) => {
  const [internalError, setInternalError] = useState("");

  // Use a safe value object so rest of logic doesn't need to check for null
  const safeValue: DateValue = value ?? { day: "", month: "", year: "" };

  // Generate years (past years for DOB)
  const currentYear = new Date().getFullYear();
  const years = generateYears("dob");
  const defaultYear = currentYear - 20; // Default to 20 years ago

  // Validate whenever value changes
  useEffect(() => {
    if (validation) {
      const { isValid, errorMessage } = validateDate(safeValue, validation);
      setInternalError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
    }
    // only depend on value/null, validation and callback
  }, [value, validation, onValidationChange]);

  // Set default year if missing (if parent provided null or empty)
  useEffect(() => {
    if (!safeValue.year) {
      onChange({
        ...safeValue,
        year: defaultYear.toString(),
      });
    }
    // depend on value so this runs when parent first gives null or empty
  }, [value, onChange, defaultYear]);

  const days = generateDays(safeValue.month, safeValue.year);

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...safeValue,
      day: e.target.value,
    });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    const newDays = generateDays(newMonth, safeValue.year);
    const newDay = parseInt(safeValue.day) > newDays.length ? "" : safeValue.day;

    onChange({
      ...safeValue,
      month: newMonth,
      day: newDay,
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    const newDays = generateDays(safeValue.month, newYear);
    const newDay = parseInt(safeValue.day) > newDays.length ? "" : safeValue.day;

    onChange({
      ...safeValue,
      year: newYear,
      day: newDay,
    });
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  // Prepare options
  const dayOptions = days.map((day) => ({
    value: day.value,
    label: day.label,
  }));

  const monthOptions = months.map((month) => ({
    value: month.value,
    label: month.label,
  }));

  const yearOptions = years.map((year) => ({
    value: year.toString(),
    label: year.toString(),
  }));

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {validation?.required && <span className="required-asterisk">*</span>}
      </label>
      <div className={`date-picker ${hasError ? "date-picker--error" : ""}`}>
        <div className="date-picker__field">
          <Select
            id={`${id}-day`}
            name={`${name}-day`}
            label="Day"
            value={safeValue.day}
            onChange={handleDayChange}
            options={dayOptions}
            placeholder="Day"
            disabled={disabled}
            error={hasError}
          />
        </div>

        <div className="date-picker__field">
          <Select
            id={`${id}-month`}
            name={`${name}-month`}
            label="Month"
            value={safeValue.month}
            onChange={handleMonthChange}
            options={monthOptions}
            placeholder="Month"
            disabled={disabled}
            error={hasError}
          />
        </div>

        <div className="date-picker__field">
          <Select
            id={`${id}-year`}
            name={`${name}-year`}
            label="Year"
            value={safeValue.year}
            onChange={handleYearChange}
            options={yearOptions}
            placeholder="Year"
            disabled={disabled}
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

export default DOBPicker;
