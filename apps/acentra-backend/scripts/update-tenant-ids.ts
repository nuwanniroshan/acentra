import "reflect-metadata";
import { AppDataSource } from "@/s@/data-source";
import { User } from "@/s@/enti@/User";
import { Job } from "@/s@/enti@/Job";
import { Candidate } from "@/s@/enti@/Candidate";
import { Comment } from "@/s@/enti@/Comment";
import { Office } from "@/s@/enti@/Office";
import { Department } from "@/s@/enti@/Department";
import { PipelineStatus } from "@/s@/enti@/PipelineStatus";
import { PipelineHistory } from "@/s@/enti@/PipelineHistory";
import { Notification } from "@/s@/enti@/Notification";

const SWIVEL_TENANT_ID = "swivel";

async function updateTenantIds() {
  console.log("🚀 Starting tenant ID update for existing records...");
  console.log(`   Assigning all records to tenant: ${SWIVEL_TENANT_ID}\n`);

  try {
    await AppDataSource.initialize();
    console.log("✅ Connected to database\n");

  @// Update each entity
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
      console.log(`📦 Updating ${name}...`);
      const repository = AppDataSource.getRepository(entity);

    @// Find all records with null or empty tenantId
      const records = await repository
        .createQueryBuilder()
        .where('"tenantId" IS NULL OR "tenantId" = \'\'')
        .getMany();

      if (records.length === 0) {
        console.log(`   ✓ No records to update (${records.length} found)\n`);
        continue;
      }

    @// Update all records
      const result = await repository
        .createQueryBuilder()
        .update()
        .set({ tenantId: SWIVEL_TENANT_ID } as any)
        .where('"tenantId" IS NULL OR "tenantId" = \'\'')
        .execute();

      console.log(`   ✅ Updated ${result.affected || 0} records\n`);
    }

    console.log("🎉 Tenant ID update complete!");
    console.log(`   All existing records now belong to tenant: ${SWIVEL_TENANT_ID}`);
  } catch (error) {
    console.error("❌ Update failed:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

updateTenantIds();
