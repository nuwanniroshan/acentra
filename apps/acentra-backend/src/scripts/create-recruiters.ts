import "reflect-metadata";
import { AppDataSource } from "../data-source";
import { User } from "../entity/User";
import { UserRole } from "@acentra/shared-types";
import { randomUUID } from "crypto";

async function createRecruiters() {
  console.log("🚀 Creating sample recruiter users...");

  try {
    await AppDataSource.initialize();
    console.log("✅ Connected to DB");

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
        console.log(`   ⏭️  Skipped: ${recruiter.email} (already exists)`);
        continue;
      }

      await userRepository.save(recruiter);
      console.log(`   ✅ Created: ${recruiter.email}`);
    }

    console.log("\n🎉 Recruiter creation complete!");

  } catch (error) {
    console.error("❌ Creation failed:", error);
    process.exit(1);
  } finally {
    if (AppDataSource.isInitialized) await AppDataSource.destroy();
  }
}

createRecruiters();