import "reflect-metadata";
import { logger } from "@acentra/logger";
import { AppDataSource } from "../src/data-source";
import { User } from "../src/entity/User";
import { Job } from "../src/entity/Job";
import { Candidate } from "../src/entity/Candidate";
import { Comment } from "../src/entity/Comment";
import { Office } from "../src/entity/Office";
import { Department } from "../src/entity/Department";
import { PipelineStatus } from "../src/entity/PipelineStatus";
import { PipelineHistory } from "../src/entity/PipelineHistory";
import { Notification } from "../src/entity/Notification";

const SWIVEL_TENANT_ID = "swivel";

async function updateTenantIds() {
  logger.info("🚀 Starting tenant ID update for existing records...");
  logger.info(`   Assigning all records to tenant: ${SWIVEL_TENANT_ID}\n`);

  try {
    await AppDataSource.initialize();
    logger.info("✅ Connected to database\n");

  // Update each entity
    const entities = [
      { entity: User, name: "Users" },
      { entity: Office, name: "Offices" },
      { entity: Department, name: "Departments" },
      { entity: PipelineStatus, name: "PipelineStatuses" },
      { entity: Job, name: "Jobs" },
      { entity: Candidate, name: "Candidates" },
      { entity: Comment, name: "Comments" },
      { entity: PipelineHistory, name: "PipelineHistory" },
      { entity: Notification, name: "Notifications" },
    ];

    for (const { entity, name } of entities) {
      logger.info(`📦 Updating ${name}...`);
      const repository = AppDataSource.getRepository(entity);

    // Find all records with null or empty tenantId
      const records = await repository
        .createQueryBuilder()
        .where('"tenantId" IS NULL OR "tenantId" = \'\'')
        .getMany();

      if (records.length === 0) {
        logger.info(`   ✓ No records to update (${records.length} found)\n`);
        continue;
      }

    // Update all records
      const result = await repository
        .createQueryBuilder()
        .update()
        .set({ tenantId: SWIVEL_TENANT_ID } as any)
        .where('"tenantId" IS NULL OR "tenantId" = \'\'')
        .execute();

      logger.info(`   ✅ Updated ${result.affected || 0} records\n`);
    }

    logger.info("🎉 Tenant ID update complete!");
    logger.info(`   All existing records now belong to tenant: ${SWIVEL_TENANT_ID}`);
  } catch (error) {
    logger.error("❌ Update failed:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

updateTenantIds();
