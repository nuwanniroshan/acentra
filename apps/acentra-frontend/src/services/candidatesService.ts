import { apiClient } from "./clients";

export interface Candidate {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: string;
  job: {
    id: string;
    title: string;
  };
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  current_address?: string;
  permanent_address?: string;
  cv_file_path?: string;
  cover_letter_path?: string;
  education?: any[];
  experience?: any[];
  desired_salary?: number;
  referred_by?: string;
  website?: string;
  notes?: string;
  interview_date?: string;
  interview_link?: string;
  created_by?: {
    id: string;
    email: string;
    name?: string;
  };
}

export interface CandidatesResponse {
  data: Candidate[];
  totalPages: number;
  page: number;
}

export interface CreateCandidateData {
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  current_address?: string;
  permanent_address?: string;
  jobId: string;
  cv: File;
  cover_letter?: File;
  profile_picture?: File;
  education?: any[];
  experience?: any[];
  desired_salary?: number;
  referred_by?: string;
  website?: string;
}

export const candidatesService = {
  async getCandidates(
    page: number = 1,
    limit: number = 25,
    filters?: {
      search?: string;
      status?: string;
      jobId?: string;
      createdBy?: string;
    }
  ): Promise<CandidatesResponse> {
    const params = new URLSearchParams();
    params.append("page", page.toString());
    params.append("limit", limit.toString());
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, value);
      });
    }
    const response = await apiClient.get(`/candidates?${params.toString()}`);
    return response.data;
  },

  async createCandidate(data: CreateCandidateData): Promise<Candidate> {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("first_name", data.first_name);
    formData.append("last_name", data.last_name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("jobId", data.jobId);

    if (data.current_address)
      formData.append("current_address", data.current_address);
    if (data.permanent_address)
      formData.append("permanent_address", data.permanent_address);
    if (data.cv) formData.append("cv", data.cv);
    if (data.cover_letter) formData.append("cover_letter", data.cover_letter);
    if (data.profile_picture)
      formData.append("profile_picture", data.profile_picture);
    if (data.education)
      formData.append("education", JSON.stringify(data.education));
    if (data.experience)
      formData.append("experience", JSON.stringify(data.experience));
    if (data.desired_salary)
      formData.append("desired_salary", data.desired_salary.toString());
    if (data.referred_by) formData.append("referred_by", data.referred_by);
    if (data.website) formData.append("website", data.website);

    const response = await apiClient.post("/candidates", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },

  async getCandidate(id: string): Promise<Candidate> {
    const response = await apiClient.get(`/candidates/${id}`);
    return response.data;
  },

  async updateCandidateStatus(id: string, status: string, extra?: { interview_date?: string; interview_link?: string }): Promise<void> {
    await apiClient.patch(`/candidates/${id}/status`, { status, ...extra });
  },

  async updateCandidateNotes(id: string, notes: string): Promise<void> {
    await apiClient.patch(`/candidates/${id}/notes`, { notes });
  },

  async deleteCandidate(id: string): Promise<void> {
    await apiClient.delete(`/candidates/${id}`);
  },

  async getCandidatesByJobId(jobId: string): Promise<Candidate[]> {
    const response = await apiClient.get(`/jobs/${jobId}/candidates`);
    return response.data;
  },

  async getCandidateComments(id: string): Promise<any[]> {
    const response = await apiClient.get(`/candidates/${id}/comments`);
    return response.data;
  },

  async addCandidateComment(
    id: string,
    text: string,
    attachment?: File,
  ): Promise<any> {
    const formData = new FormData();
    formData.append("text", text);
    if (attachment) {
      formData.append("attachment", attachment);
    }

    const response = await apiClient.post(
      `/candidates/${id}/comments`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      },
    );
    return response.data;
  },

  async getCandidatePipelineHistory(id: string): Promise<any[]> {
    const response = await apiClient.get(`/candidates/${id}/pipeline-history`);
    return response.data;
  },

  async getCandidateCv(id: string): Promise<Blob> {
    const response = await apiClient.get(`/candidates/${id}/cv`, {
      responseType: "blob",
    });
    return response.data;
  },

  async updateCandidateCv(id: string, cv: File): Promise<void> {
    const formData = new FormData();
    formData.append("cv", cv);

    await apiClient.patch(`/candidates/${id}/cv`, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
  },

  async getCandidateAiOverview(id: string): Promise<any> {
    try {
      const response = await apiClient.get(`/candidates/${id}/ai-overview`);
      return response.data;
    } catch (error: any) {
      // Return null for 404 (not found) or 500 (server error with missing entity)
      // This will show the "Generate Overview" UI
      if (error.response?.status === 404 || error.response?.status === 500) {
        console.warn("AI overview not available:", error.response?.data?.message);
        return null;
      }
      throw error;
    }
  },

  async generateCandidateAiOverview(id: string): Promise<any> {
    const response = await apiClient.post(`/candidates/${id}/ai-overview/generate`);
    return response.data;
  },

  async bulkCandidateAction(candidateIds: string[], action: string, payload?: any): Promise<any> {
    const response = await apiClient.post(`/candidates/bulk-action`, {
      candidateIds,
      action,
      payload
    });
    return response.data;
  },

  async getCandidateScorecards(candidateId: string): Promise<any[]> {
    const response = await apiClient.get(`/candidates/${candidateId}/scorecards`);
    return response.data;
  },

  async submitCandidateScorecard(candidateId: string, data: any): Promise<any> {
    const response = await apiClient.post(`/candidates/${candidateId}/scorecards`, data);
    return response.data;
  },
};
