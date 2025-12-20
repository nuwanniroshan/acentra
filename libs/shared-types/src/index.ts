// User types
export enum UserRole {
  SUPER_ADMIN = "super_admin",
  ADMIN = "admin",
  HR = "hr",
  HIRING_MANAGER = "hiring_manager",
  RECRUITER = "recruiter",
  INTERVIEWER = "interviewer",
  FINANCE_APPROVER = "finance_approver",
  EMPLOYEE = "employee",
}

export enum ActionPermission {
  // User Management
  LIST_USERS = "list_users",
  DELETE_USERS = "delete_users",
  MANAGE_USER_ROLES = "manage_user_roles",
  MANAGE_USER_STATUS = "manage_user_status",
  
  // Organization Management
  MANAGE_OFFICES = "manage_offices",
  MANAGE_DEPARTMENTS = "manage_departments",
  
  // Job Management
  CREATE_JOBS = "create_jobs",
  MANAGE_ALL_JOBS = "manage_all_jobs", // Admin bypass for ownership
  VIEW_ALL_JOBS = "view_all_jobs",
  
  // Candidate Management
  CREATE_CANDIDATES = "create_candidates",
  VIEW_ALL_CANDIDATES = "view_all_candidates",
  UPLOAD_CV = "upload_cv",
  MANAGE_CANDIDATE_STATUS = "manage_candidate_status",
  
  // Pipeline Management
  MANAGE_PIPELINE_STATUS = "manage_pipeline_status",
  
  // Feedback Management
  MANAGE_FEEDBACK_TEMPLATES = "manage_feedback_templates",
  VIEW_FEEDBACK_TEMPLATES = "view_feedback_templates",
  ATTACH_FEEDBACK = "attach_feedback",
  REMOVE_FEEDBACK = "remove_feedback",
}

export interface IUser {
  id: string;
  email: string;
  role: UserRole;
  name?: string;
  profile_picture?: string;
  department?: string;
  office_location?: string;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
  preferences?: Record<string, any>;
}

// Job types
export enum JobStatus {
  OPEN = "open",
  CLOSED = "closed",
}

export interface IJob {
  id: string;
  title: string;
  description: string;
  department?: string;
  branch?: string;
  tags?: string[];
  status: JobStatus;
  start_date?: Date | null;
  expected_closing_date?: Date | null;
  actual_closing_date?: Date | null;
  created_by: IUser;
  assignees: IUser[];
  created_at: Date;
  updated_at: Date;
}

export interface ICandidate {
  id: string;
  name: string;
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  current_address?: string;
  permanent_address?: string;
  cv_file_path: string;
  profile_picture?: string;
  cover_letter_path?: string;
  education?: any[];
  experience?: any[];
  desired_salary?: number;
  referred_by?: string;
  website?: string;
  status: string;
  interview_date?: Date;
  interview_link?: string;
  notes?: string;
  job: IJob;
  created_by?: IUser;
  created_at: Date;
  updated_at: Date;
}

// Comment types
export interface IComment {
  id: string;
  content: string;
  candidate: ICandidate;
  author: IUser;
  created_at: Date;
  updated_at: Date;
}

// Notification types
export enum NotificationType {
  JOB_CREATED = "job_created",
  CANDIDATE_ADDED = "candidate_added",
  PIPELINE_STATUS_CHANGED = "pipeline_status_changed",
}

export interface INotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  user: IUser;
  created_at: Date;
}

// Pipeline types
export interface IPipelineStatus {
  id: string;
  name: string;
  order: number;
  color?: string;
  created_at: Date;
  updated_at: Date;
}

export interface IPipelineHistory {
  id: string;
  candidate: ICandidate;
  from_status: string;
  to_status: string;
  changed_by: IUser;
  created_at: Date;
}

// Department and Office types
export interface IDepartment {
  id: string;
  name: string;
  created_at: Date;
  updated_at: Date;
}

export interface IOffice {
  id: string;
  name: string;
  location: string;
  address?: string;
  created_at: Date;
  updated_at: Date;
}

// API Response types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Auth types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name?: string;
  role?: UserRole;
}

export interface AuthResponse {
  user: IUser;
  token: string;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: UserRole;
}

// ROLE_PERMISSIONS
export const ROLE_PERMISSIONS: Record<UserRole, ActionPermission[]> = {
  [UserRole.SUPER_ADMIN]: Object.values(ActionPermission),
  [UserRole.ADMIN]: Object.values(ActionPermission),
  
  [UserRole.HR]: [
    ActionPermission.LIST_USERS,
    ActionPermission.MANAGE_OFFICES,
    ActionPermission.MANAGE_DEPARTMENTS,
    ActionPermission.CREATE_JOBS,
    ActionPermission.VIEW_ALL_JOBS,
    ActionPermission.CREATE_CANDIDATES,
    ActionPermission.VIEW_ALL_CANDIDATES,
    ActionPermission.UPLOAD_CV,
    ActionPermission.MANAGE_CANDIDATE_STATUS,
    ActionPermission.MANAGE_FEEDBACK_TEMPLATES,
    ActionPermission.VIEW_FEEDBACK_TEMPLATES,
    ActionPermission.ATTACH_FEEDBACK,
    ActionPermission.REMOVE_FEEDBACK,
  ],
  
  [UserRole.HIRING_MANAGER]: [
    ActionPermission.CREATE_JOBS,
    ActionPermission.CREATE_CANDIDATES, // Based on routes checkRole([..., HIRING_MANAGER...])
    ActionPermission.VIEW_FEEDBACK_TEMPLATES,
    ActionPermission.ATTACH_FEEDBACK,
    ActionPermission.REMOVE_FEEDBACK,
    // Hiring managers typically view candidates for their jobs (handled by business logic/other checks), 
    // but might not have VIEW_ALL_CANDIDATES
  ],
  
  [UserRole.RECRUITER]: [
    ActionPermission.CREATE_CANDIDATES,
    ActionPermission.UPLOAD_CV,
    ActionPermission.ATTACH_FEEDBACK,
    ActionPermission.REMOVE_FEEDBACK,
    // Recruiters usually view all candidates
    ActionPermission.VIEW_ALL_CANDIDATES,
  ],
  
  [UserRole.INTERVIEWER]: [
    // Basic permissions usually implied by auth, specific ones can be added here
  ],
  
  [UserRole.FINANCE_APPROVER]: [],
  
  [UserRole.EMPLOYEE]: [],
};

