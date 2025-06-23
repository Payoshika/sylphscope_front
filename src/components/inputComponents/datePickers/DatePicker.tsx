import React, { useState, useEffect } from "react";
import {
  generateYears,
  generateDays,
  validateDate,
  months,
  getDefaultYear,
} from "./utils";
import type { DatePickerProps, DatePickerType } from "./types";

interface ExtendedDatePickerProps extends DatePickerProps {
  type?: DatePickerType; // 'dob', 'future', or 'any'
}

const DatePicker: React.FC<ExtendedDatePickerProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  validation,
  onValidationChange,
  type = "any", // Default to 'any' to allow both past and future
}) => {
  const [internalError, setInternalError] = useState("");

  // Generate years based on type
  const getYearsForType = () => {
    switch (type) {
      case "dob":
        return generateYears("dob");
      case "future":
        return generateYears("future");
      case "any":
      default:
        return generateYears("any");
    }
  };

  const years = getYearsForType();

  // Add default validation based on type (but don't force it if user provides their own)
  const enhancedValidation = {
    ...validation,
    ...(type === "future" &&
      !validation?.disablePastDates && { disablePastDates: true }),
    ...(type === "dob" &&
      !validation?.disableFutureDates && { disableFutureDates: true }),
  };

  // Validate whenever value changes
  useEffect(() => {
    if (enhancedValidation) {
      const { isValid, errorMessage } = validateDate(value, enhancedValidation);
      setInternalError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
    }
  }, [value, enhancedValidation, onValidationChange]);

  // Set default year based on type
  useEffect(() => {
    if (!value.year) {
      const currentYear = new Date().getFullYear();
      let defaultYear = "";

      switch (type) {
        case "dob":
          defaultYear = (currentYear - 18).toString();
          break;
        case "future":
          defaultYear = currentYear.toString();
          break;
        case "any":
        default:
          // Don't set a default for 'any' type
          break;
      }

      if (defaultYear) {
        onChange({
          ...value,
          year: defaultYear,
        });
      }
    }
  }, [value, onChange, type]);

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

  const getSelectClass = () => {
    let baseClass = "select";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  // Helper function to get component type description
  const getTypeDescription = () => {
    switch (type) {
      case "dob":
        return "Date of Birth";
      case "future":
        return "Future dates only";
      case "any":
      default:
        return "Any date";
    }
  };

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {validation?.required && <span className="required-asterisk">*</span>}
      </label>
      <div className={`date-picker ${hasError ? "date-picker--error" : ""}`}>
        <div className="date-picker__field">
          <label htmlFor={`${id}-day`} className="date-picker__label">
            Day
          </label>
          <select
            id={`${id}-day`}
            name={`${name}-day`}
            className={getSelectClass()}
            value={value.day}
            onChange={handleDayChange}
            disabled={disabled}
          >
            <option value="">Day</option>
            {days.map((day) => (
              <option key={day.value} value={day.value}>
                {day.label}
              </option>
            ))}
          </select>
        </div>

        <div className="date-picker__field">
          <label htmlFor={`${id}-month`} className="date-picker__label">
            Month
          </label>
          <select
            id={`${id}-month`}
            name={`${name}-month`}
            className={getSelectClass()}
            value={value.month}
            onChange={handleMonthChange}
            disabled={disabled}
          >
            <option value="">Month</option>
            {months.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="date-picker__field">
          <label htmlFor={`${id}-year`} className="date-picker__label">
            Year
          </label>
          <select
            id={`${id}-year`}
            name={`${name}-year`}
            className={getSelectClass()}
            value={value.year}
            onChange={handleYearChange}
            disabled={disabled}
          >
            <option value="">Year</option>
            {years.map((year) => (
              <option key={year} value={year.toString()}>
                {year}
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

export default DatePicker;
