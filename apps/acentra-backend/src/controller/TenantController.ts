import { Request, Response } from "express";
import { AppDataSource } from "@/data-source";
import { Tenant } from "@/entity/Tenant";
import { TenantDTO } from "@/dto/TenantDTO";

export class TenantController {
  static async check(req: Request, res: Response) {
    const { name } = req.params;
    const tenantRepository = AppDataSource.getRepository(Tenant);
    
    try {
      const tenant = await tenantRepository.findOne({ where: { name } });
      
      if (tenant && tenant.isActive) {
        const tenantDTO = new TenantDTO(tenant);
        return res.status(200).json({ exists: true, isActive: true, tenant: tenantDTO });
      } else {
        return res.status(404).json({ exists: false, isActive: false });
      }
    } catch (error) {
      console.error("Error checking tenant:", error);
      return res.status(500).json({ message: "Internal server error" });
    }
  }
}
