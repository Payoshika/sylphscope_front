import React, { useState, useEffect } from "react";
import {
  generateYears,
  generateDays,
  validateDate,
  months,
  getDefaultYear,
} from "./utils";
import type { DatePickerProps } from "./types";

const DOBPicker: React.FC<DatePickerProps> = ({
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

  const years = generateYears("dob");
  const defaultYear = getDefaultYear("dob");

  // Validate whenever value changes
  useEffect(() => {
    if (validation) {
      const { isValid, errorMessage } = validateDate(value, validation);
      setInternalError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
    }
  }, [value, validation, onValidationChange]);

  // Set default year if no year is selected
  useEffect(() => {
    if (!value.year && defaultYear) {
      onChange({
        ...value,
        year: defaultYear,
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

  const getSelectClass = () => {
    let baseClass = "select";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

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

export default DOBPicker;
