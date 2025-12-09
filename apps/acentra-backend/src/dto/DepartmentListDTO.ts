export class DepartmentListDTO {
  id: string;
  name: string;

  constructor(department: { id: string; name: string }) {
    this.id = department.id;
    this.name = department.name;
  }
}