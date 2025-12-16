import { Request, Response, NextFunction } from "express";
import { AppDataSource } from "@/data-source";
import { Tenant } from "@/entity/Tenant";

export const tenantMiddleware = async (req: Request, res: Response, next: NextFunction) => {
  // Allow requests without tenantId for public auth routes
  const publicRoutes = ["/auth/register", "/auth/login", "/auth/logout", "/health"];
  const isPublicRoute = publicRoutes.some(route => req.path.includes(route));

  if (isPublicRoute) {
    return next();
  }

  const tenantId = req.headers["x-tenant-id"] as string;

  if (!tenantId) {
    console.warn("Tenant ID is missing in request headers");
    return res.status(400).json({ message: "Tenant ID is required" });
  }

  // Validate tenant exists and is active
  const tenantRepository = AppDataSource.getRepository(Tenant);
  const tenant = await tenantRepository.findOne({ where: { id: tenantId, isActive: true } });

  if (!tenant) {
    return res.status(403).json({ message: "Invalid or inactive tenant" });
  }

  req.tenantId = tenantId;
  next();
};