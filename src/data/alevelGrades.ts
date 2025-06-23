export interface ALevelGrade {
  value: string;
  label: string;
  description?: string;
  ucasPoints?: number;
}

export const alevelGrades: ALevelGrade[] = [
    { value: "", label: "Select A-Level Grade" },
    { value: "a-star", label: "A*", ucasPoints: 56 },
    { value: "a", label: "A", ucasPoints: 48 },
    { value: "b", label: "B", ucasPoints: 40 },
    { value: "c", label: "C", ucasPoints: 32 },
    { value: "d", label: "D", ucasPoints: 24 },
    { value: "e", label: "E", ucasPoints: 16 },
    { value: "u", label: "U (Ungraded)", ucasPoints: 0 },
];

export const getALevelGradeByValue = (value: string): ALevelGrade | undefined => {
  return alevelGrades.find(grade => grade.value === value);
};

export const getALevelGradeLabel = (value: string): string => {
  const grade = getALevelGradeByValue(value);
  return grade ? grade.label : "";
};

export const getUCASPoints = (value: string): number => {
  const grade = getALevelGradeByValue(value);
  return grade ? grade.ucasPoints || 0 : 0;
};