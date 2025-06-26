import React, { useState, useEffect } from "react";
import { months, generateYears, validateMonth } from "./utils";
import { type MonthPickerProps, type MonthPickerType } from "./types";
import Select from "../Select";

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
  type = "any",
}) => {
  const [internalError, setInternalError] = useState("");

  // Validation - Fixed to destructure the validation result
  useEffect(() => {
    if (validation && onValidationChange) {
      const { isValid, errorMessage } = validateMonth(value, validation);
      setInternalError(errorMessage);
      onValidationChange(isValid, errorMessage);
    }
  }, [value, validation, onValidationChange]);

  // Generate year options based on type
  const years = generateYears(type);

  // Handle month change
  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    onChange({
      ...value,
      month: newMonth,
    });
  };

  // Handle year change
  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;

    // Check if current month is still valid for new year
    let newMonth = value.month;
    const availableMonths = getAvailableMonths(newYear);
    const isCurrentMonthValid = availableMonths.some(
      (m) => m.value === value.month
    );

    if (!isCurrentMonthValid) {
      newMonth = ""; // Reset month if not valid for new year
    }

    onChange({
      year: newYear,
      month: newMonth,
    });
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  // Get filtered months based on current selection and type
  const getAvailableMonths = (selectedYear?: string) => {
    const yearToCheck = selectedYear || value.year;
    if (!yearToCheck) return months;

    const currentYear = new Date().getFullYear();
    const currentMonth = new Date().getMonth() + 1;
    const yearNum = parseInt(yearToCheck);

    if (type === "future") {
      if (yearNum > currentYear) {
        return months; // All months available for future years
      } else if (yearNum === currentYear) {
        return months.filter((month) => parseInt(month.value) >= currentMonth);
      }
    } else if (type === "past") {
      if (yearNum < currentYear) {
        return months; // All months available for past years
      } else if (yearNum === currentYear) {
        return months.filter((month) => parseInt(month.value) <= currentMonth);
      }
    }

    return months; // 'any' type or no restrictions
  };

  const availableMonths = getAvailableMonths();

  // Prepare options for Select components
  const monthOptions = availableMonths.map((month) => ({
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
      <div className={`month-picker ${hasError ? "month-picker--error" : ""}`}>
        <div className="month-picker__field">
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
            size="small"
          />
        </div>

        <div className="month-picker__field">
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
            size="small"
          />
        </div>
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default MonthPicker;
