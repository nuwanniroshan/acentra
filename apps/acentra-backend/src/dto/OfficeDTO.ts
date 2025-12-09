export class OfficeDTO {
  id: string;
  name: string;
  address: string;
  type: string;

  constructor(office: any) {
    this.id = office.id;
    this.name = office.name;
    this.address = office.address;
    this.type = office.type;
  }
}