import { apiClient } from "../utility/ApiClient";
import type { Provider } from "../types/provider";
import type { Message } from "../types/message";
import type { Student } from "../types/student";
import type { GrantProgram } from "../types/grantProgram";
import type { ProviderStaff } from "../types/user";

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
    console.log("Provider fetched:", response.data);
    if (!response.data) {
        throw new Error("Provider not found");
    }
    return { data: response.data };
};

export const getStaffByProviderId = async (providerId: string): Promise<ProviderStaff[]> => {
    const response = await apiClient.get<ProviderStaff[]>(`/api/provider-staff/provider/${providerId}`);
    if (!response.data) {
        throw new Error("Failed to fetch staff");
    }
    return response.data;
};

export const removeStaff = async (providerStaffId: string): Promise<ProviderStaff> => {
    const response = await apiClient.delete<ProviderStaff>(`/api/provider-staff/${providerStaffId}/remove-from-provider`);
    if (!response.data) {
        throw new Error("Failed to remove staff");
    }
    return response.data;
};

export const updateStaffProfile = async (providerStaff: ProviderStaff): Promise<ProviderStaff> => {
    const response = await apiClient.put<ProviderStaff>("/api/provider-staff/update-profile", providerStaff);
    if (!response.data) {
        throw new Error("Failed to update staff profile");
    }
    return response.data;
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

export const createEmptyProvider = async (userId: string): Promise<Provider> => {
  const response = await apiClient.post<Provider>(`/api/providers/empty?userId=${encodeURIComponent(userId)}`);
  if (!response.data) {
    throw new Error("Failed to create empty provider");
  }
  return response.data;
};

export const createProviderInvitationCode = async (
  providerId: string,
  invitationCode: string
): Promise<Provider> => {
  // backend expects POST /api/providers/{id}/invitation-code with the code in the body
  console.log("invitation code is", invitationCode);
  const payload = { invitationCode };
  const response = await apiClient.post<Provider>(
    `/api/providers/${encodeURIComponent(providerId)}/invitation-code`,
    payload
  );
  if (!response.data) {
    throw new Error("Failed to set invitation code");
  }
  return response.data;
};

// Add a staff member to a provider using an invitation code
export const addStaffMember = async (userId: string, invitationCode: string): Promise<ProviderStaff> => {
  const response = await apiClient.post<ProviderStaff>(
    `/api/providers/add-staff-member?userId=${encodeURIComponent(userId)}&invitationCode=${encodeURIComponent(
      invitationCode
    )}`
  );
  if (!response.data) {
    throw new Error("Failed to add staff member");
  }
  return response.data;
};


export const switchManager = async (
  managerId: string,
  otherStaffId: string
): Promise<ProviderStaff[]> => {
  const payload = { managerId, otherStaffId };
  const response = await apiClient.post<ProviderStaff[]>(
    "/api/providers/switch-manager",
    payload
  );
  if (!response.data) {
    throw new Error("Failed to switch manager");
  }
  return response.data;
};