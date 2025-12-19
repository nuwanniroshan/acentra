export class TenantDTO {
  id: string;
  name: string;
  isActive: boolean;

  constructor(tenant: any) {
    this.id = tenant.id;
    this.name = tenant.name;
    this.isActive = tenant.isActive;
  }
}