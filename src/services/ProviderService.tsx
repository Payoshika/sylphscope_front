import { apiClient } from "../utility/ApiClient";
import type { Provider } from "../types/provider";

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

export const getProviderById = async (providerId: string | number) => {
    console.log("routes are ", providerId);
  return apiClient.get<Provider>(`/api/providers/${providerId}`);
};