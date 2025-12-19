export class UserDTO {
  id: string;
  email: string;
  role: string;
  name?: string;
  profile_picture?: string;
  department?: string;
  office_location?: string;
  is_active?: boolean;

  constructor(user: any) {
    this.id = user.id;
    this.email = user.email;
    this.role = user.role;

    // Optional fields
    if (user.name) this.name = user.name;
    if (user.profile_picture) this.profile_picture = user.profile_picture;
    if (user.department) this.department = user.department;
    if (user.office_location) this.office_location = user.office_location;
    if (user.is_active) this.is_active = user.is_active;
  }
}