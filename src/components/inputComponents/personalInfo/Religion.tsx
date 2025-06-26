import React from "react";
import SearchableDropdown, {
  type SearchableOption,
  type SearchableCategory,
} from "../SearchableDropdown";
import {
  religions,
  religionCategories,
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

const Religion: React.FC<ReligionProps> = (props) => {
  // Convert religion data to SearchableOption format
  const religionOptions: SearchableOption[] = religions.map((religion) => ({
    value: religion.value,
    label: religion.label,
    category: religion.category,
  }));

  // Search function for religions
  const searchReligionsFunction = (
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

  // Categorize religions
  const getCategorizedReligions = (
    options: SearchableOption[]
  ): SearchableCategory => {
    return Object.entries(religionCategories).reduce(
      (acc, [categoryKey, categoryLabel]) => {
        const categoryReligions = options.filter(
          (option) => option.category === categoryKey && option.value !== ""
        );
        if (categoryReligions.length > 0) {
          acc[categoryKey] = {
            label: categoryLabel,
            options: categoryReligions,
          };
        }
        return acc;
      },
      {} as SearchableCategory
    );
  };

  return (
    <SearchableDropdown
      {...props}
      options={religionOptions}
      searchFunction={searchReligionsFunction}
      getCategorizedOptions={getCategorizedReligions}
      className="religion"
      placeholder={props.placeholder || "Search and select your religion"}
    />
  );
};

export default Religion;
