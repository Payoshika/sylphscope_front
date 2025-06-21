import React, { useState, useEffect, useRef } from "react";
import {
  countries,
  type Country,
  getCountryByCode,
  searchCountries,
} from "../../data/coutries";

interface PhoneNumberProps {
  id: string;
  name: string;
  label: string;
  value: {
    countryCode: string;
    number: string;
  };
  onChange: (value: { countryCode: string; number: string }) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  autoComplete?: string;
  searchable?: boolean;
  showFlag?: boolean;
}

const PhoneNumber: React.FC<PhoneNumberProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  autoComplete = "tel",
  searchable = true,
  showFlag = true,
}) => {
  const [internalError, setInternalError] = useState("");
  const [isCountryDropdownOpen, setIsCountryDropdownOpen] = useState(false);
  const [countrySearchTerm, setCountrySearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] =
    useState<Country[]>(countries);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const countrySearchRef = useRef<HTMLInputElement>(null);
  const countryDropdownRef = useRef<HTMLDivElement>(null);

  // Set default country code if not provided
  useEffect(() => {
    if (!value.countryCode) {
      onChange({
        ...value,
        countryCode: "US", // Add default country code
      });
    }
  }, [value.countryCode, onChange]);

  // Validation
  useEffect(() => {
    if (required && (!value.countryCode || !value.number.trim())) {
      setInternalError("Phone number is required");
    } else if (value.number.trim()) {
      // Basic phone number validation
      const cleanedNumber = value.number.replace(/\D/g, "");

      if (cleanedNumber.length < 7) {
        setInternalError("Phone number is too short");
      } else if (cleanedNumber.length > 15) {
        setInternalError("Phone number is too long");
      } else {
        setInternalError("");
      }
    } else {
      setInternalError("");
    }
  }, [value, required]);

  // Filter countries based on search term
  useEffect(() => {
    if (countrySearchTerm.trim() === "") {
      setFilteredCountries(countries);
    } else {
      setFilteredCountries(searchCountries(countrySearchTerm));
    }
    setHighlightedIndex(-1);
  }, [countrySearchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        countryDropdownRef.current &&
        !countryDropdownRef.current.contains(event.target as Node)
      ) {
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    if (isCountryDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isCountryDropdownOpen]);

  // Format phone number as user types
  const formatPhoneNumber = (input: string, countryCode: string) => {
    const cleaned = input.replace(/\D/g, "");
    const country = getCountryByCode(countryCode);

    if (country) {
      switch (country.code) {
        case "US":
        case "CA":
          if (cleaned.length <= 3) return cleaned;
          if (cleaned.length <= 6)
            return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
          return `(${cleaned.slice(0, 3)}) ${cleaned.slice(
            3,
            6
          )}-${cleaned.slice(6, 10)}`;
        case "GB":
          if (cleaned.length <= 4) return cleaned;
          if (cleaned.length <= 7)
            return `${cleaned.slice(0, 4)} ${cleaned.slice(4)}`;
          return `${cleaned.slice(0, 4)} ${cleaned.slice(4, 7)} ${cleaned.slice(
            7
          )}`;
        default:
          // Basic formatting for other countries
          if (cleaned.length <= 3) return cleaned;
          if (cleaned.length <= 6)
            return `${cleaned.slice(0, 3)} ${cleaned.slice(3)}`;
          return `${cleaned.slice(0, 3)} ${cleaned.slice(3, 6)} ${cleaned.slice(
            6
          )}`;
      }
    }

    return input;
  };

  const handleCountrySelect = (countryCode: string) => {
    onChange({
      ...value,
      countryCode,
    });
    setIsCountryDropdownOpen(false);
    setCountrySearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleCountrySearchChange = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    setCountrySearchTerm(e.target.value);
    if (!isCountryDropdownOpen) {
      setIsCountryDropdownOpen(true);
    }
  };

  const handleCountryInputFocus = () => {
    if (!disabled) {
      setIsCountryDropdownOpen(true);
    }
  };

  const handleCountryKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isCountryDropdownOpen) {
          setIsCountryDropdownOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredCountries.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isCountryDropdownOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCountries.length - 1
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (
          isCountryDropdownOpen &&
          highlightedIndex >= 0 &&
          filteredCountries[highlightedIndex]
        ) {
          handleCountrySelect(filteredCountries[highlightedIndex].code);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsCountryDropdownOpen(false);
        setCountrySearchTerm("");
        setHighlightedIndex(-1);
        countrySearchRef.current?.blur();
        break;
    }
  };

  const handleNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatPhoneNumber(e.target.value, value.countryCode);
    onChange({
      ...value,
      number: formatted,
    });
  };

  const getInputClass = () => {
    let baseClass = "input";
    if (error || internalError) baseClass += " input--error";
    return baseClass;
  };

  const getCountrySearchClass = () => {
    let baseClass = "country-search-input";
    if (error || internalError) baseClass += " country-search-input--error";
    if (disabled) baseClass += " country-search-input--disabled";
    return baseClass;
  };

  const getCountryDropdownClass = () => {
    let baseClass = "country-dropdown";
    if (isCountryDropdownOpen) baseClass += " country-dropdown--open";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;
  const selectedCountry = getCountryByCode(value.countryCode);
  const isValid = !hasError && value.number.length > 0;

  const getContainerClass = () => {
    let baseClass = "phone-number";
    if (hasError) baseClass += " phone-number--error";
    if (isValid) baseClass += " phone-number--valid";
    return baseClass;
  };

  // Display value for country search input
  const countryDisplayValue =
    selectedCountry && !isCountryDropdownOpen && !countrySearchTerm
      ? `${selectedCountry.flag} ${selectedCountry.phoneCode} ${selectedCountry.name}`
      : countrySearchTerm;

  return (
    <div className="form-group">
      <label className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div className={getContainerClass()}>
        <div className="phone-number__country" ref={countryDropdownRef}>
          {searchable ? (
            <div className="country-search-container">
              <div className="country-search-wrapper">
                <input
                  ref={countrySearchRef}
                  type="text"
                  id={`${id}-country`}
                  name={`${name}-country`}
                  className={getCountrySearchClass()}
                  placeholder="Search country..."
                  value={countryDisplayValue}
                  onChange={handleCountrySearchChange}
                  onFocus={handleCountryInputFocus}
                  onKeyDown={handleCountryKeyDown}
                  disabled={disabled}
                  autoComplete="off"
                  role="combobox"
                  aria-expanded={isCountryDropdownOpen}
                  aria-haspopup="listbox"
                  aria-autocomplete="list"
                />

                <button
                  type="button"
                  className="country-dropdown-toggle"
                  onClick={() =>
                    !disabled &&
                    setIsCountryDropdownOpen(!isCountryDropdownOpen)
                  }
                  disabled={disabled}
                  aria-label="Toggle country dropdown"
                >
                  <span className="dropdown-arrow">
                    {isCountryDropdownOpen ? "▲" : "▼"}
                  </span>
                </button>
              </div>

              <div className={getCountryDropdownClass()}>
                {isCountryDropdownOpen && (
                  <div className="country-options">
                    {filteredCountries.length > 0 ? (
                      filteredCountries.map((country, index) => (
                        <div
                          key={country.code}
                          className={`country-option ${
                            value.countryCode === country.code
                              ? "country-option--selected"
                              : ""
                          } ${
                            index === highlightedIndex
                              ? "country-option--highlighted"
                              : ""
                          }`}
                          onClick={() => handleCountrySelect(country.code)}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          role="option"
                          aria-selected={value.countryCode === country.code}
                        >
                          {showFlag && (
                            <span className="country-flag">{country.flag}</span>
                          )}
                          <span className="country-phone-code">
                            {country.phoneCode}
                          </span>
                          <span className="country-name">{country.name}</span>
                        </div>
                      ))
                    ) : (
                      <div className="country-no-results">
                        No countries found matching "{countrySearchTerm}"
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <select
              id={`${id}-country`}
              name={`${name}-country`}
              className="select"
              value={value.countryCode}
              onChange={(e) => handleCountrySelect(e.target.value)}
              disabled={disabled}
            >
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.flag} {country.phoneCode} {country.name}
                </option>
              ))}
            </select>
          )}
        </div>

        <div className="phone-number__input">
          <input
            type="tel"
            id={id}
            name={name}
            className={getInputClass()}
            placeholder="Enter phone number"
            value={value.number}
            onChange={handleNumberChange}
            disabled={disabled}
            required={required}
            autoComplete={autoComplete}
          />
        </div>
      </div>
      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default PhoneNumber;
