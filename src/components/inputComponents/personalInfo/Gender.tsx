import React, { useState, useEffect, useRef } from "react";
import {
  genders,
  genderCategories,
  getGendersByCategory,
  getGenderByValue,
  searchGenders,
  type GenderType,
} from "../../../data/genders";

interface GenderProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  searchable?: boolean;
  placeholder?: string;
  showCategories?: boolean;
  allowCustomInput?: boolean; // For "self-describe" option
  customValue?: string;
  onCustomChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const Gender: React.FC<GenderProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  searchable = true,
  placeholder = "Search and select your gender",
  showCategories = true,
  allowCustomInput = true,
  customValue = "",
  onCustomChange,
  onValidationChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredGenders, setFilteredGenders] = useState<GenderType[]>(genders);
  const [internalError, setInternalError] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showCustomInput, setShowCustomInput] = useState(
    value === "self-describe"
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedGender = getGenderByValue(value);

  // Validation
  useEffect(() => {
    let isValid = true;
    let errorMessage = "";

    if (required && !value) {
      isValid = false;
      errorMessage = "Gender selection is required";
    } else if (
      value === "self-describe" &&
      allowCustomInput &&
      !customValue.trim()
    ) {
      isValid = false;
      errorMessage = "Please describe your gender";
    }

    setInternalError(errorMessage);
    onValidationChange?.(isValid, errorMessage);
  }, [value, customValue, required, allowCustomInput, onValidationChange]);

  // Show/hide custom input
  useEffect(() => {
    setShowCustomInput(value === "self-describe");
    if (value === "self-describe" && customInputRef.current) {
      setTimeout(() => customInputRef.current?.focus(), 100);
    }
  }, [value]);

  // Filter genders based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredGenders(genders);
    } else {
      setFilteredGenders(searchGenders(searchTerm));
    }
    setHighlightedIndex(-1);
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

  const handleGenderSelect = (genderValue: string) => {
    onChange(genderValue);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
    if (searchInputRef.current) {
      searchInputRef.current.select();
    }
  };

  const handleCustomInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onCustomChange?.(e.target.value);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredGenders.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredGenders.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredGenders[highlightedIndex]) {
          handleGenderSelect(filteredGenders[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setSearchTerm("");
        setHighlightedIndex(-1);
        break;
    }
  };

  const getInputClass = () => {
    let baseClass = "gender-search-input";
    if (error || internalError) baseClass += " gender-search-input--error";
    if (disabled) baseClass += " gender-search-input--disabled";
    return baseClass;
  };

  const getDropdownClass = () => {
    let baseClass = "gender-dropdown";
    if (isOpen) baseClass += " gender-dropdown--open";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  // Display value in input
  const displayValue =
    selectedGender && !isOpen && !searchTerm
      ? selectedGender.label
      : searchTerm;

  // Group genders by category for display
  const gendersByCategory = Object.entries(genderCategories).reduce(
    (acc, [categoryKey, categoryLabel]) => {
      const categoryGenders = filteredGenders.filter(
        (gender) => gender.category === categoryKey && gender.value !== ""
      );
      if (categoryGenders.length > 0) {
        acc[categoryKey as GenderType["category"]] = {
          label: categoryLabel,
          genders: categoryGenders,
        };
      }
      return acc;
    },
    {} as Record<
      GenderType["category"],
      { label: string; genders: GenderType[] }
    >
  );

  return (
    <div className="form-group" ref={dropdownRef}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      {searchable ? (
        <div className="gender-search-container">
          <div className="gender-search-wrapper">
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

            <button
              type="button"
              className="gender-dropdown-toggle"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              aria-label="Toggle gender dropdown"
            >
              <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
            </button>
          </div>

          <div className={getDropdownClass()}>
            {isOpen && (
              <div className="gender-options">
                {showCategories && Object.keys(gendersByCategory).length > 0 ? (
                  // Categorized display
                  Object.entries(gendersByCategory).map(
                    ([categoryKey, categoryData]) => (
                      <div key={categoryKey} className="gender-category">
                        <div className="gender-category-header">
                          {categoryData.label}
                        </div>
                        {categoryData.genders.map((gender, index) => {
                          const globalIndex = filteredGenders.findIndex(
                            (g) => g.value === gender.value
                          );
                          return (
                            <div
                              key={gender.value}
                              className={`gender-option ${
                                value === gender.value
                                  ? "gender-option--selected"
                                  : ""
                              } ${
                                globalIndex === highlightedIndex
                                  ? "gender-option--highlighted"
                                  : ""
                              }`}
                              onClick={() => handleGenderSelect(gender.value)}
                              onMouseEnter={() =>
                                setHighlightedIndex(globalIndex)
                              }
                              role="option"
                              aria-selected={value === gender.value}
                            >
                              <span className="gender-name">
                                {gender.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )
                ) : // Flat display when search results or no categories
                filteredGenders.length > 0 ? (
                  filteredGenders.map((gender, index) => (
                    <div
                      key={gender.value}
                      className={`gender-option ${
                        value === gender.value ? "gender-option--selected" : ""
                      } ${
                        index === highlightedIndex
                          ? "gender-option--highlighted"
                          : ""
                      }`}
                      onClick={() => handleGenderSelect(gender.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      role="option"
                      aria-selected={value === gender.value}
                    >
                      <span className="gender-name">{gender.label}</span>
                    </div>
                  ))
                ) : (
                  <div className="gender-no-results">
                    No genders found matching "{searchTerm}"
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      ) : (
        // Simple dropdown without search
        <select
          id={id}
          name={name}
          className="select"
          value={value}
          onChange={(e) => handleGenderSelect(e.target.value)}
          disabled={disabled}
        >
          {showCategories
            ? Object.entries(genderCategories).map(
                ([categoryKey, categoryLabel]) => {
                  const categoryGenders = getGendersByCategory(
                    categoryKey as GenderType["category"]
                  );
                  return categoryGenders.length > 0 ? (
                    <optgroup key={categoryKey} label={categoryLabel}>
                      {categoryGenders.map((gender) => (
                        <option key={gender.value} value={gender.value}>
                          {gender.label}
                        </option>
                      ))}
                    </optgroup>
                  ) : null;
                }
              )
            : genders.map((gender) => (
                <option key={gender.value} value={gender.value}>
                  {gender.label}
                </option>
              ))}
        </select>
      )}

      {/* Custom Input for Self-Describe */}
      {showCustomInput && allowCustomInput && (
        <div className="gender-custom-input">
          <label htmlFor={`${id}-custom`} className="gender-custom-label">
            Please describe your gender:
          </label>
          <input
            ref={customInputRef}
            type="text"
            id={`${id}-custom`}
            name={`${name}-custom`}
            className="input"
            placeholder="Enter your gender identity"
            value={customValue}
            onChange={handleCustomInputChange}
            disabled={disabled}
          />
        </div>
      )}

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Gender;
