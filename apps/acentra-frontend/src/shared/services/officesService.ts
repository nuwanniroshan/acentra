import { apiClient } from "./clients";

export interface Office {
  id: string;
  name: string;
}

export const officesService = {
  async getOffices(): Promise<Office[]> {
    const response = await apiClient.get("/offices");
    return response.data;
  },

  async createOffice(officeData: {
    name: string;
    address?: string;
    type?: string;
  }): Promise<Office> {
    const response = await apiClient.post("/offices", officeData);
    return response.data;
  },

  async deleteOffice(id: string): Promise<void> {
    await apiClient.delete(`/offices/${id}`);
  },
};
