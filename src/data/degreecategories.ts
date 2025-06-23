export interface DegreeCategory {
  value: string;
  label: string;
}

export interface DegreeLevel {
  value: string;
  label: string;
  description?: string;
}

export const degreeCategories: DegreeCategory[] = [
  { value: "", label: "Select Degree Category" },
  { value: "computer-science", label: "Computer Science & Information Technology" },
  { value: "engineering", label: "Engineering" },
  { value: "business-management", label: "Business & Management" },
  { value: "arts-humanities", label: "Arts & Humanities" },
  { value: "social-sciences", label: "Social Sciences" },
  { value: "natural-sciences", label: "Natural Sciences & Mathematics" },
  { value: "health-medicine", label: "Health & Medicine" },
  { value: "creative-arts", label: "Creative Arts & Design" },
  { value: "education", label: "Education" },
  { value: "interdisciplinary", label: "Interdisciplinary Studies / Liberal Arts" },
];

export const degreeLevels: DegreeLevel[] = [
  { value: "", label: "Select Degree Level" },
  // Undergraduate Levels
  {
    value: "certificate",
    label: "Certificate",
    description: "Short-term qualification (typically 3-6 months)"
  },
  {
    value: "diploma",
    label: "Diploma",
    description: "Vocational qualification (typically 1-2 years)"
  },
  {
    value: "associate",
    label: "Associate Degree",
    description: "Two-year undergraduate degree (common in US/Canada)"
  },
  {
    value: "bachelor",
    label: "Bachelor's Degree",
    description: "Undergraduate degree (typically 3-4 years)"
  },
  // Graduate Levels
  {
    value: "graduate-certificate",
    label: "Graduate Certificate",
    description: "Postgraduate certificate (typically 6 months-1 year)"
  },
  {
    value: "graduate-diploma",
    label: "Graduate Diploma",
    description: "Postgraduate diploma (typically 1 year)"
  },
  {
    value: "master",
    label: "Master's Degree",
    description: "Postgraduate degree (typically 1-2 years)"
  },
  // Doctoral Levels
  {
    value: "doctorate",
    label: "Doctorate/PhD",
    description: "Highest academic degree (typically 3-7 years)"
  },
  {
    value: "professional-doctorate",
    label: "Professional Doctorate",
    description: "Practice-focused doctorate (e.g., EdD, DBA, PsyD)"
  },
  // Professional Degrees
  {
    value: "professional",
    label: "Professional Degree",
    description: "Specialized professional qualification (e.g., JD, MD, DDS)"
  },
];

export const getDegreeCategoryByValue = (value: string): DegreeCategory | undefined => {
  return degreeCategories.find(category => category.value === value);
};

export const getDegreeCategoryLabel = (value: string): string => {
  const category = getDegreeCategoryByValue(value);
  return category ? category.label : "";
};

export const getDegreeLevelByValue = (value: string): DegreeLevel | undefined => {
  return degreeLevels.find(level => level.value === value);
};

export const getDegreeLevelLabel = (value: string): string => {
  const level = getDegreeLevelByValue(value);
  return level ? level.label : "";
};

// Helper function to get degree levels by academic progression
export const getDegreeLevelsByType = (type: 'undergraduate' | 'graduate' | 'doctoral' | 'professional') => {
  switch (type) {
    case 'undergraduate':
      return degreeLevels.filter(level => 
        ['certificate', 'diploma', 'associate', 'bachelor'].includes(level.value)
      );
    case 'graduate':
      return degreeLevels.filter(level => 
        ['graduate-certificate', 'graduate-diploma', 'master'].includes(level.value)
      );
    case 'doctoral':
      return degreeLevels.filter(level => 
        ['doctorate', 'professional-doctorate'].includes(level.value)
      );
    case 'professional':
      return degreeLevels.filter(level => 
        level.value === 'professional'
      );
    default:
      return degreeLevels;
  }
};