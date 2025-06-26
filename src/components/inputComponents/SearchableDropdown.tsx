import React, { useState, useEffect, useRef } from "react";

export interface SearchableOption {
  value: string;
  label: string;
  category?: string;
  flag?: string; // For countries
  phoneCode?: string; // For phone numbers
  [key: string]: any; // Allow additional properties
}

export interface SearchableCategory {
  [key: string]: {
    label: string;
    options: SearchableOption[];
  };
}

interface SearchableDropdownProps {
  id: string;
  name: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SearchableOption[];
  searchFunction: (
    query: string,
    options: SearchableOption[]
  ) => SearchableOption[];
  getCategorizedOptions?: (options: SearchableOption[]) => SearchableCategory;
  renderOption?: (
    option: SearchableOption,
    isSelected: boolean,
    isHighlighted: boolean
  ) => React.ReactNode;
  placeholder?: string;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  searchable?: boolean;
  showCategories?: boolean;
  className?: string;
  dropdownClassName?: string;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;

  // Custom input support (for Gender component)
  allowCustomInput?: boolean;
  customInputTriggerValue?: string; // Value that triggers custom input (e.g., "self-describe")
  customValue?: string;
  onCustomChange?: (value: string) => void;
  customInputPlaceholder?: string;
  customInputLabel?: string;
  renderCustomInput?: (props: {
    id: string;
    name: string;
    value: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    placeholder: string;
    disabled: boolean;
    className: string;
  }) => React.ReactNode;
}

