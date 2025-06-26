import React, { useState, useRef, useEffect } from "react";

export interface SelectOption {
  value: string;
  label: string;
}

export interface SelectOptGroup {
  label: string;
  options: SelectOption[];
}

interface SelectProps {
  id: string;
  name: string;
  label?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  optGroups?: SelectOptGroup[];
  placeholder?: string;
  disabled?: boolean;
  required?: boolean;
  error?: boolean | string;
  size?: "small" | "regular" | "large";
  className?: string;
}

const Select: React.FC<SelectProps> = ({
  id,
  name,
  label,
  value,
  onChange,
  options = [],
  optGroups = [],
  placeholder = "Choose an option...",
  disabled = false,
  required = false,
  error = false,
  size = "regular",
  className = "",
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Get all options (flat array for easier handling)
  const allOptions =
    optGroups.length > 0
      ? optGroups.flatMap((group) => group.options)
      : options;

  const selectedOption = allOptions.find((option) => option.value === value);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
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
    // Create a synthetic event to maintain compatibility
    const syntheticEvent = {
      target: { value: optionValue },
      currentTarget: { value: optionValue },
    } as React.ChangeEvent<HTMLSelectElement>;

    onChange(syntheticEvent);
    setIsOpen(false);
    setHighlightedIndex(-1);
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
            prev < allOptions.length - 1 ? prev + 1 : 0
          );
        }
        break;
      case "ArrowUp":
        e.preventDefault();
        if (isOpen) {
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : allOptions.length - 1
          );
        }
        break;
      case "Enter":
      case " ":
        e.preventDefault();
        if (!isOpen) {
          setIsOpen(true);
        } else if (highlightedIndex >= 0 && allOptions[highlightedIndex]) {
          handleOptionSelect(allOptions[highlightedIndex].value);
        }
        break;
      case "Escape":
        e.preventDefault();
        setIsOpen(false);
        setHighlightedIndex(-1);
        break;
    }
  };

  const getSelectClass = () => {
    let baseClass = "custom-select";
    if (size === "small") baseClass += " custom-select--small";
    if (size === "large") baseClass += " custom-select--large";
    if (error) baseClass += " custom-select--error";
    if (disabled) baseClass += " custom-select--disabled";
    if (isOpen) baseClass += " custom-select--open";
    if (className) baseClass += ` ${className}`;
    return baseClass;
  };

  const hasError = error;
  const errorMessage = typeof error === "string" ? error : "";

  return (
    <div className="form-group" ref={dropdownRef}>
      {label && (
        <label htmlFor={id} className="form-label">
          {label}
          {required && <span className="required-asterisk">*</span>}
        </label>
      )}

      <div className={getSelectClass()}>
        <div
          className="custom-select__trigger"
          onClick={() => !disabled && setIsOpen(!isOpen)}
          onKeyDown={handleKeyDown}
          tabIndex={disabled ? -1 : 0}
          role="combobox"
          aria-expanded={isOpen}
          aria-haspopup="listbox"
          aria-labelledby={label ? `${id}-label` : undefined}
        >
          <span className="custom-select__value">
            {selectedOption ? selectedOption.label : placeholder}
          </span>
          <span className="custom-select__arrow">{isOpen ? "▲" : "▼"}</span>
        </div>

        <div className="custom-select__dropdown">
          {isOpen && (
            <div className="custom-select__options" role="listbox">
              {!selectedOption && (
                <div
                  className="custom-select__option custom-select__option--placeholder"
                  onClick={() => handleOptionSelect("")}
                  role="option"
                  aria-selected={false}
                >
                  {placeholder}
                </div>
              )}

              {optGroups.length > 0
                ? // Render with optgroups
                  optGroups.map((group) => (
                    <div key={group.label} className="custom-select__group">
                      <div className="custom-select__group-label">
                        {group.label}
                      </div>
                      {group.options.map((option, index) => {
                        const globalIndex = allOptions.findIndex(
                          (o) => o.value === option.value
                        );
                        return (
                          <div
                            key={option.value}
                            className={`custom-select__option ${
                              value === option.value
                                ? "custom-select__option--selected"
                                : ""
                            } ${
                              globalIndex === highlightedIndex
                                ? "custom-select__option--highlighted"
                                : ""
                            }`}
                            onClick={() => handleOptionSelect(option.value)}
                            onMouseEnter={() =>
                              setHighlightedIndex(globalIndex)
                            }
                            role="option"
                            aria-selected={value === option.value}
                          >
                            <span className="custom-select__option-label">
                              {option.label}
                            </span>
                            {value === option.value && (
                              <span className="custom-select__option-check">
                                ✓
                              </span>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  ))
                : // Render flat options
                  options.map((option, index) => (
                    <div
                      key={option.value}
                      className={`custom-select__option ${
                        value === option.value
                          ? "custom-select__option--selected"
                          : ""
                      } ${
                        index === highlightedIndex
                          ? "custom-select__option--highlighted"
                          : ""
                      }`}
                      onClick={() => handleOptionSelect(option.value)}
                      onMouseEnter={() => setHighlightedIndex(index)}
                      role="option"
                      aria-selected={value === option.value}
                    >
                      <span className="custom-select__option-label">
                        {option.label}
                      </span>
                      {value === option.value && (
                        <span className="custom-select__option-check">✓</span>
                      )}
                    </div>
                  ))}
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

export default Select;
