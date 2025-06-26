import React from "react";
import SearchableDropdown, {
  type SearchableOption,
  type SearchableCategory,
} from "../SearchableDropdown";
import {
  ethnicities,
  ethnicityCategories,
  searchEthnicities,
  type EthnicityType,
} from "../../../data/ethnicities";

interface EthnicityProps {
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

const Ethnicity: React.FC<EthnicityProps> = (props) => {
  // Convert ethnicity data to SearchableOption format
  const ethnicityOptions: SearchableOption[] = ethnicities.map((ethnicity) => ({
    value: ethnicity.value,
    label: ethnicity.label,
    category: ethnicity.category,
  }));

  // Search function for ethnicities
  const searchEthnicitiesFunction = (
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

  // Categorize ethnicities
  const getCategorizedEthnicities = (
    options: SearchableOption[]
  ): SearchableCategory => {
    return Object.entries(ethnicityCategories).reduce(
      (acc, [categoryKey, categoryLabel]) => {
        const categoryEthnicities = options.filter(
          (option) => option.category === categoryKey && option.value !== ""
        );
        if (categoryEthnicities.length > 0) {
          acc[categoryKey] = {
            label: categoryLabel,
            options: categoryEthnicities,
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
      options={ethnicityOptions}
      searchFunction={searchEthnicitiesFunction}
      getCategorizedOptions={getCategorizedEthnicities}
      className="ethnicity"
      placeholder={props.placeholder || "Search and select your ethnicity"}
    />
  );
};

export default Ethnicity;
