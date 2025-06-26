import React from "react";
import SearchableDropdown, {
  type SearchableOption,
  type SearchableCategory,
} from "../SearchableDropdown";
import {
  genders,
  genderCategories,
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
  allowCustomInput?: boolean;
  customValue?: string;
  onCustomChange?: (value: string) => void;
  onValidationChange?: (isValid: boolean, errorMessage: string) => void;
}

const Gender: React.FC<GenderProps> = (props) => {
  // Convert gender data to SearchableOption format
  const genderOptions: SearchableOption[] = genders.map((gender) => ({
    value: gender.value,
    label: gender.label,
    category: gender.category,
  }));

  // Search function for genders
  const searchGendersFunction = (
    query: string,
    options: SearchableOption[]
  ) => {
    if (!query.trim()) return options;
    const searchTerm = query.toLowerCase().trim();
    return options.filter(
      (option) =>
        option.label.toLowerCase().includes(searchTerm) ||
        option.value.toLowerCase().includes(searchTerm)
    );
  };

  // Categorize genders
  const getCategorizedGenders = (
    options: SearchableOption[]
  ): SearchableCategory => {
    return Object.entries(genderCategories).reduce(
      (acc, [categoryKey, categoryLabel]) => {
        const categoryGenders = options.filter(
          (option) => option.category === categoryKey && option.value !== ""
        );
        if (categoryGenders.length > 0) {
          acc[categoryKey] = {
            label: categoryLabel,
            options: categoryGenders,
          };
        }
        return acc;
      },
      {} as SearchableCategory
    );
  };

  // Custom option renderer for gender (adds checkmark for selected)
  const renderGenderOption = (
    option: SearchableOption,
    isSelected: boolean,
    isHighlighted: boolean
  ) => (
    <span className="gender__option-content">
      <span className="gender__label">{option.label}</span>
      {isSelected && <span className="gender__selected-icon">✓</span>}
    </span>
  );

  return (
    <SearchableDropdown
      {...props}
      options={genderOptions}
      searchFunction={searchGendersFunction}
      getCategorizedOptions={getCategorizedGenders}
      renderOption={renderGenderOption}
      className="gender"
      placeholder={
        props.placeholder || "Search and select your gender identity"
      }
      // Custom input configuration
      allowCustomInput={props.allowCustomInput ?? true}
      customInputTriggerValue="self-describe"
      customValue={props.customValue}
      onCustomChange={props.onCustomChange}
      customInputPlaceholder="Enter your gender identity"
      customInputLabel="Please describe your gender:"
    />
  );
};

export default Gender;
