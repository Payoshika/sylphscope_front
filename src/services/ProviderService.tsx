import { apiClient } from "../utility/ApiClient";
import type { Provider } from "../types/provider";
import type { Message } from "../types/message";
import type { Student } from "../types/student";
import type { GrantProgram } from "../types/grantProgram";

export interface ManagedStudentsEntry {
  grantProgram: GrantProgram;
  students: Student[];
}

// Create a new provider (POST /create)
export const createProvider = async (provider: Provider) => {
  // Remove id if present
  const { id, ...providerData } = provider;
  return apiClient.post("/api/provider/create", providerData);
};

// Update an existing provider (PUT /update)
export const updateProvider = async (provider: Provider) => {
  // id must exist for update
  if (!provider.id) {
    throw new Error("Provider id is required for update");
  }
  return apiClient.put(`/api/providers/${provider.id}`, provider);
};

export const getProviderById = async (providerId: string): Promise<{ data: Provider }> => {
    const response = await apiClient.get<Provider>(`/api/providers/${providerId}`);
    if (!response.data) {
        throw new Error("Provider not found");
    }
    return { data: response.data };
};

export const getMessagesByProviderStaffId = async (providerStaffId: string): Promise<Message[]> => {
    const response = await apiClient.get<Message[]>(`/api/messages/providerStaff/${providerStaffId}`);
    if (!response.data) {
        throw new Error("Failed to fetch messages");
    }
    return response.data;
};

export const getListOfStudentforProvider = async (providerId: string): Promise<ManagedStudentsEntry[]> => {
    const response = await apiClient.get<ManagedStudentsEntry[]>(`/api/providers/managed-students/${providerId}`);
    if (!response.data) {
        throw new Error("Failed to fetch managed students");
    }
    return response.data;
};