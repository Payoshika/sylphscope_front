import React, { useState, useEffect } from "react";
import { generateYears, validateMonth, months } from "./utils";
import type { MonthPickerProps, MonthPickerType } from "./types";

interface ExtendedMonthPickerProps extends MonthPickerProps {
  type?: MonthPickerType; // 'past', 'future', or 'any'
}

const MonthPicker: React.FC<ExtendedMonthPickerProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  validation,
  onValidationChange,
  type = "any", // Changed default from 'any' to allow all dates
}) => {
  const [internalError, setInternalError] = useState("");

  // Generate years based on type
  const getYearsForType = () => {
    switch (type) {
      case "past":
        return generateYears("past");
      case "future":
        return generateYears("future");
      case "any":
      default:
        return generateYears("any");
    }
  };

  const years = getYearsForType();

  // Add default validation based on type (but don't force it)
  const enhancedValidation = {
    ...validation,
    ...(type === "future" &&
      !validation?.disablePastMonths && { disablePastMonths: true }),
    ...(type === "past" &&
      !validation?.disableFutureMonths && { disableFutureMonths: true }),
  };

  // Validate whenever value changes
  useEffect(() => {
    if (enhancedValidation) {
      const { isValid, errorMessage } = validateMonth(
        value,
        enhancedValidation
      );
      setInternalError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
    }
  }, [value, enhancedValidation, onValidationChange]);

  // Set default year based on type
  useEffect(() => {
    if (!value.year) {
      const currentYear = new Date().getFullYear();
      let defaultYear = currentYear.toString();

      switch (type) {
        case "future":
          defaultYear = currentYear.toString();
          break;
        case "past":
          defaultYear = (currentYear - 1).toString();
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

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      month: e.target.value,
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    // Reset month if it becomes invalid for the new year
    const newYear = e.target.value;
    let newMonth = value.month;

    // If switching to current year with future type, ensure month is not in the past
    if (type === "future" && newYear === new Date().getFullYear().toString()) {
      const currentMonth = new Date().getMonth() + 1;
      if (value.month && parseInt(value.month) < currentMonth) {
        newMonth = "";
      }
    }

    onChange({
      ...value,
      year: newYear,
      month: newMonth,
    });
  };

  const getSelectClass = () => {
    let baseClass = "select";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  // Get filtered months based on current selection and type
  const getAvailableMonths = () => {
    if (!value.year) return months;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const selectedYear = parseInt(value.year);

    if (type === "future") {
      if (selectedYear > currentYear) {
        return months; // All months available for future years
      } else if (selectedYear === currentYear) {
        return months.filter((month) => parseInt(month.value) >= currentMonth);
      }
    } else if (type === "past") {
      if (selectedYear < currentYear) {
        return months; // All months available for past years
      } else if (selectedYear === currentYear) {
        return months.filter((month) => parseInt(month.value) <= currentMonth);
      }
    }

    return months; // 'any' type or no restrictions
  };

  const availableMonths = getAvailableMonths();

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {validation?.required && <span className="required-asterisk">*</span>}
      </label>
      <div className={`month-picker ${hasError ? "month-picker--error" : ""}`}>
        <div className="month-picker__field">
          <label htmlFor={`${id}-month`} className="month-picker__label">
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
            {availableMonths.map((month) => (
              <option key={month.value} value={month.value}>
                {month.label}
              </option>
            ))}
          </select>
        </div>

        <div className="month-picker__field">
          <label htmlFor={`${id}-year`} className="month-picker__label">
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

export default MonthPicker;
