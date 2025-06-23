export interface GCSEGrade {
  value: string;
  label: string;
  description?: string;
}

export const gcseGrades: GCSEGrade[] = [
    { value: "", label: "Select GCSE Grade" },
    { value: "9", label: "Grade 9"},
    { value: "8", label: "Grade 8"},
    { value: "7", label: "Grade 7"},
    { value: "6", label: "Grade 6" },
    { value: "5", label: "Grade 5" },
    { value: "4", label: "Grade 4" },
    { value: "3", label: "Grade 3" },
    { value: "2", label: "Grade 2" },
    { value: "1", label: "Grade 1" },
    { value: "u", label: "U (Ungraded)" },
];

export const getGCSEGradeByValue = (value: string): GCSEGrade | undefined => {
  return gcseGrades.find(grade => grade.value === value);
};

export const getGCSEGradeLabel = (value: string): string => {
  const grade = getGCSEGradeByValue(value);
  return grade ? grade.label : "";
};