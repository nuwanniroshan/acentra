export class CommentDTO {
  id: string;
  text: string;
  created_at: Date;
  attachment_path?: string;
  attachment_original_name?: string;
  attachment_type?: string;
  attachment_size?: number;
  created_by: {
    id: string;
    email: string;
    name?: string;
    profile_picture?: string;
  };

  constructor(comment: any) {
    this.id = comment.id;
    this.text = comment.text;
    this.created_at = comment.created_at;

    // Optional attachment fields
    if (comment.attachment_path) this.attachment_path = comment.attachment_path;
    if (comment.attachment_original_name) this.attachment_original_name = comment.attachment_original_name;
    if (comment.attachment_type) this.attachment_type = comment.attachment_type;
    if (comment.attachment_size) this.attachment_size = comment.attachment_size;

    // Map created_by relation
    if (comment.created_by) {
      this.created_by = {
        id: comment.created_by.id,
        email: comment.created_by.email,
      };

      // Optional user fields
      if (comment.created_by.name) this.created_by.name = comment.created_by.name;
      if (comment.created_by.profile_picture) this.created_by.profile_picture = comment.created_by.profile_picture;
    }
  }
}