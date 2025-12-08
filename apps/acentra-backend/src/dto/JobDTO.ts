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
  created_by?: string;
  created_at?: Date;
  updated_at?: Date;
  tenantId?: string;
  jdFilePath?: string;
  jd?: string;

  // Feedback templates with lazy loading support
  feedbackTemplates?: {
    id: string;
    name: string;
    category?: string;
    questionsCount: number;
    type: string;
  }[];

  constructor(job: any) {
    this.id = job.id;
    this.title = job.title;
    this.description = job.description;
    this.status = job.status;

    // Optional fields
    if (job.department) this.department = job.department;
    if (job.branch) this.branch = job.branch;
    if (job.tags) this.tags = job.tags;
    if (job.start_date) this.start_date = job.start_date;
    if (job.expected_closing_date) this.expected_closing_date = job.expected_closing_date;
    if (job.actual_closing_date) this.actual_closing_date = job.actual_closing_date;
    if (job.created_by) this.created_by = job.created_by.id;
    if (job.created_at) this.created_at = job.created_at;
    if (job.updated_at) this.updated_at = job.updated_at;
    if (job.tenantId) this.tenantId = job.tenantId;
    if (job.jdFilePath) this.jdFilePath = job.jdFilePath;
    if (job.jd) this.jd = job.jd;

    // Handle feedback templates with lazy loading support
    if (job.feedbackTemplates) {
      // Check if feedbackTemplates is a Promise (lazy-loaded) or an array (eager-loaded)
      const templates = job.feedbackTemplates instanceof Promise
        ? job.feedbackTemplates
        : job.feedbackTemplates;

      // Only process if templates is actually an array (not a Promise)
      if (Array.isArray(templates)) {
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