export class JobDTO {
  id: string;
  title: string;
  description: string;
  department?: string;
  branch?: string;
  tags?: string[];
  status: string;
  start_date?: Date;
  expected_closing_date?: Date;
  actual_closing_date?: Date;
  created_by?: {
    id: string;
    email: string;
    name?: string;
    profile_picture?: string;
  };
  assignees?: {
    id: string;
    email: string;
    name?: string;
    profile_picture?: string;
  }[];
  created_at?: Date;
  updated_at?: Date;
  tenantId?: string;
  jdFilePath?: string;
  jd?: string;
  candidates?: any[];
  candidatesCount: number;

  // Feedback templates with lazy loading support
  feedbackTemplates?: {
    id: string;
    name: string;
    category?: string;
    questionsCount: number;
    type: string;
  }[];

  // Approval fields
  budget?: number;
  approval_comment?: string;
  rejectionReason?: string;
  approved_by?: { id: string; name?: string; email: string };
  approved_at?: Date;
  rejected_by?: { id: string; name?: string; email: string };
  rejected_at?: Date;

  constructor(job: any, includeApprovalDetails: boolean = false) {
    this.id = job.id;
    this.title = job.title;
    this.description = job.description;
    this.status = job.status;
    this.candidatesCount = 0;

    // Optional fields
    if (job.department) this.department = job.department;
    if (job.branch) this.branch = job.branch;
    if (job.tags) this.tags = job.tags;
    if (job.start_date) this.start_date = job.start_date;
    if (job.expected_closing_date) this.expected_closing_date = job.expected_closing_date;
    if (job.actual_closing_date) this.actual_closing_date = job.actual_closing_date;
    if (job.created_by) {
      this.created_by = {
        id: job.created_by.id,
        email: job.created_by.email,
        name: job.created_by.name,
        profile_picture: job.created_by.profile_picture,
      };
    }
    if (job.created_at) this.created_at = job.created_at;
    if (job.updated_at) this.updated_at = job.updated_at;
    if (job.tenantId) this.tenantId = job.tenantId;
    if (job.jdFilePath) this.jdFilePath = job.jdFilePath;
    if (job.jd) this.jd = job.jd;

    // Approval details - Only if permitted
    if (includeApprovalDetails) {
      if (job.budget) this.budget = job.budget;
      if (job.approval_comment) this.approval_comment = job.approval_comment;
      if (job.rejectionReason) this.rejectionReason = job.rejectionReason;
      if (job.approved_at) this.approved_at = job.approved_at;
      if (job.rejected_at) this.rejected_at = job.rejected_at;
      
      if (job.approved_by) {
        this.approved_by = {
          id: job.approved_by.id,
          name: job.approved_by.name,
          email: job.approved_by.email
        };
      }
      if (job.rejected_by) {
        this.rejected_by = {
          id: job.rejected_by.id,
          name: job.rejected_by.name,
          email: job.rejected_by.email
        };
      }
    }

    if (job.assignees && Array.isArray(job.assignees)) {
      this.assignees = job.assignees.map((assignee: any) => ({
        id: assignee.id,
        email: assignee.email,
        name: assignee.name,
        profile_picture: assignee.profile_picture,
      }));
    }

    if (job.candidates && Array.isArray(job.candidates)) {
      this.candidatesCount = job.candidates.length;
      this.candidates = job.candidates.map((candidate: any) => ({
        id: candidate.id,
        name: candidate.name,
        status: candidate.status,
      }));
    }

    // Handle feedback templates with lazy loading support
    if (job.feedbackTemplates) {
      // Check if feedbackTemplates is a Promise (lazy-loaded) or an array (eager-loaded)
      let templates: any[] = [];

      if (job.feedbackTemplates instanceof Promise) {
        // For lazy-loaded relations, we need to await the Promise
        // But since this is a constructor, we can't use async/await directly
        // We'll handle this in the controller/service layer instead
        console.log('DEBUG: JobDTO - feedbackTemplates is a Promise, will be handled by controller');
      } else if (Array.isArray(job.feedbackTemplates)) {
        // For eager-loaded relations, process directly
        templates = job.feedbackTemplates;
      } else {
        console.log('DEBUG: JobDTO - feedbackTemplates is neither Promise nor Array:', typeof job.feedbackTemplates);
      }

      // Only process if templates is actually an array (not a Promise)
      if (Array.isArray(templates) && templates.length > 0) {
        this.feedbackTemplates = templates.map((template: any) => {
          // Handle lazy-loaded questions (could be array or Promise)
          let questionsCount = 0;
          if (template.questions) {
            if (template.questions instanceof Promise) {
              // For lazy-loaded relations, we can't get the length directly
              // This would need to be handled by the controller or service layer
              questionsCount = 0;
            } else if (Array.isArray(template.questions)) {
              questionsCount = template.questions.length;
            }
          }

          return {
            id: template.id,
            name: template.name,
            category: template.category,
            questionsCount: questionsCount,
            type: template.type
          };
        });
      }
      // If it's a Promise, leave feedbackTemplates undefined for now
      // The controller should handle lazy loading separately
    }
  }
}