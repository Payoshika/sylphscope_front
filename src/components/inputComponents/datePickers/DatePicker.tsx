import React, { useState, useEffect } from "react";
import {
  generateYears,
  generateDays,
  validateDate,
  months,
} from "./utils";
import type { DatePickerProps, DatePickerType } from "./types";
import Select from "../Select";

interface ExtendedDatePickerProps extends DatePickerProps {
  type?: DatePickerType; // 'dob', 'future', or 'any'
}

const DatePicker: React.FC<ExtendedDatePickerProps> = ({
  id,
  name,
  label,
  value = { day: "", month: "", year: "" },
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
          defaultYear = currentYear.toString();
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
          <Select
            id={`${id}-day`}
            name={`${name}-day`}
            value={value.day}
            onChange={handleDayChange}
            options={days.map((day) => ({
              value: day.value,
              label: day.label,
            }))}
            placeholder="Day"
            disabled={disabled}
            error={hasError}
          />
        </div>

        <div className="date-picker__field">
          <Select
            id={`${id}-month`}
            name={`${name}-month`}
            value={value.month}
            onChange={handleMonthChange}
            options={months.map((month) => ({
              value: month.value,
              label: month.label,
            }))}
            placeholder="Month"
            disabled={disabled}
            error={hasError}
          />
        </div>

        <div className="date-picker__field">
          <Select
            id={`${id}-year`}
            name={`${name}-year`}
            value={value.year}
            onChange={handleYearChange}
            options={years.map((year) => ({
              value: year.toString(),
              label: year.toString(),
            }))}
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

export default DatePicker;
