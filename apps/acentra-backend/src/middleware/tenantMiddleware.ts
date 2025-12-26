import { Request, Response, NextFunction } from "express";
import { tenantCacheService } from "@/service/TenantCacheService";
import { logger } from "@acentra/logger";

export const tenantMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (req.tenantId) {
    return next();
  }

  let tenantId = req.headers["x-tenant-id"] as string;

  // For profile picture routes, also check query parameter
  if (!tenantId && req.path.includes("/profile-picture")) {
    tenantId = req.query.tenantId as string;
  }

  // Allow requests without tenantId for public routes (e.g., /health, /tenants/:name/check)
  const publicRoutes = ["/health", "/tenants", "/public"];
  const isPublicRoute = publicRoutes.some((route) =>
    req.path.startsWith(route)
  );

  if (isPublicRoute) {
    return next();
  }

  if (!tenantId) {
    logger.warn("Tenant ID is missing in request headers");
    return res.status(400).json({ message: "Tenant ID is required" });
  }

  // Validate tenant exists and is active using cache
  const tenantIdValidated = await tenantCacheService.validateTenant(tenantId);

  if (!tenantIdValidated) {
    return res.status(403).json({ message: "Invalid or inactive tenant" });
  }

  req.tenantId = tenantIdValidated;
  next();
};
