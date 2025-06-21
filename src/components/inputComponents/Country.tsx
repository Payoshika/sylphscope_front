import React, { useState, useEffect, useRef } from "react";
import { countries, type Country, searchCountries } from "../../data/coutries";

interface CountryProps {
  id: string;
  name: string;
  label: string;
  value: string; // Country code (e.g., "US", "CA", "JP")
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  searchable?: boolean;
  placeholder?: string;
  showFlag?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const Country: React.FC<CountryProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  searchable = true,
  placeholder = "Search and select your country",
  showFlag = true,
  onValidationChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCountries, setFilteredCountries] =
    useState<Country[]>(countries);
  const [internalError, setInternalError] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedCountry = countries.find((country) => country.code === value);

  // Validation
  useEffect(() => {
    if (required && !value) {
      setInternalError("Country selection is required");
      onValidationChange?.(false, "Country selection is required");
    } else {
      setInternalError("");
      onValidationChange?.(true, "");
    }
  }, [value, required, onValidationChange]);

  // Filter countries based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredCountries(countries);
    } else {
      setFilteredCountries(searchCountries(searchTerm));
    }
    setHighlightedIndex(-1); // Reset highlight when search changes
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const handleCountrySelect = (countryCode: string) => {
    onChange(countryCode);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      // Clear search term when focusing to show all countries
      if (selectedCountry && searchTerm === "") {
        setSearchTerm("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else {
          setHighlightedIndex((prev) =>
            prev < filteredCountries.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : filteredCountries.length - 1
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (
          isOpen &&
          highlightedIndex >= 0 &&
          filteredCountries[highlightedIndex]
        ) {
          handleCountrySelect(filteredCountries[highlightedIndex].code);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        searchInputRef.current?.blur();
        break;
    }
  };

  const getInputClass = () => {
    let baseClass = "country-search-input";
    if (error || internalError) baseClass += " country-search-input--error";
    if (disabled) baseClass += " country-search-input--disabled";
    return baseClass;
  };

  const getDropdownClass = () => {
    let baseClass = "country-dropdown";
    if (isOpen) baseClass += " country-dropdown--open";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  // Display value in input
  const displayValue =
    selectedCountry && !isOpen && !searchTerm
      ? selectedCountry.name
      : searchTerm;

  return (
    <div className="form-group" ref={dropdownRef}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="country-search-container">
        <div className="country-search-wrapper">
          <input
            ref={searchInputRef}
            type="text"
            id={id}
            name={name}
            className={getInputClass()}
            placeholder={placeholder}
            value={displayValue}
            onChange={handleSearchChange}
            onFocus={handleInputFocus}
            onKeyDown={handleKeyDown}
            disabled={disabled}
            autoComplete="off"
            role="combobox"
            aria-expanded={isOpen}
            aria-haspopup="listbox"
            aria-autocomplete="list"
          />

          {selectedCountry && showFlag && !isOpen && (
            <span className="country-flag-display">{selectedCountry.flag}</span>
          )}

          <button
            type="button"
            className="country-dropdown-toggle"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-label="Toggle country dropdown"
          >
            <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
          </button>
        </div>

        <div className={getDropdownClass()}>
          {isOpen && (
            <div className="country-options">
              {filteredCountries.length > 0 ? (
                filteredCountries.map((country, index) => (
                  <div
                    key={country.code}
                    className={`country-option ${
                      value === country.code ? "country-option--selected" : ""
                    } ${
                      index === highlightedIndex
                        ? "country-option--highlighted"
                        : ""
                    }`}
                    onClick={() => handleCountrySelect(country.code)}
                    onMouseEnter={() => setHighlightedIndex(index)}
                    role="option"
                    aria-selected={value === country.code}
                  >
                    {showFlag && (
                      <span className="country-flag">{country.flag}</span>
                    )}
                    <span className="country-name">{country.name}</span>
                    <span className="country-code">({country.code})</span>
                  </div>
                ))
              ) : (
                <div className="country-no-results">
                  No countries found matching "{searchTerm}"
                </div>
              )}
            </div>
          )}
        </div>
      </div>

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Country;
