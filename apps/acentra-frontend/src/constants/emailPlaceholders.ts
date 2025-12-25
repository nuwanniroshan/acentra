/**
 * Email Template Placeholders
 * 
 * This file defines all available placeholders that can be used in email templates.
 * Each placeholder includes a key, label, description, example, and category.
 */

export interface EmailPlaceholder {
  key: string;
  label: string;
  description: string;
  example: string;
  category: 'candidate' | 'job' | 'company' | 'recruiter' | 'system';
}

export const EMAIL_PLACEHOLDERS: EmailPlaceholder[] = [
  // Candidate Placeholders
  {
    key: '{{candidate_name}}',
    label: 'Candidate Name',
    description: 'Full name of the candidate',
    example: 'John Doe',
    category: 'candidate',
  },
  {
    key: '{{candidate_first_name}}',
    label: 'Candidate First Name',
    description: 'First name of the candidate',
    example: 'John',
    category: 'candidate',
  },
  {
    key: '{{candidate_last_name}}',
    label: 'Candidate Last Name',
    description: 'Last name of the candidate',
    example: 'Doe',
    category: 'candidate',
  },
  {
    key: '{{candidate_email}}',
    label: 'Candidate Email',
    description: 'Email address of the candidate',
    example: 'john.doe@example.com',
    category: 'candidate',
  },
  {
    key: '{{candidate_phone}}',
    label: 'Candidate Phone',
    description: 'Phone number of the candidate',
    example: '+1 (555) 123-4567',
    category: 'candidate',
  },

  // Job Placeholders
  {
    key: '{{job_title}}',
    label: 'Job Title',
    description: 'Title of the job position',
    example: 'Senior Software Engineer',
    category: 'job',
  },
  {
    key: '{{job_department}}',
    label: 'Job Department',
    description: 'Department for the job',
    example: 'Engineering',
    category: 'job',
  },
  {
    key: '{{job_location}}',
    label: 'Job Location',
    description: 'Location of the job',
    example: 'San Francisco, CA',
    category: 'job',
  },
  {
    key: '{{job_type}}',
    label: 'Job Type',
    description: 'Type of employment',
    example: 'Full-time',
    category: 'job',
  },
  {
    key: '{{job_salary_range}}',
    label: 'Job Salary Range',
    description: 'Salary range for the position',
    example: '$120,000 - $150,000',
    category: 'job',
  },

  // Company Placeholders
  {
    key: '{{company_name}}',
    label: 'Company Name',
    description: 'Name of the company',
    example: 'Acme Corporation',
    category: 'company',
  },
  {
    key: '{{company_website}}',
    label: 'Company Website',
    description: 'Company website URL',
    example: 'https://www.acme.com',
    category: 'company',
  },

  // Recruiter Placeholders
  {
    key: '{{recruiter_name}}',
    label: 'Recruiter Name',
    description: 'Name of the recruiter sending the email',
    example: 'Jane Smith',
    category: 'recruiter',
  },
  {
    key: '{{recruiter_email}}',
    label: 'Recruiter Email',
    description: 'Email address of the recruiter',
    example: 'jane.smith@acme.com',
    category: 'recruiter',
  },
  {
    key: '{{recruiter_phone}}',
    label: 'Recruiter Phone',
    description: 'Phone number of the recruiter',
    example: '+1 (555) 987-6543',
    category: 'recruiter',
  },

  // System Placeholders
  {
    key: '{{interview_date}}',
    label: 'Interview Date',
    description: 'Scheduled interview date',
    example: 'Monday, January 15, 2025',
    category: 'system',
  },
  {
    key: '{{interview_time}}',
    label: 'Interview Time',
    description: 'Scheduled interview time',
    example: '2:00 PM EST',
    category: 'system',
  },
  {
    key: '{{application_date}}',
    label: 'Application Date',
    description: 'Date when candidate applied',
    example: 'December 20, 2024',
    category: 'system',
  },
  {
    key: '{{current_date}}',
    label: 'Current Date',
    description: 'Today\'s date',
    example: 'December 25, 2024',
    category: 'system',
  },
];

/**
 * Get placeholders by category
 */
export const getPlaceholdersByCategory = (category: EmailPlaceholder['category']): EmailPlaceholder[] => {
  return EMAIL_PLACEHOLDERS.filter(p => p.category === category);
};

/**
 * Search placeholders by keyword
 */
export const searchPlaceholders = (query: string): EmailPlaceholder[] => {
  const lowerQuery = query.toLowerCase();
  return EMAIL_PLACEHOLDERS.filter(
    p =>
      p.key.toLowerCase().includes(lowerQuery) ||
      p.label.toLowerCase().includes(lowerQuery) ||
      p.description.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Get all placeholder categories
 */
export const PLACEHOLDER_CATEGORIES = [
  { value: 'candidate', label: 'Candidate' },
  { value: 'job', label: 'Job' },
  { value: 'company', label: 'Company' },
  { value: 'recruiter', label: 'Recruiter' },
  { value: 'system', label: 'System' },
] as const;
