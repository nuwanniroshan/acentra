import { authClient } from './clients';

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
      role: string;
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
    const response = await authClient.post('/auth/login', credentials);
    return response.data;
  },

  async logout(): Promise<void> {
    await authClient.post('/auth/logout');
  },

  async register(userData: { email: string; password: string; role: string }): Promise<any> {
    const response = await authClient.post('/auth/register', userData);
    return response.data;
  },

  async getUsers(): Promise<any[]> {
    const response = await authClient.get('/users');
    return response.data;
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
};