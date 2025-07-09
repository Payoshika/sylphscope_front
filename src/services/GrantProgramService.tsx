import { apiClient } from "../utility/ApiClient";
import type { GrantProgram } from "../types/grantProgram";

export const createGrantProgram = async (grantProgram: GrantProgram) => {
const { id, ...grantProgramWithoutId } = grantProgram;
return apiClient.post("/api/grant-programs", grantProgramWithoutId);
};

export const updateGrantProgram = async (id: string | number, grantProgram: GrantProgram) => {
  return apiClient.put(`/api/grant-programs/${id}`, grantProgram);
};