import { apiClient } from "./clients";

export interface Department {
  id: string;
  name: string;
}

export const departmentsService = {
  async getDepartments(): Promise<Department[]> {
    const response = await apiClient.get("/departments");
    return response.data;
  },

  async createDepartment(departmentData: {
    name: string;
  }): Promise<Department> {
    const response = await apiClient.post("/departments", departmentData);
    return response.data;
  },

  async deleteDepartment(id: string): Promise<void> {
    await apiClient.delete(`/departments/${id}`);
  },
};
