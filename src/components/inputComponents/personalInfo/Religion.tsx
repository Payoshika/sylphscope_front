import React, { useState, useEffect, useRef } from "react";
import {
  religions,
  religionCategories,
  getReligionsByCategory,
  getReligionByValue,
  searchReligions,
  type ReligionType,
} from "../../../data/religions";

interface ReligionProps {
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
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const Religion: React.FC<ReligionProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  searchable = true,
  placeholder = "Search and select your religion",
  showCategories = true,
  onValidationChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredReligions, setFilteredReligions] =
    useState<ReligionType[]>(religions);
  const [internalError, setInternalError] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedReligion = getReligionByValue(value);

  // Validation
  useEffect(() => {
    if (required && !value) {
      setInternalError("Religion selection is required");
      onValidationChange?.(false, "Religion selection is required");
    } else {
      setInternalError("");
      onValidationChange?.(true, "");
    }
  }, [value, required, onValidationChange]);

  // Filter religions based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredReligions(religions);
    } else {
      setFilteredReligions(searchReligions(searchTerm));
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

  const handleReligionSelect = (religionValue: string) => {
    onChange(religionValue);
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

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (!isOpen) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev < filteredReligions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredReligions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredReligions[highlightedIndex]) {
          handleReligionSelect(filteredReligions[highlightedIndex].value);
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
    let baseClass = "religion-search-input";
    if (error || internalError) baseClass += " religion-search-input--error";
    if (disabled) baseClass += " religion-search-input--disabled";
    return baseClass;
  };

  const getDropdownClass = () => {
    let baseClass = "religion-dropdown";
    if (isOpen) baseClass += " religion-dropdown--open";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  // Display value in input
  const displayValue =
    selectedReligion && !isOpen && !searchTerm
      ? selectedReligion.label
      : searchTerm;

  // Group religions by category for display
  const religionsByCategory = Object.entries(religionCategories).reduce(
    (acc, [categoryKey, categoryLabel]) => {
      const categoryReligions = filteredReligions.filter(
        (religion) => religion.category === categoryKey && religion.value !== ""
      );
      if (categoryReligions.length > 0) {
        acc[categoryKey as ReligionType["category"]] = {
          label: categoryLabel,
          religions: categoryReligions,
        };
      }
      return acc;
    },
    {} as Record<
      ReligionType["category"],
      { label: string; religions: ReligionType[] }
    >
  );

  return (
    <div className="form-group" ref={dropdownRef}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      {searchable ? (
        <div className="religion-search-container">
          <div className="religion-search-wrapper">
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
              className="religion-dropdown-toggle"
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              aria-label="Toggle religion dropdown"
            >
              <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
            </button>
          </div>

          <div className={getDropdownClass()}>
            {isOpen && (
              <div className="religion-options">
                {showCategories &&
                Object.keys(religionsByCategory).length > 0 ? (
                  // Categorized display
                  Object.entries(religionsByCategory).map(
                    ([categoryKey, categoryData]) => (
                      <div key={categoryKey} className="religion-category">
                        <div className="religion-category-header">
                          {categoryData.label}
                        </div>
                        {categoryData.religions.map((religion, index) => {
                          const globalIndex = filteredReligions.findIndex(
                            (r) => r.value === religion.value
                          );
                          return (
                            <div
                              key={religion.value}
                              className={`religion-option ${
                                value === religion.value
                                  ? "religion-option--selected"
                                  : ""
                              } ${
                                globalIndex === highlightedIndex
                                  ? "religion-option--highlighted"
                                  : ""
                              }`}
                              onClick={() =>
                                handleReligionSelect(religion.value)
                              }
                              onMouseEnter={() =>
                                setHighlightedIndex(globalIndex)
                              }
                              role="option"
                              aria-selected={value === religion.value}
                            >
                              <span className="religion-name">
                                {religion.label}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                    )
                  )
                ) : // Flat display when search results or no categories
                filteredReligions.length > 0 ? (
                  filteredReligions.map((religion, index) => (
                    <div
                      key={religion.value}
                      className={`religion-option ${
                        value === religion.value
                          ? "religion-option--selected"
                          : ""
                      } ${
                        index === highlightedIndex
                          ? "religion-option--highlighted"
                          : ""
                      }`}
                      onClick={() => handleReligionSelect(religion.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      role="option"
                      aria-selected={value === religion.value}
                    >
                      <span className="religion-name">{religion.label}</span>
                    </div>
                  ))
                ) : (
                  <div className="religion-no-results">
                    No religions found matching "{searchTerm}"
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
          onChange={(e) => handleReligionSelect(e.target.value)}
          disabled={disabled}
        >
          {showCategories
            ? Object.entries(religionCategories).map(
                ([categoryKey, categoryLabel]) => {
                  const categoryReligions = getReligionsByCategory(
                    categoryKey as ReligionType["category"]
                  );
                  return categoryReligions.length > 0 ? (
                    <optgroup key={categoryKey} label={categoryLabel}>
                      {categoryReligions.map((religion) => (
                        <option key={religion.value} value={religion.value}>
                          {religion.label}
                        </option>
                      ))}
                    </optgroup>
                  ) : null;
                }
              )
            : religions.map((religion) => (
                <option key={religion.value} value={religion.value}>
                  {religion.label}
                </option>
              ))}
        </select>
      )}

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default Religion;
