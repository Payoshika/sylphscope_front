export const GrantStatus = {
    DRAFT: "DRAFT",
    OPEN: "OPEN",
    IN_REVIEW: "IN_REVIEW",
    CLOSED: "CLOSED",
    ARCHIVED: "ARCHIVED"
} as const;
export type GrantStatus = typeof GrantStatus[keyof typeof GrantStatus];
export interface Schedule {
  applicationStartDate: string | null;
  applicationEndDate: string | null;
  decisionDate: string | null;
  fundDisbursementDate: string | null;
}

export interface GrantProgram {
  id: string;
  title: string;
  description: string;
  providerId: string;
  status: GrantStatus;
  schedule: Schedule;
  createdAt: string; 
  updatedAt: string; 
  questionIds: string[];
  questionGroupsIds: string[];
  selectionCriteria: SelectionCriterion[];
  evaluationScale: EvaluationScale;
  award?: number[];
  numOfAward?: number; 
}

export type EvaluationType = "AUTO" | "MANUAL"; // Adjust as needed

export type EvaluationScale = "HUNDRED" | "TEN" | "FIVE" | "A2E";

export interface SelectionCriterion {
  id: string;
  criterionName: string;
  grantProgramId: string;
  questionType: string;
  questionId: string;
  weight: number;
  evaluationType: EvaluationType;
  evaluationScale: EvaluationScale;
}
