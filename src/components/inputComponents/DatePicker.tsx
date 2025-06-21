import React, { useState, useEffect } from "react";

interface DatePickerProps {
  id: string;
  name: string;
  label: string;
  value: {
    day: string;
    month: string;
    year: string;
  };
  onChange: (value: { day: string; month: string; year: string }) => void;
  disabled?: boolean;
  error?: boolean;
  // Validation props
  validation?: {
    required?: boolean;
    minAge?: number;
    maxAge?: number;
    customValidator?: (date: Date) => string | null;
  };
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const DatePicker: React.FC<DatePickerProps> = ({
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

  // Generate years from 1950 to current year
  const currentYear = new Date().getFullYear();
  const defaultYear = currentYear - 18;
  const years = Array.from(
    { length: currentYear - 1950 + 1 },
    (_, i) => 1950 + i
  ).reverse();

  // Months array
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  // Generate days based on selected month and year
  const getDaysInMonth = (month: string, year: string) => {
    if (!month || !year) return 31;
    const monthNum = parseInt(month);
    const yearNum = parseInt(year);
    return new Date(yearNum, monthNum, 0).getDate();
  };

  // Validation function
  const validateDate = (dateValue: {
    day: string;
    month: string;
    year: string;
  }) => {
    // If not all fields are filled, do not validate (return valid, no error)
    if (!dateValue.day && !dateValue.month) {
      return { isValid: true, errorMessage: "" };
    }
    if (!validation) return { isValid: true, errorMessage: "" };

    // Required validation
    if (
      validation.required &&
      (!dateValue.day || !dateValue.month || !dateValue.year)
    ) {
      return { isValid: false, errorMessage: "Please select a complete date" };
    }

    // If not all fields are filled and not required, it's valid
    if (!dateValue.day || !dateValue.month || !dateValue.year) {
      return { isValid: true, errorMessage: "" };
    }

    // Check if date is valid
    const date = new Date(
      parseInt(dateValue.year),
      parseInt(dateValue.month) - 1,
      parseInt(dateValue.day)
    );

    if (
      date.getFullYear() !== parseInt(dateValue.year) ||
      date.getMonth() !== parseInt(dateValue.month) - 1 ||
      date.getDate() !== parseInt(dateValue.day)
    ) {
      return { isValid: false, errorMessage: "Please select a valid date" };
    }

    // Age validation
    const today = new Date();

    if (validation.minAge) {
      const minDate = new Date(
        today.getFullYear() - validation.minAge,
        today.getMonth(),
        today.getDate()
      );
      if (date > minDate) {
        return {
          isValid: false,
          errorMessage: `You must be at least ${validation.minAge} years old`,
        };
      }
    }

    if (validation.maxAge) {
      const maxDate = new Date(
        today.getFullYear() - validation.maxAge,
        today.getMonth(),
        today.getDate()
      );
      if (date < maxDate) {
        return {
          isValid: false,
          errorMessage: `You cannot be older than ${validation.maxAge} years`,
        };
      }
    }

    // Custom validation
    if (validation.customValidator) {
      const customError = validation.customValidator(date);
      if (customError) {
        return { isValid: false, errorMessage: customError };
      }
    }

    return { isValid: true, errorMessage: "" };
  };

  // Validate whenever value changes
  useEffect(() => {
    if (validation) {
      const { isValid, errorMessage } = validateDate(value);
      setInternalError(errorMessage);
      onValidationChange?.(isValid, errorMessage);
    }
  }, [value, validation]);

  // Set default year if no year is selected
  useEffect(() => {
    if (!value.year) {
      onChange({
        ...value,
        year: defaultYear.toString(),
      });
    }
  }, []);

  const daysInMonth = getDaysInMonth(value.month, value.year);
  const days = Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      value: day.toString().padStart(2, "0"),
      label: day.toString(),
    };
  });

  const handleDayChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    onChange({
      ...value,
      day: e.target.value,
    });
  };

  const handleMonthChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newMonth = e.target.value;
    const newDaysInMonth = getDaysInMonth(newMonth, value.year);
    const newDay = parseInt(value.day) > newDaysInMonth ? "" : value.day;

    onChange({
      ...value,
      month: newMonth,
      day: newDay,
    });
  };

  const handleYearChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newYear = e.target.value;
    const newDaysInMonth = getDaysInMonth(value.month, newYear);
    const newDay = parseInt(value.day) > newDaysInMonth ? "" : value.day;

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

  return (
    <div className="form-group">
      <label className="form-label">{label}</label>
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

      {internalError && <div className="error-message">{internalError}</div>}
    </div>
  );
};

export default DatePicker;
