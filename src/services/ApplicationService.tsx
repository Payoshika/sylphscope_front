import { apiClient } from "../utility/ApiClient";
import type { ApplicationDto, GrantProgramApplicationDto } from "../types/application";

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