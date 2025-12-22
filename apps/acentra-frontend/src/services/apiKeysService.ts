import { apiClient } from "./clients";

export interface ApiKey {
  id: string;
  name: string;
  maskedKey: string;
  lastUsedAt?: string;
  createdAt: string;
}

export interface GeneratedApiKey extends ApiKey {
  key: string;
}

export const apiKeysService = {
  async getApiKeys(): Promise<ApiKey[]> {
    const response = await apiClient.get("/settings/api-keys");
    return response.data;
  },

  async generateApiKey(name: string): Promise<GeneratedApiKey> {
    const response = await apiClient.post("/settings/api-keys", { name });
    return response.data;
  },

  async revokeApiKey(id: string): Promise<void> {
    await apiClient.delete(`/settings/api-keys/${id}`);
  },
};
