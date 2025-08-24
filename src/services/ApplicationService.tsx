import { apiClient } from "../utility/ApiClient";
import type { ApplicationDto, GrantProgramApplicationDto, StudentAnswerDto, EligibilityCriteriaWithQuestionDto, EvaluationOfAnswerDto, EligibilityResultDto } from "../types/application";


export const getApplicationsByGrantProgramId = async (
  grantProgramId: string
): Promise<ApplicationDto[]> => {
  const response = await apiClient.get<ApplicationDto[]>(
    `/api/applications/grant-program/${grantProgramId}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch applications by grant program ID");
  }
  console.log("applications for grant program");
  console.log(response.data);
  return response.data;
};

export const getApplicationById = async (
  applicationId: string
): Promise<ApplicationDto> => {
  const response = await apiClient.get<ApplicationDto>(
    `/api/applications/${applicationId}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch application by ID");
  }
  return response.data;
};

export const getApplicationCountByGrantProgramId = async (
  grantProgramId: string
): Promise<number> => {
  const response = await apiClient.get<number>(
    `/api/applications/grant-program/${grantProgramId}/application-count`
  );
  if (typeof response.data !== 'number') {
    throw new Error("Failed to fetch application count by grant program ID");
  }
  return response.data;
};


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

export const getLatestAnswersByStudentId = async (
  studentId: string
): Promise<StudentAnswerDto[]> => {
  const response = await apiClient.get<StudentAnswerDto[]>(
    `/api/student-answers/by-student?studentId=${studentId}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch latest answers by student ID");
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

export const getEvaluationOfAnswerDtoForApplicationAndEvaluatorId = async (
  applicationId: string,
  evaluatorId: string
): Promise<EvaluationOfAnswerDto[]> => {
  const response = await apiClient.get<EvaluationOfAnswerDto[]>(
    `/api/evaluation-of-answers/application/${applicationId}/evaluator/${evaluatorId}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch evaluations by application ID and evaluator ID");
  }
  console.log("Evaluations for application", applicationId, "and evaluator", evaluatorId, ":", response.data);
  return response.data;
};

export const getEvaluationsByApplicationId = async (
  applicationId: string
): Promise<EvaluationOfAnswerDto[]> => {
  const response = await apiClient.get<EvaluationOfAnswerDto[]>(
    `/api/evaluation-of-answers/application/${applicationId}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch evaluations by application ID");
  }
  console.log("Evaluations for application", applicationId, ":", response.data);
  return response.data;
};

export const updateEvaluations = async (
  evaluationDtos: EvaluationOfAnswerDto[]
): Promise<EvaluationOfAnswerDto[]> => {
  const response = await apiClient.put<EvaluationOfAnswerDto[]>(
    `/api/evaluation-of-answers/batch`,
    evaluationDtos
  );
  if (!response.data) {
    throw new Error("Failed to update evaluations");
  }
  console.log("Updated", response.data.length, "evaluations");
  return response.data;
};

export const getEvaluationsByGrantProgramId = async (
  grantProgramId: string
): Promise<EvaluationOfAnswerDto[]> => {
  const response = await apiClient.get<EvaluationOfAnswerDto[]>(
    `/api/evaluation-of-answers/grant-program/${grantProgramId}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch evaluations by grant program ID");
  }
  console.log("Evaluations for grant program", grantProgramId, ":", response.data);
  return response.data;
};

export const addReceiver = async (
  applicationId: string
): Promise<ApplicationDto> => {
  const response = await apiClient.put<ApplicationDto>(
    `/api/applications/${applicationId}/select`
  );
  if (!response.data) {
    throw new Error("Failed to select applicant");
  }
  console.log("Application", applicationId, "status updated to SELECTED");
  return response.data;
};

export const rejectReceiver = async (
  applicationId: string
): Promise<ApplicationDto> => {
  const response = await apiClient.put<ApplicationDto>(
    `/api/applications/${applicationId}/reject`
  );
  if (!response.data) {
    throw new Error("Failed to reject applicant");
  }
  console.log("Application", applicationId, "status updated to NOT_SELECTED");
  return response.data;
};

export const applyGrant = async (
  applicationId: string
): Promise<ApplicationDto> => {
  const response = await apiClient.put<ApplicationDto>(
    `/api/applications/${applicationId}/apply-grant`
  );
  if (!response.data) {
    throw new Error("Failed to apply grant");
  }
  return response.data;
};

export const createEmptyApplication = async (
  applicationDto: ApplicationDto
): Promise<ApplicationDto> => {
  const response = await apiClient.post<ApplicationDto>(
    `/api/applications/empty`,
    applicationDto
  );
  if (!response.data) {
    throw new Error("Failed to create empty application");
  }
  return response.data;
};

export const getEligibilityResultByApplicationId = async (
  applicationId: string
): Promise<EligibilityResultDto | null> => {
  try {
    const response = await apiClient.get<EligibilityResultDto>(
      `/api/eligibility-results/by-application/${applicationId}`
    );
    if (!response.data) {
      return null;
    }
    console.log("Eligibility result for application", applicationId, ":", response.data);
    return response.data;
  } catch (error: any) {
    // Handle 404 specifically since the Java endpoint returns 404 when not found
    if (error.response?.status === 404) {
      console.log("No eligibility result found for application", applicationId);
      return null;
    }
    console.error("Failed to fetch eligibility result for application", applicationId, ":", error);
    throw new Error("Failed to fetch eligibility result by application ID");
  }
};