import "reflect-metadata";
import { logger } from "@acentra/logger";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserRole } from "@acentra/shared-types";
import { randomUUID } from "crypto";

async function createRecruiters() {
  logger.info("🚀 Creating sample recruiter users...");

  try {
    await AppDataSource.initialize();
    logger.info("✅ Connected to DB");

    const userRepository = AppDataSource.getRepository(User);

    // Sample recruiters to create
    const recruiters = [
      {
        id: randomUUID(),
        email: "rc@acentra.com",
        name: "RC",
        role: UserRole.RECRUITER,
        tenantId: "swivel", // Adjust this to your tenant ID
        is_active: true,
      },
      {
        id: randomUUID(),
        email: "fahima@acentra.com",
        name: "Fahima",
        role: UserRole.RECRUITER,
        tenantId: "swivel", // Adjust this to your tenant ID
        is_active: true,
      },
    ];

    for (const recruiter of recruiters) {
      const exists = await userRepository.findOne({
        where: { email: recruiter.email, tenantId: recruiter.tenantId }
      });

      if (exists) {
        logger.info(`   ⏭️  Skipped: ${recruiter.email} (already exists)`);
        continue;
      }

      await userRepository.save(recruiter);
      logger.info(`   ✅ Created: ${recruiter.email}`);
    }

    logger.info("\n🎉 Recruiter creation complete!");

  } catch (error) {
    logger.error("❌ Creation failed:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  }
}

createRecruiters();