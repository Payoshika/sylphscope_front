import { apiClient } from "../utility/ApiClient";
import type { ApplicationDto, GrantProgramApplicationDto, StudentAnswerDto, EligibilityCriteriaWithQuestionDto } from "../types/application";

export const createApplicationByStudentAndGrantProgramId = async (
  studentId: string,
  grantProgramId: string
): Promise<ApplicationDto> => {
  const response = await apiClient.post<ApplicationDto>(
    `/api/applications/student/${studentId}/grant-program/${grantProgramId}`
  );
  if (!response.data) {
    throw new Error("Failed to create application");
}
console.log(response.data); 
    return response.data;
};

export const getGrantProgramAndApplicationByStudentId = async (
  studentId: string
): Promise<GrantProgramApplicationDto[]> => {
  const response = await apiClient.get<GrantProgramApplicationDto[]>(
    `/api/applications/student/${studentId}/grant-program-applications`
  );
  if (!response.data) {
    throw new Error("Failed to fetch grant program applications");
  }
  return response.data;
};

export const getGrantProgramAndApplicationByStudentIdandGrantProgramId = async (
  studentId: string,
  grantProgramId: string
): Promise<GrantProgramApplicationDto> => {
  const response = await apiClient.get<GrantProgramApplicationDto>(
    `/api/applications/student/${studentId}/grant-program/${grantProgramId}/grant-program-application`
  );
  if (!response.data) {
    throw new Error("Grant program application not found");
  }
  return response.data;
};

export const getEligibilityCriteriaAndQuestionFromGrantProgramId = async (
  grantProgramId: string
): Promise<EligibilityCriteriaWithQuestionDto[]> => {
  const response = await apiClient.get<EligibilityCriteriaWithQuestionDto[]>(
    `/api/eligibility-criteria/criteria-and-question/by-grant-program/${grantProgramId}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch eligibility criteria and questions");
  }
  return response.data;
};

export const getAnswersByApplicationId = async (
  studentId: string,
  applicationId: string
): Promise<StudentAnswerDto[]> => {
  const response = await apiClient.get<StudentAnswerDto[]>(
    `/api/student-answers/by-application?studentId=${studentId}&applicationId=${applicationId}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch answers by application ID");
  }
  return response.data;
};

export const updateAnswers = async (
  studentId: string,
  grantProgramId: string,
  answerDtos: StudentAnswerDto[]
): Promise<StudentAnswerDto[]> => {
  const response = await apiClient.put<StudentAnswerDto[]>(
    `/api/student-answers/update?studentId=${studentId}&grantProgramId=${grantProgramId}`,
    answerDtos
  );
  if (!response.data) {
    throw new Error("Failed to update answers");
  }
  return response.data;
};