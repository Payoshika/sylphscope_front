import { apiClient } from "../utility/ApiClient";
import type { GrantProgram, GrantProgramAvailableQuestionsDto, SelectionCriterion, AssignedStaff, ProviderStaffDto } from "../types/grantProgram";
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

export const getGrantPrograms = async (
  page: number = 0,
  size: number = 10
): Promise<{ content: GrantProgram[]; totalElements: number; totalPages: number; number: number }> => {
  const response = await apiClient.get<{ content: GrantProgram[]; totalElements: number; totalPages: number; number: number }>(
    `/api/grant-programs?page=${page}&size=${size}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch grant programs");
  }
  return response.data;
};

export const getGrantProgramsByStudentId = async (
  studentId: string,
  page: number = 0,
  size: number = 10
): Promise<{ content: GrantProgram[]; totalElements: number; totalPages: number; number: number }> => {
  const response = await apiClient.get<{ content: GrantProgram[]; totalElements: number; totalPages: number; number: number }>(
    `/api/grant-programs/student/${studentId}?page=${page}&size=${size}`
  );
  if (!response.data) {
    throw new Error("Failed to fetch grant programs for student");
  }
  return response.data;
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
  const response = await apiClient.get<QuestionGroupEligibilityInfoDto[]>("/api/question-groups/groups-for-eligibility");
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

export const getQuestionByGrantProgramId = async (
  grantProgramId: string
): Promise<GrantProgramAvailableQuestionsDto> => {
  const response = await apiClient.get<GrantProgramAvailableQuestionsDto>(
    `/api/grant-programs/${grantProgramId}/available-questions`
  );
  if (!response.data) {
    throw new Error("No data returned for available questions");
  }
  return response.data;
};

export const getStaffByProviderId = async (providerId: string): Promise<ProviderStaffDto[]> => {
    const response = await apiClient.get<ProviderStaffDto[]>(`/api/providers/${providerId}/staff`);
    if (!response.data) {
        throw new Error("Failed to fetch staff list");
    }
    return response.data;
};

export const getAssignedStaff = async (grantProgramId: string): Promise<AssignedStaff[]> => {
    const response = await apiClient.get<AssignedStaff[]>(`/api/grant-programs/${grantProgramId}/assigned-staff`);
    console.log("assigned staff", response);
    console.log("assigned staff data", response.data);
    if (!response.data) {
        throw new Error("Failed to fetch assigned staff");
    }
    return response.data;
};

export const getContactPerson = async (grantProgramId: string): Promise<ProviderStaffDto> => {
    const response = await apiClient.get<ProviderStaffDto>(`/api/grant-programs/${grantProgramId}/contact-person`);
    if (!response.data) {
        throw new Error("Failed to fetch contact person");
    }
    return response.data;
};

export const updateContactPerson = async (grantProgramId: string, providerStaffDto: ProviderStaffDto): Promise<GrantProgram> => {
    const response = await apiClient.put<GrantProgram>(`/api/grant-programs/${grantProgramId}/contact-person`, providerStaffDto);
    if (!response.data) {
        throw new Error("Failed to update contact person");
    }
    return response.data;
};

export const updateAssignedStaff = async (grantProgramId: string, assignedStaffList: AssignedStaff[]): Promise<GrantProgram> => {
    const response = await apiClient.put<GrantProgram>(`/api/grant-programs/${grantProgramId}/assigned-staff`, assignedStaffList);
    if (!response.data) {
        throw new Error("Failed to update assigned staff");
    }
    return response.data;
};

export const getAppliedGrantProgram = async (studentId: string): Promise<GrantProgram[]> => {
    const response = await apiClient.get<GrantProgram[]>(`/api/grant-programs/student/${studentId}/applied`);
    if (!response.data) {
        throw new Error("Failed to fetch applied grant programs");
    }
    return response.data;
};

export const createNewGrantProgram = async (providerStaffId: string, grantProgramDto: Omit<GrantProgram, 'id' | 'createdAt' | 'updatedAt' | 'contactPerson' | 'assignedStaffIds'>): Promise<GrantProgram> => {
    const requestBody = {
        providerStaffId: providerStaffId,
        grantProgramDto: grantProgramDto
    };
    const response = await apiClient.post<GrantProgram>('/api/grant-programs', requestBody);
    if (!response.data) {
        throw new Error("Failed to create grant program");
    }
    return response.data;
};

export const searchGrantProgramsByTitle = async (title: string): Promise<{ content: GrantProgram[]; totalElements: number; totalPages: number; number: number }> => {
    const response = await apiClient.get<{ content: GrantProgram[]; totalElements: number; totalPages: number; number: number }>(
        `/api/grant-programs/search?keyword=${encodeURIComponent(title)}`
    );
    if (!response.data) {
        throw new Error("Failed to search grant programs");
    }
    return response.data;
};

export const searchAppliedGrantProgramByKeyword = async (studentId: string, keyword: string): Promise<GrantProgram[]> => {
    const response = await apiClient.get<GrantProgram[]>(
        `/api/grant-programs/student/${studentId}/applied/search?keyword=${encodeURIComponent(keyword)}`
    );
    if (!response.data) {
        throw new Error("Failed to search applied grant programs");
    }
    return response.data;
};
