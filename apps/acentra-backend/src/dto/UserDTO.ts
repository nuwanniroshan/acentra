export class UserDTO {
  id: string;
  email: string;
  role: string;
  name?: string;
  profile_picture?: string;
  department?: string;
  office_location?: string;
  is_active?: boolean;
  job_title?: string;
  employee_number?: string;
  manager_id?: string;
  address?: string;
  custom_fields?: Record<string, any>;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;

    // Optional fields
    if (user.name) this.name = user.name;
    if (user.profile_picture) this.profile_picture = user.profile_picture;
    if (user.department) this.department = user.department;
    if (user.office_location) this.office_location = user.office_location;
    if (user.is_active !== undefined) this.is_active = user.is_active;
    if (user.job_title) this.job_title = user.job_title;
    if (user.employee_number) this.employee_number = user.employee_number;
    if (user.manager_id) this.manager_id = user.manager_id;
    if (user.address) this.address = user.address;
    if (user.custom_fields) this.custom_fields = user.custom_fields;
  }
}