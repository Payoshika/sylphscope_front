import { apiClient } from "../utility/ApiClient";
import type { GrantProgram } from "../types/grantProgram";

export const createGrantProgram = async (grantProgram: GrantProgram) => {
const { id, createdAt, updatedAt, ...grantProgramData } = grantProgram;
return apiClient.post("/api/grant-programs", grantProgramData);
};

export const updateGrantProgram = async (id: string | number, grantProgram: GrantProgram) => {
  console.log("Updating grant program:", id, grantProgram);
  
  return apiClient.put(`/api/grant-programs/${id}`, grantProgram);
};