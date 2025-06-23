export interface DateValue {
  day: string;
  month: string;
  year: string;
}

export interface MonthValue {
  month: string;
  year: string;
}

export interface DateValidation {
  required?: boolean;
  minAge?: number;
  maxAge?: number;
  minDate?: Date;
  maxDate?: Date;
  disablePastDates?: boolean;
  disableFutureDates?: boolean;
  customValidator?: (date: Date) => string | null;
}

export interface MonthValidation {
  required?: boolean;
  minDate?: Date;
  maxDate?: Date;
  disablePastMonths?: boolean;
  disableFutureMonths?: boolean;
  customValidator?: (date: Date) => string | null;
}

export interface BaseDatePickerProps {
  id: string;
  name: string;
  label: string;
  disabled?: boolean;
  error?: boolean | string;
}

export interface DatePickerProps extends BaseDatePickerProps {
  value: DateValue;
  onChange: (value: DateValue) => void;
  validation?: DateValidation;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

export interface MonthPickerProps extends BaseDatePickerProps {
  value: MonthValue;
  onChange: (value: MonthValue) => void;
  validation?: MonthValidation;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

export type DatePickerType = 'dob' | 'future' | 'any';
export type MonthPickerType = 'past' | 'future' | 'any';