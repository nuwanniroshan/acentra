export class FeedbackTemplateDTO {
  id: string;
  name: string;
  type: string;
  description?: string;
  category?: string;
  instructions?: string;
  isActive?: boolean;
  stageMappings?: string[];
  jobTypeMappings?: string[];
  version?: number;
  createdBy?: string;
  created_at?: string;
  updated_at?: string;
  questions: any[];
  questionsCount: number;

  constructor(template: any, includeQuestions = false) {
    this.id = template.id;
    this.name = template.name;
    this.type = template.type;

    // Handle lazy-loaded questions (could be array or Promise)
    let questionsArray: any[] = [];
    if (template.questions) {
      if (template.questions instanceof Promise) {
        // For lazy-loaded relations, we'll use the length from the template directly
        // since we can't await in constructor
        this.questionsCount = template.questionsCount || 0;
        questionsArray = [];
      } else {
        questionsArray = template.questions;
        this.questionsCount = template.questions.length;
      }
    } else {
      this.questionsCount = 0;
      questionsArray = [];
    }

    this.questions = includeQuestions ? questionsArray : [];

    // Optional fields
    if (template.description) this.description = template.description;
    if (template.category) this.category = template.category;
    if (template.instructions) this.instructions = template.instructions;
    if (template.isActive !== undefined) this.isActive = template.isActive;
    if (template.stageMappings) this.stageMappings = template.stageMappings;
    if (template.jobTypeMappings) this.jobTypeMappings = template.jobTypeMappings;
    if (template.version) this.version = template.version;
    if (template.createdBy) this.createdBy = template.createdBy;
    if (template.created_at) this.created_at = template.created_at;
    if (template.updated_at) this.updated_at = template.updated_at;
  }
}