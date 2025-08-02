import type { GrantProgram, EvaluationScale } from "./grantProgram";
import type { EligibilityCriteriaDTO } from "../data/questionEligibilityInfoDto";
import type { QuestionEligibilityInfoDto, QuestionGroupEligibilityInfoDto } from "../data/questionEligibilityInfoDto";

export type ApplicationStatus =
  | "draft"
  | "applied"
  | "under selection process"
  | "selected"
  | "not selected"
  | "canceled";

export interface Answer {
  questionId: string;
  answer: any[];
}

export interface StudentAnswerDto {
  id: string;
  studentId: string;
  questionId: string;
  applicationId: string[];
  questionGroupId: string;
  answer: Answer[];
  questionText: string;
  optionText: string;
}

export interface EligibilityResultDto {
  id: string;
  studentId: string;
  applicationId: string;
  grantProgramId: string;
  eligible: boolean;
  evaluatedAt: string; // ISO string
  updatedAt: string;   // ISO string
  failedCriteria: string[];
  passedCriteria: string[];
}

export interface ApplicationDto {
  id: string;
  studentId: string;
  grantProgramId: string;
  status: ApplicationStatus;
  submittedAt: string; // ISO string
  updatedAt: string;   // ISO string
  eligibilityResult: EligibilityResultDto;
  studentAnswers: Record<string, StudentAnswerDto>;
}

export interface GrantProgramApplicationDto {
  grantProgram: GrantProgram;
  application: ApplicationDto;
}

export interface EligibilityCriteriaWithQuestionDto {
  eligibilityCriteria: EligibilityCriteriaDTO;
  question: QuestionEligibilityInfoDto | null;
  questionGroup: QuestionGroupEligibilityInfoDto | null;
}

export interface EvaluationOfAnswerDto {
  id: string;
  studentAnswerId: string;
  applicationId: string;
  grantProgramId: string;
  evaluatorId: string; // providerStaffId
  questionId: string;
  questionGroupId: string;
  value: number;
  evaluationScale: EvaluationScale;
  createdAt: string; // ISO string
  updatedAt: string; // ISO string
}

