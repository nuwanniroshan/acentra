import { apiClient } from './clients';

export interface Department {
  id: string;
  name: string;
}

export const departmentsService = {
  async getDepartments(): Promise<Department[]> {
    const response = await apiClient.get('/departments');
    return response.data;
  },
};