import type { DateValue, MonthValue, DateValidation, MonthValidation } from './types';

export const months = [
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

export const toDateValue = (date: string | { day: string; month: string; year: string } | null): DateValue => {
  if (!date) return { day: "", month: "", year: "" };
  if (typeof date === "object") return date;
  // Handles both "YYYY-MM-DD" and "YYYY-MM-DDTHH:mm:ssZ"
  const [datePart] = date.split("T");
  if (!datePart) return { day: "", month: "", year: "" };
  const [year, month, day] = datePart.split("-");
  return {
    year: year || "",
    month: month || "",
    day: day || "",
  };
};

export const formatDateForBackend = (date: string | { day: string; month: string; year: string } | null): string => {
  if (!date) return "";
  if (typeof date === "string") return date;
  if (date.year && date.month && date.day) {
    return `${date.year}-${date.month.padStart(2, "0")}-${date.day.padStart(2, "0")}`;
  }
  return "";
};

// Generate years for different picker types
export const generateYears = (type: 'dob' | 'future' | 'any' | 'past'): number[] => {
  const currentYear = new Date().getFullYear();
  
  switch (type) {
    case 'dob':
      // DOB: 1900 to current year (current year first)
      return Array.from(
        { length: currentYear - 1900 + 1 },
        (_, i) => 1900 + i
      ).reverse();
    
    case 'future':
      // Future: current year to +50 years (current year first)
      return Array.from(
        { length: 51 },
        (_, i) => currentYear + i
      );
    
    case 'past':
      // Past: 1900 to current year (current year first)
      return Array.from(
        { length: currentYear - 1900 + 1 },
        (_, i) => 1900 + i
      ).reverse();
    
    case 'any':
    default:
      // Any: produce a centered list with current year at the top:
      // currentYear, currentYear+1 ... up to currentYear+50, then currentYear-1 down to 1900
      const minYear = 1900;
      const maxYear = currentYear + 50;
      const ordered: number[] = [];
      for (let y = currentYear; y <= maxYear; y++) ordered.push(y);
      for (let y = currentYear - 1; y >= minYear; y--) ordered.push(y);
      return ordered;
  }
};

// Get days in month
export const getDaysInMonth = (month: string, year: string): number => {
  if (!month || !year) return 31;
  const monthNum = parseInt(month);
  const yearNum = parseInt(year);
  return new Date(yearNum, monthNum, 0).getDate();
};

// Generate days array
export const generateDays = (month: string, year: string) => {
  const daysInMonth = getDaysInMonth(month, year);
  return Array.from({ length: daysInMonth }, (_, i) => {
    const day = i + 1;
    return {
      value: day.toString().padStart(2, "0"),
      label: day.toString(),
    };
  });
};

// Rest of the validation functions remain the same...
export const validateDate = (
  dateValue: DateValue,
  validation?: DateValidation
): { isValid: boolean; errorMessage: string } => {
  // If not all fields are filled, check if required
  if (!dateValue.day || !dateValue.month || !dateValue.year) {
    if (validation?.required) {
      return { isValid: false, errorMessage: "Please select a complete date" };
    }
    return { isValid: true, errorMessage: "" };
  }

  if (!validation) return { isValid: true, errorMessage: "" };

  // Create date object
  const date = new Date(
    parseInt(dateValue.year),
    parseInt(dateValue.month) - 1,
    parseInt(dateValue.day)
  );

  // Check if date is valid
  if (
    date.getFullYear() !== parseInt(dateValue.year) ||
    date.getMonth() !== parseInt(dateValue.month) - 1 ||
    date.getDate() !== parseInt(dateValue.day)
  ) {
    return { isValid: false, errorMessage: "Please select a valid date" };
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Past/Future date validation
  if (validation.disablePastDates && date < today) {
    return { isValid: false, errorMessage: "Please select a future date" };
  }

  if (validation.disableFutureDates && date > today) {
    return { isValid: false, errorMessage: "Please select a past date" };
  }

  // Min/Max date validation
  if (validation.minDate && date < validation.minDate) {
    return { 
      isValid: false, 
      errorMessage: `Date must be after ${validation.minDate.toLocaleDateString()}` 
    };
  }

  if (validation.maxDate && date > validation.maxDate) {
    return { 
      isValid: false, 
      errorMessage: `Date must be before ${validation.maxDate.toLocaleDateString()}` 
    };
  }

  // Age validation
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

// Validate month (remains the same)
export const validateMonth = (
  monthValue: MonthValue,
  validation?: MonthValidation
): { isValid: boolean; errorMessage: string } => {
  // If not all fields are filled, check if required
  if (!monthValue.month || !monthValue.year) {
    if (validation?.required) {
      return { isValid: false, errorMessage: "Please select month and year" };
    }
    return { isValid: true, errorMessage: "" };
  }

  if (!validation) return { isValid: true, errorMessage: "" };

  // Create date object (first day of the month)
  const date = new Date(
    parseInt(monthValue.year),
    parseInt(monthValue.month) - 1,
    1
  );

  const today = new Date();
  const currentMonth = new Date(today.getFullYear(), today.getMonth(), 1);

  // Past/Future month validation
  if (validation.disablePastMonths && date < currentMonth) {
    return { isValid: false, errorMessage: "Please select a future month" };
  }

  if (validation.disableFutureMonths && date > currentMonth) {
    return { isValid: false, errorMessage: "Please select a past month" };
  }

  // Min/Max date validation
  if (validation.minDate) {
    const minMonth = new Date(validation.minDate.getFullYear(), validation.minDate.getMonth(), 1);
    if (date < minMonth) {
      return { 
        isValid: false, 
        errorMessage: `Month must be after ${minMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` 
      };
    }
  }

  if (validation.maxDate) {
    const maxMonth = new Date(validation.maxDate.getFullYear(), validation.maxDate.getMonth(), 1);
    if (date > maxMonth) {
      return { 
        isValid: false, 
        errorMessage: `Month must be before ${maxMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}` 
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

// Get default year for different picker types
export const getDefaultYear = (type: 'dob' | 'future' | 'any'): string => {
  const currentYear = new Date().getFullYear();
  
  switch (type) {
    case 'dob':
      return (currentYear - 18).toString();
    case 'future':
      return currentYear.toString();
    case 'any':
    default:
     return currentYear.toString();
  }
};