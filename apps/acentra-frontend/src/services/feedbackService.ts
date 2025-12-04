import { apiClient } from "./clients";

export interface FeedbackTemplate {
  id: string;
  name: string;
  type: string;
  description?: string;
  category?: string;
  instructions?: string;
  isActive: boolean;
  stageMappings?: string[];
  jobTypeMappings?: string[];
  version: number;
  createdBy?: string;
  created_at: string;
  updated_at: string;
  questions: FeedbackQuestion[];
}

export interface FeedbackQuestion {
  id: string;
  question: string;
  type: 'free_text' | 'rating' | 'yes_no' | 'multiple_choice';
  required: 'required' | 'optional';
  helpText?: string;
  options?: string[];
  minRating?: number;
  maxRating?: number;
  ratingLabels?: string;
  order: number;
  isActive: boolean;
}

export interface CandidateFeedbackTemplate {
  id: string;
  candidate: {
    id: string;
    name: string;
  };
  template: FeedbackTemplate;
  status: 'not_started' | 'in_progress' | 'completed';
  assignedBy?: string;
  assignedAt?: string;
  completedBy?: string;
  completedAt?: string;
  overallScore?: number;
  generalComments?: string;
  isManuallyAssigned: boolean;
  created_at: string;
  updated_at: string;
  responses: FeedbackResponse[];
}

export interface FeedbackResponse {
  id: string;
  question: FeedbackQuestion;
  textAnswer?: string;
  numericAnswer?: number;
  booleanAnswer?: boolean;
  selectedOption?: string;
  comments?: string;
  answeredBy?: string;
  answeredAt: string;
  isFinal: boolean;
}

export interface FeedbackStats {
  total: number;
  completed: number;
  inProgress: number;
  notStarted: number;
  completionRate: number;
  averageCompletionTime: number;
}

class FeedbackService {
  // Template Management
  async getAllTemplates(): Promise<FeedbackTemplate[]> {
    const response = await apiClient.get('/feedback-templates');
    return response.data;
  }

  async getTemplateById(id: string): Promise<FeedbackTemplate> {
    const response = await apiClient.get(`/feedback-templates/${id}`);
    return response.data;
  }

  async getTemplatesByType(type: string): Promise<FeedbackTemplate[]> {
    const response = await apiClient.get(`/feedback-templates/type/${type}`);
    return response.data;
  }

  async createTemplate(templateData: Partial<FeedbackTemplate>): Promise<FeedbackTemplate> {
    const response = await apiClient.post('/feedback-templates', templateData);
    return response.data;
  }

  async updateTemplate(id: string, templateData: Partial<FeedbackTemplate>): Promise<FeedbackTemplate> {
    const response = await apiClient.put(`/feedback-templates/${id}`, templateData);
    return response.data;
  }

  async deleteTemplate(id: string): Promise<void> {
    await apiClient.delete(`/feedback-templates/${id}`);
  }

  async cloneTemplate(id: string, name: string): Promise<FeedbackTemplate> {
    const response = await apiClient.post(`/feedback-templates/${id}/clone`, { name });
    return response.data;
  }

  // Candidate Feedback Management
  async getCandidateFeedback(candidateId: string): Promise<CandidateFeedbackTemplate[]> {
    const response = await apiClient.get(`/candidates/${candidateId}/feedback`);
    return response.data;
  }

  async getFeedbackDetails(feedbackId: string): Promise<CandidateFeedbackTemplate> {
    const response = await apiClient.get(`/feedback/${feedbackId}`);
    return response.data;
  }

  async attachTemplate(candidateId: string, templateId: string): Promise<CandidateFeedbackTemplate> {
    const response = await apiClient.post(`/candidates/${candidateId}/feedback/attach`, { templateId });
    return response.data;
  }

  async removeTemplate(feedbackId: string): Promise<void> {
    await apiClient.delete(`/feedback/${feedbackId}`);
  }

  async saveResponse(feedbackId: string, responseData: {
    questionId: string;
    textAnswer?: string;
    numericAnswer?: number;
    booleanAnswer?: boolean;
    selectedOption?: string;
    comments?: string;
  }): Promise<FeedbackResponse> {
    const response = await apiClient.post(`/feedback/${feedbackId}/responses`, responseData);
    return response.data;
  }

  async completeFeedback(feedbackId: string, generalComments?: string): Promise<CandidateFeedbackTemplate> {
    const response = await apiClient.patch(`/feedback/${feedbackId}/complete`, { generalComments });
    return response.data;
  }

  async autoAttachTemplates(candidateId: string): Promise<{
    message: string;
    attachedTemplates: CandidateFeedbackTemplate[];
  }> {
    const response = await apiClient.post(`/candidates/${candidateId}/feedback/auto-attach`);
    return response.data;
  }

  // Statistics
  async getFeedbackStats(): Promise<FeedbackStats> {
    const response = await apiClient.get('/feedback/stats');
    return response.data;
  }
}

export const feedbackService = new FeedbackService();