const SearchableDropdown: React.FC<SearchableDropdownProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  searchFunction,
  getCategorizedOptions,
  renderOption,
  placeholder = "Search and select an option",
  disabled = false,
  error = false,
  required = false,
  searchable = true,
  showCategories = true,
  className = "",
  dropdownClassName = "",
  onValidationChange,

  // Custom input props
  allowCustomInput = false,
  customInputTriggerValue = "self-describe",
  customValue = "",
  onCustomChange,
  customInputPlaceholder = "Enter your custom value",
  customInputLabel = "Please specify:",
  renderCustomInput,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] =
    useState<SearchableOption[]>(options);
  const [internalError, setInternalError] = useState("");
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const [showCustomInput, setShowCustomInput] = useState(
    value === customInputTriggerValue
  );

  const searchInputRef = useRef<HTMLInputElement>(null);
  const customInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const selectedOption = options.find((option) => option.value === value);

  // Validation
  useEffect(() => {
    let isValid = true;
    let errorMessage = "";

    if (required && !value) {
      isValid = false;
      errorMessage = `${label} is required`;
    } else if (
      value === customInputTriggerValue &&
      allowCustomInput &&
      !customValue.trim()
    ) {
      isValid = false;
      errorMessage = `Please provide your custom ${label.toLowerCase()}`;
    }

    setInternalError(errorMessage);
    onValidationChange?.(isValid, errorMessage);
  }, [
    value,
    customValue,
    required,
    label,
    allowCustomInput,
    customInputTriggerValue,
    onValidationChange,
  ]);

  // Show/hide custom input
  useEffect(() => {
    setShowCustomInput(value === customInputTriggerValue);

    // Focus custom input when it becomes visible
    if (value === customInputTriggerValue && customInputRef.current) {
      setTimeout(() => customInputRef.current?.focus(), 100);
    }
  }, [value, customInputTriggerValue]);

  // Filter options based on search term
  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(searchFunction(searchTerm, options));
    }
    setHighlightedIndex(-1);
  }, [searchTerm, options, searchFunction]);

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

  const handleOptionSelect = (optionValue: string) => {
    onChange(optionValue);
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
          prev < filteredOptions.length - 1 ? prev + 1 : 0
        );
        break;
      case "ArrowUp":
        e.preventDefault();
        setHighlightedIndex((prev) =>
          prev > 0 ? prev - 1 : filteredOptions.length - 1
        );
        break;
      case "Enter":
        e.preventDefault();
        if (highlightedIndex >= 0 && filteredOptions[highlightedIndex]) {
          handleOptionSelect(filteredOptions[highlightedIndex].value);
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
    let baseClass = `${className}__search-input`;
    if (error || internalError)
      baseClass += ` ${className}__search-input--error`;
    if (disabled) baseClass += ` ${className}__search-input--disabled`;
    return baseClass;
  };

  const getDropdownClass = () => {
    let baseClass = `${className}__dropdown`;
    if (dropdownClassName) baseClass += ` ${dropdownClassName}`;
    if (isOpen) baseClass += ` ${className}__dropdown--open`;
    return baseClass;
  };

  const hasError = error || !!internalError;
  const errorMessage = typeof error === "string" ? error : internalError;

  // Display value in input
  const displayValue =
    selectedOption && !isOpen && !searchTerm
      ? selectedOption.label
      : searchTerm;

  // Get categorized options if function provided and categories should be shown
  const categorizedOptions =
    showCategories && getCategorizedOptions
      ? getCategorizedOptions(filteredOptions)
      : null;

  // Default option renderer
  const defaultRenderOption = (
    option: SearchableOption,
    isSelected: boolean,
    isHighlighted: boolean
  ) => (
    <span className={`${className}__option-content`}>
      {option.flag && (
        <span className={`${className}__flag`}>{option.flag}</span>
      )}
      {option.phoneCode && (
        <span className={`${className}__phone-code`}>{option.phoneCode}</span>
      )}
      <span className={`${className}__label`}>{option.label}</span>
      {isSelected && <span className={`${className}__selected-icon`}>✓</span>}
    </span>
  );

  const optionRenderer = renderOption || defaultRenderOption;

  // Default custom input renderer
  const defaultRenderCustomInput = (props: any) => (
    <input ref={customInputRef} type="text" {...props} />
  );

  const customInputRenderer = renderCustomInput || defaultRenderCustomInput;

  return (
    <div className="form-group" ref={dropdownRef}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>

      {searchable ? (
        <div className={`${className}__search-container`}>
          <div className={`${className}__search-wrapper`}>
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
              className={`${className}__dropdown-toggle`}
              onClick={() => !disabled && setIsOpen(!isOpen)}
              disabled={disabled}
              aria-label={`Toggle ${label.toLowerCase()} dropdown`}
            >
              <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
            </button>
          </div>

          <div className={getDropdownClass()}>
            {isOpen && (
              <div className={`${className}__options`}>
                {categorizedOptions ? (
                  // Categorized display
                  Object.entries(categorizedOptions).map(
                    ([categoryKey, categoryData]) => (
                      <div
                        key={categoryKey}
                        className={`${className}__category`}
                      >
                        <div className={`${className}__category-header`}>
                          {categoryData.label}
                        </div>
                        {categoryData.options.map((option, index) => {
                          const globalIndex = filteredOptions.findIndex(
                            (o) => o.value === option.value
                          );
                          return (
                            <div
                              key={option.value}
                              className={`${className}__option ${
                                value === option.value
                                  ? `${className}__option--selected`
                                  : ""
                              } ${
                                globalIndex === highlightedIndex
                                  ? `${className}__option--highlighted`
                                  : ""
                              }`}
                              onClick={() => handleOptionSelect(option.value)}
                              onMouseEnter={() =>
                                setHighlightedIndex(globalIndex)
                              }
                              role="option"
                              aria-selected={value === option.value}
                            >
                              {optionRenderer(
                                option,
                                value === option.value,
                                globalIndex === highlightedIndex
                              )}
                            </div>
                          );
                        })}
                      </div>
                    )
                  )
                ) : // Flat display
                filteredOptions.length > 0 ? (
                  filteredOptions.map((option, index) => (
                    <div
                      key={option.value}
                      className={`${className}__option ${
                        value === option.value
                          ? `${className}__option--selected`
                          : ""
                      } ${
                        index === highlightedIndex
                          ? `${className}__option--highlighted`
                          : ""
                      }`}
                      onClick={() => handleOptionSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      role="option"
                      aria-selected={value === option.value}
                    >
                      {optionRenderer(
                        option,
                        value === option.value,
                        index === highlightedIndex
                      )}
                    </div>
                  ))
                ) : (
                  <div className={`${className}__no-results`}>
                    No {label.toLowerCase()} found matching "{searchTerm}"
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
          onChange={(e) => handleOptionSelect(e.target.value)}
          disabled={disabled}
        >
          {showCategories && getCategorizedOptions
            ? Object.entries(getCategorizedOptions(options)).map(
                ([categoryKey, categoryData]) => (
                  <optgroup key={categoryKey} label={categoryData.label}>
                    {categoryData.options.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </optgroup>
                )
              )
            : options.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
        </select>
      )}

      {/* Custom Input Section */}
      {showCustomInput && allowCustomInput && (
        <div className={`${className}__custom-input`}>
          <label
            htmlFor={`${id}-custom`}
            className={`${className}__custom-label`}
          >
            {customInputLabel}
          </label>
          {customInputRenderer({
            id: `${id}-custom`,
            name: `${name}-custom`,
            value: customValue,
            onChange: handleCustomInputChange,
            placeholder: customInputPlaceholder,
            disabled,
            className: "input",
          })}
        </div>
      )}

      {hasError && errorMessage && (
        <div className="error-message">{errorMessage}</div>
      )}
    </div>
  );
};

export default SearchableDropdown;
