import { apiClient } from "./clients";

export interface User {
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
}

export interface UserPreferences {
  [key: string]: any;
}

export const usersService = {
  async getUsers(): Promise<User[]> {
    const response = await apiClient.get("/users");
    return response.data;
  },

  async getUsersByRole(role: string): Promise<User[]> {
    const response = await apiClient.get(`/users?role=${role}`);
    return response.data;
  },

  async getUser(id: string): Promise<User> {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },

  async deleteUser(id: string): Promise<void> {
    await apiClient.delete(`/users/${id}`);
  },

  async updateUserRole(id: string, role: string): Promise<void> {
    await apiClient.patch(`/users/${id}/role`, { role });
  },

  async toggleUserActive(id: string): Promise<void> {
    await apiClient.patch(`/users/${id}/toggle-active`);
  },

  async getUserPreferences(userId: string): Promise<UserPreferences> {
    const response = await apiClient.get(`/users/${userId}/preferences`);
    return response.data;
  },

  async updateUserPreferences(
    userId: string,
    preferences: UserPreferences,
  ): Promise<void> {
    await apiClient.patch(`/users/${userId}/preferences`, { preferences });
  },

  async updateProfile(
    userId: string,
    profileData: {
      name?: string;
      department?: string;
      office_location?: string;
      profile_picture?: string;
    },
  ): Promise<User> {
    const response = await apiClient.patch(
      `/users/${userId}/profile`,
      profileData,
    );
    return response.data;
  },

  async uploadProfilePicture(userId: string, file: File): Promise<User> {
    const formData = new FormData();
    formData.append("profile_picture", file);

    const response = await apiClient.post(
      `/users/${userId}/profile-picture`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data.user;
  },
};
