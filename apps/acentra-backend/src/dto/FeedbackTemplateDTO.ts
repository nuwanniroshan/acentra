export class FeedbackTemplateDTO {
  id: string;
  name: string;
  type: string;
  category?: string;
  questionsCount: number;
  isActive?: boolean;
  version?: number;
  createdBy?: string;
  created_at?: string;
  updated_at?: string;

  constructor(template: any) {
    this.id = template.id;
    this.name = template.name;
    this.type = template.type;

    // Handle lazy-loaded questions (could be array or Promise)
    if (template.questions) {
      if (template.questions instanceof Promise) {
        // For lazy-loaded relations, we'll use the length from the template directly
        // since we can't await in constructor
        this.questionsCount = template.questionsCount || 0;
      } else {
        this.questionsCount = template.questions.length;
      }
    } else {
      this.questionsCount = 0;
    }

    // Optional fields
    if (template.category) this.category = template.category;
    if (template.isActive) this.isActive = template.isActive;
    if (template.version) this.version = template.version;
    if (template.createdBy) this.createdBy = template.createdBy;
    if (template.created_at) this.created_at = template.created_at;
    if (template.updated_at) this.updated_at = template.updated_at;
  }
}