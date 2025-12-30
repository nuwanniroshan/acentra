import { authClient } from "./clients";
import { UserRole } from "@acentra/shared-types";

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  data: {
    token: string;
    user: {
      id: string;
      email: string;
      role: UserRole;
      name?: string;
      profile_picture?: string;
      department?: string;
      office_location?: string;
      is_active: boolean;
      created_at: Date;
      updated_at: Date;
    };
  };
}

export const authService = {
  async login(credentials: LoginRequest): Promise<LoginResponse> {
    const response = await authClient.post("/auth/login", credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await authClient.post("/auth/logout");
  },

  async register(userData: {
    email: string;
    password?: string;
    role: UserRole;
    name?: string;
    job_title?: string;
    employee_number?: string;
    manager_id?: string;
    address?: string;
    custom_fields?: Record<string, any>;
  }): Promise<any> {
    const response = await authClient.post("/auth/register", userData);
    return response.data;
  },

  async getUsers(): Promise<any[]> {
    const response = await authClient.get("/users");
    return response.data.data;
  },

  async deleteUser(id: string): Promise<void> {
    await authClient.delete(`/users/${id}`);
  },

  async updateUserRole(id: string, role: string): Promise<void> {
    await authClient.patch(`/users/${id}/role`, { role });
  },

  async toggleUserActive(id: string): Promise<void> {
    await authClient.patch(`/users/${id}/toggle-active`);
  },

  async checkTenant(slug: string): Promise<{ success: boolean; exists: boolean; tenantId?: string }> {
    const response = await authClient.get(`/auth/tenant/${slug}`);
    return response.data;
  },

  async changePassword(data: { oldPassword: string; newPassword: string }): Promise<void> {
    await authClient.post("/auth/change-password", data);
  },

  async forgotPassword(email: string): Promise<void> {
    await authClient.post("/auth/forgot-password", { email });
  },

  async resetPassword(data: { token: string; newPassword: string }): Promise<void> {
    await authClient.post("/auth/reset-password", data);
  },
};
