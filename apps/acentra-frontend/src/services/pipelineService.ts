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

  async createPipelineStatus(data: { value: string; label: string; order: number }): Promise<PipelineStatus> {
    const response = await apiClient.post('/pipeline-statuses', data);
    return response.data;
  },

  async updatePipelineStatus(id: string, data: { label: string }): Promise<PipelineStatus> {
    const response = await apiClient.patch(`/pipeline-statuses/${id}`, data);
    return response.data;
  },

  async deletePipelineStatus(id: string): Promise<void> {
    await apiClient.delete(`/pipeline-statuses/${id}`);
  },

  async updatePipelineStatusOrder(orders: { id: string; order: number }[]): Promise<void> {
    await apiClient.put('/pipeline-statuses/order', { orders });
  },
};