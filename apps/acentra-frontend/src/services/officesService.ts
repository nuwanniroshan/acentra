import { apiClient } from './clients';

export interface Office {
  id: string;
  name: string;
}

export const officesService = {
  async getOffices(): Promise<Office[]> {
    const response = await apiClient.get('/offices');
    return response.data;
  },
};