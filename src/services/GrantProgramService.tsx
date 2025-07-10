import { apiClient } from "../utility/ApiClient";
import type { GrantProgram } from "../types/grantProgram";
import type { QuestionEligibilityInfoDto, EligibilityCriteriaDTO } from "../data/questionEligibilityInfoDto";

export const createGrantProgram = async (grantProgram: GrantProgram) => {
const { id, createdAt, updatedAt, ...grantProgramData } = grantProgram;
return apiClient.post("/api/grant-programs", grantProgramData);
};

export const updateGrantProgram = async (id: string | number, grantProgram: GrantProgram) => {
  console.log("Updating grant program:", id, grantProgram);

  return apiClient.put(`/api/grant-programs/${id}`, grantProgram);
};

export const fetchEligibilityQuestions = async (): Promise<QuestionEligibilityInfoDto[]> => {
  const response = await apiClient.get<QuestionEligibilityInfoDto[]>("/api/questions/questions-for-eligibility");
  return response.data || [];
};

export const getEligibilityCriteria = async (grantProgramId: string) => {
  const response = await apiClient.get<EligibilityCriteriaDTO[]>(`/api/eligibility-criteria/by-grant-program/${grantProgramId}`);
  return response.data || [];
};

export const createEligibilityCriteria = async (criteriaList: EligibilityCriteriaDTO[]) => {
  return apiClient.post("/api/eligibility-criteria/simple/batch", criteriaList);
};

