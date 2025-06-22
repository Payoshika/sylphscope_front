import React, { useState, useEffect } from "react";
import { getCountryByCode } from "../../data/countries";

export interface AddressValue {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  region: string; // State/Province/Prefecture
}

interface AddressProps {
  id: string;
  name: string;
  label: string;
  value: AddressValue;
  onChange: (value: AddressValue) => void;
  countryCode: string; // Country code passed as prop
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  // Individual field requirements
  requireAddressLine2?: boolean;
  // Validation
  validate?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const Address: React.FC<AddressProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  countryCode,
  disabled = false,
  error = false,
  required = false,
  requireAddressLine2 = false,
  validate = true,
  onValidationChange,
}) => {
  const [internalErrors, setInternalErrors] = useState<Record<string, string>>(
    {}
  );
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  // Get selected country for region label
  const selectedCountry = getCountryByCode(countryCode);

  // Region label based on country
  const getRegionLabel = (countryCode: string): string => {
    switch (countryCode) {
      case "US":
        return "State";
      case "CA":
        return "Province";
      case "JP":
        return "Prefecture";
      case "GB":
        return "County";
      case "AU":
        return "State/Territory";
      case "DE":
        return "State (Länder)";
      case "FR":
        return "Region";
      case "IT":
        return "Region";
      case "BR":
        return "State";
      case "MX":
        return "State";
      case "IN":
        return "State";
      case "CN":
        return "Province";
      case "KR":
        return "Province";
      case "ES":
        return "Province";
      case "AR":
        return "Province";
      case "CL":
        return "Region";
      case "PE":
        return "Region";
      case "CO":
        return "Department";
      case "VE":
        return "State";
      case "ZA":
        return "Province";
      case "NG":
        return "State";
      case "EG":
        return "Governorate";
      case "SA":
        return "Province";
      case "AE":
        return "Emirate";
      case "TH":
        return "Province";
      case "MY":
        return "State";
      case "ID":
        return "Province";
      case "PH":
        return "Province";
      case "VN":
        return "Province";
      case "TR":
        return "Province";
      case "GR":
        return "Region";
      case "PT":
        return "District";
      case "NL":
        return "Province";
      case "BE":
        return "Province";
      case "CH":
        return "Canton";
      case "AT":
        return "State";
      case "SE":
        return "Province";
      case "NO":
        return "County";
      case "DK":
        return "Region";
      case "FI":
        return "Region";
      case "PL":
        return "Voivodeship";
      case "CZ":
        return "Region";
      case "HU":
        return "County";
      case "RO":
        return "County";
      case "BG":
        return "Province";
      case "HR":
        return "County";
      case "SI":
        return "Region";
      case "SK":
        return "Region";
      case "LT":
        return "County";
      case "LV":
        return "Region";
      case "EE":
        return "County";
      case "UA":
        return "Oblast";
      case "RU":
        return "Federal Subject";
      case "BY":
        return "Region";
      case "MD":
        return "District";
      case "RS":
        return "District";
      case "BA":
        return "Entity";
      case "ME":
        return "Municipality";
      case "MK":
        return "Region";
      case "AL":
        return "County";
      case "XK":
        return "District";
      default:
        return "State/Province/Region";
    }
  };

  // Validate individual fields
  const validateField = (
    fieldName: keyof AddressValue,
    fieldValue: string
  ): string => {
    if (!validate) return "";

    switch (fieldName) {
      case "addressLine1":
        if (required && !fieldValue.trim()) {
          return "Address line 1 is required";
        }
        if (fieldValue.trim() && fieldValue.length < 3) {
          return "Address line 1 must be at least 3 characters";
        }
        if (fieldValue.trim() && fieldValue.length > 100) {
          return "Address line 1 must be less than 100 characters";
        }
        break;

      case "addressLine2":
        if (requireAddressLine2 && !fieldValue?.trim()) {
          return "Address line 2 is required";
        }
        if (fieldValue && fieldValue.trim() && fieldValue.length > 100) {
          return "Address line 2 must be less than 100 characters";
        }
        break;

      case "city":
        if (required && !fieldValue.trim()) {
          return "City is required";
        }
        if (fieldValue.trim() && fieldValue.length < 2) {
          return "City must be at least 2 characters";
        }
        if (fieldValue.trim() && fieldValue.length > 50) {
          return "City must be less than 50 characters";
        }
        // Basic city name validation (letters, spaces, hyphens, apostrophes)
        if (
          fieldValue.trim() &&
          !/^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(fieldValue.trim())
        ) {
          return "City name contains invalid characters";
        }
        break;

      case "region":
        if (required && !fieldValue.trim()) {
          return `${getRegionLabel(countryCode)} is required`;
        }
        if (fieldValue.trim() && fieldValue.length < 2) {
          return `${getRegionLabel(countryCode)} must be at least 2 characters`;
        }
        if (fieldValue.trim() && fieldValue.length > 50) {
          return `${getRegionLabel(
            countryCode
          )} must be less than 50 characters`;
        }
        // Basic region name validation
        if (
          fieldValue.trim() &&
          !/^[a-zA-ZÀ-ÿ\s\-'\.]+$/.test(fieldValue.trim())
        ) {
          return `${getRegionLabel(countryCode)} contains invalid characters`;
        }
        break;
    }

    return "";
  };

  // Validate all fields
  const validateAllFields = (): {
    isValid: boolean;
    errors: Record<string, string>;
  } => {
    const errors: Record<string, string> = {};

    (Object.keys(value) as Array<keyof AddressValue>).forEach((key) => {
      const fieldValue = value[key] || "";
      const error = validateField(key, fieldValue);
      if (error) {
        errors[key] = error;
      }
    });

    return {
      isValid: Object.keys(errors).length === 0,
      errors,
    };
  };

  // Update validation when value changes
  useEffect(() => {
    if (validate) {
      const { isValid, errors } = validateAllFields();
      setInternalErrors(errors);

      const firstError = Object.values(errors)[0] || "";
      onValidationChange?.(isValid, firstError);
    }
  }, [value, validate, required, requireAddressLine2, countryCode]);

  // Handle field changes
  const handleFieldChange = (
    fieldName: keyof AddressValue,
    fieldValue: string
  ) => {
    // Update the value
    onChange({
      ...value,
      [fieldName]: fieldValue,
    });

    // Mark field as touched
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    // Clear error for this field if it's valid
    if (validate && touched[fieldName]) {
      const error = validateField(fieldName, fieldValue);
      setInternalErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  // Handle field blur
  const handleFieldBlur = (fieldName: keyof AddressValue) => {
    setTouched((prev) => ({
      ...prev,
      [fieldName]: true,
    }));

    if (validate) {
      const fieldValue = value[fieldName] || "";
      const error = validateField(fieldName, fieldValue);
      setInternalErrors((prev) => ({
        ...prev,
        [fieldName]: error,
      }));
    }
  };

  // Format field values based on country
  const formatFieldValue = (
    fieldName: keyof AddressValue,
    inputValue: string
  ): string => {
    switch (fieldName) {
      case "city":
      case "region":
        // Capitalize first letter of each word for city and region
        return inputValue
          .toLowerCase()
          .split(" ")
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(" ");

      case "addressLine1":
      case "addressLine2":
        // Keep address lines as entered but trim whitespace
        return inputValue.trim();

      default:
        return inputValue;
    }
  };

  const handleFormattedFieldChange = (
    fieldName: keyof AddressValue,
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const rawValue = e.target.value;

    // Apply formatting on blur, not on every keystroke for better UX
    handleFieldChange(fieldName, rawValue);
  };

  const handleFormattedFieldBlur = (
    fieldName: keyof AddressValue,
    e: React.FocusEvent<HTMLInputElement>
  ) => {
    const formattedValue = formatFieldValue(fieldName, e.target.value);

    // Update with formatted value
    if (formattedValue !== e.target.value) {
      handleFieldChange(fieldName, formattedValue);
    }

    handleFieldBlur(fieldName);
  };

  const getInputClass = (fieldName: keyof AddressValue) => {
    let baseClass = "input";
    const hasFieldError = error || internalErrors[fieldName];
    if (hasFieldError) baseClass += " input--error";
    return baseClass;
  };

  const hasError = error || Object.keys(internalErrors).length > 0;
  const errorMessage =
    typeof error === "string" ? error : Object.values(internalErrors)[0] || "";

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="address-container">
        {/* Address Line 1 */}
        <div className="address-field">
          <label htmlFor={`${id}-line1`} className="address-field-label">
            Address Line 1
            {required && <span className="required-asterisk">*</span>}
          </label>
          <input
            type="text"
            id={`${id}-line1`}
            name={`${name}-line1`}
            className={getInputClass("addressLine1")}
            placeholder="Street address, P.O. box, company name"
            value={value.addressLine1}
            onChange={(e) => handleFormattedFieldChange("addressLine1", e)}
            onBlur={(e) => handleFormattedFieldBlur("addressLine1", e)}
            disabled={disabled}
            required={required}
            maxLength={100}
          />
          {touched.addressLine1 && internalErrors.addressLine1 && (
            <div className="field-error-message">
              {internalErrors.addressLine1}
            </div>
          )}
        </div>

        {/* Address Line 2 */}
        <div className="address-field">
          <label htmlFor={`${id}-line2`} className="address-field-label">
            Address Line 2{" "}
            {!requireAddressLine2 && (
              <span className="optional-text">(Optional)</span>
            )}
            {requireAddressLine2 && (
              <span className="required-asterisk">*</span>
            )}
          </label>
          <input
            type="text"
            id={`${id}-line2`}
            name={`${name}-line2`}
            className={getInputClass("addressLine2")}
            placeholder="Apartment, suite, unit, building, floor, etc."
            value={value.addressLine2 || ""}
            onChange={(e) => handleFormattedFieldChange("addressLine2", e)}
            onBlur={(e) => handleFormattedFieldBlur("addressLine2", e)}
            disabled={disabled}
            required={requireAddressLine2}
            maxLength={100}
          />
          {touched.addressLine2 && internalErrors.addressLine2 && (
            <div className="field-error-message">
              {internalErrors.addressLine2}
            </div>
          )}
        </div>

        {/* City and Region Row */}
        <div className="address-row">
          <div className="address-field address-field--flex">
            <label htmlFor={`${id}-city`} className="address-field-label">
              City
              {required && <span className="required-asterisk">*</span>}
            </label>
            <input
              type="text"
              id={`${id}-city`}
              name={`${name}-city`}
              className={getInputClass("city")}
              placeholder="City"
              value={value.city}
              onChange={(e) => handleFormattedFieldChange("city", e)}
              onBlur={(e) => handleFormattedFieldBlur("city", e)}
              disabled={disabled}
              required={required}
              maxLength={50}
            />
            {touched.city && internalErrors.city && (
              <div className="field-error-message">{internalErrors.city}</div>
            )}
          </div>

          <div className="address-field address-field--flex">
            <label htmlFor={`${id}-region`} className="address-field-label">
              {getRegionLabel(countryCode)}
              {required && <span className="required-asterisk">*</span>}
            </label>
            <input
              type="text"
              id={`${id}-region`}
              name={`${name}-region`}
              className={getInputClass("region")}
              placeholder={getRegionLabel(countryCode)}
              value={value.region}
              onChange={(e) => handleFormattedFieldChange("region", e)}
              onBlur={(e) => handleFormattedFieldBlur("region", e)}
              disabled={disabled}
              required={required}
              maxLength={50}
            />
            {touched.region && internalErrors.region && (
              <div className="field-error-message">{internalErrors.region}</div>
            )}
          </div>
        </div>
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Address;
