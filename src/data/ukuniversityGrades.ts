export interface UKUniversityGrade {
  value: string;
  label: string;
  description?: string;
  category: 'honours' | 'ordinary' | 'postgraduate';
}

export const ukUniversityGrades: UKUniversityGrade[] = [
  {
      value: "", label: "Select University Grade",
      category: "honours"
  },
  
  // Honours Degrees
  { 
    value: "first", 
    label: "First Class Honours (1st)", 
    description: "70% and above",
    category: 'honours'
  },
  { 
    value: "upper-second", 
    label: "Upper Second Class Honours (2:1)", 
    description: "60-69%",
    category: 'honours'
  },
  { 
    value: "lower-second", 
    label: "Lower Second Class Honours (2:2)", 
    description: "50-59%",
    category: 'honours'
  },
  { 
    value: "third", 
    label: "Third Class Honours (3rd)", 
    description: "40-49%",
    category: 'honours'
  },
  
  // Ordinary Degrees
  { 
    value: "first", 
    label: "First Class Degree", 
    description: "70% and above",
    category: 'ordinary'
  },
  { 
    value: "second", 
    label: "Second Class Degree", 
    description: "60-69%",
    category: 'ordinary'
  },
  { 
    value: "pass", 
    label: "Pass Degree", 
    description: "40% and above",
    category: 'ordinary'
  },
  { 
    value: "fail", 
    label: "Fail", 
    description: "Below 40%",
    category: 'ordinary'
  },
  
  // Postgraduate Classifications
  { 
    value: "distinction", 
    label: "Distinction", 
    description: "70% and above",
    category: 'postgraduate'
  },
  { 
    value: "merit", 
    label: "Merit", 
    description: "60-69%",
    category: 'postgraduate'
  },
  { 
    value: "pass-postgrad", 
    label: "Pass", 
    description: "50-59%",
    category: 'postgraduate'
  },
];

export const getUKUniversityGradeByValue = (value: string): UKUniversityGrade | undefined => {
  return ukUniversityGrades.find(grade => grade.value === value);
};

export const getUKUniversityGradeLabel = (value: string): string => {
  const grade = getUKUniversityGradeByValue(value);
  return grade ? grade.label : "";
};

export const getUKUniversityGradesByCategory = (category: 'honours' | 'ordinary' | 'postgraduate'): UKUniversityGrade[] => {
  return ukUniversityGrades.filter(grade => grade.category === category || grade.value === "");
};