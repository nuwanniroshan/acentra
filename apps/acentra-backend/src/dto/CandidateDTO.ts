export class CandidateDTO {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: string;
  created_at: Date;
  job: {
    id: string;
    title: string;
  };
  profile_picture?: string;
  first_name?: string;
  last_name?: string;
  current_address?: string;
  permanent_address?: string;
  cv_file_path?: string;
  cover_letter_path?: string;
  education?: any[];
  experience?: any[];
  desired_salary?: number;
  referred_by?: string;
  website?: string;
  notes?: string;
  interview_date?: Date;
  interview_link?: string;
  created_by?: {
    id: string;
    email: string;
    name?: string;
  };

  constructor(candidate: any) {
    this.id = candidate.id;
    this.name = candidate.name;
    this.email = candidate.email;
    this.phone = candidate.phone;
    this.status = candidate.status;
    this.created_at = candidate.created_at;

    // Map job relation
    if (candidate.job) {
      this.job = {
        id: candidate.job.id,
        title: candidate.job.title,
      };
    }

    // Optional fields
    if (candidate.profile_picture) this.profile_picture = candidate.profile_picture;
    if (candidate.first_name) this.first_name = candidate.first_name;
    if (candidate.last_name) this.last_name = candidate.last_name;
    if (candidate.current_address) this.current_address = candidate.current_address;
    if (candidate.permanent_address) this.permanent_address = candidate.permanent_address;
    if (candidate.cv_file_path) this.cv_file_path = candidate.cv_file_path;
    if (candidate.cover_letter_path) this.cover_letter_path = candidate.cover_letter_path;
    if (candidate.education) this.education = candidate.education;
    if (candidate.experience) this.experience = candidate.experience;
    if (candidate.desired_salary) this.desired_salary = candidate.desired_salary;
    if (candidate.referred_by) this.referred_by = candidate.referred_by;
    if (candidate.website) this.website = candidate.website;
    if (candidate.notes) this.notes = candidate.notes;
    if (candidate.interview_date) this.interview_date = candidate.interview_date;
    if (candidate.interview_link) this.interview_link = candidate.interview_link;

    // Map created_by relation
    if (candidate.created_by) {
      this.created_by = {
        id: candidate.created_by.id,
        email: candidate.created_by.email,
        name: candidate.created_by.name,
      };
    }
  }
}