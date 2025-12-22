import { Request, Response, NextFunction } from "express";
import { ApiKeyService } from "../service/ApiKeyService";
import { UserRole } from "@acentra/shared-types";
import { logger } from "@acentra/logger";

export const apiKeyAuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const apiKeyHeader = req.headers["x-api-key"] as string;

  if (!apiKeyHeader) {
    return next();
  }

  try {
    const apiKey = await ApiKeyService.validate(apiKeyHeader);

    if (!apiKey) {
      logger.warn(`Invalid API key attempt from IP: ${req.ip}`);
      return res.status(401).json({ message: "Invalid API key" });
    }

    // Set tenantId and user context
    req.tenantId = apiKey.tenantId;
    req.user = {
      userId: apiKey.id,
      role: UserRole.SYSTEM, // Machine-to-machine role
      email: `system-${apiKey.name.toLowerCase().replace(/\s+/g, '-')}`
    };

    logger.debug(`Authenticated request using API key: ${apiKey.name}`);
    next();
  } catch (error) {
    logger.error("API key validation error:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
};
