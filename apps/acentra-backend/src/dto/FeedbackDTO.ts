export class FeedbackDTO {
  id: string;
  status: string;
  assignedBy?: string;
  assignedAt?: Date;
  completedBy?: string;
  completedAt?: Date;
  overallScore?: number;
  generalComments?: string;
  isManuallyAssigned: boolean;
  created_at: Date;
  updated_at: Date;

  template?: {
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
    questions?: any[];
  };

  candidate?: {
    id: string;
    name: string;
    email: string;
  };

  responses?: FeedbackResponseDTO[];

  constructor(feedback: any) {
    this.id = feedback.id;
    this.status = feedback.status;
    this.isManuallyAssigned = feedback.isManuallyAssigned;
    this.created_at = feedback.created_at;
    this.updated_at = feedback.updated_at;

    // Optional fields
    if (feedback.assignedBy) this.assignedBy = feedback.assignedBy;
    if (feedback.assignedAt) this.assignedAt = feedback.assignedAt;
    if (feedback.completedBy) this.completedBy = feedback.completedBy;
    if (feedback.completedAt) this.completedAt = feedback.completedAt;
    if (feedback.overallScore) this.overallScore = feedback.overallScore;
    if (feedback.generalComments) this.generalComments = feedback.generalComments;

    // Map template relation
    if (feedback.template) {
      this.template = {
        id: feedback.template.id,
        name: feedback.template.name,
        type: feedback.template.type,
      };
      if (feedback.template.description) this.template.description = feedback.template.description;
      if (feedback.template.category) this.template.category = feedback.template.category;
      if (feedback.template.instructions) this.template.instructions = feedback.template.instructions;
      if (feedback.template.isActive) this.template.isActive = feedback.template.isActive;
      if (feedback.template.stageMappings) this.template.stageMappings = feedback.template.stageMappings;
      if (feedback.template.jobTypeMappings) this.template.jobTypeMappings = feedback.template.jobTypeMappings;
      if (feedback.template.version) this.template.version = feedback.template.version;
      if (feedback.template.createdBy) this.template.createdBy = feedback.template.createdBy;
      if (feedback.template.created_at) this.template.created_at = feedback.template.created_at;
      if (feedback.template.updated_at) this.template.updated_at = feedback.template.updated_at;

      // Handle questions field - try multiple possible field names
      let questions = feedback.template.__questions__ || feedback.template.questions;
      if (!questions && feedback.template.questionsCount) {
        // If we have a questionsCount but no questions array, create a minimal array
        questions = Array(feedback.template.questionsCount).fill({});
      }

      if (questions && Array.isArray(questions)) {
        this.template.questions = questions.map((q: any) => ({
          id: q.id,
          question: q.question,
          type: q.type,
          required: q.required,
          helpText: q.helpText,
          options: q.options,
          minRating: q.minRating,
          maxRating: q.maxRating,
          ratingLabels: q.ratingLabels,
          order: q.order,
          isActive: q.isActive
        }));
      } else if (questions && typeof questions === 'object') {
        // Handle case where questions is an object with length property
        this.template.questions = Object.values(questions);
      }
    }

    // Map candidate relation
    if (feedback.candidate) {
      this.candidate = {
        id: feedback.candidate.id,
        name: feedback.candidate.name,
        email: feedback.candidate.email,
      };
    }

    // Map responses
    if (feedback.responses && feedback.responses.length > 0) {
      this.responses = feedback.responses.map((response: any) => new FeedbackResponseDTO(response));
    }
  }
}

export class FeedbackResponseDTO {
  id: string;
  textAnswer?: string;
  numericAnswer?: number;
  booleanAnswer?: boolean;
  selectedOption?: string;
  comments?: string;
  answeredBy?: string;
  answeredAt?: Date;
  isFinal: boolean;
  created_at: Date;
  updated_at: Date;

  question?: {
    id: string;
    question: string;
    type: "free_text" | "rating" | "yes_no" | "multiple_choice";
    required?: "required" | "optional";
    helpText?: string;
    options?: string[];
    minRating?: number;
    maxRating?: number;
    ratingLabels?: string;
    order?: number;
    isActive?: boolean;
  };

  constructor(response: any) {
    this.id = response.id;
    this.isFinal = response.isFinal;
    this.created_at = response.created_at;
    this.updated_at = response.updated_at;

    // Optional fields
    if (response.textAnswer) this.textAnswer = response.textAnswer;
    if (response.numericAnswer) this.numericAnswer = response.numericAnswer;
    if (response.booleanAnswer) this.booleanAnswer = response.booleanAnswer;
    if (response.selectedOption) this.selectedOption = response.selectedOption;
    if (response.comments) this.comments = response.comments;
    if (response.answeredBy) this.answeredBy = response.answeredBy;
    if (response.answeredAt) this.answeredAt = response.answeredAt;

    // Map question relation
    if (response.question) {
      this.question = {
        id: response.question.id,
        question: response.question.question || response.question.text,
        type: response.question.type,
      };
      if (response.question.required) this.question.required = response.question.required;
      if (response.question.helpText) this.question.helpText = response.question.helpText;
      if (response.question.options) this.question.options = response.question.options;
      if (response.question.minRating) this.question.minRating = response.question.minRating;
      if (response.question.maxRating) this.question.maxRating = response.question.maxRating;
      if (response.question.ratingLabels) this.question.ratingLabels = response.question.ratingLabels;
      if (response.question.order) this.question.order = response.question.order;
      if (response.question.isActive) this.question.isActive = response.question.isActive;
    }
  }
}