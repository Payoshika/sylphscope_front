import React, { useState, useEffect, useRef } from "react";

interface University {
  name: string;
  country: string;
  alpha_two_code: string;
  "state-province"?: string;
  domains: string[];
  web_pages: string[];
}

interface UniversityProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  placeholder?: string;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const University: React.FC<UniversityProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  disabled = false,
  error = false,
  required = false,
  placeholder = "Search for a university...",
  onValidationChange,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [universities, setUniversities] = useState<University[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [internalError, setInternalError] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [hasSearched, setHasSearched] = useState(false);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const abortControllerRef = useRef<AbortController | null>(null);

  // Validation
  useEffect(() => {
    if (required && !value.trim()) {
      setInternalError("University selection is required");
      onValidationChange?.(false, "University selection is required");
    } else {
      setInternalError("");
      onValidationChange?.(true, "");
    }
  }, [value, required, onValidationChange]);

  // Search universities when search term changes and is 4+ characters
  useEffect(() => {
    const searchUniversities = async () => {
      if (searchTerm.trim().length < 4) {
        setUniversities([]);
        setIsLoading(false);
        setHasSearched(false);
        return;
      }

      // Cancel previous request
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }

      // Create new abort controller
      abortControllerRef.current = new AbortController();

      setIsLoading(true);
      setHasSearched(true);

      try {
        const encodedSearchTerm = encodeURIComponent(searchTerm.trim());
        const response = await fetch(
          `http://universities.hipolabs.com/search?name=${encodedSearchTerm}&limit=10`,
          {
            signal: abortControllerRef.current.signal,
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data: University[] = await response.json();

        // Sort by relevance (exact match first, then starts with, then contains)
        const sortedData = data.sort((a, b) => {
          const aName = a.name.toLowerCase();
          const bName = b.name.toLowerCase();
          const searchLower = searchTerm.toLowerCase();

          // Exact match
          if (aName === searchLower) return -1;
          if (bName === searchLower) return 1;

          // Starts with
          if (aName.startsWith(searchLower) && !bName.startsWith(searchLower))
            return -1;
          if (bName.startsWith(searchLower) && !aName.startsWith(searchLower))
            return 1;

          // Alphabetical for the rest
          return aName.localeCompare(bName);
        });

        setUniversities(sortedData);
        setHighlightedIndex(-1);
      } catch (error) {
        if (error instanceof Error && error.name === "AbortError") {
          // Request was aborted, ignore
          return;
        }
        console.error("Error searching universities:", error);
        setUniversities([]);
        setInternalError("Failed to search universities. Please try again.");
      } finally {
        setIsLoading(false);
      }
    };

    // Debounce search
    const timeoutId = setTimeout(() => {
      searchUniversities();
    }, 300);

    return () => {
      clearTimeout(timeoutId);
    };
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

  // Cleanup abort controller on unmount
  useEffect(() => {
    return () => {
      if (abortControllerRef.current) {
        abortControllerRef.current.abort();
      }
    };
  }, []);

  const handleUniversitySelect = (university: University) => {
    onChange(university.name);
    setIsOpen(false);
    setSearchTerm("");
    setHighlightedIndex(-1);
    setUniversities([]);
    setHasSearched(false);
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value;
    setSearchTerm(newValue);

    // If user clears the input, also clear the selected value
    if (newValue === "") {
      onChange("");
      setUniversities([]);
      setIsOpen(false);
      setHasSearched(false);
    } else if (!isOpen) {
      setIsOpen(true);
    }
  };

  const handleInputFocus = () => {
    if (!disabled) {
      setIsOpen(true);
      // If there's a selected value but no search term, clear it to allow new search
      if (value && !searchTerm) {
        setSearchTerm("");
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (disabled) return;

    switch (e.key) {
      case "ArrowDown":
        e.preventDefault();
        if (!isOpen && universities.length > 0) {
          setIsOpen(true);
        } else if (universities.length > 0) {
          setHighlightedIndex((prev) =>
            prev < universities.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen && universities.length > 0) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : universities.length - 1
          );
        }
        break;
      case "Enter":
        e.preventDefault();
        if (isOpen && highlightedIndex >= 0 && universities[highlightedIndex]) {
          handleUniversitySelect(universities[highlightedIndex]);
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
    let baseClass = "university-search-input";
    if (error || internalError) baseClass += " university-search-input--error";
    if (disabled) baseClass += " university-search-input--disabled";
    return baseClass;
  };

  const getDropdownClass = () => {
    let baseClass = "university-dropdown";
    if (isOpen) baseClass += " university-dropdown--open";
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  // Display value in input
  const displayValue = value && !isOpen && !searchTerm ? value : searchTerm;

  const shouldShowMinCharMessage =
    searchTerm.length > 0 && searchTerm.length < 4;
  const shouldShowNoResults =
    hasSearched &&
    !isLoading &&
    universities.length === 0 &&
    searchTerm.length >= 4;

  return (
    <div className="form-group" ref={dropdownRef}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      <div className="university-search-container">
        <div className="university-search-wrapper">
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

          {isLoading && (
            <div className="university-loading-indicator">
              <span className="loading-spinner">🔄</span>
            </div>
          )}

          <button
            type="button"
            className="university-dropdown-toggle"
            onClick={() => !disabled && setIsOpen(!isOpen)}
            disabled={disabled}
            aria-label="Toggle university dropdown"
          >
            <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
          </button>
        </div>

        <div className={getDropdownClass()}>
          {isOpen && (
            <div className="university-options">
              {shouldShowMinCharMessage && (
                <div className="university-message">
                  Type at least 4 characters to search universities
                </div>
              )}

              {isLoading && (
                <div className="university-loading">
                  <span className="loading-spinner">🔄</span>
                  Searching universities...
                </div>
              )}

              {universities.length > 0 && !isLoading && (
                <>
                  {universities.map((university, index) => (
                    <div
                      key={`${university.name}-${university.country}-${index}`}
                      className={`university-option ${
                        index === highlightedIndex
                          ? "university-option--highlighted"
                          : ""
                      } ${
                        value === university.name
                          ? "university-option--selected"
                          : ""
                      }`}
                      onClick={() => handleUniversitySelect(university)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      role="option"
                      aria-selected={value === university.name}
                    >
                      <div className="university-main">
                        <span className="university-name">
                          {university.name}
                        </span>
                      </div>
                      <div className="university-details">
                        <span className="university-country">
                          {university.country}
                        </span>
                        {university["state-province"] && (
                          <span className="university-state">
                            , {university["state-province"]}
                          </span>
                        )}
                      </div>
                    </div>
                  ))}
                </>
              )}

              {shouldShowNoResults && (
                <div className="university-no-results">
                  No universities found matching "{searchTerm}"
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

export default University;
