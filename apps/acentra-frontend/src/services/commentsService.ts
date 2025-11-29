import { apiClient } from './clients';

export interface Comment {
  id: string;
  text: string;
  created_at: string;
  created_by: {
    id: string;
    email: string;
    name?: string;
  };
  attachment_path?: string;
  attachment_original_name?: string;
  attachment_type?: string;
  attachment_size?: number;
}

export const commentsService = {
  async deleteCommentAttachment(commentId: string): Promise<void> {
    await apiClient.delete(`/comments/${commentId}/attachment`);
  },
};