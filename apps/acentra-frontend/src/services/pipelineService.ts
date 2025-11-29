import { apiClient } from './clients';

export interface PipelineStatus {
  id: string;
  value: string;
  label: string;
  order: number;
}

export const pipelineService = {
  async getPipelineStatuses(): Promise<PipelineStatus[]> {
    const response = await apiClient.get('/pipeline-statuses');
    return response.data;
  },
};