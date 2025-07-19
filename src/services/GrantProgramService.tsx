import { apiClient } from "../utility/ApiClient";
import type { GrantProgram, SelectionCriterion } from "../types/grantProgram";
import type { QuestionEligibilityInfoDto, EligibilityCriteriaDTO, Question, Option,QuestionGroupEligibilityInfoDto} from "../data/questionEligibilityInfoDto";

//grant related functions
export const getGrantProgramById = async (id: string | number): Promise<GrantProgram> => {
  const response = await apiClient.get<GrantProgram>(`/api/grant-programs/${id}`);
  if (!response.data) {
    throw new Error("GrantProgram not found");
  }
  return response.data;
};

export const getGrantProgramsByProviderId = async (providerId: string | number): Promise<GrantProgram[]> => {
  const response = await apiClient.get<GrantProgram[]>(`/api/grant-programs/provider/${providerId}`);
  return response.data || [];
};

export const createGrantProgram = async (grantProgram: GrantProgram) => {
const { id, createdAt, updatedAt, ...grantProgramData } = grantProgram;
return apiClient.post("/api/grant-programs", grantProgramData);
};

export const updateGrantProgram = async (id: string | number, grantProgram: GrantProgram) => {
  console.log("Updating grant program:", id, grantProgram);
  return apiClient.put(`/api/grant-programs/${id}`, grantProgram);
};

//Question Related functions
export const createQuestion = async (question: Question, options: Option[] = []) => {
  const { id, ...questionData } = question;
  const payload = {
    "question" : questionData,
    "options" : options,
  };
  console.log(payload);
  const response = await apiClient.post<Question>("/api/questions", payload);
  console.log("createdQuestion for custom Eligibility");
  console.log(response.data);
  return response.data;
};

//Eligibility Related functions
export const fetchEligibilityQuestions = async (): Promise<QuestionEligibilityInfoDto[]> => {
  const response = await apiClient.get<QuestionEligibilityInfoDto[]>("/api/questions/questions-for-eligibility");
  return response.data || [];
};

export const fetchEligibilityQuestionGroups = async (): Promise<QuestionGroupEligibilityInfoDto[]> => {
  const response = await apiClient.get<QuestionGroupEligibilityInfoDto[]>("/api/questions/question-groups-for-eligibility");
  return response.data || [];
};

export const getEligibilityCriteria = async (grantProgramId: string) => {
  const response = await apiClient.get<EligibilityCriteriaDTO[]>(`/api/eligibility-criteria/by-grant-program/${grantProgramId}`);
  return response.data || [];
};

export const createEligibilityCriteria = async (criteriaList: EligibilityCriteriaDTO[]) => {
  return apiClient.post("/api/eligibility-criteria/simple/batch", criteriaList);
};

export const updateEligibilityCriteria = async (criteriaList: EligibilityCriteriaDTO[], grantProgramId: string) => {
  return apiClient.put(`/api/eligibility-criteria/batch?grantProgramId=${grantProgramId}`, criteriaList);
};

export const updateQuestion = async (grantProgramId: string, questionInfoList: QuestionEligibilityInfoDto[]) => {
  console.log("Updating questions for grant program:", grantProgramId, questionInfoList);
  return apiClient.put(`/api/grant-programs/questions/batch?grantProgramId=${grantProgramId}`, questionInfoList);
};

export const getSelectionCriteria = async (grantProgramId: string): Promise<SelectionCriterion[]> => {
  const response = await apiClient.get<SelectionCriterion[]>(`/api/selection-criteria/by-grant-program/${grantProgramId}`);
  return response.data || [];
};

export const updateSelectionCriteria = async (
  grantProgramId: string,
  criteriaList: SelectionCriterion[]
) => {
  console.log("asking update selection criteria", grantProgramId, criteriaList);
  return apiClient.put(`/api/selection-criteria/batch-update/${grantProgramId}`, criteriaList);
};

function toIsoDateString(date: string | { day: string; month: string; year: string } | null): string | null {
  if (!date) return null;
  if (typeof date === "string") {
    if (!date) return null;
    if (date.includes("T")) return date;
    if (date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return `${date}T00:00:00Z`;
    }
    return null;
  }
  // Handle DateValue object
  const { year, month, day } = date;
  if (!year || !month || !day) return null;
  return `${year}-${month.padStart(2, "0")}-${day.padStart(2, "0")}T00:00:00Z`;
}

export const updateGrantProgramSchedule = async (
  grantProgramId: string,
  schedule: GrantProgram["schedule"]
) => {
  console.log("Updating grant program schedule:", grantProgramId, schedule);
  const payload = {
    applicationStartDate: toIsoDateString(schedule.applicationStartDate),
    applicationEndDate: toIsoDateString(schedule.applicationEndDate),
    decisionDate: toIsoDateString(schedule.decisionDate),
    fundDisbursementDate: toIsoDateString(schedule.fundDisbursementDate),
  };
  return apiClient.put(`/api/grant-programs/${grantProgramId}/schedule`, payload);
};