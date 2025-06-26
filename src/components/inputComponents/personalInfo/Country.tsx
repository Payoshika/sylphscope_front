import React from "react";
import SearchableDropdown, {
  type SearchableOption,
} from "../SearchableDropdown";
import {
  countries,
  searchCountries,
  type CountryType,
} from "../../../data/countries";

interface CountryProps {
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
  showFlag?: boolean;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const Country: React.FC<CountryProps> = ({ showFlag = true, ...props }) => {
  // Convert country data to SearchableOption format
  const countryOptions: SearchableOption[] = countries.map((country) => ({
    value: country.code,
    label: country.name,
    flag: country.flag,
    phoneCode: country.phoneCode,
  }));

  // Search function for countries
  const searchCountriesFunction = (
    query: string,
    options: SearchableOption[]
  ) => {
    if (!query.trim()) return options;
    const searchTerm = query.toLowerCase().trim();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchTerm) ||
        option.value.toLowerCase().includes(searchTerm) ||
        (option.phoneCode && option.phoneCode.includes(searchTerm))
    );
  };

  // Custom option renderer for countries
  const renderCountryOption = (
    option: SearchableOption,
    isSelected: boolean,
    isHighlighted: boolean
  ) => (
    <span className="country__option-content">
      {showFlag && option.flag && (
        <span className="country__flag">{option.flag}</span>
      )}
      <span className="country__label">{option.label}</span>
      <span className="country__code">({option.value})</span>
      {isSelected && <span className="country__selected-icon">✓</span>}
    </span>
  );

  return (
    <SearchableDropdown
      {...props}
      options={countryOptions}
      searchFunction={searchCountriesFunction}
      renderOption={renderCountryOption}
      className="country"
      showCategories={false} // Countries don't have categories
      placeholder={props.placeholder || "Search and select your country"}
    />
  );
};

export default Country;
