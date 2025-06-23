export interface GPAScale {
  value: string;
  label: string;
  description?: string;
  maxValue: number;
  commonIn: string[];
}

export const gpaScales: GPAScale[] = [
  { value: "", label: "Select GPA Scale", maxValue: 0, commonIn: [] },
  {
    value: "4.0",
    label: "4.0 Scale (US Standard)",
    description: "Most common in United States",
    maxValue: 4.0,
    commonIn: ["United States", "Canada", "Philippines"]
  },
  {
    value: "4.33",
    label: "4.33 Scale (Canadian)",
    description: "Common in Canadian universities",
    maxValue: 4.33,
    commonIn: ["Canada"]
  },
  {
    value: "5.0",
    label: "5.0 Scale (Weighted)",
    description: "Weighted GPA system",
    maxValue: 5.0,
    commonIn: ["United States (Weighted)", "Germany"]
  },
  {
    value: "10.0",
    label: "10.0 Scale",
    description: "Common in Indian and European systems",
    maxValue: 10.0,
    commonIn: ["India", "CGPA System", "Some European countries"]
  },
  {
    value: "100",
    label: "100 Point Scale (Percentage)",
    description: "Percentage-based grading system",
    maxValue: 100,
    commonIn: ["Many international systems", "High schools"]
  }
];

export const getGPAScaleByValue = (value: string): GPAScale | undefined => {
  return gpaScales.find(scale => scale.value === value);
};

export const getGPAScaleLabel = (value: string): string => {
  const scale = getGPAScaleByValue(value);
  return scale ? scale.label : "";
};

export const getGPAScaleMaxValue = (value: string): number => {
  const scale = getGPAScaleByValue(value);
  return scale ? scale.maxValue : 0;
};

export const getGPAScaleDescription = (value: string): string => {
  const scale = getGPAScaleByValue(value);
  return scale ? scale.description || "" : "";
};

export const getCommonRegions = (value: string): string[] => {
  const scale = getGPAScaleByValue(value);
  return scale ? scale.commonIn : [];
};

// Helper function to validate GPA value against scale
export const validateGPAValue = (gpaValue: string, scaleValue: string): { isValid: boolean; errorMessage: string } => {
  if (!gpaValue || !scaleValue) {
    return { isValid: true, errorMessage: "" };
  }

  const numericGPA = parseFloat(gpaValue);
  const scale = getGPAScaleByValue(scaleValue);

  if (!scale) {
    return { isValid: false, errorMessage: "Invalid GPA scale selected" };
  }

  if (isNaN(numericGPA)) {
    return { isValid: false, errorMessage: "GPA value must be a valid number" };
  }

  if (numericGPA < 0) {
    return { isValid: false, errorMessage: "GPA value cannot be negative" };
  }

  if (numericGPA > scale.maxValue) {
    return { isValid: false, errorMessage: `GPA value cannot exceed ${scale.maxValue} for ${scale.label}` };
  }

  return { isValid: true, errorMessage: "" };
};

// Helper function to get grade quality based on percentage
export const getGradeQuality = (gpaValue: string, scaleValue: string): string => {
  if (!gpaValue || !scaleValue) return "";
  
  const numericGPA = parseFloat(gpaValue);
  const scale = getGPAScaleByValue(scaleValue);
  
  if (!scale || isNaN(numericGPA)) return "";
  
  const percentage = (numericGPA / scale.maxValue) * 100;
  
  if (percentage >= 95) return "Outstanding";
  if (percentage >= 90) return "Excellent";
  if (percentage >= 85) return "Very Good";
  if (percentage >= 80) return "Good";
  if (percentage >= 75) return "Above Average";
  if (percentage >= 70) return "Average";
  if (percentage >= 60) return "Below Average";
  if (percentage >= 50) return "Pass";
  return "Fail";
};