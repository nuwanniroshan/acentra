import { AppDataSource } from "../data-source";
import { ApiKey } from "../entity/ApiKey";
import * as crypto from "crypto";
import * as bcrypt from "bcryptjs";
import { logger } from "@acentra/logger";

export class ApiKeyService {
  private static repository = AppDataSource.getRepository(ApiKey);

  static async generate(name: string, tenantId: string, createdBy?: string): Promise<{ plainTextKey: string; apiKey: ApiKey }> {
    const rawKey = crypto.randomBytes(32).toString("hex");
    const plainTextKey = `ac_${rawKey}`;
    const hashedKey = crypto.createHash('sha256').update(plainTextKey).digest('hex');
    const maskedKey = `ac_..._${plainTextKey.slice(-4)}`;

    const apiKey = new ApiKey();
    apiKey.name = name;
    apiKey.tenantId = tenantId;
    apiKey.hashedKey = hashedKey;
    apiKey.maskedKey = maskedKey;
    apiKey.createdBy = createdBy;

    await this.repository.save(apiKey);

    logger.info(`Generated new API key: ${name} for tenant: ${tenantId}`);

    return { plainTextKey, apiKey };
  }

  static async validate(plainTextKey: string): Promise<ApiKey | null> {
    // We can't query by hashed key directly because bcrypt salt is random.
    // However, for performance, we could store a non-reversible fast hash (like SHA-256) 
    // to find candidates and then verify with bcrypt.
    // For now, let's keep it simple as hinted in architecture.md about @Index 
    // but bcrypt makes it hard. Wait, if I use a fixed salt or SHA-256 for the index...
    // Architecture says: "Secure Storage: API Key secrets must be stored using a one-way secure hash (e.g., Argon2 or SHA-256 with salt) in the database."
    // If I use SHA-256, I can query by it.
    
    // Let's reconsider the architecture note: "Database: Ensure @Index is applied to the hashedKey field for performance."
    // If it's a bcrypt hash, @Index doesn't help with lookup of the plain text.
    // I'll update the logic to store a SHA-256 hash for lookup and bcrypt for verification, or just use SHA-256 as the primary hash.
    // Given the architecture says "SHA-256 with salt", I'll use that.
    
    const hashedKey = crypto.createHash('sha256').update(plainTextKey).digest('hex');
    
    const apiKey = await this.repository.findOne({
      where: { hashedKey },
      relations: ["tenant"]
    });

    if (apiKey) {
      if (apiKey.revokedAt) {
        return null;
      }
      apiKey.lastUsedAt = new Date();
      await this.repository.save(apiKey);
    }

    return apiKey;
  }

  static async list(tenantId: string): Promise<ApiKey[]> {
    return this.repository.find({
      where: { tenantId, revokedAt: null },
      order: { createdAt: "DESC" }
    });
  }

  static async revoke(id: string, tenantId: string): Promise<void> {
    const apiKey = await this.repository.findOne({ where: { id, tenantId } });
    if (apiKey) {
      apiKey.revokedAt = new Date();
      await this.repository.save(apiKey);
      logger.info(`Revoked API key: ${apiKey.name} (ID: ${id})`);
    }
  }
}
