export interface GenderType {
  value: string;
  label: string;
  category: 'traditional' | 'non-binary' | 'other';
}

export const genders: GenderType[] = [
  { value: "", label: "Select Gender", category: 'other' },
  
  // Traditional
  { value: "male", label: "Male", category: 'traditional' },
  { value: "female", label: "Female", category: 'traditional' },
  
  // Non-Binary and Gender Diverse
  { value: "non-binary", label: "Non-Binary", category: 'non-binary' },
  { value: "genderfluid", label: "Gender Fluid", category: 'non-binary' },
  { value: "genderqueer", label: "Genderqueer", category: 'non-binary' },
  { value: "agender", label: "Agender", category: 'non-binary' },
  { value: "bigender", label: "Bigender", category: 'non-binary' },
  { value: "demigender", label: "Demigender", category: 'non-binary' },
  { value: "pangender", label: "Pangender", category: 'non-binary' },
  { value: "two-spirit", label: "Two-Spirit", category: 'non-binary' },
  
  // Other
  { value: "transgender-male", label: "Transgender Male", category: 'other' },
  { value: "transgender-female", label: "Transgender Female", category: 'other' },
  { value: "questioning", label: "Questioning", category: 'other' },
  { value: "prefer-not-to-say", label: "Prefer Not to Say", category: 'other' },
  { value: "self-describe", label: "Self-Describe", category: 'other' },
  { value: "other", label: "Other", category: 'other' },
];

export const genderCategories = {
  traditional: "Traditional",
  'non-binary': "Non-Binary & Gender Diverse",
  other: "Other"
};

export const getGendersByCategory = (category: GenderType['category']): GenderType[] => {
  return genders.filter(gender => gender.category === category && gender.value !== "");
};

export const getGenderByValue = (value: string): GenderType | undefined => {
  return genders.find(gender => gender.value === value);
};

export const getGenderLabel = (value: string): string => {
  const gender = getGenderByValue(value);
  return gender ? gender.label : "";
};

export const searchGenders = (query: string): GenderType[] => {
  if (!query.trim()) return genders;
  
  const searchTerm = query.toLowerCase().trim();
  return genders.filter(gender =>
    gender.label.toLowerCase().includes(searchTerm) ||
    gender.value.toLowerCase().includes(searchTerm)
  );
};