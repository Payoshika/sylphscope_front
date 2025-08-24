import type { ComparisonOperator } from "../data/questionEligibilityInfoDto";

function parseDateString(date: string): Date | null {
  if (!date || typeof date !== "string") return null;
  const parts = date.split(/[-\/]/);
  if (parts.length !== 3) return null;
  const [year, month, day] = parts.map(Number);
  if (!year || !month || !day) return null;
  return new Date(year, month - 1, day);
}

function dateObjToString(dateObj: { day: string; month: string; year: string }): string {
  if (!dateObj || !dateObj.year || !dateObj.month || !dateObj.day) return "";
  return `${dateObj.year}-${dateObj.month.padStart(2, "0")}-${dateObj.day.padStart(2, "0")}`;
}

export function doesAnswerMeetCriteria(
  answer: any,
  operator: ComparisonOperator,
  values: any[]
): boolean {
  // Handle date type answers (array of date objects)
  const isDateComparison =
    values.length > 0 &&
    (typeof values[0] === "object" && values[0].day != null);

  let answerDateStr = "";
  if (isDateComparison) {
    if (Array.isArray(answer) && answer.length > 0 && typeof answer[0] === "object" && answer[0].day != null) {
      answerDateStr = dateObjToString(answer[0]);
    } else if (typeof answer === "object" && answer.day != null) {
      answerDateStr = dateObjToString(answer);
    } else if (typeof answer === "string") {
      answerDateStr = answer;
    }
    const valueDateStr = dateObjToString(values[0]);
    const answerDate = parseDateString(answerDateStr);
    const valueDate = parseDateString(valueDateStr);
    if (!answerDate || !valueDate) return false;

    switch (operator) {
      case "equals":
        return answerDate.getTime() === valueDate.getTime();
      case "not_equals":
        return answerDate.getTime() !== valueDate.getTime();
      case "greater_than":
        return answerDate.getTime() > valueDate.getTime();
      case "less_than":
        return answerDate.getTime() < valueDate.getTime();
      case "greater_than_or_equal":
        return answerDate.getTime() >= valueDate.getTime();
      case "less_than_or_equal":
        return answerDate.getTime() <= valueDate.getTime();
      default:
        return false;
    }
  }

  // Normalize string answers and values for case-insensitive comparison
  const normalizeForComparison = (value: any): any => {
    if (typeof value === "string") {
      return value.toLowerCase();
    }
    if (Array.isArray(value)) {
      return value.map(v => typeof v === "string" ? v.toLowerCase() : v);
    }
    return value;
  };

  const normalizedAnswer = normalizeForComparison(answer);
  const normalizedValues = values.map(normalizeForComparison);

  // Non-date logic (original)
  switch (operator) {
    case "equals":
      return normalizedValues.some(v => v === normalizedAnswer);
    case "not_equals":
      return normalizedValues.every(v => v !== normalizedAnswer);
    case "greater_than":
      return typeof answer === "number" && answer > values[0];
    case "less_than":
      return typeof answer === "number" && answer < values[0];
    case "greater_than_or_equal":
      return typeof answer === "number" && answer >= values[0];
    case "less_than_or_equal":
      return typeof answer === "number" && answer <= values[0];
    case "in_list":
      return Array.isArray(normalizedAnswer)
        ? normalizedAnswer.some(a => normalizedValues.includes(a))
        : normalizedValues.includes(normalizedAnswer);
    case "not_in_list":
      return Array.isArray(normalizedAnswer)
        ? normalizedAnswer.every(a => !normalizedValues.includes(a))
        : !normalizedValues.includes(normalizedAnswer);
    case "contains":
      return typeof normalizedAnswer === "string" && normalizedValues.some(v => 
        typeof v === "string" && normalizedAnswer.includes(v)
      );
    case "not_contains":
      return typeof normalizedAnswer === "string" && normalizedValues.every(v => 
        typeof v === "string" && !normalizedAnswer.includes(v)
      );
    case "exists":
      return answer !== undefined && answer !== null && answer !== "";
    case "not_exists":
      return answer === undefined || answer === null || answer === "";
    default:
      return false;
  }
}
