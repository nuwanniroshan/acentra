import { Request, Response } from "express";
import { ApiKeyService } from "../service/ApiKeyService";
import { logger } from "@acentra/logger";

export class ApiKeyController {
  static async generate(req: Request, res: Response) {
    const { name } = req.body;
    const tenantId = req.tenantId;
    const userId = req.user?.userId;

    if (!name) {
      return res.status(400).json({ message: "Name is required" });
    }

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    try {
      const { plainTextKey, apiKey } = await ApiKeyService.generate(name, tenantId, userId);
      
      return res.status(201).json({
        id: apiKey.id,
        name: apiKey.name,
        key: plainTextKey,
        maskedKey: apiKey.maskedKey,
        createdAt: apiKey.createdAt
      });
    } catch (error) {
      logger.error("Error generating API key:", error);
      return res.status(500).json({ message: "Error generating API key" });
    }
  }

  static async list(req: Request, res: Response) {
    const tenantId = req.tenantId;

    if (!tenantId) {
      return res.status(400).json({ message: "Tenant ID is required" });
    }

    try {
      const keys = await ApiKeyService.list(tenantId);
      const sanitisedKeys = keys.map(key => ({
        id: key.id,
        name: key.name,
        maskedKey: key.maskedKey,
        lastUsedAt: key.lastUsedAt,
        createdAt: key.createdAt
      }));
      
      return res.json(sanitisedKeys);
    } catch (error) {
      logger.error("Error listing API keys:", error);
      return res.status(500).json({ message: "Error listing API keys" });
    }
  }

  static async revoke(req: Request, res: Response) {
    const { id } = req.params;
    const tenantId = req.tenantId;

    if (!id || !tenantId) {
      return res.status(400).json({ message: "ID and Tenant ID are required" });
    }

    try {
      await ApiKeyService.revoke(id, tenantId);
      return res.status(204).send();
    } catch (error) {
      logger.error("Error revoking API key:", error);
      return res.status(500).json({ message: "Error revoking API key" });
    }
  }
}
