import type { GrantProgramDto } from "./grantProgram";
import type { EligibilityCriteriaRequestDto } from "./eligibilityCriteria";
import type { QuestionDto } from "./question";
import type { QuestionGroupDto } from "./questionGroup";
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
  isEligible: boolean;
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
  grantProgram: GrantProgramDto;
  application: ApplicationDto;
}

export interface EligibilityCriteriaWithQuestionDto {
  eligibilityCriteria: EligibilityCriteriaRequestDto;
  question: QuestionEligibilityInfoDto | null;
  questionGroup: QuestionGroupEligibilityInfoDto | null;
}