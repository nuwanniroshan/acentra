import { apiClient } from "./clients";

export interface Job {
  id: string;
  title: string;
  description: string;
  status: string;
  department?: string;
  branch?: string;
  tags?: string[];
  start_date: string;
  expected_closing_date: string;
  actual_closing_date?: string;
  candidates: any[];
  created_by: { id: string; email: string; name?: string };
  assignees: { id: string; email: string; name?: string }[];
}

export interface CreateJobData {
  title: string;
  description: string;
  department?: string;
  branch?: string;
  tags?: string[];
  start_date: string;
  expected_closing_date: string;
  assigneeIds?: string[];
  feedbackTemplateIds: string[];
  tempFileLocation?: string;
  jdContent?: string;
}

export interface UpdateJobData {
  title?: string;
  description?: string;
  department?: string;
  branch?: string;
  tags?: string[];
  expected_closing_date?: string;
}

export interface ParsedJdData {
  title: string;
  description: string;
  tags: string[];
  requiredSkills: string[];
  niceToHaveSkills: string[];
  content: string;
  tempFileLocation: string;
}

export const jobsService = {
  async getJobs(): Promise<Job[]> {
    const response = await apiClient.get("/jobs");
    return response.data;
  },

  async getJob(id: string): Promise<Job> {
    const response = await apiClient.get(`/jobs/${id}`);
    return response.data;
  },

  async createJob(data: CreateJobData): Promise<Job> {
    const response = await apiClient.post("/jobs", data);
    return response.data;
  },

  async updateJob(id: string, data: UpdateJobData): Promise<Job> {
    const response = await apiClient.put(`/jobs/${id}`, data);
    return response.data;
  },

  async deleteJob(id: string): Promise<void> {
    await apiClient.delete(`/jobs/${id}`);
  },

  async closeJob(id: string): Promise<void> {
    await apiClient.post(`/jobs/${id}/close`);
  },

  async assignUsers(id: string, userIds: string[]): Promise<void> {
    await apiClient.post(`/jobs/${id}/assign`, { userIds });
  },

  async parseJd(file: File): Promise<ParsedJdData> {
    const formData = new FormData();
    formData.append("jd", file);
    const response = await apiClient.post("/jobs/parse-jd", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getJobJd(id: string): Promise<Blob> {
    const response = await apiClient.get(`/jobs/${id}/jd`, {
      responseType: "blob",
    });
    return response.data;
  },

  async approveJob(id: string, budget?: number, comment?: string, assigneeIds?: string[]): Promise<Job> {
    const response = await apiClient.put(`/jobs/${id}/approve`, { budget, comment, assigneeIds });
    return response.data;
  },

  async rejectJob(id: string, reason: string): Promise<Job> {
    const response = await apiClient.put(`/jobs/${id}/reject`, { reason });
    return response.data;
  },
};
