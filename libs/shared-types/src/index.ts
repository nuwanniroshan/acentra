// User types
export enum UserRole {
  SUPER_ADMIN = 'super_admin',
  ADMIN = 'admin',
  HR = 'hr',
  ENGINEERING_MANAGER = 'engineering_manager',
  RECRUITER = 'recruiter',
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
}

// Job types
export enum JobStatus {
  OPEN = 'open',
  CLOSED = 'closed',
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

// Candidate types
export enum CandidateStatus {
  NEW = 'new',
  SHORTLISTED = 'shortlisted',
  INTERVIEW_SCHEDULED = 'interview_scheduled',
  OFFER = 'offer',
  HIRED = 'hired',
  REJECTED = 'rejected',
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
  JOB_CREATED = 'job_created',
  CANDIDATE_ADDED = 'candidate_added',
  PIPELINE_STATUS_CHANGED = 'pipeline_status_changed',
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
