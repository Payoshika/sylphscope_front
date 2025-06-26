export interface EthnicityType {
  value: string;
  label: string;
  category: 'asian' | 'black' | 'hispanic' | 'white' | 'mixed' | 'other';
}

export const ethnicities: EthnicityType[] = [
  { value: "", label: "Select Ethnicity", category: 'other' },
  
  // Asian
  { value: "asian-east", label: "East Asian", category: 'asian' },
  { value: "asian-south", label: "South Asian", category: 'asian' },
  { value: "asian-southeast", label: "Southeast Asian", category: 'asian' },
  { value: "asian-other", label: "Other Asian", category: 'asian' },
  
  // Black or African
  { value: "black-african", label: "Black African", category: 'black' },
  { value: "black-caribbean", label: "Black Caribbean", category: 'black' },
  { value: "black-american", label: "African American", category: 'black' },
  { value: "black-other", label: "Other Black", category: 'black' },
  
  // Hispanic or Latino
  { value: "hispanic-latino", label: "Hispanic or Latino", category: 'hispanic' },
  { value: "hispanic-mexican", label: "Mexican", category: 'hispanic' },
  { value: "hispanic-other", label: "Other Hispanic/Latino", category: 'hispanic' },
  
  // White or Caucasian
  { value: "white-european", label: "White European", category: 'white' },
  { value: "white-american", label: "White American", category: 'white' },
  { value: "white-british", label: "White British", category: 'white' },
  { value: "white-other", label: "Other White", category: 'white' },
  
  // Mixed or Multiracial
  { value: "mixed-white-asian", label: "Mixed White and Asian", category: 'mixed' },
  { value: "mixed-white-black", label: "Mixed White and Black", category: 'mixed' },
  { value: "mixed-other", label: "Other Mixed Background", category: 'mixed' },
  
  // Other
  { value: "middle-eastern", label: "Middle Eastern", category: 'other' },
  { value: "native-american", label: "Native American or Indigenous", category: 'other' },
  { value: "pacific-islander", label: "Pacific Islander", category: 'other' },
  { value: "prefer-not-to-say", label: "Prefer Not to Say", category: 'other' },
  { value: "other", label: "Other", category: 'other' },
];

export const ethnicityCategories = {
  asian: "Asian",
  black: "Black or African",
  hispanic: "Hispanic or Latino",
  white: "White or Caucasian",
  mixed: "Mixed or Multiracial",
  other: "Other"
};

export const getEthnicitiesByCategory = (category: EthnicityType['category']): EthnicityType[] => {
  return ethnicities.filter(ethnicity => ethnicity.category === category && ethnicity.value !== "");
};

export const getEthnicityByValue = (value: string): EthnicityType | undefined => {
  return ethnicities.find(ethnicity => ethnicity.value === value);
};

export const getEthnicityLabel = (value: string): string => {
  const ethnicity = getEthnicityByValue(value);
  return ethnicity ? ethnicity.label : "";
};

export const searchEthnicities = (query: string): EthnicityType[] => {
  if (!query.trim()) return ethnicities;
  
  const searchTerm = query.toLowerCase().trim();
  return ethnicities.filter(ethnicity =>
    ethnicity.label.toLowerCase().includes(searchTerm) ||
    ethnicity.value.toLowerCase().includes(searchTerm)
  );
};