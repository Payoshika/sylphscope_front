import React, { useEffect, useState } from "react";
import { months, generateYears, generateDays, validateDate } from "./utils";
import { type DateValue, type DateValidation } from "./types";
import Select from "../Select";

interface DOBPickerProps {
  id: string;
  name: string;
  label: string;
  value: DateValue;
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

  // Generate years (past years for DOB)
  const currentYear = new Date().getFullYear();
  const years = generateYears(currentYear - 100, currentYear);
  const defaultYear = currentYear - 20; // Default to 20 years ago

  // Validate whenever value changes
  useEffect(() => {
    if (validation) {
      const { isValid, errorMessage } = validateDate(value, validation);
      setInternalError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
    }
  }, [value, validation, onValidationChange]);

  // Set default year
  useEffect(() => {
    if (!value.year) {
      onChange({
        ...value,
        year: defaultYear.toString(),
      });
    }
  }, [value, onChange, defaultYear]);

  const days = generateDays(value.month, value.year);

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      day: e.target.value,
    });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    const newDays = generateDays(newMonth, value.year);
    const newDay = parseInt(value.day) > newDays.length ? "" : value.day;

    onChange({
      ...value,
      month: newMonth,
      day: newDay,
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    const newDays = generateDays(value.month, newYear);
    const newDay = parseInt(value.day) > newDays.length ? "" : value.day;

    onChange({
      ...value,
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
            value={value.day}
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
            value={value.month}
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
            value={value.year}
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
