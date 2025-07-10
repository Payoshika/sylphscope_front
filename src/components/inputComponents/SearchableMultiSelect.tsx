import React, { useState, useRef, useEffect } from "react";
import type { SearchableOption } from "./SearchableDropdown";
import Checkmark from "../icons/Checkmark";

interface SearchableMultiSelectProps {
  id: string;
  name: string;
  label: string;
  value: string[];
  onChange: (value: string[]) => void;
  options: SearchableOption[];
  searchFunction: (query: string, options: SearchableOption[]) => SearchableOption[];
  placeholder?: string;
  disabled?: boolean;
  error?: boolean | string;
  required?: boolean;
  className?: string;
}

const SearchableMultiSelect: React.FC<SearchableMultiSelectProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options,
  searchFunction,
  placeholder = "Search and select options",
  disabled = false,
  error = false,
  required = false,
  className = "multi-select"
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredOptions, setFilteredOptions] = useState<SearchableOption[]>(options);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);

  const searchInputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setFilteredOptions(options);
    } else {
      setFilteredOptions(searchFunction(searchTerm, options));
    }
    setHighlightedIndex(-1);
  }, [searchTerm, options, searchFunction]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
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

  const handleOptionToggle = (optionValue: string) => {
    if (value.includes(optionValue)) {
      onChange(value.filter((v) => v !== optionValue));
    } else {
      onChange([...value, optionValue]);
    }
    setSearchTerm("");
    setIsOpen(true);
  };

  const handleRemoveSelected = (optionValue: string, e: React.MouseEvent) => {
    e.stopPropagation();
    onChange(value.filter((v) => v !== optionValue));
  };

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
    setIsOpen(true);
  };

  const handleInputFocus = () => {
    setIsOpen(true);
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
          handleOptionToggle(filteredOptions[highlightedIndex].value);
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

  return (
    <div className={`form-group ${className}`} ref={dropdownRef}>
      <label htmlFor={id} className="form-label">
        {label}
        {required && <span className="required-asterisk">*</span>}
      </label>
      <div
        className={`${className}__search-container`}
        onClick={() => !disabled && searchInputRef.current?.focus()}
      >
<div className={`${className}__search-wrapper`}>
  {/* Selected chips above the input */}
  {value.length > 0 && (
    <div className={`${className}__selected-chips`}>
      {value
        .map((val) => options.find((opt) => opt.value === val))
        .filter(Boolean)
        .map((opt) => (
          <span className={`${className}__chip`} key={opt!.value}>
            {opt!.label}
            <button
              type="button"
              className={`${className}__chip-remove`}
              onClick={(e) => handleRemoveSelected(opt!.value, e)}
              aria-label={`Remove ${opt!.label}`}
              tabIndex={-1}
            >
              ×
            </button>
          </span>
        ))}
    </div>
  )}
  <div className={`${className}__search-wrapper__input`}>
    <input
      ref={searchInputRef}
      type="text"
      id={id}
      name={name}
      className={`${className}__search-input`}
      placeholder={placeholder}
      value={searchTerm}
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
      tabIndex={-1}
    >
      <span className="dropdown-arrow">{isOpen ? "▲" : "▼"}</span>
    </button>
  </div>
</div>
        <div className={`${className}__dropdown${isOpen ? ` ${className}__dropdown--open` : ""}`}>
          {isOpen && (
            <div className={`${className}__options`}>
              {filteredOptions.length > 0
                ? filteredOptions.map((option, index) => {
                    const isSelected = value.includes(option.value);
                    return (
                      <div
                        key={option.value}
                        className={`${className}__option ${
                          isSelected ? `${className}__option--selected` : ""
                        } ${
                          index === highlightedIndex
                            ? `${className}__option--highlighted`
                            : ""
                        }`}
                        onClick={() => handleOptionToggle(option.value)}
                        onMouseEnter={() => setHighlightedIndex(index)}
                        role="option"
                        aria-selected={isSelected}
                      >
                        <span className={`${className}__option-content`}>
                        {isSelected && (
              <Checkmark
                className={`${className}__selected-icon`}
                size={18}
                color="currentColor"
                strokeWidth={3}
              />                          )}
                        <span className={`${className}__label`}>{option.label}</span>
                        </span>
                      </div>
                    );
                  })
                : (
                  <div className={`${className}__no-results`}>
                    No {label.toLowerCase()} found matching "{searchTerm}"
                  </div>
                )}
            </div>
          )}
        </div>
      </div>
      {error && (
        <div className="error-message">
          {typeof error === "string" ? error : "Invalid selection"}
        </div>
      )}
    </div>
  );
};

export default SearchableMultiSelect;